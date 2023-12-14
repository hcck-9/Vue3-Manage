import { defineStore } from 'pinia'
import { getReadListAndStatus, getDepartmentMsgList } from '@/api/dep_msg.js'
export const useMsg = defineStore(
  'messageinfor',
  {
    state: () => {
      return {
        read_list: [],
        message_list: []
      }
    },

    actions: {
      async returnReadList(id) {
        this.read_list = []
        this.message_list = []
        const department = localStorage.getItem('department')
        const res = await getReadListAndStatus(id)
        const res2 = await getDepartmentMsgList(department)
        this.read_list = JSON.parse(res.data[0].read_list)
        this.message_list = res2.data
      }
    },
    getters: {}
  },
  {
    persist: {
      // 存储全部数据
      enabled: true
    }
  }
)