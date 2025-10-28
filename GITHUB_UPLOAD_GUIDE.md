# 📦 GitHub上传和代码对接完整指南

## 🎯 概述

本指南将帮助您将**远见者旅行社智能化管理平台**上传到GitHub，并为其他开发者提供代码对接说明。

---

## 📋 上传前检查清单

### ✅ 已完成项
- [x] `.gitignore` 已配置（自动忽略敏感文件）
- [x] 环境变量模板 `env.template` 已创建
- [x] 文档完善（README.md 等）
- [x] 代码优化完成

### ⚠️ 需要注意的敏感信息

以下文件**不会**上传到GitHub（已在`.gitignore`中配置）：
```
.env                    # 环境变量（包含密钥）
prisma/dev.db          # 本地数据库
prisma/*.db-journal    # 数据库日志
node_modules/          # 依赖包
.next/                 # 构建产物
data/settings.json     # 企业设置（可选是否上传）
```

---

## 🚀 上传到GitHub步骤

### 步骤 1: 初始化Git仓库

```bash
# 在项目根目录执行
git init
```

### 步骤 2: 添加所有文件

```bash
# 添加所有文件（.gitignore会自动过滤敏感文件）
git add .

# 查看将要提交的文件
git status
```

### 步骤 3: 创建首次提交

```bash
git commit -m "🎉 初始提交: 远见者旅行社智能化管理平台 v2.0

✨ 功能特性:
- Apple风格UI设计
- 订单管理系统
- 游客/线路/报价管理
- 员工权限系统
- AI助手集成
- 知识库管理
- 企业设置和个人信息管理
- 全局命令栏(⌘K)
- 每日激励语和公告系统

🎨 技术栈:
- Next.js 14 + React 18
- TypeScript
- Prisma ORM
- NextAuth.js
- Tailwind CSS
- Radix UI
"
```

### 步骤 4: 在GitHub创建仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - **仓库名**: `yuanjianzhe-travel-system` 或自定义
   - **描述**: 远见者旅行社智能化管理平台 - Apple风格UI
   - **可见性**: 
     - 🔓 Public（公开，任何人可见）
     - 🔒 Private（私有，仅您和协作者可见）**推荐**
   - ⚠️ **不要**勾选"Add a README file"（项目已有）

3. 点击 "Create repository"

### 步骤 5: 关联远程仓库并推送

```bash
# 关联GitHub仓库（替换为您的GitHub用户名和仓库名）
git remote add origin https://github.com/YOUR_USERNAME/yuanjianzhe-travel-system.git

# 推送到GitHub
git branch -M main
git push -u origin main
```

**推送完成！** 🎉

---

## 🔐 环境变量配置说明

### 对于代码对接者

1. **复制环境变量模板**
```bash
cp env.template .env
```

2. **编辑`.env`文件，填写必要的配置**

```env
# 数据库连接（本地开发使用SQLite）
DATABASE_URL="file:./dev.db"

# NextAuth配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-please-change-this"

# AI模型配置（豆包大模型）
DOUBAO_API_KEY="your-doubao-api-key-here"
DOUBAO_MODEL="ep-20250127055059-xxxxx"
```

### 获取必要的密钥

#### 1. NEXTAUTH_SECRET
```bash
# 生成随机密钥
openssl rand -base64 32

# 或使用在线工具
# https://generate-secret.vercel.app/32
```

#### 2. DOUBAO_API_KEY
- 访问：https://www.volcengine.com/
- 注册火山引擎账号
- 开通豆包大模型服务
- 在控制台获取API Key

---

## 👥 代码对接指南

### 前置要求

确保已安装以下工具：
- **Node.js**: v18.0.0 或更高版本
- **pnpm**: v8.0.0 或更高版本（推荐）
- **Git**: 最新版本

```bash
# 检查版本
node -v
pnpm -v
git --version
```

### 克隆项目

```bash
# 克隆仓库（替换为实际的仓库地址）
git clone https://github.com/YOUR_USERNAME/yuanjianzhe-travel-system.git

# 进入项目目录
cd yuanjianzhe-travel-system
```

### 安装依赖

```bash
# 使用pnpm安装（推荐）
pnpm install

# 或使用npm
npm install

# 或使用yarn
yarn install
```

### 配置环境变量

