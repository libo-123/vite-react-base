import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import getVitePlugins from './config/plugins'
import buildConfig from './config/build'
import cssConfig from './config/css'

/**
 * Vite 配置文件
 * @param command - 命令类型：'serve'（开发）或 'build'（构建）
 * @param mode - 环境模式：'development'、'test'、'staging'、'production'、'analyze'
 * @param isSsrBuild - 是否为 SSR 构建
 * @param isPreview - 是否为预览模式
 */
// @ts-expect-error 忽略类型错误
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {

  const currentEnv = loadEnv(mode, process.cwd())

  return {
    // 设置基础访问路径,资源引入的根路径
    base: currentEnv.VITE_BASE_URL,
    // 插件配置
    plugins: getVitePlugins(command, mode),
    // 构建配置
    build: buildConfig(command, mode),
    // css配置
    css: cssConfig(),
    // 路径别名配置
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    server: {
      port: 8080,
      host: true,
      // 代理配置,跨域处理
      proxy: {
        '/api': {
          // 这是本地开发request_api的
          target: 'http://localhost:8888',
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    },
    // 预览配置
    preview: {
      https: false, // 启用 TLS + HTTP/2
      open: true, // 启动时自动在浏览器中打开应用程序
      proxy: { // 配置自定义代理规则
        '/api': {
          target: 'http://localhost:8888',
          changeOrigin: true,
        }
      },
    }, 
    optimizeDeps: {
      entries: [], // 指定自定义条目——该值需要遵循 fast-glob 模式
      exclude: [], // 在预构建中强制排除的依赖项
      include: [], // 可强制预构建链接的包
      keepNames: false, // true 可以在函数和类上保留 name 属性
    },
  }
})
