"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, User, DollarSign, Calendar } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export default function ApprovalsPage() {
  return (
    <div className="p-8">
      <PageHeader
        title="审批流程"
        description="查看和处理待审批的定制方案"
        breadcrumbs={[{ label: "审批流程" }]}
      />

      <div className="grid gap-6">
        {/* 待审批卡片 */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Clock className="h-5 w-5 text-yellow-600" />
              待审批 (3)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[
                { id: "TZ-2025-002", title: "李先生云南深度游", amount: "¥7,980", submitter: "销售员A", date: "2025-01-15", priority: "中" },
                { id: "TZ-2025-004", title: "赵女士北欧4国15日游", amount: "¥35,800", submitter: "销售员B", date: "2025-01-16", priority: "高" },
                { id: "TZ-2025-005", title: "陈先生家庭三亚亲子游", amount: "¥18,600", submitter: "销售员A", date: "2025-01-17", priority: "低" },
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-5 border border-gray-100 rounded-2xl hover:bg-gray-50/50 hover:shadow-md transition-all duration-200 group bg-white"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50">
                        <Clock className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-gray-900">{item.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            item.priority === "高"
                              ? "bg-gradient-to-r from-red-100 to-red-200 text-red-700"
                              : item.priority === "中"
                              ? "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700"
                              : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600"
                          }`}>
                            {item.priority}优先级
                          </span>
                        </div>
                        <p className="font-medium text-lg text-gray-900 group-hover:text-blue-600 transition-colors mt-1">
                          {item.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 ml-14 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        {item.submitter}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        {item.date}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <p className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {item.amount}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-sm hover:shadow-md transition-all"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        批准
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="rounded-full border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        拒绝
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 统计卡片 */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
            <CardContent className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-3 text-gray-900 mb-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">已批准</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    12
                  </p>
                </div>
              </CardTitle>
              <div className="text-sm text-gray-600 flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                本月已批准 12 个申请
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
            <CardContent className="p-6 bg-gradient-to-br from-red-50 to-rose-50">
              <CardTitle className="flex items-center gap-3 text-gray-900 mb-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-red-100 to-rose-100">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">已拒绝</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                    2
                  </p>
                </div>
              </CardTitle>
              <div className="text-sm text-gray-600 flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                本月已拒绝 2 个申请
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

