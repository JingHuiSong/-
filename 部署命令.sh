#!/bin/bash

# 远见者旅行社系统 - GitHub 上传脚本
# 请先在 GitHub 创建仓库后运行此脚本

echo "================================================"
echo "  远见者旅行社系统 - GitHub 上传助手"
echo "================================================"
echo ""

# 获取 GitHub 仓库地址
read -p "请输入您的 GitHub 仓库地址 (例如: https://github.com/用户名/仓库名.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ 错误：仓库地址不能为空"
    exit 1
fi

echo ""
echo "📋 准备上传到: $REPO_URL"
echo ""

# 检查是否已有 remote
if git remote | grep -q origin; then
    echo "⚠️  检测到已存在的 origin，正在移除..."
    git remote remove origin
fi

# 添加远程仓库
echo "📌 添加远程仓库..."
git remote add origin "$REPO_URL"

# 推送代码
echo "🚀 推送代码到 GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "================================================"
    echo "  ✅ 代码已成功上传到 GitHub!"
    echo "================================================"
    echo ""
    echo "下一步："
    echo "1. 访问 https://vercel.com"
    echo "2. 使用 GitHub 登录"
    echo "3. 导入您的项目"
    echo "4. 配置环境变量（见下方）"
    echo ""
    echo "------------------------------------------------"
    echo "需要配置的环境变量："
    echo "------------------------------------------------"
    echo "DATABASE_URL=file:./prisma/prod.db"
    echo "NEXTAUTH_URL=https://your-project.vercel.app"
    echo "NEXTAUTH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex')")"
    echo "------------------------------------------------"
    echo ""
else
    echo ""
    echo "❌ 上传失败，请检查："
    echo "1. GitHub 仓库地址是否正确"
    echo "2. 是否有推送权限"
    echo "3. 网络连接是否正常"
fi

