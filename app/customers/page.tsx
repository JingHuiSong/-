"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  industry: string | null;
  status: string;
  createdAt: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers");
      const data = await res.json();
      setCustomers(data);
    } catch (error) {
      console.error("获取客户列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-8">
      <PageHeader
        title="游客管理"
        description="管理您的游客信息和旅行偏好"
        breadcrumbs={[{ label: "游客管理" }]}
        action={
          <Button className="gap-2 rounded-full px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all button-apple">
            <Plus className="h-4 w-4" />
            添加游客
          </Button>
        }
      />

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fadeIn">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="搜索游客姓名或公司..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-full border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <CardTitle className="text-gray-900">游客列表 ({filteredCustomers.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">加载中...</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "没有找到匹配的游客" : "还没有游客记录，点击上方按钮添加第一位游客"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                  <tr className="text-left text-xs text-gray-700 uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">游客姓名</th>
                    <th className="px-6 py-4 font-semibold">所在地</th>
                    <th className="px-6 py-4 font-semibold">旅行偏好</th>
                    <th className="px-6 py-4 font-semibold">联系方式</th>
                    <th className="px-6 py-4 font-semibold">状态</th>
                    <th className="px-6 py-4 font-semibold">首次咨询</th>
                    <th className="px-6 py-4 font-semibold">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCustomers.map((customer, index) => (
                    <tr 
                      key={customer.id} 
                      className="hover:bg-blue-50/50 transition-colors duration-200 animate-fadeIn"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900">{customer.name}</td>
                      <td className="px-6 py-4 text-gray-600">{customer.company || "-"}</td>
                      <td className="px-6 py-4 text-gray-600">{customer.industry || "-"}</td>
                      <td className="px-6 py-4 text-gray-600 font-mono text-sm">
                        {customer.email || customer.phone || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                            customer.status === "ACTIVE"
                              ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800"
                              : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800"
                          }`}
                        >
                          {customer.status === "ACTIVE" ? "活跃" : "非活跃"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {new Date(customer.createdAt).toLocaleDateString("zh-CN")}
                      </td>
                      <td className="px-6 py-4">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all button-apple"
                        >
                          查看
                        </Button>
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

