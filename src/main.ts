import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import fileOperateUI from './components/index.js'
// 引入windi css
// import 'virtual:uno.css'

createApp(App).use(ElementPlus).use(fileOperateUI).mount('#app')
