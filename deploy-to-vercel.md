# 🚀 一键部署到 Vercel - 快速指南

## 📋 准备工作（5分钟）

### 1. 创建云数据库

**推荐选项：Vercel Postgres（最简单）**

1. 访问 https://vercel.com/dashboard
2. 点击 **Storage** → **Create Database**
3. 选择 **Postgres** → 选择区域 → **Create**
4. ✅ 完成！Vercel 会自动配置环境变量

**备选选项：Supabase（免费额度大）**

1. 访问 https://supabase.com/dashboard
2. **New Project** → 填写项目信息
3. 进入 **Settings** → **Database**
4. 复制 **Connection String** (URI 格式)
5. ✅ 完成！稍后粘贴到 Vercel 环境变量

---

## 🎯 部署步骤（3步完成）

### 步骤 1：导入 GitHub 仓库到 Vercel

1. 访问 https://vercel.com/new
2. 点击 **Import Git Repository**
3. 选择仓库：`JingHuiSong/-`（您的仓库）
4. 点击 **Import**

### 步骤 2：配置构建设置

在 Vercel 导入页面：

```
Framework Preset: Next.js
Root Directory: ./
Build Command: pnpm prisma generate && pnpm build
Install Command: pnpm install
Output Directory: .next
Node.js Version: 18.x
```

✅ 保持默认即可，已在 `vercel.json` 中配置

### 步骤 3：配置环境变量

点击 **Environment Variables**，添加以下变量：

#### 🔴 必需配置

**1. DATABASE_URL**
```
如果使用 Vercel Postgres:
  值：${POSTGRES_PRISMA_URL}

如果使用 Supabase:
  值：postgresql://postgres:[密码]@db.[项目].supabase.co:5432/postgres
```

**2. NEXTAUTH_URL**
```
值：https://[你的项目名].vercel.app
```

**3. NEXTAUTH_SECRET**
```
生成方法：在终端运行 openssl rand -base64 32
值：[生成的32位密钥]
```

**4. NODE_ENV**
```
值：production
```

---

## ✅ 点击部署！

1. 点击 **Deploy** 按钮
2. ⏳ 等待 2-3 分钟（首次构建）
3. 🎉 部署成功！

---

## 🗄️ 初始化数据库

部署成功后，需要运行数据库迁移和种子数据。

### 方法 A：使用 Vercel CLI（推荐）

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 链接项目
vercel link

# 4. 拉取环境变量到本地
vercel env pull .env.production

# 5. 修改 schema 为 PostgreSQL
cp prisma/schema.vercel.prisma prisma/schema.prisma

# 6. 运行迁移（连接生产数据库）
npx dotenv -e .env.production -- npx prisma migrate deploy

# 7. 填充种子数据
npx dotenv -e .env.production -- npx prisma db seed
```

### 方法 B：手动执行 SQL

1. 进入 Vercel Dashboard → Storage → 您的数据库
2. 点击 **Query** 或 **Data** 标签
3. 复制 `prisma/migrations` 文件夹中的所有 SQL
4. 在数据库控制台中执行
5. 使用 SQL 手动插入管理员账户

---

## 🧪 测试部署

### 1. 访问应用

```
https://[你的项目名].vercel.app
```

### 2. 测试登录

```
邮箱：admin@yuanjianzhe.com
密码：admin123456
```

### 3. 检查功能

- [ ] 登录成功
- [ ] 工作台显示正常
- [ ] 客户管理可访问
- [ ] 订单系统可用
- [ ] 头像上传正常（需配置 Vercel Blob）

---

## 🐛 常见问题

### Q1: 部署失败 - "Can't reach database server"

**解决：**
- 检查 `DATABASE_URL` 是否正确配置
- 确保数据库服务在线
- 检查数据库防火墙设置（允许 Vercel IP）

### Q2: 登录后显示 "NextAuth Error"

**解决：**
- 检查 `NEXTAUTH_SECRET` 是否配置
- 检查 `NEXTAUTH_URL` 是否正确（必须是 https://）
- 重新部署项目

### Q3: 页面加载缓慢

**解决：**
- 选择离用户更近的数据库区域
- 启用 Vercel 的 Edge Functions
- 优化数据库查询

### Q4: 文件上传不工作

**说明：** Vercel serverless 环境不支持本地文件存储

**解决：** 配置 Vercel Blob Storage

```bash
# 1. 在 Vercel Dashboard 创建 Blob Store
# 2. 添加环境变量
BLOB_READ_WRITE_TOKEN="vercel_blob_xxx"

# 3. 修改上传代码使用 Vercel Blob
```

---

## 📊 部署完成检查清单

完成以下检查，确保系统运行正常：

- [ ] Vercel 项目已创建
- [ ] GitHub 仓库已连接
- [ ] 数据库已创建并连接
- [ ] 环境变量已配置（至少4个必需变量）
- [ ] 构建成功（绿色对勾）
- [ ] 部署成功（可访问 URL）
- [ ] 数据库迁移已执行
- [ ] 管理员账户可登录
- [ ] 所有主要功能正常

---

## 🎨 自定义域名（可选）

1. Vercel Dashboard → 您的项目 → **Settings** → **Domains**
2. 添加自定义域名：`www.yuanjianzhe.com`
3. 根据提示配置 DNS 记录
4. 等待 SSL 证书自动签发

---

## 🔄 更新部署

### 自动部署（推荐）

推送代码到 GitHub `main` 分支，Vercel 自动部署：

```bash
git add .
git commit -m "更新功能"
git push origin main
```

### 手动部署

```bash
vercel --prod
```

---

## 📈 监控和日志

### 查看运行日志

```bash
vercel logs [deployment-url]
```

### 查看构建日志

Vercel Dashboard → 项目 → Deployments → 选择部署 → View Build Logs

### 性能监控

Vercel Dashboard → 项目 → Analytics
- 页面访问量
- 响应时间
- 错误率

---

## 💡 性能优化建议

### 1. 启用边缘缓存

```typescript
// app/page.tsx
export const revalidate = 60; // 缓存60秒
```

### 2. 使用图片优化

```typescript
import Image from 'next/image';

<Image
  src="/logo.svg"
  width={200}
  height={200}
  alt="Logo"
  priority
/>
```

### 3. 启用增量静态生成 (ISR)

```typescript
export async function generateStaticParams() {
  // 预渲染常用页面
}
```

---

## 🎉 部署成功！

恭喜！您的远见者旅行社内部协作系统已成功部署到 Vercel！

**下一步：**
1. ✅ 测试所有功能
2. 📧 邀请团队成员
3. 📊 配置数据备份
4. 🔒 启用双因素认证

**预见世界，预见自己** 🌍✨

---

## 📞 需要帮助？

- 📖 [Vercel 文档](https://vercel.com/docs)
- 💬 [GitHub Issues](https://github.com/JingHuiSong/-/issues)
- 📧 Email: admin@yuanjianzhe.com

