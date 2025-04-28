## 简介

一个基于vite的完整项目启动模板。

### 亮点

- 包含95%vite项目配置。
- 极致的图片压缩配置。
- curosr + mcp等AI工具完整配置。
- 封装了路由、数据流、请求、工具函数、hooks、icon、主题国际化等。

### 链接直达

- vite6官网：https://cn.vitejs.dev/
- 社区插件：https://github.com/vitejs/awesome-vite#plugins

## 技术栈

包管理：pnpm（自动匹配适应版本号）

技术栈：React19 + Typescript5 + Vite6 + Sass-module + zustand + react-router-dom6 + ahooks + cursor(通用规则 + MCP)  

代码校验：(Eslint + prettier + husky + commit-msg)

部署：（nginx + docker）

## 目录（不完整版）

请看文件 .curosr/rules

## 启动说明


```tsx
pnpm run dev   启动开发服务器

pnpm run preview  启动预览

pnpm run build:test|staging|prod  打包测试|预发布|生产环境

pnpm run format 格式化
```



### 为什么没有tsc -b 打包？

为了实现迭代开发


## 项目插件（11种）

我来帮您总结当前项目中使用的 Vite 插件。根据 `config/vite-plugins.ts` 文件的内容，我将按照您要求的格式进行整理：

1. React 支持
- 功能：使用 SWC 提供 React 支持，提供更快的编译速度
- 插件名称：`@vitejs/plugin-react-swc`
- GitHub地址：https://github.com/vitejs/vite-plugin-react-swc
- 注意点：相比 `@vitejs/plugin-react` https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react 有更好的性能 

2. SVG 组件支持
- 功能：将 SVG 文件作为 React 组件导入
- 插件名称：`vite-plugin-svgr`
- GitHub地址：https://github.com/pd4d10/vite-plugin-svgr
- 注意点：可以配合 SVGO 进行 SVG 优化

3. 依赖检测
- 功能：检测重复依赖
- 插件名称：`unplugin-detect-duplicated-deps`
- GitHub地址：https://github.com/tjx666/unplugin-detect-duplicated-deps
- 注意点：生产环境使用，可配置是否抛出错误

4. 自动导入
- 功能：自动导入 API 和组件
- 插件名称：`unplugin-auto-import`
- GitHub地址：https://github.com/unplugin/unplugin-auto-import
- 注意点：需要配置 ESLint 规则

5. 控制台清理
- 功能：删除 console.log 等调试代码
- 插件名称：`vite-plugin-remove-console`
- GitHub地址：https://github.com/xiaoxian521/vite-plugin-remove-console
- 注意点：仅在生产环境使用

6. 源码跳转
- 功能：在浏览器中点击跳转到编辑器源码
- 插件名称：`vite-plugin-react-click-to-component`
- GitHub地址：https://github.com/ArnaudBarre/vite-plugin-react-click-to-component
- 注意点：仅开发环境使用

7. 打包分析
- 功能：分析构建产物体积和依赖关系
- 插件名称：`rollup-plugin-visualizer`
- GitHub地址：https://github.com/btd/rollup-plugin-visualizer
- 注意点：仅在分析模式下使用

8. 图片优化
- 功能：优化图片资源，减少体积
- 插件名称：`vite-plugin-image-optimizer`
- GitHub地址：https://github.com/FatehAK/vite-plugin-image-optimizer
- 注意点：需要安装 `sharp` 依赖

9. 资源压缩
- 功能：使用 gzip/brotli 压缩资源
- 插件名称：`vite-plugin-compression2`
- GitHub地址：https://github.com/anncwb/vite-plugin-compression
- 注意点：默认使用 gzip 压缩

10. 图片压缩
- 功能：压缩图片资源，减少体积，转慢速的webp格式压缩图片资源，支持渐进式JPEG和PNG压缩。
- 插件名称：`@vheemstra/vite-plugin-imagemin`
- GitHub地址：https://github.com/vheemstra/vite-plugin-imagemin
- 注意点：需要配合 `imagemin-mozjpeg` 和 `imagemin-webp` 使用

效果如下：
⚡vite-plugin-imagemin processed these files:

  dist/img/desk_top-Buor6MdA.png            272.39 kB │ 
   - dist/img/desk_top-Buor6MdA.png         28.39 kB │ -89.58 % │   Cache
   - dist/img/desk_top-Buor6MdA.png.avif     1.11 kB │ -99.59 % │  771 ms
   
  dist/img/gif_test-D4kGRkBA.gif           3605.65 kB │ 
   - dist/img/gif_test-D4kGRkBA.gif        753.35 kB │ -79.11 % │   Cache
   - dist/img/gif_test-D4kGRkBA.gif.avif    68.88 kB │ -98.09 % │ 1228 ms
   - 
  dist/img/test-Dx-WGgb6.jpeg               131.64 kB │ 
   - dist/img/test-Dx-WGgb6.jpeg            45.62 kB │ -65.34 % │   Cache
   - dist/img/test-Dx-WGgb6.jpeg.avif       26.55 kB │ -79.83 % │   Cache

1.  模块联邦
- 功能：实现微前端架构
- 插件名称：`@originjs/vite-plugin-federation`
- GitHub地址：https://github.com/originjs/vite-plugin-federation
- 注意点：当前配置中已注释，未启用

这些插件涵盖了开发、构建、优化等多个方面，为项目提供了完整的开发体验和性能优化方案。


## 坑点

1、pnpm install @ant-design/icons@5.x --save  要安装这个版本，6.x版本有循环依赖问题

2、
