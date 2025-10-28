#!/bin/bash

echo "🚀 开始推送代码到 GitHub..."
echo "仓库: https://github.com/JingHuiSong/internal-collaboration-system.git"
echo ""

cd "/Users/songjinghui/Desktop/源代码/yuanjianzhe 系统"

# 尝试推送 3 次
for i in {1..3}; do
    echo "📤 第 $i 次尝试推送..."
    
    if git push -u origin main; then
        echo ""
        echo "================================================"
        echo "  ✅ 推送成功！"
        echo "================================================"
        echo ""
        echo "下一步：访问 https://vercel.com 部署项目"
        echo ""
        exit 0
    else
        echo "❌ 第 $i 次推送失败"
        if [ $i -lt 3 ]; then
            echo "⏳ 等待 3 秒后重试..."
            sleep 3
        fi
    fi
done

echo ""
echo "================================================"
echo "  ❌ 推送失败，请尝试其他方案"
echo "================================================"
echo ""
echo "可能的解决方案："
echo "1. 检查网络连接"
echo "2. 使用代理（如果有）"
echo "3. 使用 SSH 方式推送"
echo "4. 使用 GitHub Desktop"
echo ""

