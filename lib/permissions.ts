// 部门权限配置系统

// 部门定义
export const DEPARTMENTS = {
  ADMIN: {
    code: 'ADMIN',
    name: '管理与系统部',
    description: '公司管理、权限控制、知识审计',
    color: 'purple',
  },
  SALES: {
    code: 'SALES',
    name: '销售与客户部',
    description: '获取客户、沟通签约、维护关系',
    color: 'blue',
  },
  DESIGN: {
    code: 'DESIGN',
    name: '定制策划部',
    description: '方案设计、报价编制、行程策划',
    color: 'green',
  },
  RESOURCES: {
    code: 'RESOURCES',
    name: '酒店与供应商资源部',
    description: '维护酒店/地接资源、上传合约价',
    color: 'orange',
  },
  OPERATIONS: {
    code: 'OPERATIONS',
    name: '操作与执行部',
    description: '订单确认、出票、行前服务',
    color: 'indigo',
  },
  FINANCE: {
    code: 'FINANCE',
    name: '财务与结算部',
    description: '成本核算、收付款、利润分析',
    color: 'red',
  },
} as const;

// 职位定义
export const POSITIONS = {
  // 管理部
  SYSTEM_ADMIN: { code: 'SYSTEM_ADMIN', name: '系统管理员', department: 'ADMIN' },
  GENERAL_MANAGER: { code: 'GENERAL_MANAGER', name: '总经理', department: 'ADMIN' },
  
  // 销售部
  SALES_CONSULTANT: { code: 'SALES_CONSULTANT', name: '销售顾问', department: 'SALES' },
  SALES_MANAGER: { code: 'SALES_MANAGER', name: '销售经理', department: 'SALES' },
  
  // 策划部
  PRODUCT_DESIGNER: { code: 'PRODUCT_DESIGNER', name: '策划师', department: 'DESIGN' },
  DESIGN_DIRECTOR: { code: 'DESIGN_DIRECTOR', name: '策划总监', department: 'DESIGN' },
  
  // 资源部
  RESOURCE_MANAGER: { code: 'RESOURCE_MANAGER', name: '资源管理员', department: 'RESOURCES' },
  RESOURCE_DIRECTOR: { code: 'RESOURCE_DIRECTOR', name: '资源总监', department: 'RESOURCES' },
  
  // 操作部
  OPERATOR: { code: 'OPERATOR', name: '操作专员', department: 'OPERATIONS' },
  OPERATIONS_MANAGER: { code: 'OPERATIONS_MANAGER', name: '操作经理', department: 'OPERATIONS' },
  
  // 财务部
  ACCOUNTANT: { code: 'ACCOUNTANT', name: '会计', department: 'FINANCE' },
  FINANCE_MANAGER: { code: 'FINANCE_MANAGER', name: '财务经理', department: 'FINANCE' },
} as const;

