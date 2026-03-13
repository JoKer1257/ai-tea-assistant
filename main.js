import { createSSRApp } from 'vue'
import * as Pinia from 'pinia'
import App from './App.vue'

// Import Tailwind CSS
import './style.css'

export function createApp() {
  const app = createSSRApp(App)
  app.use(Pinia.createPinia())
  return {
    app,
    Pinia
  }
}
