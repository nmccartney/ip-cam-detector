// import HelloWorld from './components/HelloWorld';
import AssetViewer from '../components/AssetViewer';
import DetectionViewer from '../components/DetectionViewer';
import Timeline from '../components/Timeline';

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// const Home = () => import(/* webpackChunkName: "home" */ '@/views/Home.vue')

const routes = [
    {
        path: '/',
        name: 'IP Camera Detector',
        component: Timeline
    },
    {
        path: '/detections',
        name: 'Detections',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        // component: () => import(/* webpackChunkName: "about" */ '../components/DetectionViewer.vue')
        component: DetectionViewer
    },
    {
        path: '/evaluations',
        name: 'Evaluations',
        component: DetectionViewer
    },
    {
        path: '/file-explorer',
        name: 'File Explorer',
        component: AssetViewer
    },
]

const router = new VueRouter({
    routes
})

export default router