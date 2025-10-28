# 个人信息与企业设置功能文档

> **版本**：v1.0.0  
> **更新时间**：2025-01-27

---

## 🎯 功能概述

为每位用户提供个性化的个人信息管理和企业品牌定制功能，支持头像上传、个人资料编辑和企业Logo更新。

---

## 👤 个人信息管理

### 访问路径
```
/profile
或
导航栏底部点击用户头像
或
按 ⌘K 搜索"个人信息"
```

### 功能特性

#### 1. 头像上传 📸
- ✅ **点击上传**：点击头像即可选择图片
- ✅ **支持格式**：JPG、PNG、GIF
- ✅ **文件大小**：最大 2MB
- ✅ **Base64存储**：直接存储在数据库
- ✅ **实时预览**：上传后立即显示
- ✅ **悬浮效果**：Hover显示上传图标

#### 2. 基本信息编辑 ✏️
- ✅ **姓名**：可修改
- ✅ **邮箱**：只读（不可修改）
- ✅ **手机号码**：可选填
- ✅ **所属部门**：只读（由管理员分配）
- ✅ **个人简介**：多行文本输入

#### 3. 账户信息展示 📋
- ✅ **用户ID**：系统生成的唯一标识
- ✅ **部门代码**：当前所属部门
- ✅ **职位**：当前职位
- ✅ **邮箱验证状态**：显示是否已验证

### UI设计

#### 视觉特点
- 🎨 **渐变背景**：from-gray-50 via-blue-50/30 to-purple-50/30
- 🎨 **毛玻璃卡片**：白色半透明 + backdrop-blur
- 🎨 **渐变头像边框**：蓝色→紫色渐变
- 🎨 **悬浮动画**：头像Hover放大1.05倍
- 🎨 **成功提示**：绿色卡片 + 动画

#### 交互效果
- ✨ **渐入动画**：卡片延迟渐入
- ✨ **上传反馈**：旋转加载动画
- ✨ **保存反馈**：按钮加载状态
- ✨ **消息提示**：3秒后自动消失

---

## 🏢 企业设置管理

### 访问路径
```
/settings
或
按 ⌘K 搜索"企业设置"
```

### 功能特性

#### 1. 企业Logo上传 🖼️
- ✅ **点击上传**：点击Logo即可选择图片
- ✅ **支持格式**：JPG、PNG、SVG
- ✅ **文件大小**：最大 5MB
- ✅ **Base64存储**：存储在配置文件
- ✅ **实时预览**：上传后立即显示
- ✅ **应用范围**：登录页 + 导航栏

#### 2. 企业信息编辑 ✏️
- ✅ **企业名称**：可修改
- ✅ **企业口号/标语**：可修改
- ✅ **实时预览**：查看显示效果

#### 3. 预览效果 👁️
- ✅ **模拟展示**：查看实际显示效果
- ✅ **渐变背景**：蓝色渐变卡片
- ✅ **Logo+文字组合**：完整展示

### 数据存储

**文件路径**：`data/settings.json`

**数据结构**：
```json
{
  "companyName": "远见者旅行社",
  "companySlogan": "预见世界，预见自己",
  "companyLogo": "data:image/png;base64,..."
}
```

---

## 🔌 API接口

### 个人信息API

#### GET /api/profile
获取当前用户的个人信息

**Response**:
```json
{
  "id": "clxxx...",
  "name": "张三",
  "email": "zhang@yuanjianzhe.com",
  "image": "data:image/png;base64,...",
  "phone": "13800138000",
  "department": "销售与客户部",
  "departmentCode": "SALES",
  "position": "销售顾问",
  "bio": "热爱旅游，专注高端定制..."
}
```

#### PUT /api/profile
更新个人信息

**Request**:
```json
{
  "name": "张三",
  "phone": "13800138000",
  "bio": "个人简介..."
}
```

#### POST /api/profile/avatar
上传头像

**Request**:
```json
{
  "image": "data:image/png;base64,iVBORw0KGgoAAAA..."
}
```

**Response**:
```json
{
  "image": "data:image/png;base64,..."
}
```

### 企业设置API

#### GET /api/settings
获取企业设置

**Response**:
```json
{
  "companyName": "远见者旅行社",
  "companySlogan": "预见世界，预见自己",
  "companyLogo": "/logo.png"
}
```

#### PUT /api/settings
更新企业信息

**Request**:
```json
{
  "companyName": "远见者旅行社",
  "companySlogan": "预见世界，预见自己"
}
```

#### POST /api/settings/logo
上传企业Logo

**Request**:
```json
{
  "logo": "data:image/png;base64,..."
}
```

---

## 📁 文件结构

```
app/
├── profile/
│   └── page.tsx              ✅ 个人信息页面
├── settings/
│   └── page.tsx              ✅ 企业设置页面
└── api/
    ├── profile/
    │   ├── route.ts          ✅ 个人信息API
    │   └── avatar/
    │       └── route.ts      ✅ 头像上传API
    └── settings/
        ├── route.ts          ✅ 企业设置API
        └── logo/
            └── route.ts      ✅ Logo上传API

data/
└── settings.json             ✅ 企业设置配置文件
```

---

## 🎨 UI组件

### 头像组件
```tsx
<div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center overflow-hidden cursor-pointer group-hover:scale-105 transition-transform">
  {image ? (
    <img src={image} alt="头像" className="w-full h-full object-cover" />
  ) : (
    <span className="text-4xl text-white font-bold">{name?.charAt(0)}</span>
  )}
</div>
```

### 消息提示组件
```tsx
{message && (
  <div className="p-4 rounded-xl flex items-center gap-3 animate-scaleIn bg-green-50 border border-green-200 text-green-800">
    <Check className="h-5 w-5 text-green-600" />
    <span className="font-medium">{message.text}</span>
  </div>
)}
```

