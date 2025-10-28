#!/bin/bash

# 部署脚本
echo "🚀 开始部署内部协作系统..."

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查配置文件
if [ ! -f .env.prod ]; then
    echo "📝 创建生产环境配置文件..."
    cat > .env.prod << EOL
# PostgreSQL 数据库密码
POSTGRES_PASSWORD=$(openssl rand -base64 32)

# NextAuth 配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# 数据库连接
DATABASE_URL=postgresql://postgres:\${POSTGRES_PASSWORD}@postgres:5432/coop
EOL
    echo "✅ 已创建 .env.prod，请修改 NEXTAUTH_URL 为您的域名"
    echo "📍 配置文件位置: .env.prod"
fi

# 停止旧容器
echo "🛑 停止旧容器..."
docker-compose -f docker-compose.prod.yml down

# 构建并启动
echo "🔨 构建镜像并启动服务..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "📊 服务状态："
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "✨ 部署完成！"
echo "🌐 访问地址: http://localhost:3000"
echo "📧 测试账号: admin@example.com / password123"
echo ""
echo "📝 查看日志: docker-compose -f docker-compose.prod.yml logs -f"
echo "🛑 停止服务: docker-compose -f docker-compose.prod.yml down"

