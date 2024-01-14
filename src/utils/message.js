import { ElMessage } from 'element-plus'

let messageInstance = null

const newMessage = (options) => {
  if (messageInstance) {
    messageInstance.close()
  }
  messageInstance = ElMessage(options)
}

;['error', 'success', 'info', 'warning'].forEach((type) => {
  newMessage[type] = (options) => {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }
    options.type = type
    return newMessage(options)
  }
})

export default newMessage