---

## ⚙️ 配置说明

### 图片上传限制

**个人头像**：
- 最大文件大小：2MB
- 支持格式：image/*
- 存储方式：Base64编码存入数据库

**企业Logo**：
- 最大文件大小：5MB
- 支持格式：image/*
- 存储方式：Base64编码存入配置文件

### 验证规则

```typescript
// 文件类型验证
if (!file.type.startsWith("image/")) {
  showMessage("error", "请上传图片文件");
  return;
}

// 文件大小验证
if (file.size > 2 * 1024 * 1024) {
  showMessage("error", "图片大小不能超过2MB");
  return;
}
```

---

## 🔐 权限控制

### 个人信息
- ✅ 所有用户可访问自己的个人信息
- ✅ 只能编辑自己的信息
- ✅ 邮箱和部门由管理员管理

### 企业设置
- 🔄 建议仅管理员可访问
- 🔄 需添加权限验证
- 🔄 操作需记录审计日志

---

## 🚀 使用指南

### 1. 上传个人头像

1. 点击导航栏底部的用户头像
2. 进入个人信息页面
3. 点击大头像
4. 选择图片文件（≤2MB）
5. 等待上传完成
6. 头像立即更新

### 2. 编辑个人信息

1. 访问个人信息页面
2. 修改姓名、手机号、个人简介
3. 点击"保存更改"按钮
4. 看到成功提示

### 3. 上传企业Logo

1. 访问企业设置页面
2. 点击Logo区域
3. 选择Logo文件（≤5MB）
4. 等待上传完成
5. Logo应用到系统

### 4. 修改企业信息

1. 访问企业设置页面
2. 修改企业名称和口号
3. 查看预览效果
4. 点击"保存更改"

---

## 🎯 导航栏集成

### 用户头像点击跳转

**优化前**：
- 用户头像仅作展示
- 无法快速访问个人信息

**优化后**：
- ✅ 用户头像可点击
- ✅ 点击跳转到个人信息页
- ✅ 显示真实头像（如已上传）
- ✅ Hover放大效果

---

## 📊 数据库字段（扩展建议）

### User表建议扩展字段

```prisma
model User {
  // ... 现有字段
  
  // 建议添加
  phone       String?    // 手机号码
  bio         String?    // 个人简介
  avatar      String?    // 头像URL（备用）
  
  @@map("users")
}
```

### Settings表（未来可考虑）

```prisma
model Settings {
  id              String   @id @default(cuid())
  companyName     String
  companySlogan   String
  companyLogo     String
  companyEmail    String?
  companyPhone    String?
  companyAddress  String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("settings")
}
```

---

## 🔄 未来优化

### 第一阶段（已完成）✅
- ✅ 个人信息页面
- ✅ 头像上传功能
- ✅ 企业设置页面
- ✅ Logo上传功能
- ✅ 导航栏用户头像集成

### 第二阶段（规划中）📅
- 📅 头像裁剪功能
- 📅 图片压缩优化
- 📅 OSS云存储支持
- 📅 更多个人设置选项

### 第三阶段（规划中）📅
- 📅 头像框选择
- 📅 个性化主题
- 📅 通知偏好设置
- 📅 快捷键自定义

---

## 🎨 视觉效果

### 个人信息页面
```
┌─────────────────────────────────────────┐
│  📸 个人头像                            │
│  ┌─────────────┐                        │
│  │    头像     │  <- 点击上传           │
│  │  (可点击)   │                        │
│  └─────────────┘                        │
│                                         │
│  张三                                   │
│  zhang@yuanjianzhe.com                 │
│  [ 销售顾问 ]                          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  ✏️ 基本信息                            │
│  ┌─────────────────────────────────┐   │
│  │ 姓名: [张三            ]        │   │
│  │ 邮箱: zhang@... (不可修改)      │   │
│  │ 手机: [13800138000    ]        │   │
│  │ 部门: 销售与客户部 (不可修改)   │   │
│  │ 简介: [多行文本框...]          │   │
│  └─────────────────────────────────┘   │
│                    [ 保存更改 ]        │
└─────────────────────────────────────────┘
```

### 企业设置页面
```
┌─────────────────────────────────────────┐
│  🖼️ 企业Logo                            │
│  ┌─────────────┐                        │
│  │    Logo     │  <- 点击上传           │
│  │  (可点击)   │                        │
│  └─────────────┘                        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  🏢 企业信息                            │
│  ┌─────────────────────────────────┐   │
│  │ 企业名称: [远见者旅行社]       │   │
│  │ 企业口号: [预见世界，预见自己]  │   │
│  └─────────────────────────────────┘   │
│                    [ 保存更改 ]        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  👁️ 预览效果                            │
│  [渐变背景卡片展示Logo+名称+口号]      │
└─────────────────────────────────────────┘
```

---

## ✅ 检查清单

发布前确保：

- [ ] 头像上传功能正常
- [ ] 图片大小限制生效
- [ ] 个人信息保存成功
- [ ] Logo上传功能正常
- [ ] 企业信息保存成功
- [ ] 导航栏头像显示正确
- [ ] 点击头像跳转正常
- [ ] 所有动画流畅
- [ ] 消息提示正常显示
- [ ] data目录和配置文件存在

---

## 📞 技术支持

如有问题，请联系：
- 前端团队：frontend@yuanjianzhe.com
- 后端团队：backend@yuanjianzhe.com

---

**🎊 个人信息与企业设置功能已完成！**

**立即体验**：
1. 重启开发服务器
2. 点击导航栏底部用户头像
3. 或按 `⌘K` 搜索"个人信息"

