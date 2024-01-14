import { createApp } from 'vue'
import App from './App.vue'
// 引入路由
import router from './router'
// 导入 element-plus icon
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 导入svg图标
import 'virtual:svg-icons-register'
// 导入 pinia
import pinia from './store'
// 导入全局样式
import '@/assets/css/common.scss'
// 创建实例
const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)

import { useMenu } from '@/store/menu.js'
const menuStore = useMenu()
menuStore.addRouter()

app.use(router).mount('#app')
