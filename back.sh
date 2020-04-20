#!/bin/bash
WORK_PATH='/usr/projects/vue-back'
cd $WORK_PATH
echo "清除老代码"
git reset --hard origin/master
git clean -f
echo "拉去最新代码"
git pull origin master
echo "开始执行构建-注意了：vue-back后面的部分必须要有"
docker build -t vue-back:1.0 .
echo "停止并删除旧容器"
docker stop vue-back-container
docker rm vue-back-container 
echo "启动新的容器"
docker container run -p 3001:3001 --name vue-back-container -d vue-back:1.0