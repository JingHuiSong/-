"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEPARTMENTS, DEPARTMENT_PERMISSIONS, PERMISSION_MODULES } from "@/lib/permissions";
import { Users, CheckCircle } from "lucide-react";

export default function DepartmentsPage() {
  const departments = Object.values(DEPARTMENTS);

  const getPermissionName = (permissionCode: string) => {
    for (const module of Object.values(PERMISSION_MODULES)) {
      for (const perm of Object.values(module)) {
        if (perm.code === permissionCode) {
          return perm.name;
        }
      }
    }
    return permissionCode;
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
      purple: {
        bg: 'from-purple-50 to-purple-100',
        border: 'border-purple-200',
        text: 'text-purple-700',
        badge: 'bg-purple-100 text-purple-700',
      },
      blue: {
        bg: 'from-blue-50 to-blue-100',
        border: 'border-blue-200',
        text: 'text-blue-700',
        badge: 'bg-blue-100 text-blue-700',
      },
      green: {
        bg: 'from-green-50 to-green-100',
        border: 'border-green-200',
        text: 'text-green-700',
        badge: 'bg-green-100 text-green-700',
      },
      orange: {
        bg: 'from-orange-50 to-orange-100',
        border: 'border-orange-200',
        text: 'text-orange-700',
        badge: 'bg-orange-100 text-orange-700',
      },
      indigo: {
        bg: 'from-indigo-50 to-indigo-100',
        border: 'border-indigo-200',
        text: 'text-indigo-700',
        badge: 'bg-indigo-100 text-indigo-700',
      },
      red: {
        bg: 'from-red-50 to-red-100',
        border: 'border-red-200',
        text: 'text-red-700',
        badge: 'bg-red-100 text-red-700',
      },
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="p-8">
      <PageHeader
        title="部门权限管理"
        description="查看各部门职责和系统权限配置"
        breadcrumbs={[{ label: "部门管理" }]}
      />

      <div className="grid gap-6">
        {departments.map((dept) => {
          const permissions = DEPARTMENT_PERMISSIONS[dept.code as keyof typeof DEPARTMENT_PERMISSIONS] || [];
          const colors = getColorClasses(dept.color);

          return (
            <Card key={dept.code} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className={`bg-gradient-to-r ${colors.bg} border-b ${colors.border}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-xl bg-white shadow-sm`}>
                        <Users className={`h-6 w-6 ${colors.text}`} />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-gray-900">{dept.name}</CardTitle>
                        <p className={`text-sm ${colors.text} font-medium mt-1`}>{dept.code}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{dept.description}</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${colors.badge}`}>
                    {permissions.length} 项权限
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  核心系统权限
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {permissions.map((perm) => (
                    <div
                      key={perm}
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span className="text-sm text-gray-700">{getPermissionName(perm)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 权限说明 */}
      <Card className="mt-6 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg text-gray-900 mb-3">💡 权限管理说明</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• <strong>管理与系统部</strong>：拥有全部权限，负责系统管理和审计</p>
            <p>• <strong>销售与客户部</strong>：专注客户管理和报价创建，限制访问成本数据</p>
            <p>• <strong>定制策划部</strong>：可编辑报价和产品，查看成本进行方案设计</p>
            <p>• <strong>资源部</strong>：专门管理知识库和供应商资源，审批资源使用</p>
            <p>• <strong>操作执行部</strong>：查看订单和客户信息，执行具体操作</p>
            <p>• <strong>财务结算部</strong>：查看财务数据，进行成本核算和审批</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

