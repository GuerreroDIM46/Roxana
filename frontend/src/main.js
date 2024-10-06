import { createApp } from 'vue'
import App from '@/App.vue'
import '@/scss/styles.scss'
import * as bootstrap from 'bootstrap'
import { createPinia } from 'pinia'
import { createRouter, createWebHashHistory } from 'vue-router'
import '@/scss/global.scss'

const Home = () => import('@/views/Home.vue')  
const Listados = () => import('@/views/Listados.vue')  
const Elementos = () => import('@/views/Elementos.vue')  

const routes = [
    { path: '/', redirect: '/listados'},  
    { path: '/home', component: Home, name: 'Home' },
    { path: '/listados', component: Listados, name: 'Listados' },  
    { path: '/elementos', component: Elementos, name: 'Elementos' } 
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
