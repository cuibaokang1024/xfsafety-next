import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus' // 引入element-ui
import 'element-plus/lib/theme-chalk/index.css' // 引入element-ui css样式
import '@/styles/index.scss'// 全局 css
import './permission'

const app = createApp(App)
app.use(router).use(store).use(ElementPlus)
router.isReady().then(() => app.mount('#app'))
