import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json'; // path from src to file at repo root
Amplify.configure(outputs);

// (optional sanity)
console.log('APIs in config:', (Amplify.getConfig() as any)?.custom?.API);

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
