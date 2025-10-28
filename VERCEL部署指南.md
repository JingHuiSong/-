# 远见者旅行社系统 - Vercel 部署完整指南

## ⚠️ 重要提示

Vercel 是 **serverless** 环境，不支持 SQLite 本地文件数据库。您需要使用云数据库（推荐 PostgreSQL）。

---

## 🚀 快速部署步骤

### 方案一：使用 Vercel Postgres（推荐 - 最简单）

#### 1. 创建 Vercel Postgres 数据库

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入您的项目
3. 点击 **Storage** 标签
4. 点击 **Create Database**
5. 选择 **Postgres**
6. 选择区域（建议选择离用户最近的）
7. 点击 **Create**

#### 2. 连接数据库到项目

1. 在 Vercel Dashboard 中，数据库创建完成后
2. 点击 **Connect to Project**
3. 选择您的项目
4. Vercel 会自动添加环境变量：
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL` ⭐（Prisma 使用这个）
   - `POSTGRES_URL_NON_POOLING`
   - 等其他变量

#### 3. 更新 Prisma Schema

将项目的 `prisma/schema.prisma` 修改为使用 PostgreSQL：

```bash
# 在本地执行
cp prisma/schema.vercel.prisma prisma/schema.prisma
```

或手动修改 `prisma/schema.prisma` 中的 datasource：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

#### 4. 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

**Settings → Environment Variables**

```env
# 数据库（Vercel Postgres 会自动添加）
DATABASE_URL=${POSTGRES_PRISMA_URL}

# NextAuth 配置
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars-long

# 其他配置
NODE_ENV=production
```

**生成 NEXTAUTH_SECRET：**
```bash
openssl rand -base64 32
```

#### 5. 部署到 Vercel

**方式 A：通过 GitHub 自动部署（推荐）**

1. 访问 [Vercel Dashboard](https://vercel.com/new)
2. 点击 **Import Git Repository**
3. 选择您的 GitHub 仓库：`https://github.com/JingHuiSong/-.git`
4. 配置构建设置：
   - Framework Preset: **Next.js**
   - Build Command: `pnpm prisma generate && pnpm build`
   - Install Command: `pnpm install`
   - Output Directory: `.next`
5. 点击 **Deploy**

**方式 B：使用 Vercel CLI**

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

#### 6. 初始化数据库

部署成功后，需要运行数据库迁移：

**方式 A：使用 Vercel Postgres Insights**

1. 进入 Vercel Dashboard → Storage → 您的数据库
2. 点击 **Query** 标签
3. 手动执行迁移 SQL（从 `prisma/migrations` 文件夹复制）

**方式 B：本地连接生产数据库**

```bash
# 获取生产数据库 URL（从 Vercel 环境变量）
# 设置到本地环境变量
export DATABASE_URL="postgresql://..."

# 运行迁移
pnpm prisma migrate deploy

# 填充种子数据
pnpm db:seed
```

---

### 方案二：使用其他云数据库

#### 推荐的数据库服务

1. **Supabase**（免费额度大）
   - 访问：https://supabase.com
   - 创建项目 → 获取 PostgreSQL 连接字符串
   - 格式：`postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`

2. **Neon**（专为 serverless 优化）
   - 访问：https://neon.tech
   - 免费 500MB 存储
   - 自动扩缩容

3. **Railway**
   - 访问：https://railway.app
   - 免费 $5/月额度

4. **PlanetScale**（MySQL）
   - 访问：https://planetscale.com
   - 需要修改 schema 为 MySQL

#### 配置步骤（以 Supabase 为例）

1. **创建 Supabase 项目**
   - 访问 https://supabase.com/dashboard
   - Create New Project
   - 记录数据库密码

2. **获取连接字符串**
   - Project Settings → Database
   - Connection String → URI
   - 复制连接字符串

3. **在 Vercel 中配置**
   - Vercel Dashboard → Your Project → Settings → Environment Variables
   - 添加 `DATABASE_URL` = 您的 Supabase 连接字符串

4. **部署**
   - 推送代码到 GitHub
   - Vercel 自动部署

---

## 🔧 完整配置检查清单

### Vercel 项目设置

```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "pnpm prisma generate && pnpm build",
  "installCommand": "pnpm install",
  "env": {
    "SKIP_ENV_VALIDATION": "1"
  }
}
```

