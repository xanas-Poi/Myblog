/* eslint-disable */

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 8888 npm run dev OR npm run dev --port = 8888
const path = require("path");
const port = process.env.port || process.env.npm_config_port || 8888; // dev port
const host = process.env.host || process.env.npm_config_host || "127.0.0.1"; // dev host

/*gzip压缩 */
// 导入compression-webpack-plugin
const CompressionWebpackPlugin = require("compression-webpack-plugin");
// 定义压缩文件类型
const productionGzipExtensions = ["js", "css", "scss"];

// dll  vendor打包
const webpack = require("webpack");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// function resolve(dir) {
//   return path.join(__dirname, dir);
// }

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./my-project/" : "./", // 部署应用时的基本 URL
  outputDir: "dist", // build打包后产生的文件加名称
  assetsDir: "./static", //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  publicPath: "./",
  lintOnSave: process.env.NODE_ENV !== "production", //是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
  productionSourceMap: false, // false 生产环境下css不分离文件、会自动生成一些map文件
  filenameHashing: true, // 默认在生成的静态资源文件名中包含hash以控制缓存
  // 配置服务器
  devServer: {
    port,
    host,
    open: true, //运行服务器自动打开
    hotOnly: true, // 热更新
    // https: false,
    // 可以通过设置让浏览器 overlay 同时显示警告和错误：
    // overlay: {
    //     warnings: false,
    //     errors: false,
    // },
    proxy: {
      '/api': {
        target: 'http://localhost:6720/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  // // css的处理
  css: {
    // 当为true时，css文件名可省略 module 默认为 false
    requireModuleExtension: true,
    // 是否将组件中的 CSS 提取至一个独立的 CSS 文件中,当作为一个库构建时，你也可以将其设置为 false 免得用户自己导入 CSS
    // 默认生产环境下是 true，开发环境下是 false
    extract: false,
    // 是否为 CSS 开启 source map。设置为 true 之后可能会影响构建的性能
    sourceMap: false,
    //向 CSS 相关的 loader 传递选项(支持 css-loader postcss-loader sass-loader less-loader stylus-loader)
    loaderOptions: {
      css: {},
      sass: {}
    }
  },
  //统一配置打包插件
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      // 为生产环境修改配置...
      return {
        // 打包去掉console 必须引入TerserPlugin
        

        optimization: {
          minimizer: [
            new TerserPlugin({
              terserOptions: {
                compress: {
                  warnings: false,
                  drop_console: true,
                  drop_debugger: true,
                  pure_funcs: ["console.log"]
                }
              }
            })
          ]
        },
        
        
        // 关闭 webpack 的性能提示
        performance: {
          hints: false
        },
        //别名
        plugins: [
          //gzip压缩
          new CompressionWebpackPlugin({
            filename: "[path].gz[query]",
            algorithm: "gzip",
            test: new RegExp(
              "\\.(" + productionGzipExtensions.join("|") + ")$"
            ), //匹配文件名
            threshold: 10240, //对10K以上的数据进行压缩
            minRatio: 0.8,
            deleteOriginalAssets: false //是否删除源文件
          }),

          //代码压缩
          // new UglifyJsPlugin({
          //   uglifyOptions: {
          //       compress: {
          //           drop_debugger: true,
          //           drop_console: true,  //生产环境自动删除console
          //       },
          //       warnings: false,
          //   },
          //   sourceMap: false,
          //   parallel: true,//使用多进程并行运行来提高构建速度。默认并发运行数：os.cpus().length - 1。
          // }),

          new CleanWebpackPlugin(),
          new webpack.DllReferencePlugin({
            context: process.cwd(),
            manifest: require("./public/vendor/vendor-manifest.json")
          }),
          // 将 dll 注入到 生成的 html 模板中
          new AddAssetHtmlPlugin({
            // dll文件位置
            filepath: path.resolve(__dirname, "./public/vendor/*.js"),
            // dll 引用路径
            publicPath: "./vendor",
            // dll最终输出的目录
            outputPath: "./vendor"
          }),
        ]
      };
    } else {
      // 为开发环境修改配置...
      return;
    }
  },
  pages: {
    index: {
        // 入口文件
        entry: './src/main.js',
        // 模版文件
        template: 'public/index.html',
        // 输出文件名
        filename: 'index.html'
    }
},
}
