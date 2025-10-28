"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Users,
  Package,
  FileText,
  CheckSquare,
  BookOpen,
  FileSearch,
  LayoutDashboard,
  LogOut,
  ShoppingCart,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "工作台", href: "/dashboard", icon: LayoutDashboard },
  { name: "游客管理", href: "/customers", icon: Users },
  { name: "旅游线路", href: "/products", icon: Package },
  { name: "定制报价", href: "/quotes", icon: FileText },
  { name: "订单管理", href: "/orders", icon: ShoppingCart },
  { name: "审批流程", href: "/approvals", icon: CheckSquare },
  { name: "知识库", href: "/knowledge", icon: BookOpen },
  { name: "AI助手", href: "/ai-chat", icon: BookOpen },
  { name: "员工管理", href: "/staff", icon: Users },
  { name: "部门权限", href: "/departments", icon: Users },
  { name: "操作日志", href: "/audit-logs", icon: FileSearch },
];

export function Nav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [companyInfo, setCompanyInfo] = useState({
    name: "远见者旅行社",
    slogan: "预见世界 · 预见自己",
    logo: "/logo.svg",
  });

  useEffect(() => {
    // 获取企业设置
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setCompanyInfo({
          name: data.companyName || "远见者旅行社",
          slogan: data.companySlogan || "预见世界 · 预见自己",
          logo: data.companyLogo || "/logo.svg",
        });
      })
      .catch(() => {
        // 使用默认值
      });
  }, []);

  return (
    <div className="flex h-screen flex-col border-r border-gray-200/50 bg-white/95 backdrop-blur-xl w-[280px] shadow-sm">
      {/* Logo区域 */}
      <div className="flex h-16 items-center border-b border-gray-200/50 px-6 bg-white/90 backdrop-blur-md">
        <div className="flex items-center gap-3 animate-fadeIn">
          <div className="w-10 h-10 bg-white rounded-[14px] flex items-center justify-center shadow-lg border border-gray-100 transform hover:scale-105 transition-transform duration-200 overflow-hidden p-1">
            <img 
              src={companyInfo.logo} 
              alt="企业Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = "/logo-placeholder.svg";
              }}
            />
          </div>
          <div>
            <h1 className="text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {companyInfo.name}
            </h1>
            <p className="text-xs text-gray-500">{companyInfo.slogan}</p>
          </div>
        </div>
      </div>
      
      {/* 快捷搜索提示 */}
      <div className="px-4 pt-4 pb-2">
        <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-gray-100/80 hover:bg-gray-100 transition-all duration-150 text-gray-600 text-sm group">
          <Search className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
          <span className="flex-1 text-left text-gray-500">快速搜索...</span>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono bg-white rounded border border-gray-200 text-gray-500">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* 导航菜单 */}
      <div className="flex-1 overflow-y-auto py-2">
        <nav className="space-y-1 px-3">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{ animationDelay: `${index * 30}ms` }}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 group relative overflow-hidden animate-fadeIn button-apple",
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                    : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 animate-pulse-soft pointer-events-none"></div>
                )}
                <Icon 
                  className={cn(
                    "h-5 w-5 transition-all duration-150 relative z-10",
                    isActive ? "scale-105 drop-shadow-sm" : "group-hover:scale-105 text-gray-600 group-hover:text-blue-600"
                  )} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="relative z-10 tracking-wide">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/90 relative z-10 shadow-sm"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 用户信息区域 */}
      <div className="border-t border-gray-200/50 p-4 bg-white/90 backdrop-blur-md">
        <Link 
          href="/profile"
          className="flex items-center gap-3 mb-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-150 cursor-pointer group"
        >
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/30 relative group-hover:scale-105 transition-transform duration-150 overflow-hidden">
            {session?.user?.image ? (
              <img 
                src={session.user.image} 
                alt={session.user.name || "用户"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-base">{session?.user?.name?.charAt(0) || "U"}</span>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{session?.user?.name || "用户"}</p>
            <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
          </div>
        </Link>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 rounded-xl border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all duration-150 text-gray-700 button-apple"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-4 w-4" />
          退出登录
        </Button>
      </div>
    </div>
  );
}

