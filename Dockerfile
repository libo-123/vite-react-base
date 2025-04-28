# 第一阶段：构建阶段
# 使用Node.js 20 Alpine作为基础镜像，命名为"build"
FROM node:20-alpine AS build
# 设置容器内工作目录为/app
WORKDIR /app
# 复制依赖文件到容器
COPY pnpm-lock.yaml package.json ./
# 全局安装pnpm包管理器
RUN npm install pnpm -g
# 安装项目依赖
RUN pnpm install
# 复制所有源代码到容器
COPY . .
# 执行构建命令生成生产环境代码
RUN pnpm run build:docker

# 第二阶段：运行阶段
# 使用nginx Alpine作为运行环境基础镜像
FROM nginx:alpine AS runtime
# 复制nginx配置文件
COPY ./nginx.conf /etc/nginx/nginx.conf
# 从构建阶段复制生成的文件到nginx目录
COPY --from=build /app/dist /usr/share/nginx/html
# 暴露8082端口
EXPOSE 8082