// 权限模块定义
export const PERMISSION_MODULES = {
  // 客户管理
  CUSTOMER: {
    VIEW_OWN: { code: 'CUSTOMER_VIEW_OWN', name: '查看自己的客户', description: '只能查看分配给自己的客户' },
    VIEW_ALL: { code: 'CUSTOMER_VIEW_ALL', name: '查看所有客户', description: '可以查看所有客户信息' },
    CREATE: { code: 'CUSTOMER_CREATE', name: '创建客户', description: '可以创建新客户' },
    EDIT_OWN: { code: 'CUSTOMER_EDIT_OWN', name: '编辑自己的客户', description: '可以编辑分配给自己的客户' },
    EDIT_ALL: { code: 'CUSTOMER_EDIT_ALL', name: '编辑所有客户', description: '可以编辑任何客户信息' },
    DELETE: { code: 'CUSTOMER_DELETE', name: '删除客户', description: '可以删除客户记录' },
  },
  
  // 报价管理
  QUOTE: {
    VIEW_OWN: { code: 'QUOTE_VIEW_OWN', name: '查看自己的报价', description: '只能查看自己创建的报价' },
    VIEW_ALL: { code: 'QUOTE_VIEW_ALL', name: '查看所有报价', description: '可以查看所有报价' },
    CREATE: { code: 'QUOTE_CREATE', name: '创建报价草稿', description: '可以创建报价草稿' },
    EDIT_DRAFT: { code: 'QUOTE_EDIT_DRAFT', name: '编辑草稿', description: '可以编辑草稿状态的报价' },
    EDIT_ALL: { code: 'QUOTE_EDIT_ALL', name: '编辑所有报价', description: '可以编辑任何状态的报价' },
    APPROVE: { code: 'QUOTE_APPROVE', name: '审批报价', description: '可以审批报价单' },
    VIEW_COST: { code: 'QUOTE_VIEW_COST', name: '查看成本价', description: '可以查看成本和毛利' },
    EDIT_PRICE: { code: 'QUOTE_EDIT_PRICE', name: '修改价格', description: '可以修改报价公式和价格' },
  },
  
  // 产品/线路管理
  PRODUCT: {
    VIEW: { code: 'PRODUCT_VIEW', name: '查看线路', description: '可以查看旅游线路' },
    CREATE: { code: 'PRODUCT_CREATE', name: '创建线路', description: '可以创建新线路' },
    EDIT: { code: 'PRODUCT_EDIT', name: '编辑线路', description: '可以编辑线路信息' },
    DELETE: { code: 'PRODUCT_DELETE', name: '删除线路', description: '可以删除线路' },
    VIEW_COST: { code: 'PRODUCT_VIEW_COST', name: '查看成本', description: '可以查看线路成本' },
    EDIT_COST: { code: 'PRODUCT_EDIT_COST', name: '编辑成本', description: '可以编辑成本信息' },
  },
  
  // 知识库管理
  KNOWLEDGE: {
    VIEW: { code: 'KNOWLEDGE_VIEW', name: '查看知识库', description: '可以查看知识库内容' },
    UPLOAD: { code: 'KNOWLEDGE_UPLOAD', name: '上传知识', description: '可以上传文档和知识' },
    EDIT_OWN: { code: 'KNOWLEDGE_EDIT_OWN', name: '编辑自己的知识', description: '可以编辑自己上传的知识' },
    EDIT_ALL: { code: 'KNOWLEDGE_EDIT_ALL', name: '编辑所有知识', description: '可以编辑任何知识' },
    DELETE: { code: 'KNOWLEDGE_DELETE', name: '删除知识', description: '可以删除知识内容' },
    APPROVE: { code: 'KNOWLEDGE_APPROVE', name: '审批知识', description: '可以审批知识上传' },
  },
  
  // 审批流程
  APPROVAL: {
    VIEW_OWN: { code: 'APPROVAL_VIEW_OWN', name: '查看自己的审批', description: '查看与自己相关的审批' },
    VIEW_ALL: { code: 'APPROVAL_VIEW_ALL', name: '查看所有审批', description: '查看所有审批记录' },
    APPROVE: { code: 'APPROVAL_APPROVE', name: '审批权限', description: '可以审批提交的申请' },
  },
  
  // 财务管理
  FINANCE: {
    VIEW_REVENUE: { code: 'FINANCE_VIEW_REVENUE', name: '查看收入', description: '可以查看收入数据' },
    VIEW_COST: { code: 'FINANCE_VIEW_COST', name: '查看成本', description: '可以查看成本数据' },
    VIEW_PROFIT: { code: 'FINANCE_VIEW_PROFIT', name: '查看利润', description: '可以查看利润分析' },
    EDIT: { code: 'FINANCE_EDIT', name: '编辑财务', description: '可以编辑财务数据' },
    REPORT: { code: 'FINANCE_REPORT', name: '财务报表', description: '可以生成财务报表' },
  },
  
  // 系统管理
  SYSTEM: {
    USER_MANAGE: { code: 'SYSTEM_USER_MANAGE', name: '用户管理', description: '可以管理系统用户' },
    PERMISSION_MANAGE: { code: 'SYSTEM_PERMISSION_MANAGE', name: '权限管理', description: '可以分配权限' },
    AUDIT_LOG: { code: 'SYSTEM_AUDIT_LOG', name: '审计日志', description: '可以查看审计日志' },
    AI_AUDIT: { code: 'SYSTEM_AI_AUDIT', name: 'AI审计', description: '可以审计AI问答' },
    SYSTEM_SETTINGS: { code: 'SYSTEM_SETTINGS', name: '系统设置', description: '可以修改系统设置' },
  },
  
  // AI助手
  AI: {
    USE: { code: 'AI_USE', name: '使用AI助手', description: '可以使用AI助手' },
    VIEW_HISTORY: { code: 'AI_VIEW_HISTORY', name: '查看历史', description: '可以查看AI问答历史' },
  },
} as const;

// 部门默认权限配置
export const DEPARTMENT_PERMISSIONS = {
  // 管理与系统部 - 全权限
  ADMIN: [
    // 客户
    'CUSTOMER_VIEW_ALL', 'CUSTOMER_CREATE', 'CUSTOMER_EDIT_ALL', 'CUSTOMER_DELETE',
    // 报价
    'QUOTE_VIEW_ALL', 'QUOTE_CREATE', 'QUOTE_EDIT_ALL', 'QUOTE_APPROVE', 'QUOTE_VIEW_COST', 'QUOTE_EDIT_PRICE',
    // 产品
    'PRODUCT_VIEW', 'PRODUCT_CREATE', 'PRODUCT_EDIT', 'PRODUCT_DELETE', 'PRODUCT_VIEW_COST', 'PRODUCT_EDIT_COST',
    // 知识库
    'KNOWLEDGE_VIEW', 'KNOWLEDGE_UPLOAD', 'KNOWLEDGE_EDIT_ALL', 'KNOWLEDGE_DELETE', 'KNOWLEDGE_APPROVE',
    // 审批
    'APPROVAL_VIEW_ALL', 'APPROVAL_APPROVE',
    // 财务
    'FINANCE_VIEW_REVENUE', 'FINANCE_VIEW_COST', 'FINANCE_VIEW_PROFIT', 'FINANCE_EDIT', 'FINANCE_REPORT',
    // 系统
    'SYSTEM_USER_MANAGE', 'SYSTEM_PERMISSION_MANAGE', 'SYSTEM_AUDIT_LOG', 'SYSTEM_AI_AUDIT', 'SYSTEM_SETTINGS',
    // AI
    'AI_USE', 'AI_VIEW_HISTORY',
  ],
  
  // 销售与客户部
  SALES: [
    // 客户
    'CUSTOMER_VIEW_OWN', 'CUSTOMER_CREATE', 'CUSTOMER_EDIT_OWN',
    // 报价
    'QUOTE_VIEW_OWN', 'QUOTE_CREATE', 'QUOTE_EDIT_DRAFT',
    // 产品
    'PRODUCT_VIEW',
    // 知识库
    'KNOWLEDGE_VIEW',
    // 审批
    'APPROVAL_VIEW_OWN',
    // AI
    'AI_USE',
  ],
  
  // 定制策划部
  DESIGN: [
    // 客户
    'CUSTOMER_VIEW_ALL',
    // 报价
    'QUOTE_VIEW_ALL', 'QUOTE_CREATE', 'QUOTE_EDIT_ALL', 'QUOTE_VIEW_COST', 'QUOTE_EDIT_PRICE',
    // 产品
    'PRODUCT_VIEW', 'PRODUCT_CREATE', 'PRODUCT_EDIT', 'PRODUCT_VIEW_COST',
    // 知识库
    'KNOWLEDGE_VIEW', 'KNOWLEDGE_UPLOAD', 'KNOWLEDGE_EDIT_OWN',
    // 审批
    'APPROVAL_VIEW_OWN',
    // AI
    'AI_USE',
  ],
  
  // 酒店与供应商资源部
  RESOURCES: [
    // 产品
    'PRODUCT_VIEW', 'PRODUCT_EDIT', 'PRODUCT_VIEW_COST', 'PRODUCT_EDIT_COST',
    // 知识库
    'KNOWLEDGE_VIEW', 'KNOWLEDGE_UPLOAD', 'KNOWLEDGE_EDIT_ALL', 'KNOWLEDGE_DELETE',
    // 报价 (仅查看用于验证)
    'QUOTE_VIEW_ALL', 'QUOTE_VIEW_COST',
    // 审批
    'APPROVAL_VIEW_OWN', 'APPROVAL_APPROVE',
    // AI
    'AI_USE',
  ],
  
  // 操作与执行部
  OPERATIONS: [
    // 客户
    'CUSTOMER_VIEW_ALL',
    // 报价
    'QUOTE_VIEW_ALL',
    // 产品
    'PRODUCT_VIEW',
    // 知识库
    'KNOWLEDGE_VIEW',
    // 审批
    'APPROVAL_VIEW_OWN',
    // AI
    'AI_USE',
  ],
  
  // 财务与结算部
  FINANCE: [
    // 报价
    'QUOTE_VIEW_ALL', 'QUOTE_VIEW_COST', 'QUOTE_APPROVE',
    // 产品
    'PRODUCT_VIEW', 'PRODUCT_VIEW_COST',
    // 财务
    'FINANCE_VIEW_REVENUE', 'FINANCE_VIEW_COST', 'FINANCE_VIEW_PROFIT', 'FINANCE_EDIT', 'FINANCE_REPORT',
    // 审批
    'APPROVAL_VIEW_ALL', 'APPROVAL_APPROVE',
    // AI
    'AI_USE',
  ],
};

// 权限检查函数
export function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
  if (!userPermissions) return false;
  return userPermissions.includes(requiredPermission);
}

// 权限组检查函数
export function hasAnyPermission(userPermissions: string[], requiredPermissions: string[]): boolean {
  if (!userPermissions) return false;
  return requiredPermissions.some(permission => userPermissions.includes(permission));
}

// 权限组全部检查函数
export function hasAllPermissions(userPermissions: string[], requiredPermissions: string[]): boolean {
  if (!userPermissions) return false;
  return requiredPermissions.every(permission => userPermissions.includes(permission));
}

// 获取部门默认权限
export function getDepartmentPermissions(departmentCode: string): string[] {
  return DEPARTMENT_PERMISSIONS[departmentCode as keyof typeof DEPARTMENT_PERMISSIONS] || [];
}

// 获取职位对应部门
export function getPositionDepartment(positionCode: string): string {
  const position = Object.values(POSITIONS).find(p => p.code === positionCode);
  return position?.department || '';
}

// 获取部门的所有职位
export function getDepartmentPositions(departmentCode: string) {
  return Object.values(POSITIONS).filter(p => p.department === departmentCode);
}

