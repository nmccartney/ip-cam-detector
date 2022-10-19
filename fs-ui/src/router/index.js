// import HelloWorld from './components/HelloWorld';
import AssetViewer from '../components/AssetViewer';
import DetectionViewer from '../components/DetectionViewer';

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// const Home = () => import(/* webpackChunkName: "home" */ '@/views/Home.vue')

const routes = [
    {
        path: '/',
        name: 'explorer',
        component: AssetViewer
    },
    {
        path: '/detections',
        name: 'detection',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        // component: () => import(/* webpackChunkName: "about" */ '../components/DetectionViewer.vue')
        component: DetectionViewer
    }
]

const router = new VueRouter({
    routes
})

export default router