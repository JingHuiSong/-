@echo off
chcp 65001 >nul
echo ====================================
echo    GitHub 上传助手
echo    远见者旅行社智能化管理平台
echo ====================================
echo.

:: 检查Git是否安装
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 错误: 未检测到Git，请先安装Git
    echo 下载地址: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✅ Git已安装
echo.

:: 初始化Git仓库
if not exist ".git" (
    echo 📦 初始化Git仓库...
    git init
    echo ✅ Git仓库初始化完成
    echo.
) else (
    echo ✅ Git仓库已存在
    echo.
)

:: 添加所有文件
echo 📝 添加文件到Git...
git add .
echo ✅ 文件添加完成
echo.

:: 显示状态
echo 📊 当前Git状态:
echo ----------------------------------------
git status --short
echo ----------------------------------------
echo.

:: 询问是否继续
set /p CONTINUE="是否继续提交? (Y/N): "
if /i not "%CONTINUE%"=="Y" (
    echo ❌ 已取消操作
    pause
    exit /b 0
)

:: 创建提交
echo.
echo 💾 创建Git提交...
git commit -m "🎉 初始提交: 远见者旅行社智能化管理平台 v2.0" ^
-m "" ^
-m "✨ 功能特性:" ^
-m "- Apple风格UI设计" ^
-m "- 订单管理系统" ^
-m "- 游客/线路/报价管理" ^
-m "- 员工权限系统" ^
-m "- AI助手集成" ^
-m "- 知识库管理" ^
-m "- 企业设置和个人信息管理" ^
-m "- 全局命令栏(⌘K)" ^
-m "- 每日激励语和公告系统" ^
-m "" ^
-m "🎨 技术栈:" ^
-m "- Next.js 14 + React 18" ^
-m "- TypeScript" ^
-m "- Prisma ORM" ^
-m "- NextAuth.js" ^
-m "- Tailwind CSS" ^
-m "- Radix UI"

if %ERRORLEVEL% NEQ 0 (
    echo ❌ 提交失败
    pause
    exit /b 1
)

echo ✅ 提交成功
echo.

:: 询问GitHub仓库地址
echo ========================================
echo 📌 请在GitHub上创建仓库
echo ========================================
echo.
echo 1. 访问: https://github.com/new
echo 2. 填写仓库名: yuanjianzhe-travel-system (或自定义)
echo 3. 选择Private(私有)或Public(公开)
echo 4. 不要勾选 "Add a README file"
echo 5. 点击 "Create repository"
echo.
echo 创建完成后，复制仓库地址(格式如下):
echo https://github.com/您的用户名/仓库名.git
echo.
set /p REPO_URL="请输入GitHub仓库地址: "

if "%REPO_URL%"=="" (
    echo ❌ 仓库地址不能为空
    pause
    exit /b 1
)

:: 添加远程仓库
echo.
echo 🔗 关联远程仓库...
git remote remove origin 2>nul
git remote add origin %REPO_URL%
echo ✅ 远程仓库关联成功
echo.

:: 推送到GitHub
echo 🚀 推送到GitHub...
git branch -M main
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ 推送失败，可能需要配置GitHub认证
    echo.
    echo 💡 解决方案:
    echo 1. 使用GitHub Desktop (推荐)
    echo 2. 配置SSH密钥
    echo 3. 使用Personal Access Token
    echo.
    echo 详细教程: https://docs.github.com/cn/authentication
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ 上传成功！
echo ========================================
echo.
echo 🌐 仓库地址: %REPO_URL%
echo 📝 查看文档: GITHUB_UPLOAD_GUIDE.md
echo.
echo ⚠️ 重要提醒:
echo 1. .env文件已自动忽略(不会上传)
echo 2. 数据库文件已自动忽略
echo 3. node_modules已自动忽略
echo.
echo 📚 代码对接指南:
echo 1. 克隆: git clone %REPO_URL%
echo 2. 安装: pnpm install
echo 3. 配置: cp env.template .env
echo 4. 迁移: pnpm db:migrate
echo 5. 填充: pnpm db:seed
echo 6. 启动: pnpm dev
echo.
echo 🎉 祝您使用愉快！
echo ========================================
pause

