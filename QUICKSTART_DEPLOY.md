# ⚡ 快速上线指南

## 🎯 选择部署方式

### 方式 1️⃣：Vercel 在线部署（5分钟，推荐新手）

**最简单！完全免费！自动 HTTPS！**

#### 步骤：

1. **注册 Vercel 账号**
   - 访问：https://vercel.com
   - 使用 GitHub 登录

2. **上传代码到 GitHub**
   ```bash
   # 在项目目录运行
   git init
   git add .
   git commit -m "准备部署"
   git branch -M main
   
   # 在 GitHub 创建新仓库，然后运行：
   git remote add origin https://github.com/你的用户名/仓库名.git
   git push -u origin main
   ```

3. **在 Vercel 导入项目**
   - 登录 Vercel
   - 点击 "Add New..." → "Project"
   - 选择你的 GitHub 仓库
   - 点击 "Import"

4. **配置环境变量**
   
   点击 "Environment Variables"，添加以下变量：
   
   | 变量名 | 值 | 说明 |
   |--------|-----|------|
   | `DATABASE_URL` | `file:./prisma/prod.db` | 数据库 |
   | `NEXTAUTH_URL` | `https://你的项目.vercel.app` | 项目地址 |
   | `NEXTAUTH_SECRET` | 随机字符串 | 安全密钥 |

   生成 NEXTAUTH_SECRET（在本地终端运行）：
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **部署！**
   - 点击 "Deploy"
   - 等待 2-3 分钟
   - ✅ 完成！访问提供的域名

---

### 方式 2️⃣：Docker 本地/服务器部署（10分钟）

**适合有自己服务器的用户**

#### Windows 用户：

1. **安装 Docker Desktop**
   - 下载：https://www.docker.com/products/docker-desktop
   - 安装并启动

2. **创建配置文件**
   
   在项目根目录创建 `.env.prod` 文件：
   ```env
   POSTGRES_PASSWORD=你的数据库密码
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=生成的随机字符串
   DATABASE_URL=postgresql://postgres:你的数据库密码@postgres:5432/coop
   ```

3. **一键部署**
   ```bash
   # 双击运行
   deploy.bat
   ```
   
   或在命令行运行：
   ```bash
   docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
   ```

4. **访问应用**
   - 打开浏览器访问：http://localhost:3000
   - 测试账号：admin@example.com / password123

#### Linux/Mac 用户：

1. **安装 Docker**
   ```bash
   # Linux
   curl -fsSL https://get.docker.com | sh
   
   # Mac
   # 下载 Docker Desktop for Mac
   ```

2. **创建配置文件**
   ```bash
   cat > .env.prod << 'EOL'
   POSTGRES_PASSWORD=$(openssl rand -base64 32)
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=$(openssl rand -base64 32)
   DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/coop
   EOL
   ```

3. **一键部署**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

---

### 方式 3️⃣：云服务器部署（适合专业用户）

#### 阿里云/腾讯云/AWS 等

1. **购买云服务器**
   - 配置：1核2G 即可
   - 系统：Ubuntu 20.04+

2. **连接服务器**
   ```bash
   ssh root@你的服务器IP
   ```

3. **安装 Docker**
   ```bash
   curl -fsSL https://get.docker.com | sh
   systemctl start docker
   systemctl enable docker
   ```

4. **上传项目**
   ```bash
   # 方式1：使用 git
   git clone https://github.com/你的用户名/仓库名.git
   cd 仓库名
   
   # 方式2：使用 scp 上传
   scp -r /本地路径/* root@服务器IP:/root/项目目录/
   ```

5. **配置并部署**
   ```bash
   # 创建配置文件
   nano .env.prod
   # 粘贴配置内容（修改 NEXTAUTH_URL 为你的域名）
   
   # 部署
   docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
   ```

6. **配置防火墙**
   ```bash
   # 开放 3000 端口
   ufw allow 3000
   ```

7. **访问**
   - http://你的服务器IP:3000

#### 配置域名（可选）

1. **安装 Nginx**
   ```bash
   apt update
   apt install nginx -y
   ```

2. **配置反向代理**
   ```bash
   nano /etc/nginx/sites-available/coop
   ```
   
   粘贴以下内容：
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
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
   }
   ```

3. **启用配置**
   ```bash
   ln -s /etc/nginx/sites-available/coop /etc/nginx/sites-enabled/
   nginx -t
   systemctl reload nginx
   ```

4. **配置 SSL（推荐）**
   ```bash
   apt install certbot python3-certbot-nginx -y
   certbot --nginx -d your-domain.com
   ```

---

## 🎉 部署完成后

### 测试账号
- 管理员：admin@example.com / password123
- 销售：agent1@example.com / password123

### ⚠️ 重要：修改密码！
登录后立即修改默认密码！

### 常用命令

#### Vercel
```bash
# 查看部署日志
vercel logs

# 重新部署
git push origin main
```

#### Docker
```bash
# 查看日志
docker-compose -f docker-compose.prod.yml logs -f

# 停止服务
docker-compose -f docker-compose.prod.yml down

# 重启服务
docker-compose -f docker-compose.prod.yml restart

# 备份数据库
docker exec coop-postgres pg_dump -U postgres coop > backup_$(date +%Y%m%d).sql

# 恢复数据库
docker exec -i coop-postgres psql -U postgres coop < backup.sql
```

---

## ❓ 常见问题

### Q1: Vercel 部署后页面报错？
**A:** 检查环境变量是否正确配置，特别是 `NEXTAUTH_SECRET` 和 `NEXTAUTH_URL`

### Q2: Docker 容器无法启动？
**A:** 检查端口是否被占用：
```bash
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000
```

### Q3: 数据库没有数据？
**A:** 运行数据库种子：
```bash
# Vercel: 使用 Vercel CLI
vercel env pull
pnpm db:seed

# Docker: 进入容器
docker exec -it coop-app sh
npx prisma db seed
```

### Q4: 忘记管理员密码？
**A:** 重新运行数据库种子脚本会重置为默认密码

### Q5: 如何更新应用？
```bash
# Vercel: 直接推送代码
git push origin main

# Docker: 重新构建
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 📞 需要帮助？

1. 查看完整文档：`DEPLOYMENT.md`
2. 检查日志文件
3. 确认环境变量配置
4. 确保端口未被占用

---

## 🔒 安全建议

- ✅ 修改所有默认密码
- ✅ 使用强密码（至少16位随机字符）
- ✅ 启用 HTTPS（Vercel 自动，服务器用 certbot）
- ✅ 定期备份数据库
- ✅ 限制数据库访问权限
- ✅ 更新 NEXTAUTH_SECRET 为随机值
- ✅ 生产环境使用 PostgreSQL 而非 SQLite

---

祝您部署顺利！🎊

