"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plus, Pencil, Trash2, Shield } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEPARTMENTS, POSITIONS, getDepartmentPermissions, getDepartmentPositions } from "@/lib/permissions";

interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  departmentCode?: string;
  position?: string;
  isActive: boolean;
  createdAt: string;
  permissions?: string[];
}

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "AGENT",
    department: "远见者旅行社",
    departmentCode: "",
    position: "",
  });

  const departments = Object.values(DEPARTMENTS);
  const [availablePositions, setAvailablePositions] = useState<any[]>([]);

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    if (formData.departmentCode) {
      const positions = getDepartmentPositions(formData.departmentCode);
      setAvailablePositions(positions);
      // 如果当前选中的职位不属于新部门，清空职位选择
      const currentPositionValid = positions.some(p => p.code === formData.position);
      if (!currentPositionValid) {
        setFormData(prev => ({ ...prev, position: "" }));
      }
    } else {
      setAvailablePositions([]);
    }
  }, [formData.departmentCode]);

  const fetchStaff = async () => {
    try {
      const res = await fetch("/api/staff");
      if (!res.ok) {
        throw new Error("获取失败");
      }
      const data = await res.json();
      setStaff(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("获取员工失败:", error);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (s: Staff) => {
    setEditingStaff(s);
    setFormData({
      name: s.name || "",
      email: s.email,
      password: "",
      role: s.role,
      department: s.department || "远见者旅行社",
      departmentCode: s.departmentCode || "",
      position: s.position || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这位员工吗？")) return;

    try {
      const res = await fetch(`/api/staff/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchStaff();
      }
    } catch (error) {
      console.error("删除失败:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingStaff ? `/api/staff/${editingStaff.id}` : "/api/staff";
    const method = editingStaff ? "PUT" : "POST";

    // 获取部门默认权限
    const defaultPermissions = formData.departmentCode 
      ? getDepartmentPermissions(formData.departmentCode)
      : [];

    const submitData = {
      ...formData,
      permissions: JSON.stringify(defaultPermissions),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (res.ok) {
        setIsDialogOpen(false);
        setEditingStaff(null);
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "AGENT",
          department: "远见者旅行社",
          departmentCode: "",
          position: "",
        });
        fetchStaff();
      }
    } catch (error) {
      console.error("保存失败:", error);
    }
  };

  const filteredStaff = Array.isArray(staff) ? staff.filter((s) =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const roleNames: Record<string, string> = {
    ADMIN: "管理员",
    MANAGER: "经理",
    AGENT: "员工",
  };

  const getDepartmentColor = (code?: string) => {
    const dept = departments.find(d => d.code === code);
    return dept?.color || 'blue';
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      purple: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800',
      blue: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800',
      green: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800',
      orange: 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800',
      indigo: 'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800',
      red: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800',
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="p-8">
      <PageHeader
        title="员工管理"
        description="管理系统内部员工账号和权限"
        breadcrumbs={[{ label: "员工管理" }]}
        action={
          <Button
            className="gap-2 rounded-full px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
            onClick={() => {
              setEditingStaff(null);
              setFormData({
                name: "",
                email: "",
                password: "",
                role: "AGENT",
                department: "远见者旅行社",
                departmentCode: "",
                position: "",
              });
              setIsDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            添加员工
          </Button>
        }
      />

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="搜索员工姓名、邮箱或部门..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-full border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <CardTitle className="text-gray-900">员工列表 ({filteredStaff.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">加载中...</div>
          ) : filteredStaff.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "没有找到匹配的员工" : "还没有员工，点击上方按钮添加第一位员工"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-100">
                  <tr className="text-left text-sm text-gray-500">
                    <th className="pb-4 font-medium">姓名</th>
                    <th className="pb-4 font-medium">邮箱</th>
                    <th className="pb-4 font-medium">部门</th>
                    <th className="pb-4 font-medium">职位</th>
                    <th className="pb-4 font-medium">角色</th>
                    <th className="pb-4 font-medium">状态</th>
                    <th className="pb-4 font-medium">创建时间</th>
                    <th className="pb-4 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((s, index) => {
                    const dept = departments.find(d => d.code === s.departmentCode);
                    const position = Object.values(POSITIONS).find(p => p.code === s.position);
                    const color = getDepartmentColor(s.departmentCode);

                    return (
                      <tr
                        key={s.id}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-gray-900">{s.name || "-"}</div>
                            {s.role === "ADMIN" && (
                              <Shield className="h-4 w-4 text-purple-600" />
                            )}
                          </div>
                        </td>
                        <td className="py-4 text-gray-600">{s.email}</td>
                        <td className="py-4">
                          {dept ? (
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${getColorClasses(color)}`}>
                              {dept.name}
                            </span>
                          ) : (
                            <span className="text-gray-500 text-sm">{s.department || "-"}</span>
                          )}
                        </td>
                        <td className="py-4 text-gray-600 text-sm">
                          {position?.name || "-"}
                        </td>
                        <td className="py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${
                              s.role === "ADMIN"
                                ? "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800"
                                : s.role === "MANAGER"
                                ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800"
                                : "bg-gradient-to-r from-green-100 to-green-200 text-green-800"
                            }`}
                          >
                            {roleNames[s.role] || s.role}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            s.isActive 
                              ? "bg-green-100 text-green-700" 
                              : "bg-gray-100 text-gray-700"
                          }`}>
                            {s.isActive ? "在职" : "离职"}
                          </span>
                        </td>
                        <td className="py-4 text-gray-500 text-sm">
                          {new Date(s.createdAt).toLocaleDateString("zh-CN")}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(s)}
                              className="rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(s.id)}
                              className="rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 添加/编辑对话框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-gray-100 pb-4">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {editingStaff ? "编辑员工" : "添加员工"}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              {editingStaff ? "修改员工信息和权限" : "创建新的员工账号，系统将自动分配部门默认权限"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-5 py-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">姓名</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  密码 {editingStaff && <span className="text-gray-400 font-normal">(留空则不修改)</span>}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingStaff}
                  className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departmentCode" className="text-sm font-medium text-gray-700">所属部门</Label>
                  <Select
                    value={formData.departmentCode}
                    onValueChange={(value) => {
                      const dept = departments.find(d => d.code === value);
                      setFormData({ 
                        ...formData, 
                        departmentCode: value,
                        department: dept?.name || "",
                      });
                    }}
                  >
                    <SelectTrigger className="rounded-lg border-gray-200">
                      <SelectValue placeholder="选择部门" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept.code} value={dept.code}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position" className="text-sm font-medium text-gray-700">职位</Label>
                  <Select
                    value={formData.position}
                    onValueChange={(value) => setFormData({ ...formData, position: value })}
                    disabled={!formData.departmentCode}
                  >
                    <SelectTrigger className="rounded-lg border-gray-200">
                      <SelectValue placeholder={formData.departmentCode ? "选择职位" : "请先选择部门"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePositions.map(pos => (
                        <SelectItem key={pos.code} value={pos.code}>
                          {pos.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-gray-700">系统角色</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger className="rounded-lg border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">管理员（全部权限）</SelectItem>
                    <SelectItem value="MANAGER">经理（部门管理）</SelectItem>
                    <SelectItem value="AGENT">普通员工</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.departmentCode && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    <Shield className="inline h-4 w-4 mr-1 text-blue-600" />
                    该部门默认权限
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {getDepartmentPermissions(formData.departmentCode).slice(0, 6).map(perm => (
                      <span key={perm} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {perm.replace(/_/g, ' ')}
                      </span>
                    ))}
                    {getDepartmentPermissions(formData.departmentCode).length > 6 && (
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        +{getDepartmentPermissions(formData.departmentCode).length - 6} 更多...
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter className="border-t border-gray-100 pt-6 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-full px-6 border-gray-300"
              >
                取消
              </Button>
              <Button
                type="submit"
                className="rounded-full px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm"
              >
                {editingStaff ? "保存" : "创建"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
