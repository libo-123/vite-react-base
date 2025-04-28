import { loadEnv, PluginOption } from 'vite'

// 使用 Babel 的官方 React 支持。
// 说明:使用 esbuild 和 Babel，以较小的软件包占用空间和使用 Babel 转换管道的灵活性实现快速 HMR。
// 如果没有额外的 Babel 插件，在构建过程中只能使用 esbuild。
// import react from '@vitejs/plugin-react'

// import { Schema, ValidateEnv } from "@julr/vite-plugin-validate-env";

// 使用 SWC 的官方 React 支持。
import reactSWC from '@vitejs/plugin-react-swc'

// 使用 SVGR 的官方 React 支持。
import svgr from 'vite-plugin-svgr'

// 检测重复依赖
import UnpluginDetectDuplicatedDeps from 'unplugin-detect-duplicated-deps/vite'

// 自动导入
import AutoImport from 'unplugin-auto-import/vite'

// 删除 console
import removeConsole from "vite-plugin-remove-console"

// 在浏览器中按住 Option 键并右键单击即可在编辑器中打开源代码。非常方便
import { reactClickToComponent } from "vite-plugin-react-click-to-component"

// 打包分析插件，用于分析构建产物的体积和依赖关系
import { visualizer } from 'rollup-plugin-visualizer'

// 图片优化 
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// 使用 gzip 或者 brotli 来压缩资源js文件 默认gizp      approved: 2025-04-25
import { compression } from 'vite-plugin-compression2'

// 模块联邦插件
// import federation from "@originjs/vite-plugin-federation";
// 图片压缩
// import viteImagemin from '@vheemstra/vite-plugin-imagemin'  //approved: 重点关注，测试

// The minifiers you want to use:
// @ts-ignore 忽略类型错误
// import imageminMozjpeg from 'imagemin-mozjpeg'
// import imageminPng from 'imagemin-pngquant'
// @ts-ignore 忽略类型错误
// import imageminGif from 'imagemin-gifsicle'

// //  @ts-ignore 忽略类型错误  制作webp图片    webp 图片压缩
// import imageminWebp from 'imagemin-webp'

// @ts-ignore 忽略类型错误  制作avif图片      avif 图片压缩
// import imageminAvif from 'imagemin-avif'

/**
 * 获取 Vite 插件配置
 * @param command - 命令类型：'serve'（开发）或 'build'（构建：测试/生产）
 * @param mode - 环境模式：'development'、'test'、'staging'、'production'、'analyze'
 */
