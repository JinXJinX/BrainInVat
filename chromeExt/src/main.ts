import { createApp } from 'vue'
import './assets/style.scss'
import './assets/perfect-scrollbar.css'
import { createRouter, createWebHistory } from "vue-router"
import App from './App.vue'
import { PageName } from './types'
import { createPinia } from "pinia";
import Notifications from '@kyvg/vue3-notification'


const routes = [
    {
        path: "/panel",
        name: PageName.PANEL,
        component: () => import("./views/Panel.vue"),
    },
    {
        path: "/chat",
        name: PageName.CHAT,
        component: () => import("./views/Chat.vue"),
    },
    {
        path: "/pages",
        name: PageName.PAGE_LIST,
        component: () => import("./views/PageList.vue"),
    },
    {
        path: "/setting",
        name: PageName.SETTING,
        component: () => import("./views/Setting.vue"),
    },
    {
        path: "/faq",
        name: PageName.FAQ,
        component: () => import("./views/FAQ.vue"),
    },
    {
        path: "/tos",
        name: PageName.TOS,
        component: () => import("./views/TOS.vue"),
    },
    {
        path: "/privacy",
        name: PageName.PRIVACY,
        component: () => import("./views/Privacy.vue"),
    },
    {
        path: "/contact",
        name: PageName.CONTACT,
        component: () => import("./views/Contact.vue"),
    },
]

const router = createRouter({
    history: createWebHistory("/"),
    routes,
})

const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(Notifications)
app.mount("#app")
