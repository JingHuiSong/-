# 🚀 内部协作系统

Next.js 14 + Prisma + NextAuth 企业协作平台

## ⚡ 快速部署

**想要立即上线？**

📖 查看 [快速部署指南](QUICKSTART_DEPLOY.md) - 3种方式，5分钟上线！

- 🌐 **Vercel 部署**（推荐）- 免费 + 自动 HTTPS
- 🐳 **Docker 部署** - 一键启动
- 🖥️ **云服务器部署** - 完全控制

## 本地开发

```bash
# 1. 安装依赖
pnpm install

# 2. 配置环境变量
cp env.template .env
# 编辑 .env 文件

# 3. 启动数据库（可选，使用 SQLite 可跳过）
docker-compose up -d

# 4. 初始化数据库
pnpm db:migrate
pnpm db:seed

# 5. 启动项目
pnpm dev
```

访问 http://localhost:3000

## 测试账号

- 管理员: admin@example.com / password123
- 销售: agent1@example.com / password123

⚠️ **生产环境请立即修改默认密码！**

## 功能特性

✅ 客户管理 - CRM 客户关系管理  
✅ 产品管理 - 产品库存价格管理  
✅ 报价管理 - 智能报价单生成  
✅ 审批流程 - 多级审批工作流  
✅ 知识库 - 团队文档协作  
✅ 审计日志 - 完整操作追踪

## 技术栈

- **框架**: Next.js 14 (App Router)
- **UI**: React + Tailwind CSS + Radix UI
- **认证**: NextAuth.js
- **数据库**: Prisma ORM + PostgreSQL/SQLite
- **部署**: Docker + Vercel

## 项目结构

```
├── app/              # Next.js 应用目录
├── components/       # React 组件
├── lib/             # 工具函数
├── prisma/          # 数据库模型
├── public/          # 静态资源
└── ...
```

## 📚 文档

- [快速部署指南](QUICKSTART_DEPLOY.md) - 新手友好的部署教程
- [详细部署文档](DEPLOYMENT.md) - 完整的生产环境部署指南

## 🔧 开发命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
pnpm start        # 启动生产服务器
pnpm lint         # 代码检查
pnpm db:studio    # 打开数据库管理界面
pnpm db:migrate   # 运行数据库迁移
pnpm db:seed      # 填充测试数据
```

## 许可证

MIT

