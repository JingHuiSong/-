@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   内部协作系统 - 一键安装
echo ========================================
echo.

echo [1/4] 安装依赖...
call pnpm install
if errorlevel 1 (
    echo 错误：依赖安装失败！
    pause
    exit /b 1
)

echo.
echo [2/4] 启动数据库...
call docker-compose up -d
timeout /t 3 /nobreak >nul

echo.
echo [3/4] 初始化数据库...
call pnpm db:migrate
call pnpm db:seed

echo.
echo [4/4] 完成！
echo.
echo ========================================
echo   启动开发服务器：pnpm dev
echo   访问地址：http://localhost:3000
echo   测试账号：admin@example.com / password123
echo ========================================
echo.
pause

