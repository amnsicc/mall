import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)

app.use(router)

app.directive('focus', {
  mounted(el, binding) { if (binding.value !== false) el.focus({ preventScroll: true }) },
})

app.mount('#app')