export default function getVitePlugins(command: string, mode: string): PluginOption[] {
    const isDev = command === 'serve' // 开发
    const isBuild = command === 'build' // 构建
    const isAnalyze = mode === 'analyze' // 分析

    const currentEnv = loadEnv(mode, process.cwd())

    console.log('当前环境', currentEnv.VITE_BASE_URL)

    return [
        // 【ReactSWC 支持】获得更快的变异速度，SWC是Rust编写的编译器，比bable快约20-300倍，且更低的内存占用。
        // https://github.com/vitejs/vite-plugin-react-swc
        reactSWC(),

        // 【SVG 组件支持】
        // 还可以进一步使用SVGO ，SVGO 是一个用于优化 SVG 文件的工具，减少无用信息及体积。如果svg文件有多个，可以考虑使用,如下。具体看插件github配置
        // https://github.com/pd4d10/vite-plugin-svgr
        svgr({
            svgrOptions: {
                plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
                svgoConfig: {
                    floatPrecision: 2,
                },
            }
        }),
        // 【性能分析】
        // https://github.com/btd/rollup-plugin-visualizer
        isAnalyze && visualizer({
            open: true,
            gzipSize: true,
            brotliSize: true,
            filename: 'dist/stats.html',
        }),

        // 【按需 API 自动导入】
        // https://github.com/unplugin/unplugin-auto-import
        // 谨慎使用，这会让代码边得抽象，且组件copy到其他项目中时或其他地方时，没有导入包会看着很奇怪！
        AutoImport({
            // 这个配置指定了需要自动导入的模块,现在你可以直接使用 useState、useEffect 或 useNavigate 等，
            imports: ['react', 'react-router-dom'],
            // 【自动生成】的类型声明文件的位置
            dts: './src/auto-imports.d.ts',
            // 需要自动导入的目录，该目录下的所有模块都可以被自动导入，通常用于状态管理相关的文件，比如 zustand store 文件
            // dirs: ['src/store'],
            eslintrc: {
                enabled: true,
                //【自动生成】指定了生成的 ESLint 配置文件的位置，告诉 ESLint 哪些导入是自动的，避免报未使用变量的错误
                filepath: './.eslintrc-auto-import.json',  // Default `./.eslintrc-auto-import.json`
            },
        }),

        // 【移除console/debugger】在测试/生产环境中删除 console.log 的 vite 插件。删除测试环境部分console
        // https://github.com/xiaoxian521/vite-plugin-remove-console
        isBuild && removeConsole({
            // 完全自定义要删除的语句,覆盖includes
            custom: ["console.log()", "debugger"]
        }),
        // 【点击页面打开代码】在浏览器中按住 Option 键并右键单击即可在编辑器中打开源代码。非常方便
        // https://github.com/ArnaudBarre/
        isDev && reactClickToComponent(),

        // 【在构建时验证您的环境变量及类型】注：该插件还处于实验阶段，会出现警告！ 
        // ValidateEnv({
        //   VITE_SOME_COMMON: Schema.string(),
        //   VITE_SOME_KEY: Schema.string(),
        //   VITE_SOME_KEY2: Schema.string()
        // })

        // 【生产环境依循环赖检测】
        // https://github.com/tjx666/unplugin-detect-duplicated-deps
        isBuild && UnpluginDetectDuplicatedDeps({
            throwErrorWhenDuplicated: true,
            // 忽略循环依赖
            // ignore: {
            // "@ant-design/colors": [
            //     "7.2.0",
            //     "8.0.0"
            // ],
            // "@ant-design/fast-color": [
            //     "2.0.6",
            //     "3.0.0"
            // ],
            // "@ant-design/icons": [
            //     "5.6.1",
            //     "6.0.0"
            // ]
            // }
        }),

        // 【gzip 或者 brotli 来压缩资源】 默认gizp
        // https://github.com/anncwb/vite-plugin-compression
        isBuild && compression({
            threshold: 10240,
            deleteOriginalAssets: false,
        }),

        // 【图片优化】  使用这个插件需要再安装 pnpm add -D sharp  
        //  https://github.com/FatehAK/vite-plugin-image-optimizer
        //  这个比较清爽一点，默认配置够用，和viteImagemin二选一
        isBuild && ViteImageOptimizer(),

        // 【图片压缩】 svg由svgr插件处理，避免重复调用。
        //  https://github.com/vheemstra/vite-plugin-imagemin
        //  不过太大的图片一般用CDN引入比较好，也能保证图片的质量，不然测试环境图片于生产环境图片质量不一致
        //  有些macos系统不支持压缩算饭，imagemin库不维护了！和viteImageOptimizer二选一即可！
        // isBuild && viteImagemin(
        //     {
        //         // 压缩图片 【key是文件扩展名,value是压缩插件】
        //         plugins: {
        //             jpeg: imageminMozjpeg({
        //                 quality: 80,
        //                 // 是否创建基线 JPEG 文件。
        //                 progressive: true
        //             }),
        //             png: imageminPng({
        //                 quality: [0.3, 0.8],
        //                 speed: 10,
        //                 // 移除此选项，它在macOS上可能导致问题
        //             }),
        //             gif: imageminGif({
        //                 // 优化级别 1 - 3
        //                 optimizationLevel: 3,
        //                 // 颜色数量
        //                 colors: 256,
        //                 // 隔行扫描
        //                 interlaced: true
        //             }),
        //         },
        //         // 如果图片大小大于原图，则跳过，默认true
        //         skipIfLarger: true,

        //         // 制作avif图片 【key是文件扩展名,value是压缩插件】
        //         makeAvif: {
        //             plugins: {
        //                 jpeg:imageminAvif({
        //                     quality: 70,
        //                 }),
        //                 png: imageminAvif({
        //                     quality: 70,
        //                 }),
        //                 gif: imageminAvif({
        //                     quality: 70,
        //                 }),
        //             },
        //             // 自定义图片路径,(这是默认值)  介绍：AVIF是一种现代图像格式，提供比WebP和JPEG更好的压缩率
        //             formatFilePath: (file: string) => `${file}.avif`,
        //             // 如果图片大小大于优化图，则跳过, 有三种可选  false | 'original' | 'optimized' | 'smallest'
        //             skipIfLargerThan: "optimized",
        //         },

        //         // 制作webp图片
        //         // makeWebp: {
        //         //     plugins: {
        //         //         jpeg: imageminWebp({
        //         //             quality: 80,
        //         //         }),
        //         //     },
        //         // },
        //     }
        // ),

        // 【模块联邦】用于 微前端 暂时不在这里体现 @originjs/vite-plugin-federation 插件，
        //  https://github.com/originjs/vite-plugin-federation
        // federation({
        //     // 配置选项
        //     name: 'remote-app',
        //     filename: 'remoteEntry.js',
        //     // 暴露的模块
        //     exposes: {
        //         './Button': './src/Button.vue',
        //     },
        //     // 远程模块
        //     remotes: {
        //         remote_app: "http://localhost:5001/assets/remoteEntry.js",
        //     },
        //     shared: ['react', 'react-dom'],
        // }),

    ].filter(Boolean) as PluginOption[]
}