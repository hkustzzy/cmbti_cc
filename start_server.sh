#!/bin/bash
# 猫咪性格测试网站 - 本地服务器启动脚本

echo "🐱 正在启动猫咪性格测试网站..."
echo "📍 服务地址: http://localhost:8000"
echo "⌨️  按 Ctrl+C 停止服务器"
echo ""

# 切换到脚本所在目录
cd "$(dirname "$0")"

# 启动 Python HTTP 服务器
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    python -m http.server 8000
else
    echo "错误: 未找到 Python,请安装 Python 后重试"
    exit 1
fi
