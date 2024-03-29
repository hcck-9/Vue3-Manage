import { defineStore } from 'pinia'
import router from '@/router'
import { ref } from 'vue'
export const useMenu = defineStore(
  'menuArr',
  () => {
    // 初始化数据
    const menuData = ref([])
    // 设置动态路由
    const setRouter = (arr) => {
      menuData.value = arr
      function compilerMenu(arr) {
        if (!arr) return
        arr.forEach((item) => {
          let rts = {
            name: item.name,
            path: item.path,
            meta: item.meta,
            component: item.component
          }
          if (item.group) {
            for (const child of item.group) {
              compilerMenu(child.children)
            }
          }
          if (!item.group) {
            let path = loadComponents(item.component)
            rts.component = path
            router.addRoute('menu', rts)
          }
          function loadComponents(url) {
            let modules = import.meta.glob('../views/**/*.vue')
            return modules[`../views/${url}.vue`]
          }
        })
      }
      compilerMenu(arr)
    }
    // 初始化数据的
    const addRouter = () => {
      setRouter(menuData.value)
    }

    return {
      addRouter,
      setRouter,
      menuData
    }
  },
  {
    persist: true
  }
)
