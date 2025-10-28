"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Activity, Clock, User, Globe } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export default function AuditLogsPage() {
  const logs = [
    { action: "创建定制方案", entity: "张女士三亚蜜月游", user: "销售员A", time: "2025-01-27 14:30:25", ip: "192.168.1.100" },
    { action: "更新游客", entity: "李先生", user: "销售员A", time: "2025-01-27 14:15:10", ip: "192.168.1.101" },
    { action: "审批通过", entity: "云南7日深度游", user: "经理", time: "2025-01-27 13:45:30", ip: "192.168.1.102" },
    { action: "添加线路", entity: "西藏朝圣10日游", user: "管理员", time: "2025-01-27 12:20:15", ip: "192.168.1.103" },
    { action: "修改线路", entity: "三亚浪漫5日游", user: "销售员B", time: "2025-01-27 11:10:50", ip: "192.168.1.100" },
    { action: "创建游客", entity: "王先生夫妇", user: "销售员B", time: "2025-01-27 10:30:00", ip: "192.168.1.101" },
    { action: "修改方案", entity: "桂林山水4日游", user: "销售员A", time: "2025-01-27 09:15:25", ip: "192.168.1.102" },
    { action: "登录系统", entity: "系统登录", user: "管理员", time: "2025-01-27 08:00:00", ip: "192.168.1.100" },
  ];

  const actionColors: Record<string, { badge: string; dot: string }> = {
    "创建": { badge: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700", dot: "bg-green-500" },
    "更新": { badge: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700", dot: "bg-blue-500" },
    "删除": { badge: "bg-gradient-to-r from-red-100 to-red-200 text-red-700", dot: "bg-red-500" },
    "审批": { badge: "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700", dot: "bg-purple-500" },
    "添加": { badge: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700", dot: "bg-green-500" },
    "修改": { badge: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700", dot: "bg-yellow-500" },
    "登录": { badge: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700", dot: "bg-gray-500" },
  };

  const getActionColor = (action: string) => {
    for (const key in actionColors) {
      if (action.includes(key)) {
        return actionColors[key];
      }
    }
    return { badge: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700", dot: "bg-gray-500" };
  };

  const stats = [
    { label: "今日操作", value: "156", icon: Activity, color: "from-blue-500 to-indigo-500", bgColor: "from-blue-50 to-indigo-50" },
    { label: "活跃用户", value: "12", icon: User, color: "from-green-500 to-emerald-500", bgColor: "from-green-50 to-emerald-50" },
    { label: "总记录", value: "2.4K", icon: Clock, color: "from-purple-500 to-purple-600", bgColor: "from-purple-50 to-purple-100" },
  ];

  return (
    <div className="p-8">
      <PageHeader
        title="操作日志"
        description="系统操作记录和追踪"
        breadcrumbs={[{ label: "操作日志" }]}
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={i} 
              className="border-0 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              <CardContent className={`p-5 bg-gradient-to-br ${stat.bgColor}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className={`text-3xl font-bold mt-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent opacity-60 group-hover:opacity-100 transition-opacity`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 搜索框 */}
      <Card className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="搜索操作、用户或实体..."
              className="pl-12 rounded-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 py-6 text-base"
            />
          </div>
        </CardContent>
      </Card>

      {/* 日志表格 */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Activity className="h-5 w-5 text-blue-600" />
            操作日志 ({logs.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100 bg-gray-50/50">
                <tr className="text-left text-sm text-gray-600">
                  <th className="pb-4 pt-4 px-6 font-semibold">操作</th>
                  <th className="pb-4 pt-4 px-6 font-semibold">实体</th>
                  <th className="pb-4 pt-4 px-6 font-semibold">操作人</th>
                  <th className="pb-4 pt-4 px-6 font-semibold">时间</th>
                  <th className="pb-4 pt-4 px-6 font-semibold">IP地址</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => {
                  const colors = getActionColor(log.action);
                  return (
                    <tr 
                      key={i} 
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors group"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${colors.badge}`}
                        >
                          <span className={`inline-block w-1.5 h-1.5 rounded-full ${colors.dot}`}></span>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-900 font-medium">{log.entity}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-blue-50">
                            <User className="h-3.5 w-3.5 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{log.user}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm text-gray-600 font-mono">{log.time}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Globe className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm text-gray-500 font-mono">{log.ip}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

