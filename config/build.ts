import { BuildOptions, loadEnv } from 'vite';

/**
 * Vite 构建配置
 * @description 包含生产环境下的构建相关配置
 */
export default function buildConfig(command: string, mode: string): BuildOptions {
    // 环境判断
    const isDev = command === 'serve'
    const isBuild = command === 'build'
    const isAnalyze = mode === 'analyze'
    const currentEnv = loadEnv(mode, process.cwd())

    return {
        // 构建输出目录 默认dist
        outDir: 'dist',
        // 静态资源输出目录 默认assets
        assetsDir: 'assets',
        // 内联资源最小限制 默认为4096 字节小于4096字节的资源会被内联为base64
        assetsInlineLimit: 4096,
        // 构建源码映射 是否生成 source map 文件
        sourcemap: mode === 'development' ? true : false,
        // 库模式，为qiankun微前端配置
        // lib: {
        //   entry: './src/main.tsx', // 或者你的入口文件
        //   formats: ['umd'],
        //   name: 'viteForConfig', // 你的子应用名称
        // },
        // 自定义底层的 Rollup 打包配置。选项 https://rollupjs.org/configuration-options/
        rollupOptions: {
            // 配置入口文件  
            // 默认情况下，Vite 会抓取你的 index.html 来检测需要预构建的依赖项(在没有配置入口文件时,不过一般index.html文件都引入了入口文件！)
            // input: {
            //   main: './src/main.tsx',
            // },
            output: {
                // 控制chunk输出格式
                // entryFileNames: 'assets/[name].[hash].js', // 入口chunk文件命名格式
                // chunkFileNames: 'assets/[name].[hash].js', // 非入口chunk文件命名格式
                // assetFileNames: 'assets/[name].[hash].[ext]', // 资源文件命名格式

                // 对打包出来的资源文件进行分类，放到不同的文件夹内
                assetFileNames(assetsInfo: { name: string; }) {
                    //css样式文件
                    if (assetsInfo.name?.endsWith(".css")) {
                        return "css/[name]-[hash].css";
                    }
                    //  字体文件
                    const fontExts = [".ttf", ".otf", ".woff", ".woff2", ".eot"];
                    if (fontExts.some((ext) => assetsInfo.name?.endsWith(ext))) {
                        return "font/[name]-[hash].[ext]";
                    }

                    //  图片文件
                    const imgExts = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".icon", '.avif'];
                    if (imgExts.some((ext) => assetsInfo.name?.endsWith(ext))) {
                        return "img/[name]-[hash].[ext]";
                    }

                    //  SVG类型的图片文件
                    const imgSvg = [".svg"];
                    if (imgSvg.some((ext) => assetsInfo.name?.endsWith(ext))) {
                        return "icons/[name]-[hash].[ext]";
                    }

                    //  视频文件
                    const videoExts = [".mp4", ".avi", ".wmv", ".ram", ".mpg", "mpeg"];
                    if (videoExts.some((ext) => assetsInfo.name?.endsWith(ext))) {
                        return "video/[name]-[hash].[ext]";
                    }

                    return "assets/[name]-[hash].[ext]"
                },
                //manualChunks-允许创建自定义共享通用块。
                //使用方式1：自定义 chunk 分割策略，将这些依赖打包到一起
                // manualChunks: {
                //     'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                //     'utils-vendor': ['lodash-es', 'axios'],
                //     'ui-vendor': ['antd'],
                // },

                // rollup实验属性，为代码拆分设置设置最小块大小目标（以字节为单位），从而合并到一起。 单位：字节
                // 注意：manualChunks策略的优先级高于experimentalMinChunkSize
                // - 源码实现顺序 - Rollup打包过程中先执行manualChunks函数对模块分组，然后才进入后续的chunk合并阶段
                // - 文档说明 - Rollup文档中experimentalMinChunkSize被描述为一个后处理步骤，用于优化已经生成的chunks
                // - 实际行为 - 在实际项目中可观察到，无论experimentalMinChunkSize设置多大，manualChunks返回的不同名称chunks都不会被合并
                // - 设计逻辑 - 手动分块(manualChunks)的目的是开发者精确控制模块分组，如果后续步骤能随意合并这些精确定义的分组，会违背其设计意图
                // - 这就是为什么你的代码中即使设置了experimentalMinChunkSize: 1024，仍然会有很多小体积的独立chunks，因为manualChunks函数已经为它们分配了不同的chunk名称。
                experimentalMinChunkSize: 1024, //实际不生效



                // 使用方式2：按照依赖大小动态决定
                // getModuleInfo(id) 获取模块信息
                //  - code: 模块的源代码字符串，可通过 length 获取代码大小
                //  - importedIds: 该模块直接导入的所有模块 ID 数组
                //  - dynamicallyImportedIds: 动态导入的模块 ID 数组
                //  - importers: 导入当前模块的模块 ID 数组
                //  - dynamicImporters: 动态导入当前模块的模块 ID 数组
                //  - ast: 模块的抽象语法树
                //  - isEntry: 是否为入口模块
                //  - isExternal: 是否为外部模块
                manualChunks: (id, { getModuleInfo }) => {
                    if (id.includes('node_modules')) {
                        // * 「具名单独打包模块」 定义需要单独打包的依赖包配置(可选)
                        // const vendorPackages = ['antd', 'react', 'axios'];

                        // for (const vendor of vendorPackages) {
                        //     if (id.includes(vendor)) { 
                        //         return `vendor-${vendor}`;
                        //     }
                        // }

                        // * 「超过阈值单独打包」 递归获取模块及其依赖的大小，模块大小超过阈值（例如50KB），则单独分割。(可选)
                        // 设置阈值，可监控打包后的chunk数量和大小分布，根据实际情况微调阈值
                        const getModuleSize = (id: string) => {
                            const info = getModuleInfo(id);
                            if (!info) return 0;
                            // 注意：递归获取依赖模块总大小，效率非常低，但更全面反映模块体积
                            // return (info.code?.length || 0) + info.importedIds.reduce((total, importId) => total + getModuleSize(importId), 0);

                            // 获取模块体积，识别单个过大的模块文件，效率高
                            return (info.code?.length || 0)
                        };

                        // 这里获取的模块体积是打包前包的完整体积（包括依赖）
                        const moduleSize = getModuleSize(id);
                        if (moduleSize > (55 * 1024)) {
                            const packageName = id.toString().split('node_modules/')[1].split('/')[0];
                            return `vendor-size-${moduleSize}-${packageName}`;
                        }

                        // 这里如果想要合并的话，返回一个固定字符串名词即可！  例如：vendor-common
                        // * 「公共vendor」 小于阈值的模块归入公共vendor
                        const chunkHash = Math.abs(
                            id.split('').reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) & 0xffffffff, 0)
                        );
                        return 'vendor-common' + (chunkHash % 3);
                    }
                }

            },
        },
        // 是否生成一个 manifest 文件，包含了没有被 hash 过的资源文件名和 hash 后版本的映射， 默认false
        manifest: false,
        //直接修改底层rollup的监听器  https://rollupjs.org/configuration-options/#watch
        watch: {},
        // 单个超过文件大小警告的限制 默认500kb
        chunkSizeWarningLimit: 500,

        // 配置打包文件的名称 (不建议使用)
        //打包去掉打印信息 保留debugger vite3需要单独安装terser才行  pnpm add -D terser
        // minify: 'terser', // 使用 terser 压缩代码 ,因为官网没有提供esbuid去掉console的用法
        // terserOptions: {
        //   compress: {
        //     drop_console: true,
        //     drop_debugger: false,
        //   },
        // },
    } as BuildOptions
}