"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Package, 
  FileText, 
  TrendingUp, 
  Sparkles,
  Bell,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dailyQuote, setDailyQuote] = useState({
    text: "每一次旅行，都是一次心灵的成长",
    author: "远见者旅行社",
  });

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 获取每日激励语
  useEffect(() => {
    fetchDailyQuote();
  }, []);

  const fetchDailyQuote = () => {
    // 根据日期生成不同的激励语
    const quotes = [
      { text: "服务每一位客户，创造每一份感动", author: "远见者旅行社" },
      { text: "专业成就品质，用心赢得信赖", author: "远见者服务理念" },
      { text: "让每一次旅行，都成为美好回忆", author: "远见者使命" },
      { text: "细节决定成败，态度决定高度", author: "远见者精神" },
      { text: "世界很大，梦想很美，我们一起出发", author: "远见者旅行社" },
      { text: "用脚步丈量世界，用真心服务客户", author: "远见者愿景" },
      { text: "专注定制旅游，成就精彩人生", author: "远见者旅行社" },
    ];
    
    const dayOfYear = Math.floor((currentTime.getTime() - new Date(currentTime.getFullYear(), 0, 0).getTime()) / 86400000);
    const quote = quotes[dayOfYear % quotes.length];
    setDailyQuote(quote);
  };

  const stats = [
    {
      title: "服务游客",
      value: "156",
      icon: Users,
      description: "+12% 较上月",
      trend: "up",
      color: "blue",
      href: "/customers",
    },
    {
      title: "旅游线路",
      value: "89",
      icon: Package,
      description: "+5 新线路",
      trend: "up",
      color: "green",
      href: "/products",
    },
    {
      title: "待审批方案",
      value: "24",
      icon: FileText,
      description: "需要处理",
      trend: "warning",
      color: "orange",
      href: "/approvals",
    },
    {
      title: "本月成交",
      value: "¥2.4M",
      icon: TrendingUp,
      description: "+28% 较上月",
      trend: "up",
      color: "purple",
      href: "/orders",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: "创建定制方案",
      description: "三亚5日游",
      time: "2分钟前",
      icon: "📝",
      type: "create",
    },
    {
      id: 2,
      title: "更新游客信息",
      description: "张女士",
      time: "15分钟前",
      icon: "👤",
      type: "update",
    },
    {
      id: 3,
      title: "审批通过",
      description: "云南7日游",
      time: "1小时前",
      icon: "✅",
      type: "approve",
    },
    {
      id: 4,
      title: "添加线路",
      description: "西藏深度游",
      time: "2小时前",
      icon: "🗺️",
      type: "add",
    },
  ];

  const todos = [
    {
      id: 1,
      title: "审批李先生的定制方案",
      priority: "high",
      deadline: "今天 17:00",
    },
    {
      id: 2,
      title: "跟进王女士的云南行程",
      priority: "medium",
      deadline: "明天",
    },
    {
      id: 3,
      title: "更新海南线路价格",
      priority: "low",
      deadline: "本周五",
    },
    {
      id: 4,
      title: "准备月度业绩报告",
      priority: "medium",
      deadline: "周五",
    },
  ];

  const announcements = [
    {
      id: 1,
      title: "系统升级通知",
      content: "本周六凌晨2:00-4:00进行系统维护，期间系统将无法访问。",
      date: "2025-01-27",
      type: "system",
      important: true,
    },
    {
      id: 2,
      title: "新产品培训",
      content: "下周三下午3点，会议室举行海南线路产品培训，请各位同事准时参加。",
      date: "2025-01-25",
      type: "training",
      important: false,
    },
    {
      id: 3,
      title: "优秀员工表彰",
      content: "恭喜张三、李四荣获本月优秀员工称号！",
      date: "2025-01-20",
      type: "praise",
      important: false,
    },
  ];

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 6) return "夜深了";
    if (hour < 9) return "早上好";
    if (hour < 12) return "上午好";
    if (hour < 14) return "中午好";
    if (hour < 18) return "下午好";
    if (hour < 22) return "晚上好";
    return "夜深了";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "高";
      case "medium":
        return "中";
      case "low":
        return "低";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-8">
      {/* 顶部问候区 */}
      <div className="mb-8 animate-fadeIn">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              {getGreeting()}，{session?.user?.name || "用户"}！
            </h1>
            <p className="text-gray-500 text-lg">这是您的工作概览</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold text-gray-900">
              {currentTime.toLocaleTimeString("zh-CN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {currentTime.toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </div>
          </div>
        </div>

        {/* 每日激励语 */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">今日寄语</h3>
                <p className="text-lg text-white/90 leading-relaxed mb-2">
                  "{dailyQuote.text}"
                </p>
                <p className="text-sm text-white/70">—— {dailyQuote.author}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 数据统计卡片 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card 
                className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200 cursor-pointer card-hover animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-12 w-12 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-xl flex items-center justify-center shadow-lg shadow-${stat.color}-500/30`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                    <p className={`text-xs ${
                      stat.trend === "up" ? "text-green-600" : 
                      stat.trend === "warning" ? "text-orange-600" : 
                      "text-gray-600"
                    }`}>
                      {stat.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 公告栏 */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm lg:col-span-2 animate-fadeIn" style={{ animationDelay: "400ms" }}>
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-orange-50 to-red-50">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-600" />
              公告通知
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                    announcement.important
                      ? "bg-red-50 border-red-200"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {announcement.important && (
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                          重要
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {announcement.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {announcement.content}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {announcement.date}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 待办事项 */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fadeIn" style={{ animationDelay: "500ms" }}>
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              待办事项
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {todo.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(
                          todo.priority
                        )}`}
                      >
                        {getPriorityLabel(todo.priority)}
                      </span>
                      <span className="text-xs text-gray-500">{todo.deadline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4 rounded-lg border-gray-200 hover:bg-gray-50"
            >
              查看全部任务
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 最近活动 */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mt-6 animate-fadeIn" style={{ animationDelay: "600ms" }}>
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
          <CardTitle className="text-xl font-bold text-gray-900">最近活动</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 text-2xl">{activity.icon}</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
