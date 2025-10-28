# 🚀 Vercel 部署完整指南

## 步骤 1：在 Vercel 导入项目

1. 访问：https://vercel.com
2. 点击 "Add New..." → "Project"
3. 找到并选择 `internal-collaboration-system` 仓库
4. 点击 "Import"

---

## 步骤 2：配置环境变量（重要！）

在 Vercel 的配置页面，找到 **"Environment Variables"** 部分。

### 添加以下 3 个环境变量：

#### 1. DATABASE_URL
```
变量名: DATABASE_URL
值: file:./prisma/prod.db
环境: Production, Preview, Development（全选）
```

#### 2. NEXTAUTH_URL
```
变量名: NEXTAUTH_URL
值: https://你的项目名.vercel.app
环境: Production, Preview, Development（全选）
```

⚠️ **注意**：第一次部署时可以先填写一个临时值（如 `https://temp.vercel.app`），部署成功后 Vercel 会给您一个真实域名，然后回来修改这个值。

#### 3. NEXTAUTH_SECRET
```
变量名: NEXTAUTH_SECRET
值: ad674666f08d8ca45f688213fb5560055212cf23be17984715723da8fb139e50
环境: Production, Preview, Development（全选）
```

---

## 步骤 3：构建设置（保持默认即可）

Vercel 应该自动检测到这是 Next.js 项目：

- **Framework Preset**: Next.js
- **Build Command**: `next build` 或留空
- **Output Directory**: `.next` 或留空
- **Install Command**: `npm install` 或留空

如果有问题，可以手动设置：
- **Build Command**: `prisma generate && next build`
- **Install Command**: `npm install`

---

## 步骤 4：开始部署

1. 确认所有环境变量都已添加
2. 点击 **"Deploy"** 按钮
3. 等待 2-3 分钟（观察构建日志）

---

## 步骤 5：部署成功后

### 5.1 获取域名

部署成功后，Vercel 会给您一个域名，类似：
- `https://internal-collaboration-system.vercel.app`
- 或 `https://internal-collaboration-system-你的用户名.vercel.app`

### 5.2 更新 NEXTAUTH_URL

1. 在 Vercel 项目中，进入 **Settings** → **Environment Variables**
2. 找到 `NEXTAUTH_URL` 变量
3. 点击 **Edit**
4. 将值更新为实际的 Vercel 域名（如 `https://internal-collaboration-system.vercel.app`）
5. 保存后，点击 **Redeploy**

### 5.3 初始化数据库

⚠️ **重要**：Vercel 使用 SQLite 时，每次部署数据都会重置。建议：

**方案 A：接受数据重置**（简单，适合演示）
- 每次访问都需要重新登录
- 测试数据不会保留

**方案 B：使用外部数据库**（推荐生产环境）

使用 Vercel Postgres 或其他云数据库：

1. 在 Vercel 项目中，进入 **Storage** → **Create Database**
2. 选择 **Postgres**
3. 创建后，Vercel 会自动设置 `DATABASE_URL`
4. 在项目中运行：
```bash
# 本地更新数据库配置
# .env
DATABASE_URL="postgresql://..."  # 从 Vercel 复制

# 推送 schema 到生产数据库
npx prisma db push

# 填充初始数据
npx prisma db seed
```

---

## 步骤 6：访问您的应用

打开浏览器，访问 Vercel 给您的域名！

### 测试账号：
- 邮箱：`admin@yuanjianzhe.com`
- 密码：`admin123456`

⚠️ **登录后立即修改密码！**

---

## 🔧 常见问题排查

### 问题 1：构建失败 - "Cannot find module @prisma/client"

**解决方案**：确保 Build Command 包含 `prisma generate`

在 Vercel 项目设置中：
```
Build Command: prisma generate && next build
```

### 问题 2：运行时错误 - "NEXTAUTH_SECRET missing"

**解决方案**：检查环境变量是否正确添加

1. 进入 **Settings** → **Environment Variables**
2. 确认 `NEXTAUTH_SECRET` 存在且有值
3. 确认已选择 Production 环境
4. 重新部署

### 问题 3：登录后一直重定向

**解决方案**：`NEXTAUTH_URL` 与实际域名不匹配

1. 确认 `NEXTAUTH_URL` 值与 Vercel 域名完全一致
2. 包括 `https://` 前缀
3. 不要在末尾加 `/`
4. 保存后重新部署

### 问题 4：数据库连接错误

**解决方案**：SQLite 在 Vercel 上的限制

- Vercel 的无服务器环境不支持持久化 SQLite
- 建议使用 Vercel Postgres 或其他云数据库

---

## 📱 自定义域名（可选）

### 添加自己的域名：

1. 在 Vercel 项目中，进入 **Settings** → **Domains**
2. 输入您的域名（如 `yuanjianzhe.com`）
3. 按照提示在域名服务商处添加 DNS 记录
4. 等待 DNS 生效（通常几分钟）
5. 更新 `NEXTAUTH_URL` 为新域名
6. 重新部署

---

## 🔄 后续更新

每次修改代码后：

```bash
# 1. 提交更改
git add .
git commit -m "更新说明"

# 2. 推送到 GitHub
git push origin main

# 3. Vercel 会自动检测并重新部署！
```

---

## 📊 监控和日志

### 查看部署日志：
1. 在 Vercel 项目中，进入 **Deployments**
2. 点击最新的部署
3. 查看 **Build Logs** 和 **Function Logs**

### 查看运行时错误：
1. 进入 **Runtime Logs**
2. 选择时间范围
3. 查看错误信息

---

## ✅ 部署成功检查清单

- [ ] 所有环境变量已添加
- [ ] NEXTAUTH_URL 与实际域名一致
- [ ] 构建成功（绿色勾号）
- [ ] 可以访问网站
- [ ] 可以登录系统
- [ ] 功能正常运行

---

## 🆘 需要帮助？

如果遇到问题：

1. 检查 Vercel 的构建日志
2. 检查环境变量配置
3. 确认 GitHub 代码已更新
4. 尝试重新部署

---

祝您部署顺利！🎉

