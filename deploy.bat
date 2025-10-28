@echo off
chcp 65001 >nul
echo 🚀 开始部署内部协作系统...

REM 检查 Docker 是否安装
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker 未安装，请先安装 Docker Desktop
    pause
    exit /b 1
)

REM 检查配置文件
if not exist .env.prod (
    echo 📝 请先创建 .env.prod 配置文件
    echo.
    echo 复制以下内容到 .env.prod 文件：
    echo ================================================
    echo # PostgreSQL 数据库密码
    echo POSTGRES_PASSWORD=your-secure-password-here
    echo.
    echo # NextAuth 配置
    echo NEXTAUTH_URL=http://localhost:3000
    echo NEXTAUTH_SECRET=your-very-long-random-secret-key
    echo.
    echo # 数据库连接
    echo DATABASE_URL=postgresql://postgres:your-secure-password-here@postgres:5432/coop
    echo ================================================
    pause
    exit /b 1
)

REM 停止旧容器
echo 🛑 停止旧容器...
docker-compose -f docker-compose.prod.yml down

REM 构建并启动
echo 🔨 构建镜像并启动服务...
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

REM 等待服务启动
echo ⏳ 等待服务启动...
timeout /t 10 /nobreak >nul

REM 检查服务状态
echo 📊 服务状态：
docker-compose -f docker-compose.prod.yml ps

echo.
echo ✨ 部署完成！
echo 🌐 访问地址: http://localhost:3000
echo 📧 测试账号: admin@example.com / password123
echo.
echo 📝 查看日志: docker-compose -f docker-compose.prod.yml logs -f
echo 🛑 停止服务: docker-compose -f docker-compose.prod.yml down
pause

