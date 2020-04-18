#!/bin/bash
WORK_PATH='/usr/projects/vue-back'
cd $WORK_PATH
echo "清除老代码"
git reset --hard origin/master
git clean -f
echo "拉取最新代码"
docker build -t vue-back .
echo "停止并删除旧容器"
docker stop vue-back-container
docker rm vue-back-container 
echo "启动新的容器"
docker container run -p 3001:3001 --name vue-back-container