```bash
# 1. 复制环境变量模板
cp env.template .env

# 2. 编辑.env文件
# Windows: notepad .env
# Mac/Linux: nano .env

# 3. 填写必要的配置（参考上面的环境变量说明）
```

### 初始化数据库

```bash
# 1. 生成Prisma Client
pnpm prisma generate

# 2. 运行数据库迁移
pnpm db:migrate

# 3. 填充示例数据
pnpm db:seed
```

### 启动开发服务器

```bash
# 启动开发服务器
pnpm dev

# 访问 http://localhost:3000
```

### 默认登录账号

```
邮箱: admin@yuanjianzhe.com
密码: admin123456
```

---

## 📁 项目结构说明

```
yuanjianzhe-travel-system/
├── app/                      # Next.js 14 App Router
│   ├── api/                  # API路由
│   │   ├── auth/            # 认证相关
│   │   ├── orders/          # 订单管理
│   │   ├── customers/       # 游客管理
│   │   ├── products/        # 线路管理
│   │   ├── quotes/          # 报价管理
│   │   ├── staff/           # 员工管理
│   │   ├── knowledge/       # 知识库
│   │   ├── ai-chat/         # AI助手
│   │   ├── announcements/   # 公告系统
│   │   ├── profile/         # 个人信息
│   │   └── settings/        # 企业设置
│   ├── dashboard/           # 工作台
│   ├── orders/              # 订单管理页面
│   ├── customers/           # 游客管理页面
│   ├── products/            # 线路管理页面
│   ├── quotes/              # 报价管理页面
│   ├── approvals/           # 审批流程页面
│   ├── staff/               # 员工管理页面
│   ├── departments/         # 部门权限页面
│   ├── knowledge/           # 知识库页面
│   ├── ai-chat/             # AI助手页面
│   ├── profile/             # 个人信息页面
│   ├── settings/            # 企业设置页面
│   ├── login/               # 登录页面
│   └── globals.css          # 全局样式
├── components/              # 共享组件
│   ├── ui/                  # UI基础组件
│   ├── nav.tsx              # 导航栏
│   ├── page-header.tsx      # 页面头部
│   ├── command-bar.tsx      # 命令栏(⌘K)
│   └── skeleton.tsx         # 骨架屏
├── lib/                     # 工具函数和配置
│   ├── auth.ts              # NextAuth配置
│   ├── prisma.ts            # Prisma客户端
│   ├── permissions.ts       # 权限定义
│   ├── ui-config.ts         # UI配置
│   └── utils.ts             # 工具函数
├── prisma/                  # 数据库相关
│   ├── schema.prisma        # 数据库模型
│   ├── seed.ts              # 种子数据
│   └── migrations/          # 数据库迁移
├── public/                  # 静态资源
│   ├── logo.svg             # 企业Logo
│   └── logo-placeholder.svg # 默认Logo
├── data/                    # 数据文件
│   └── settings.json        # 企业设置
├── .env.template            # 环境变量模板
├── .gitignore               # Git忽略配置
├── package.json             # 项目依赖
├── next.config.js           # Next.js配置
├── tailwind.config.ts       # Tailwind配置
├── tsconfig.json            # TypeScript配置
├── docker-compose.yml       # Docker配置
├── Dockerfile               # Docker镜像
└── README.md                # 项目说明
```

---

## 🔧 开发指南

### 可用脚本

```bash
# 开发
pnpm dev              # 启动开发服务器
pnpm build            # 构建生产版本
pnpm start            # 启动生产服务器

# 数据库
pnpm db:migrate       # 运行数据库迁移
pnpm db:seed          # 填充示例数据
pnpm db:studio        # 打开Prisma Studio（数据库管理界面）
pnpm db:reset         # 重置数据库（慎用！）

# 代码质量
pnpm lint             # 运行ESLint检查
pnpm type-check       # TypeScript类型检查
```

### 开发流程

1. **创建新分支**
```bash
git checkout -b feature/your-feature-name
```

2. **开发功能**
```bash
# 修改代码
# 测试功能
```

3. **提交代码**
```bash
git add .
git commit -m "feat: 添加新功能"
```

4. **推送到GitHub**
```bash
git push origin feature/your-feature-name
```

