import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { resolve } from 'path'
// 导入svgIcon 插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// eslint-disable-next-line no-undef
const pathReslove = (dir) => resolve(__dirname, dir)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      // eslint-disable-next-line no-undef
      iconDirs: [resolve(process.cwd(), 'src/assets/svg')],
      symbolId: 'icon-[dir]-[name]'
    })
  ],
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: []
    }
  },
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
  }
})
