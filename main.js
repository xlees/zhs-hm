import App from './App'

import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

import config from '@/config.js'

import { createSSRApp } from 'vue'
// import mpShare from '@/uni_modules/uview-plus/libs/mixin/mpShare.js'


export function createApp() {
  const app = createSSRApp(App)
  
  // app.use(store)
  
  const pinia = createPinia()
  pinia.use(persist)
  
  // app.mixin(mpShare)
  app.use(pinia)
  
  console.log("vue3 app created.")
  
  // 配置全局变量
  app.config.globalProperties.$config = config
  
  return {
    app
  }
}
