# 🚀 部署指南

## 方案一：Vercel 部署（推荐，最简单）

### 优点
- ✅ 零配置，自动部署
- ✅ 免费 SSL 证书
- ✅ 全球 CDN 加速
- ✅ 自动扩展

### 步骤

1. **准备 Vercel 账号**
   - 访问 [https://vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录

2. **推送代码到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/你的用户名/你的仓库.git
   git push -u origin main
   ```

3. **在 Vercel 导入项目**
   - 点击 "New Project"
   - 选择你的 GitHub 仓库
   - Vercel 会自动检测 Next.js 项目

4. **配置环境变量**
   在 Vercel 项目设置中添加：
   ```
   DATABASE_URL=file:./prisma/prod.db
   NEXTAUTH_URL=https://你的项目.vercel.app
   NEXTAUTH_SECRET=生成一个随机字符串
   ```

5. **部署**
   - 点击 "Deploy"
   - 等待构建完成（约 2-3 分钟）
   - 访问提供的域名

### 生成 NEXTAUTH_SECRET
```bash
# 在本地运行
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 方案二：Docker 部署（适合自有服务器）

### 优点
- ✅ 完全控制
- ✅ 本地/云服务器均可
- ✅ 包含数据库

### 前置要求
- Docker 和 Docker Compose 已安装
- 服务器至少 1GB 内存

### 步骤

1. **修改生产环境配置**
   ```bash
   # 复制并编辑生产环境配置
   cp .env.production .env.prod
   # 编辑 .env.prod，修改密码和域名
   ```

2. **更新 Prisma Schema 使用 PostgreSQL**
   编辑 `prisma/schema.prisma`：
   ```prisma
   datasource db {
     provider = "postgresql"  // 改为 postgresql
     url      = env("DATABASE_URL")
   }
   ```

3. **更新 next.config.js**
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'standalone', // 添加这一行
   }
   module.exports = nextConfig
   ```

4. **构建并启动**
   ```bash
   # 使用生产环境配置启动
   docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
   ```

5. **查看日志**
   ```bash
   docker-compose -f docker-compose.prod.yml logs -f
   ```

6. **访问应用**
   - 打开浏览器访问 `http://你的服务器IP:3000`

### 停止服务
```bash
docker-compose -f docker-compose.prod.yml down
```

### 备份数据库
```bash
docker exec coop-postgres pg_dump -U postgres coop > backup.sql
```

---

## 方案三：传统服务器部署

### 步骤

1. **安装依赖**
   ```bash
   # 安装 Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # 安装 pnpm
   npm install -g pnpm

   # 安装 PM2（进程管理器）
   npm install -g pm2
   ```

2. **安装项目依赖**
   ```bash
   pnpm install
   ```

3. **配置环境变量**
   ```bash
   cp .env.example .env
   # 编辑 .env 文件
   ```

4. **初始化数据库**
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

5. **构建项目**
   ```bash
   pnpm build
   ```

6. **使用 PM2 启动**
   ```bash
   pm2 start npm --name "coop-system" -- start
   pm2 save
   pm2 startup
   ```

7. **配置 Nginx 反向代理（可选）**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## 生产环境检查清单

- [ ] 修改所有默认密码
- [ ] 生成安全的 NEXTAUTH_SECRET
- [ ] 配置正确的 NEXTAUTH_URL
- [ ] 设置数据库备份策略
- [ ] 配置 SSL 证书（HTTPS）
- [ ] 检查防火墙设置
- [ ] 修改默认管理员密码
- [ ] 设置监控和日志

---

## 常见问题

### Q: 部署后数据库为空？
A: 运行数据库迁移和种子：
```bash
pnpm db:migrate
pnpm db:seed
```

### Q: 环境变量不生效？
A: 确保在 Vercel 或 Docker 中正确配置了环境变量，并重新部署。

### Q: Docker 容器启动失败？
A: 检查日志：
```bash
docker-compose -f docker-compose.prod.yml logs
```

### Q: 如何更新应用？
A: 
- **Vercel**: 推送代码到 GitHub，自动部署
- **Docker**: 重新构建镜像
  ```bash
  docker-compose -f docker-compose.prod.yml up -d --build
  ```

---

## 性能优化建议

1. **启用图片优化**
   - Vercel 自动优化
   - 自建服务器需配置 CDN

2. **数据库优化**
   - 定期清理审计日志
   - 添加索引
   - 使用连接池

3. **缓存策略**
   - 配置 Redis 缓存（可选）
   - 使用 Next.js ISR

---

## 技术支持

遇到问题？请检查：
1. 环境变量是否正确配置
2. 数据库是否正常运行
3. 端口是否被占用
4. 查看应用日志

