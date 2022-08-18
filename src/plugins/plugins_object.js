import Helper from '@/utils/Common/helper.js'
import messages from '@/assets/js/lan'

export default {
  install(app) {
    app.config.globalProperties.$Helper = Helper
    app.config.globalProperties.$messages = messages
  },
}
