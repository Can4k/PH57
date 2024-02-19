import {createRouter, createWebHistory} from 'vue-router'
import VoteView from '../views/VoteView.vue'
import ResultView from "@/views/ResultView.vue";

const routes = [
    {
        path: '/',
        name: 'home',
        component: VoteView
    },
    {
        path: '/result',
        name: 'result',
        component: ResultView
    },
    {
        path: "/:catchAll(.*)",
        redirect: '/',
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
