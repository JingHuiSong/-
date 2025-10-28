"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";

interface Quote {
  id: string;
  quoteNumber: string;
  title: string;
  customer: {
    name: string;
    company: string | null;
  };
  status: string;
  total: number;
  createdAt: string;
}

const statusMap: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "草稿", className: "bg-gray-100 text-gray-800" },
  PENDING: { label: "待审批", className: "bg-yellow-100 text-yellow-800" },
  APPROVED: { label: "已批准", className: "bg-green-100 text-green-800" },
  REJECTED: { label: "已拒绝", className: "bg-red-100 text-red-800" },
  SENT: { label: "已发送", className: "bg-blue-100 text-blue-800" },
};

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const res = await fetch("/api/quotes");
      const data = await res.json();
      setQuotes(data);
    } catch (error) {
      console.error("获取报价列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuotes = quotes.filter((quote) =>
    quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30 p-8">
      <PageHeader
        title="定制报价管理"
        description="为游客创建个性化旅游定制方案"
        breadcrumbs={[{ label: "定制报价" }]}
        action={
          <Button className="gap-2 rounded-full px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all button-apple">
            <Plus className="h-4 w-4" />
            创建定制方案
          </Button>
        }
      />

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fadeIn">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="搜索方案编号、标题或游客..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-full border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <CardTitle className="text-gray-900">定制方案列表 ({filteredQuotes.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">加载中...</div>
          ) : filteredQuotes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "没有找到匹配的定制方案" : "还没有定制方案，点击上方按钮创建第一个方案"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-purple-50 border-b border-gray-200">
                  <tr className="text-left text-xs text-gray-700 uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">方案编号</th>
                    <th className="px-6 py-4 font-semibold">行程标题</th>
                    <th className="px-6 py-4 font-semibold">游客</th>
                    <th className="px-6 py-4 font-semibold">总价</th>
                    <th className="px-6 py-4 font-semibold">状态</th>
                    <th className="px-6 py-4 font-semibold">创建时间</th>
                    <th className="px-6 py-4 font-semibold">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredQuotes.map((quote, index) => (
                    <tr 
                      key={quote.id} 
                      className="hover:bg-purple-50/50 transition-colors duration-200 animate-fadeIn"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4 font-mono text-sm font-semibold text-purple-600">
                        {quote.quoteNumber}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{quote.title}</td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="font-medium text-gray-900">{quote.customer.name}</div>
                        {quote.customer.company && (
                          <div className="text-sm text-gray-500">{quote.customer.company}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold text-green-600 text-lg">
                        ¥{quote.total.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                            statusMap[quote.status]?.className || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {statusMap[quote.status]?.label || quote.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {new Date(quote.createdAt).toLocaleDateString("zh-CN")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="rounded-full hover:bg-purple-50 hover:text-purple-600 transition-all button-apple"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="rounded-full hover:bg-purple-50 hover:text-purple-600 transition-all button-apple"
                          >
                            编辑
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

