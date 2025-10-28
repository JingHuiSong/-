# 🚨 紧急修复 - Vercel 部署错误

## ❌ 错误信息
```
Application error: a server-side exception has occurred
Digest: 1541185240
```

## 🔍 根本原因

**Prisma Schema 还在使用 SQLite！**

Vercel 是 serverless 环境，不支持 SQLite 文件数据库。

---

## ✅ 修复步骤（5分钟解决）

### 第1步：切换到 PostgreSQL（已自动完成）

✅ 已将 `prisma/schema.prisma` 从 SQLite 切换到 PostgreSQL

**改动：**
```prisma
datasource db {
  provider = "postgresql"  // 从 sqlite 改为 postgresql
  url      = env("DATABASE_URL")
}
```

### 第2步：在 Vercel 创建数据库

**方式 A：Vercel Postgres（推荐 - 最简单）**

1. 访问 https://vercel.com/dashboard
2. 选择您的项目
3. 点击 **Storage** 标签
4. 点击 **Create Database**
5. 选择 **Postgres**
6. 选择区域（推荐：Hong Kong 或 Singapore）
7. 点击 **Create**
8. 点击 **Connect to Project** → 选择您的项目
9. ✅ Vercel 自动添加环境变量！

**方式 B：Supabase（免费额度大）**

1. 访问 https://supabase.com
2. 创建新项目（记住密码！）
3. 进入 **Project Settings** → **Database**
4. 复制 **Connection String** (URI 格式)
   ```
   postgresql://postgres.[项目名]:[密码]@aws-0-[区域].pooler.supabase.com:5432/postgres
   ```
5. 去 Vercel 配置环境变量

### 第3步：配置 Vercel 环境变量

**如果使用 Vercel Postgres：**

✅ 已自动配置，检查是否包含这些变量：
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL` ⭐
- `POSTGRES_URL_NON_POOLING`

确保添加：
```env
DATABASE_URL=${POSTGRES_PRISMA_URL}
```

**如果使用 Supabase：**

在 Vercel Dashboard → Settings → Environment Variables 添加：

| 变量名 | 值 |
|--------|-----|
| `DATABASE_URL` | `postgresql://postgres...` (从 Supabase 复制) |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | 运行 `openssl rand -base64 32` 生成 |
| `NODE_ENV` | `production` |

### 第4步：推送代码并重新部署

```bash
# 提交更改
git add prisma/schema.prisma
git commit -m "Fix: Switch to PostgreSQL for Vercel deployment"
git push origin main

# Vercel 会自动重新部署
```

或手动触发部署：
1. Vercel Dashboard → Deployments
2. 点击最新的部署旁边的 **...** 
3. 选择 **Redeploy**

### 第5步：初始化数据库

部署成功后，运行数据库迁移：

```bash
# 1. 安装 Vercel CLI（如果还没有）
npm i -g vercel

# 2. 登录
vercel login

# 3. 链接到您的项目
vercel link

# 4. 拉取生产环境变量到本地
vercel env pull .env.production

# 5. 运行数据库迁移
npx dotenv -e .env.production -- npx prisma migrate deploy

# 6. 填充种子数据
npx dotenv -e .env.production -- npx prisma db seed
```

---

## 🧪 测试部署

部署完成后：

1. **访问应用：** `https://your-app.vercel.app`

2. **测试登录：**
   ```
   邮箱：admin@yuanjianzhe.com
   密码：admin123456
   ```

3. **如果还是报错，查看日志：**
   ```bash
   vercel logs --follow
   ```

---

## 🐛 其他可能的错误

### 错误：Still showing "Application error"

**可能原因：**
1. 数据库未初始化
2. 环境变量未配置
3. Prisma Client 未生成

**解决：**

1. **检查环境变量：**
   ```bash
   vercel env ls
   ```
   
   确保包含：
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

2. **手动触发构建：**
   - Vercel Dashboard → Deployments → Redeploy

3. **查看构建日志：**
   - Deployments → 选择最新部署 → View Build Logs
   - 查找错误信息

### 错误："Can't reach database server"

**解决：**

1. 检查 `DATABASE_URL` 格式：
   ```
   postgresql://USER:PASSWORD@HOST:PORT/DATABASE
   ```

2. 如果使用 Supabase，确保：
   - 使用 **Pooler** 连接字符串（不是 Direct）
   - 包含正确的密码
   - 端口是 5432

3. 测试数据库连接：
   ```bash
   # 使用 psql 测试
   psql "你的DATABASE_URL"
   ```

### 错误："NEXTAUTH_SECRET is missing"

**解决：**

```bash
# 生成密钥
openssl rand -base64 32

# 或使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 添加到 Vercel 环境变量
```

---

## 📊 部署检查清单

完成后检查：

- [ ] `prisma/schema.prisma` 使用 `postgresql`（不是 `sqlite`）
- [ ] Vercel 数据库已创建（Postgres 或 Supabase）
- [ ] 环境变量已配置（至少 4 个）
- [ ] 代码已推送到 GitHub
- [ ] Vercel 自动重新部署
- [ ] 构建成功（绿色对勾 ✅）
- [ ] 数据库迁移已执行
- [ ] 种子数据已填充
- [ ] 应用可以访问
- [ ] 登录功能正常

---

## 🎯 快速命令参考

```bash
# 1. 拉取环境变量
vercel env pull .env.production

# 2. 运行迁移
npx dotenv -e .env.production -- npx prisma migrate deploy

# 3. 填充数据
npx dotenv -e .env.production -- npx prisma db seed

# 4. 查看日志
vercel logs --follow

# 5. 重新部署
vercel --prod
```

---

## 📞 仍然有问题？

### 1. 查看实时日志
```bash
vercel logs [your-deployment-url] --follow
```

### 2. 检查运行时日志
Vercel Dashboard → Your Project → Logs → Runtime Logs

### 3. 检查构建日志
Vercel Dashboard → Deployments → View Build Logs

### 4. 常见错误代码
- `Digest: 1541185240` → 数据库连接问题
- `Module not found` → 依赖问题
- `NEXTAUTH_SECRET missing` → 环境变量问题

---

## ✅ 修复完成后的验证

1. **首页加载** → 应该显示登录页面
2. **登录功能** → 可以使用管理员账户登录
3. **工作台** → 显示数据统计
4. **各个模块** → 客户、订单、报价等都能访问

---

**现在立即执行第4步：推送代码！** 🚀

```bash
git add .
git commit -m "Fix: Switch to PostgreSQL for Vercel"
git push origin main
```

Vercel 会自动检测并重新部署。大约 2-3 分钟后，应用就能正常访问了！

**预见世界，预见自己** 🌍✨