5. **创建Pull Request**
- 在GitHub仓库页面点击"Pull Request"
- 填写PR描述
- 等待审核和合并

### Git提交规范

使用语义化提交信息：

```bash
feat: 新功能
fix: 错误修复
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
perf: 性能优化
test: 测试相关
chore: 构建/工具链更新
```

示例：
```bash
git commit -m "feat: 添加订单导出Excel功能"
git commit -m "fix: 修复订单创建时的Select错误"
git commit -m "docs: 更新部署文档"
```

---

## 🚢 部署指南

### Vercel部署（推荐）

1. **在GitHub上授权Vercel**
   - 访问 https://vercel.com
   - 使用GitHub账号登录
   - 导入您的仓库

2. **配置环境变量**
   - 在Vercel项目设置中添加环境变量
   - 复制`.env.template`中的所有变量
   - 填写实际的值

3. **部署**
   - Vercel会自动检测Next.js项目
   - 点击"Deploy"即可
   - 每次推送到main分支会自动重新部署

### Docker部署

```bash
# 构建镜像
docker build -t yuanjianzhe-travel-system .

# 运行容器
docker-compose up -d
```

### 云服务器部署

参考文档：
- `DEPLOYMENT.md` - 详细部署指南
- `QUICKSTART_DEPLOY.md` - 快速部署指南

---

## 📊 数据库说明

### SQLite (开发环境)

默认使用SQLite，数据库文件位于 `prisma/dev.db`

**优点**: 无需安装数据库服务器，开箱即用  
**缺点**: 不适合生产环境

### PostgreSQL (生产环境)

生产环境推荐使用PostgreSQL

**修改`DATABASE_URL`**:
```env
# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/yuanjianzhe?schema=public"
```

**重新迁移**:
```bash
pnpm db:migrate
pnpm db:seed
```

---

## 🔒 安全建议

### 敏感信息保护

1. **永远不要**将以下内容提交到GitHub：
   - `.env` 文件（真实的环境变量）
   - 数据库文件（`*.db`）
   - API密钥和密码
   - 真实的企业Logo和数据

2. **使用环境变量**
   - 所有敏感配置都通过环境变量管理
   - 不同环境使用不同的`.env`文件

3. **定期更新密钥**
   - 定期轮换`NEXTAUTH_SECRET`
   - 定期更新API密钥
   - 使用强密码策略

### 代码安全

1. **依赖更新**
```bash
# 检查过期依赖
pnpm outdated

# 更新依赖
pnpm update
```

2. **安全审计**
```bash
# 检查安全漏洞
pnpm audit
```

---

## 🤝 贡献指南

### 如何贡献

1. Fork本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

### 代码规范

- 遵循ESLint规则
- 使用TypeScript类型定义
- 组件使用PascalCase命名
- 函数使用camelCase命名
- 文件使用kebab-case命名

---

## 📞 技术支持

### 遇到问题？

1. **查看文档**
   - `README.md` - 项目概述
   - `OPTIMIZATION_SUMMARY.md` - 优化详解
   - `OPTIMIZATION_CHECKLIST.md` - 测试清单
   - `DEPLOYMENT.md` - 部署指南

2. **检查Issues**
   - 在GitHub Issues中搜索类似问题
   - 如没有相关问题，创建新Issue

3. **联系方式**
   - 📧 Email: tech@yuanjianzhe.com
   - 💬 GitHub Issues: 推荐

---

## 📝 更新日志

### v2.0.0 (2025-01)

**新增功能**:
- ✨ Apple风格UI全面升级
- 🎨 订单管理系统
- 👥 员工权限体系
- 🤖 AI助手集成
- 📚 知识库系统
- ⌘K 全局命令栏
- 💬 每日激励语和公告
- 🏢 企业设置和Logo管理
- 👤 个人信息和头像上传

**优化改进**:
- 🐛 修复订单创建Select错误
- ⚡ 性能优化和动画系统
- 🎯 响应式设计完善
- 📱 移动端适配

---

## 📄 开源协议

本项目采用 MIT 协议 - 详见 [LICENSE](LICENSE) 文件

---

## 🌟 致谢

感谢以下开源项目：
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [NextAuth.js](https://next-auth.js.org/)

---

**Happy Coding! 🚀**

如有任何问题，欢迎在GitHub Issues中提问！

