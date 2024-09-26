#!/bin/bash
npm install --ignore-scripts
npm run build

# 检查 PM2 是否安装
if ! command -v pm2 &> /dev/null
then
    echo "PM2 未安装，正在使用 npm 安装 PM2..."
    npm install -g pm2
fi

# 检查应用是否已经在运行
if pm2 list | grep -q "frontend"; then
    # 如果已经在运行，则重启
    pm2 restart "frontend"
else
    # 否则启动应用
    pm2 start npm --name "frontend" -- start
fi