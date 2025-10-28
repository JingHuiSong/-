"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  Calendar,
  Kanban,
  Table2,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  orderNumber: string;
  title: string;
  customerId: string;
  customerName?: string;
  quoteId?: string;
  status: string;
  startDate?: string;
  endDate?: string;
  days?: number;
  nights?: number;
  travelers: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

type ViewType = "table" | "kanban" | "calendar" | "report";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [viewType, setViewType] = useState<ViewType>("table");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    customerId: "",
    quoteId: "",
    title: "",
    startDate: "",
    endDate: "",
    travelers: 1,
    totalAmount: 0,
    notes: "",
  });

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchQuotes();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("获取失败");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("获取订单失败:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers");
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("获取客户失败:", error);
    }
  };

  const fetchQuotes = async () => {
    try {
      const res = await fetch("/api/quotes");
      const data = await res.json();
      setQuotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("获取报价失败:", error);
    }
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      customerId: order.customerId,
      quoteId: order.quoteId || "",
      title: order.title,
      startDate: order.startDate ? order.startDate.split("T")[0] : "",
      endDate: order.endDate ? order.endDate.split("T")[0] : "",
      travelers: order.travelers,
      totalAmount: order.totalAmount,
      notes: "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除此订单吗？")) return;
    try {
      await fetch(`/api/orders/${id}`, { method: "DELETE" });
      fetchOrders();
    } catch (error) {
      console.error("删除失败:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingOrder ? `/api/orders/${editingOrder.id}` : "/api/orders";
      const method = editingOrder ? "PUT" : "POST";
      
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      setIsDialogOpen(false);
      setEditingOrder(null);
      setFormData({
        customerId: "",
        quoteId: "",
        title: "",
        startDate: "",
        endDate: "",
        travelers: 1,
        totalAmount: 0,
        notes: "",
      });
      fetchOrders();
    } catch (error) {
      console.error("保存失败:", error);
    }
  };

  const filteredOrders = Array.isArray(orders)
    ? orders.filter((order) => {
        const matchSearch =
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === "ALL" || order.status === statusFilter;
        const matchPayment =
          paymentFilter === "ALL" || order.paymentStatus === paymentFilter;
        return matchSearch && matchStatus && matchPayment;
      })
    : [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "IN_PROGRESS":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      DRAFT: { label: "草稿", className: "bg-gray-100 text-gray-700" },
      CONFIRMED: { label: "已确认", className: "bg-blue-100 text-blue-700" },
      IN_PROGRESS: { label: "执行中", className: "bg-purple-100 text-purple-700" },
      COMPLETED: { label: "已完成", className: "bg-green-100 text-green-700" },
      CANCELLED: { label: "已取消", className: "bg-red-100 text-red-700" },
    };
    const config = statusMap[status] || statusMap.DRAFT;
    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        {getStatusIcon(status)}
        {config.label}
      </Badge>
    );
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const paymentMap: Record<string, { label: string; className: string }> = {
      UNPAID: { label: "未支付", className: "bg-red-100 text-red-700" },
      PARTIAL: { label: "部分支付", className: "bg-yellow-100 text-yellow-700" },
      PAID: { label: "已支付", className: "bg-green-100 text-green-700" },
      REFUNDED: { label: "已退款", className: "bg-gray-100 text-gray-700" },
    };
    const config = paymentMap[paymentStatus] || paymentMap.UNPAID;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  // 计算统计数据
  const stats = {
    total: filteredOrders.length,
    totalAmount: filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0),
    paidAmount: filteredOrders.reduce((sum, o) => sum + o.paidAmount, 0),
    inProgress: filteredOrders.filter((o) => o.status === "IN_PROGRESS").length,
    completed: filteredOrders.filter((o) => o.status === "COMPLETED").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-8">
      <PageHeader
        title="订单管理"
        description="管理旅游定制订单，跟踪执行进度与收付款状态"
        breadcrumbs={[{ label: "订单管理" }]}
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">订单总数</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Table2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">订单总额</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  ¥{stats.totalAmount.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">已收金额</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  ¥{stats.paidAmount.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">执行中</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.inProgress}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">已完成</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.completed}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 工具栏 */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-3 flex-1">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索订单号、标题、客户..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-blue-500 rounded-lg"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] border-gray-200 rounded-lg">
                  <SelectValue placeholder="订单状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">全部状态</SelectItem>
                  <SelectItem value="DRAFT">草稿</SelectItem>
                  <SelectItem value="CONFIRMED">已确认</SelectItem>
                  <SelectItem value="IN_PROGRESS">执行中</SelectItem>
                  <SelectItem value="COMPLETED">已完成</SelectItem>
                  <SelectItem value="CANCELLED">已取消</SelectItem>
                </SelectContent>
              </Select>

              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-[140px] border-gray-200 rounded-lg">
                  <SelectValue placeholder="支付状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">全部支付</SelectItem>
                  <SelectItem value="UNPAID">未支付</SelectItem>
                  <SelectItem value="PARTIAL">部分支付</SelectItem>
                  <SelectItem value="PAID">已支付</SelectItem>
                  <SelectItem value="REFUNDED">已退款</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewType === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("table")}
                className="rounded-lg"
              >
                <Table2 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewType === "kanban" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("kanban")}
                className="rounded-lg"
              >
                <Kanban className="h-4 w-4" />
              </Button>
              <Button
                variant={viewType === "calendar" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("calendar")}
                className="rounded-lg"
              >
                <Calendar className="h-4 w-4" />
              </Button>
              <Button
                variant={viewType === "report" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("report")}
                className="rounded-lg"
              >
                <BarChart3 className="h-4 w-4" />
              </Button>

              <div className="h-6 w-px bg-gray-200 mx-1" />

              <Button variant="outline" size="sm" className="rounded-lg">
                <Upload className="h-4 w-4 mr-2" />
                导入
              </Button>
              <Button variant="outline" size="sm" className="rounded-lg">
                <Download className="h-4 w-4 mr-2" />
                导出
              </Button>
              <Button
                onClick={() => {
                  setEditingOrder(null);
                  setFormData({
                    customerId: "",
                    quoteId: "",
                    title: "",
                    startDate: "",
                    endDate: "",
                    travelers: 1,
                    totalAmount: 0,
                    notes: "",
                  });
                  setIsDialogOpen(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg rounded-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                创建订单
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 表格视图 */}
      {viewType === "table" && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    订单号
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    订单标题
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    客户
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    出行日期
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    人数
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    订单金额
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    已收款
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    订单状态
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    支付状态
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                      加载中...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                      暂无订单数据
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-blue-50/50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm font-semibold text-blue-600">
                          {order.orderNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{order.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {order.customerName || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {order.startDate
                          ? new Date(order.startDate).toLocaleDateString("zh-CN")
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {order.travelers} 人
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-gray-900">
                          ¥{order.totalAmount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-green-600">
                          ¥{order.paidAmount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPaymentBadge(order.paymentStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(order)}
                            className="text-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(order.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 看板视图 */}
      {viewType === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {["DRAFT", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((status) => (
            <Card key={status} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    {
                      {
                        DRAFT: "草稿",
                        CONFIRMED: "已确认",
                        IN_PROGRESS: "执行中",
                        COMPLETED: "已完成",
                        CANCELLED: "已取消",
                      }[status]
                    }
                  </h3>
                  <Badge variant="outline">
                    {filteredOrders.filter((o) => o.status === status).length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {filteredOrders
                    .filter((o) => o.status === status)
                    .map((order) => (
                      <Card
                        key={order.id}
                        className="p-3 border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer"
                      >
                        <div className="font-medium text-sm mb-2">{order.title}</div>
                        <div className="text-xs text-gray-600 mb-2">
                          {order.orderNumber}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-900">
                            ¥{order.totalAmount.toLocaleString()}
                          </span>
                          {getPaymentBadge(order.paymentStatus)}
                        </div>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 日历视图占位 */}
      {viewType === "calendar" && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm p-12 text-center">
          <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">日历视图</h3>
          <p className="text-gray-600">即将推出，敬请期待</p>
        </Card>
      )}

      {/* 报表视图占位 */}
      {viewType === "report" && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm p-12 text-center">
          <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">多维报表</h3>
          <p className="text-gray-600">数据分析功能即将上线</p>
        </Card>
      )}

      {/* 创建/编辑订单对话框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {editingOrder ? "编辑订单" : "创建订单"}
            </DialogTitle>
            <DialogDescription>
              填写订单信息，系统将自动生成订单号
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="customerId">客户 *</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, customerId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择客户" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} - {customer.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="quoteId">关联报价单（可选）</Label>
                <Select
                  value={formData.quoteId || "NONE"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, quoteId: value === "NONE" ? "" : value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择报价单" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">不关联</SelectItem>
                    {quotes.map((quote) => (
                      <SelectItem key={quote.id} value={quote.id}>
                        {quote.title} - ¥{quote.total}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="title">订单标题 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="例如：巴厘岛7天6晚蜜月之旅"
                  required
                />
              </div>

              <div>
                <Label htmlFor="startDate">出行开始日期</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="endDate">出行结束日期</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="travelers">出行人数 *</Label>
                <Input
                  id="travelers"
                  type="number"
                  min="1"
                  value={formData.travelers}
                  onChange={(e) =>
                    setFormData({ ...formData, travelers: parseInt(e.target.value) })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="totalAmount">订单金额（元）*</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.totalAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalAmount: parseFloat(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="notes">备注</Label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="订单备注信息..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                取消
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
              >
                {editingOrder ? "保存" : "创建"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

