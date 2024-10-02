import { createApp } from 'vue'
import App from '@/App.vue'
import '@/scss/styles.scss'
import * as bootstrap from 'bootstrap'
import { createPinia } from 'pinia'
import { createRouter, createWebHashHistory } from 'vue-router'
import '@/scss/global.scss'

const Home = () => import('@/views/Home.vue')  

const routes = [
    { path: '/', redirect: '/home'},  
    { path: '/home', component: Home, name: 'Home' } 
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

const pinia = createPinia()

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
