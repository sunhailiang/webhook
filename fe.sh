#!/bin/bash
WORK_PATH='/usr/projects/vue-fe'
cd $WORK_PATH
echo "清除老代码"
git reset --hard origin/master
git clean -f
echo "拉取最新代码"
git pull origin master
echo "构建代码"
npm run build 
echo "开始执行构建-注意了：vue-fe后面的部分必须要有"
docker build -t vue-fe:1.0 .
echo "停止并删除旧容器"
docker stop vue-fe-container
docker rm vue-fe-container 
echo "启动新的容器"
docker container run -p 80:80 --name vue-fe-container -d vue-fe:1.0