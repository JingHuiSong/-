"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  ShoppingCart,
  CheckSquare,
  BookOpen,
  UserCog,
  Search,
  Clock,
  TrendingUp,
  User,
  Settings,
} from "lucide-react";

interface Command {
  id: string;
  title: string;
  subtitle?: string;
  icon: any;
  action: () => void;
  keywords: string[];
}

export function CommandBar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // 定义命令
  const commands: Command[] = [
    {
      id: "dashboard",
      title: "工作台",
      subtitle: "查看系统概览",
      icon: LayoutDashboard,
      action: () => router.push("/dashboard"),
      keywords: ["dashboard", "工作台", "首页", "home"],
    },
    {
      id: "customers",
      title: "游客管理",
      subtitle: "管理客户信息",
      icon: Users,
      action: () => router.push("/customers"),
      keywords: ["customers", "游客", "客户", "users"],
    },
    {
      id: "products",
      title: "旅游线路",
      subtitle: "管理旅游产品",
      icon: Package,
      action: () => router.push("/products"),
      keywords: ["products", "线路", "产品", "旅游"],
    },
    {
      id: "quotes",
      title: "定制报价",
      subtitle: "创建和管理报价单",
      icon: FileText,
      action: () => router.push("/quotes"),
      keywords: ["quotes", "报价", "定制", "方案"],
    },
    {
      id: "orders",
      title: "订单管理",
      subtitle: "查看和管理订单",
      icon: ShoppingCart,
      action: () => router.push("/orders"),
      keywords: ["orders", "订单", "order"],
    },
    {
      id: "approvals",
      title: "审批流程",
      subtitle: "处理待审批事项",
      icon: CheckSquare,
      action: () => router.push("/approvals"),
      keywords: ["approvals", "审批", "approval"],
    },
    {
      id: "knowledge",
      title: "知识库",
      subtitle: "上传和管理知识",
      icon: BookOpen,
      action: () => router.push("/knowledge"),
      keywords: ["knowledge", "知识库", "文档", "docs"],
    },
    {
      id: "staff",
      title: "员工管理",
      subtitle: "管理员工账号",
      icon: UserCog,
      action: () => router.push("/staff"),
      keywords: ["staff", "员工", "用户", "团队"],
    },
    {
      id: "profile",
      title: "个人信息",
      subtitle: "管理个人资料和头像",
      icon: User,
      action: () => router.push("/profile"),
      keywords: ["profile", "个人", "信息", "头像", "资料"],
    },
    {
      id: "settings",
      title: "企业设置",
      subtitle: "管理企业Logo和信息",
      icon: Settings,
      action: () => router.push("/settings"),
      keywords: ["settings", "设置", "企业", "logo", "配置"],
    },
  ];

  // 过滤命令
  const filteredCommands = commands.filter((command) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      command.title.toLowerCase().includes(searchLower) ||
      command.subtitle?.toLowerCase().includes(searchLower) ||
      command.keywords.some((keyword) => keyword.includes(searchLower))
    );
  });

  // 监听快捷键 Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // 执行命令
  const executeCommand = useCallback((command: Command) => {
    setOpen(false);
    setSearch("");
    command.action();
  }, []);

  // 处理键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      setSearch("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
        {/* 搜索输入框 */}
        <div className="relative border-b border-gray-100">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="搜索功能... (快捷键: ⌘K)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 pl-12 pr-4 h-16 text-base focus-visible:ring-0 bg-transparent"
            autoFocus
          />
        </div>

        {/* 命令列表 */}
        <div className="max-h-[400px] overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">未找到匹配的功能</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredCommands.map((command) => {
                const Icon = command.icon;
                return (
                  <button
                    key={command.id}
                    onClick={() => executeCommand(command)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 transition-all duration-150 group text-left"
                  >
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-150">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {command.title}
                      </div>
                      {command.subtitle && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          {command.subtitle}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Enter ↵
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 底部提示 */}
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/50 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white rounded border border-gray-200 font-mono">↑</kbd>
              <kbd className="px-2 py-1 bg-white rounded border border-gray-200 font-mono">↓</kbd>
              <span>导航</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white rounded border border-gray-200 font-mono">↵</kbd>
              <span>选择</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white rounded border border-gray-200 font-mono">ESC</kbd>
              <span>关闭</span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>快捷高效</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

