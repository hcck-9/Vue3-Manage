import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { visualizer } from 'rollup-plugin-visualizer'
import { resolve } from 'path'
import viteImagemin from 'vite-plugin-imagemin'
import compression from 'vite-plugin-compression2'
// 导入svgIcon 插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// eslint-disable-next-line no-undef
const pathReslove = (dir) => resolve(__dirname, dir)

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    createSvgIconsPlugin({
      // eslint-disable-next-line no-undef
      iconDirs: [resolve(process.cwd(), 'src/assets/svg')],
      symbolId: 'icon-[dir]-[name]'
    }),
    visualizer(),
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7, // 设置GIF图片的优化等级为7
        interlaced: false // 不启用交错扫描
      },
      optipng: {
        optimizationLevel: 7 // 设置PNG图片的优化等级为7
      },
      mozjpeg: {
        quality: 20 // 设置JPEG图片的质量为20
      },
      pngquant: {
        quality: [0.8, 0.9], // 设置PNG图片的质量范围为0.8到0.9之间
        speed: 4 // 设置PNG图片的优化速度为4
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox' // 启用移除SVG视图框的插件
          },
          {
            name: 'removeEmptyAttrs',
            active: false // 不启用移除空属性的插件
          }
        ]
      }
    }),
    compression({
      algorithm: 'gzip', // 指定压缩算法为gzip,[ 'gzip' , 'brotliCompress' ,'deflate' , 'deflateRaw']
      ext: '.gz', // 指定压缩后的文件扩展名为.gz
      threshold: 10240, // 仅对文件大小大于threshold的文件进行压缩，默认为10KB
      deleteOriginFile: false, // 是否删除原始文件，默认为false
      filter: /\.(js|css|json|html|ico|svg)(\?.*)?$/i, // 匹配要压缩的文件的正则表达式，默认为匹配.js、.css、.json、.html、.ico和.svg文件
      compressionOptions: { level: 9 }, // 指定gzip压缩级别，默认为9（最高级别）
      verbose: true, //是否在控制台输出压缩结果
      disable: false //是否禁用插件
    })
  ],
  // vite 自动识别 scss
  // pluginOptions: {
  //   'style-resources-loader': {
  //     preProcessor: 'scss',
  //     patterns: []
  //   }
  // },
  resolve: {
    alias: {
      // 设置 @ 指向 SRC 目录
      '@': pathReslove('./src')
    }
  },
  server: {
    host: 'localhost',
    // 端口
    port: 8080,
    // 默认打开浏览器
    open: true,
    // 允许跨域
    cors: true,
    hmr: true,
    watch: {
      usePolling: true
    }
  },
  build: {
    minify: 'terser', // 启用 terser 压缩
    terserOptions: {
      compress: {
        // pure_funcs: ['console.log'], // 只删除 console.log
        drop_console: true, // 删除所有 console
        drop_debugger: true // 删除 debugger
      }
    },
    rollupOptions: {
      output: {
        // 最小化拆分包
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 通过拆分包的方式将所有来自node_modules的模块打包到单独的chunk中
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        },
        // 设置chunk的文件名格式
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : []
          const fileName1 = facadeModuleId[facadeModuleId.length - 2] || '[name]'
          // 根据chunk的facadeModuleId（入口模块的相对路径）生成chunk的文件名
          return `js/${fileName1}/[name].[hash].js`
        },
        // 设置入口文件的文件名格式
        entryFileNames: 'js/[name].[hash].js',
        // 设置静态资源文件的文件名格式
        assetFileNames: '[ext]/[name].[hash:4].[ext]'
      }
    }
  },
  base: '/Vue3-Manage/',
  build: {
    outDir: 'docs'
  }
})
