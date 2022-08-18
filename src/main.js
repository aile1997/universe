import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index.js'
// import less from "less";
import '@/assets/js/rem.js'
import '@/assets/css/common.css'

import pluginObject from './plugins/plugins_object'
// window['global'] = window
const app = createApp(App)
app.use(router).mount('#app')
app.use(pluginObject)