### 环境变量（必须配置）

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `DATABASE_URL` | 数据库连接字符串 | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_URL` | 应用访问地址 | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | 认证密钥（32位以上） | `openssl rand -base64 32` |
| `NODE_ENV` | 环境类型 | `production` |

### package.json 脚本检查

确保有以下脚本：

```json
{
  "scripts": {
    "build": "next build",
    "postinstall": "prisma generate"
  }
}
```

---

## 🐛 常见部署错误及解决方案

### 错误 1: `Can't reach database server`

**原因：** 数据库连接字符串错误或数据库未启动

**解决：**
```bash
# 检查 DATABASE_URL 格式
postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# 确保数据库服务在线
# 在 Vercel Environment Variables 中正确配置
```

### 错误 2: `P1001: Can't reach database server at localhost`

**原因：** 本地 SQLite 配置未修改

**解决：**
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"  // 不是 sqlite
  url      = env("DATABASE_URL")
}
```

### 错误 3: `Prisma Client could not locate the Query Engine`

**原因：** Prisma 未正确生成

**解决：**
```json
// package.json
{
  "scripts": {
    "postinstall": "prisma generate"  // 添加这一行
  }
}
```

### 错误 4: `Module not found: Can't resolve 'fs'`

**原因：** 使用了 Node.js 文件系统模块

**解决：**
- 移除文件上传到本地的代码
- 改用云存储服务（Vercel Blob、Cloudinary 等）

### 错误 5: `NEXTAUTH_SECRET` missing

**原因：** 未配置认证密钥

**解决：**
```bash
# 生成密钥
openssl rand -base64 32

# 在 Vercel 环境变量中添加
NEXTAUTH_SECRET=生成的密钥
```

---

## 📊 部署后检查

### 1. 数据库连接测试

访问：`https://your-app.vercel.app/api/test-db`

创建测试 API（可选）：
```typescript
// app/api/test-db/route.ts
import { PrismaClient } from '@prisma/client';

export async function GET() {
  try {
    const prisma = new PrismaClient();
    await prisma.$connect();
    return Response.json({ status: 'ok', message: '数据库连接成功' });
  } catch (error) {
    return Response.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
```

### 2. 登录测试

访问：`https://your-app.vercel.app/login`

使用管理员账户：
- 邮箱：`admin@yuanjianzhe.com`
- 密码：`admin123456`

### 3. 性能检查

- 首页加载时间 < 3s
- API 响应时间 < 500ms
- Lighthouse 分数 > 90

---

## 🎯 优化建议

### 1. 启用边缘运行时

```typescript
// app/api/*/route.ts
export const runtime = 'edge';
```

### 2. 配置图片优化

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-cdn.com'],
  },
}
```

### 3. 启用缓存

```typescript
// app/api/*/route.ts
export const revalidate = 60; // 60秒缓存
```

### 4. 使用 Vercel Blob 存储文件

```bash
npm install @vercel/blob
```

```typescript
import { put } from '@vercel/blob';

const blob = await put('avatar.png', file, {
  access: 'public',
});
```

---

## 🔄 持续部署

### GitHub Actions 自动部署

每次推送到 `main` 分支时自动部署：

1. Vercel 会自动检测 GitHub 仓库的更新
2. 自动触发构建和部署
3. 部署完成后发送通知

### 查看部署日志

1. Vercel Dashboard → Your Project
2. 点击最新的 Deployment
3. 查看 Build Logs 和 Runtime Logs

---

## 📞 获取帮助

### 常用资源

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Prisma Vercel 部署](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

### 查看日志

```bash
# 使用 Vercel CLI 查看实时日志
vercel logs your-deployment-url
```

---

## ✅ 部署成功检查清单

- [ ] Vercel Postgres 数据库已创建
- [ ] 环境变量已配置（DATABASE_URL, NEXTAUTH_SECRET）
- [ ] prisma/schema.prisma 已改为 postgresql
- [ ] GitHub 仓库已连接到 Vercel
- [ ] 构建成功（无错误）
- [ ] 数据库迁移已执行
- [ ] 种子数据已填充
- [ ] 登录功能正常
- [ ] 所有页面可访问
- [ ] 性能测试通过

---

**祝您部署顺利！🎉**

如有问题，请查看 Vercel 部署日志或联系技术支持。

