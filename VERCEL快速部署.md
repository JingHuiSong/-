# ⚡ Vercel 快速部署 - 3步完成

## 🚨 关键问题

**Vercel 不支持 SQLite！** 必须使用云数据库（PostgreSQL）。

---

## 🎯 3步部署

### 第1步：创建数据库（2分钟）

**选择一个：**

**选项 A：Vercel Postgres（推荐）**
```
1. 访问 https://vercel.com/dashboard
2. Storage → Create Database → Postgres
3. ✅ 自动配置环境变量
```

**选项 B：Supabase（免费）**
```
1. 访问 https://supabase.com
2. New Project → 创建
3. 复制数据库连接字符串
```

---

### 第2步：部署到 Vercel（1分钟）

1. 访问 https://vercel.com/new
2. Import Repository: `JingHuiSong/-`
3. 配置环境变量：

```env
DATABASE_URL=${POSTGRES_PRISMA_URL}  # 如果用 Vercel Postgres
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=运行 openssl rand -base64 32 生成
NODE_ENV=production
```

4. 点击 **Deploy**

---

### 第3步：初始化数据库（2分钟）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录并链接项目
vercel login
vercel link

# 拉取环境变量
vercel env pull .env.production

# 切换到 PostgreSQL schema
cp prisma/schema.vercel.prisma prisma/schema.prisma

# 运行迁移
npx dotenv -e .env.production -- npx prisma migrate deploy

# 填充数据
npx dotenv -e .env.production -- npx prisma db seed
```

---

## ✅ 完成！

访问：`https://your-app.vercel.app`

登录：
- 邮箱：`admin@yuanjianzhe.com`
- 密码：`admin123456`

---

## 🐛 遇到问题？

### 错误：Can't reach database server

**原因：** DATABASE_URL 未配置或错误

**解决：**
1. Vercel Dashboard → Settings → Environment Variables
2. 检查 `DATABASE_URL` 是否正确
3. 重新部署

### 错误：NEXTAUTH_SECRET missing

**原因：** 未配置认证密钥

**解决：**
```bash
# 生成密钥
openssl rand -base64 32

# 添加到 Vercel 环境变量
NEXTAUTH_SECRET=生成的密钥
```

### 错误：Prisma Client error

**原因：** Schema 还是 SQLite

**解决：**
```prisma
// prisma/schema.prisma - 修改为
datasource db {
  provider = "postgresql"  // 改这里
  url      = env("DATABASE_URL")
}
```

---

## 📚 详细文档

查看完整文档：
- `VERCEL部署指南.md` - 详细步骤
- `deploy-to-vercel.md` - 常见问题

---

**预见世界，预见自己** 🌍✨

