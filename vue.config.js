'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')
const port = process.env.port || process.env.npm_config_port || 9528 // dev port
const name = defaultSettings.title
// 定义resolve方法，把相对路径转换成绝对路径
// const resolve = dir => path.join(__dirname, dir)
// 等价于
const resolve = _path => path.resolve(__dirname, _path)

const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
const CompressionPlugin = require('compression-webpack-plugin')

// 样式和js的CDN外链，会插入到index.html中
const cdn = {
  // 开发环境
  dev: {
    css: [],
    js: []
  },
  // 生产环境
  build: {
    // css: ['https://unpkg.com/element-ui@2.15.1/lib/theme-chalk/index.css'],
    // js: ['https://unpkg.com/vue@2.6.11/dist/vue.min.js', 'https://unpkg.com/element-ui@2.15.1/lib/index.js']
    js: ['https://unpkg.com/vue@2.6.11/dist/vue.min.js']
  }
}

// 外部扩展，即外部引入对象与内部引用时的对象配置
// 例如：vue: 'Vue', 对应 import Vue from 'vue' 来说
// 属性名 vue 为要从外部引入时的 vue 对象，Vue为引入后的对应的全局变量。
const externals = {
  vue: 'Vue'
  // 'element-ui': 'ElementUI'
}

module.exports = {
  // publicPath: '/', // 用法和 webpack 的 output.publicPath 一致，资源文件引用的目录，打包后浏览器访问服务时的 url 路径中通用的前缀部分。
  // outputDir: 'dist', // 生产环境构建文件的目录，相当于 webpack的 output.path，构建项目时所有输出文件的目标路径/打包后文件在硬盘中的存储位置
  assetsDir: 'static', // 打包时静态资源的输出目录路径（相对于outputDir的路径，即在dist目录下）
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: false, // 在生产阶段关闭已加速构建速度快速 sourceMap作用是方便我们在开发测试阶段快速定位编译前的代码
  // configureWebpack: { // webpack简单配置，该对象将会被 webpack-merge 合并入最终的 webpack 配置
  //   name,
  //    plugins: [
  //      new MyAwesomeWebpackPlugin()
  //    ]
  // },
  configureWebpack: config => {
    config.name = name
    const plugins = []
    if (IS_PROD) {
      // 生产环境
      plugins.push(
        // 开启gzip压缩，在服务器也要开启相应配置
        new CompressionPlugin({
          test: /\.(js|css|json|ico|svg)$/, // 匹配文件格式
          algorithm: 'gzip',
          threshold: 10240, // 对超过10k的数据压缩
          minRatio: 0.8, // 压缩比
          // filename: '[path][base].gz', // 压缩后的文件名，默认值是 [path][base].gz
          filename(pathData) {
            // `pathData` 参数包含很多可以获取到文件路径相关数据的属性 - `path`/`name`/`ext`/等等
            // 如果路径中包含svg，则放到svg/目录下
            // 只是演示，一般都用字符串默认值就好
            if (/\.svg$/.test(pathData.ext)) {
              return 'static/svg/[base].gz'
            }
            return '[path][base].gz'
          },
          deleteOriginalAssets: false // 不删除源文件，true 则只保留压缩后的文件
        })
      )
      // 外部扩展配置，在production模式下，引入外部cdn资源，同时不要把这些模块打包到libs公共包里
      config.externals = externals
    } else {
      // 为开发环境修改配置
    }
    config.plugins = [...config.plugins, ...plugins]
  },
  chainWebpack: config => {
    // svg图标配置
    config.module.rule('svg').exclude.add(resolve('src/assets/icons'))
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // 配置别名，vue-cli默认已设置
    // config.resolve.alias
    //   .set("@", resolve("src"))

    // 添加插件
    // 注意链式配置webpack，不用再new去创建一个插件了，这件事已经默认帮我们做好了。
    config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    // 插件移除
    config.plugins.delete('prefetch')
    // 插件修改
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L213
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    if (IS_PROD) {
      // 图片压缩处理
      config.module
        .rule('images')
        // .test(/\.(gif|png|jpe?g|svg)$/i)
        .exclude.add(resolve('src/assets/icons')) // 排除icons目录，这些图标已用 svg-sprite-loader 处理，打包成 svg-sprite 了
        .end()
        .use('url-loader')
        .tap(options => ({
          limit: 10240,
          fallback: {
            loader: require.resolve('file-loader'),
            options: {
              // 在这里修改file-loader的配置
              // name: 'static/img/[name].[hash:8].[ext]',
              name: '[name].[hash:8].[ext]',
              outputPath: function (url, resourcePath, context) {
                // 返回从项目根目录到该图片的相对路径
                const relativePath = path.relative(context, resourcePath)
                const pathArr = relativePath.split('/')
                // 如果你的静态资源目录结构较为简单(最多二个层级)，图片只放在/src/assets/ 或/src/assets/xxx
                // 希望根据assets下的目录结构原样输出，可以这样做
                if (pathArr[3] !== undefined) {
                  return `static/img/${pathArr[2]}/${url}` // url 是上面配置的 name 的值，必须加在路径最后
                }
                return `static/img/${url}`

                // 这些都可依照个人习惯来安排，个人建议没必要太复杂
                // if (/denglun-bg\.jpg/.test(resourcePath)) {
                //   // 如果图片以 denglun-bg.jpg 结尾
                //   return `static/denglun/${url}`
                // }
                // if (/bg_images\//.test(resourcePath)) {
                //   // 如果图片路径包含 bg_images 目录
                //   return `static/bg_images/${url}`
                // }
                // return `static/img/${url}`
              },
              publicPath: (url, resourcePath, context) => {
                // 无特殊需要无需配置，默认访问路径前缀就是webpack配置的output.publicPath
                // 路径结构和输出路径一致，即在这个前缀后加上文件输出所在路径(不包含dist)即可
                // 如果要让资源引用地址输出为相对路径，把 `outputPath` 的内容拷贝一份到这里即可
              }
            }
          }
        }))
        .end()
        .use('image-webpack-loader')
        .loader('image-webpack-loader')
        .options({
          mozjpeg: { progressive: true, quality: 50 }, // 压缩JPEG图像
          optipng: { enabled: true }, // 压缩PNG图像
          pngquant: { quality: [0.5, 0.65], speed: 4 }, // 压缩PNG图像
          gifsicle: { interlaced: false } // 压缩GIF图像
        })
        .end()
        .enforce('post') // 表示先执行配置在下面那个loader

      // 代码细分抽离优化
      config.optimization.splitChunks({
        chunks: 'all', // 表明选择哪些 chunk 进行优化。通用设置，可选值：all/async/initial。设置为 all 意味着 chunk 可以在异步和非异步 chunk 之间共享。
        minSize: 20000, // 允许新拆出 chunk 的最小体积
        maxAsyncRequests: 10, // 每个异步加载模块最多能被拆分的数量
        maxInitialRequests: 10, // 每个入口和它的同步依赖最多能被拆分的数量
        enforceSizeThreshold: 50000, // 强制执行拆分的体积阈值并忽略其他限制
        cacheGroups: {
          libs: {
            // 第三方库
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/, // 请注意'[\\/]'的用法，是具有跨平台兼容性的路径分隔符
            priority: 20 // 优先级，执行顺序就是权重从高到低
            // chunks: 'initial' // 只打包最初依赖的第三方
            // reuseExistingChunk: true
          },
          elementUI: {
            // 把 elementUI 单独分包
            name: 'chunk-elementUI',
            test: /[\\/]node_modules[\\/]element-ui[\\/]/,
            // test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
            priority: 30 // 权重必须比 libs 大，不然会被打包进 libs 里
          },
          //     'async-libs': {
          //       name: 'chunk-async-libs',
          //       test: /[\\/]node_modules[\\/]/, // 请注意'[\\/]'的用法，是具有跨平台兼容性的路径分隔符
          //       priority: 20, // 优先级，执行顺序就是权重从高到低
          //       chunks: 'async'
          //     },
          commons: {
            name: 'chunk-commons',
            minChunks: 2, // 拆分前，这个模块至少被不同 chunk 引用的次数
            priority: 0,
            reuseExistingChunk: true
          },
          svgIcon: {
            name: 'chunk-svgIcon',
            // 函数匹配示例，把 svg 单独拆出来
            test(module) {
              // `module.resource` 是文件的绝对路径
              // 用`path.sep` 代替 / or \，以便跨平台兼容
              // const path = require('path') // path 一般会在配置文件引入，此处只是说明 path 的来源，实际并不用加上
              return (
                module.resource &&
                module.resource.endsWith('.svg') &&
                module.resource.includes(`${path.sep}icons${path.sep}`)
              )
            },
            priority: 50
          }
          // utils: {
          //   // 公用代码
          //   name: 'chunk-utils',
          //   test: /[\\/]src[\\/](utils|filters|api)[\\/]/,
          //   //test: /[\\/]src[\\/]api[\\/]/,
          //   // maxInitialRequests: 5, //入口点的最大并行请求数
          //   // minChunks: 2,
          //   priority: 10,
          //   // chunks: 'initial',
          //   reuseExistingChunk: true
          // }
        }
      })
      // 添加 cdn 参数到 htmlWebpackPlugin 配置中
      config.plugin('html').tap(args => {
        args[0].cdn = cdn.build
        args[0].title = '动森管理系统'
        return args
      })
    }
  },
  devServer: {
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    port: port,
    proxy: {
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://106.54.168.208:1016', // 腾讯云服务器
        // target: 'http://localhost:1016',
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
    sockHost: '106.54.168.208', // 如果不配置npm服务器运行地址IP，sockJS会默认访问项目运行地址，就会一直报错
    sockPort: '1224'
    // sockPath: '/socket',
  }
}
