#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
# npm run build
yarn build

# 进入生成的文件夹
cd blog/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
# git config --local user.name "xiaozheng243"
# git config --local user.email "luzz_1@163.com"
# git push -f git@github.com:xiaozheng243/xiaozheng243.github.io.git master

git push -f git@gitee.com:xiaozheng243/xiaozheng243.gitee.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -