import { createApp } from 'vue'
import App from './App.vue'

// Modules
import router from './router'
import store from './store'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

// CSS property
import "primevue/resources/themes/bootstrap4-light-blue/theme.css"

const app = createApp(App);

app.use(store);
app.use(router);
app.use(PrimeVue);
app.use(ToastService);

app.mount('#app')
