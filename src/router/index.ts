import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Startseite from "@/views/Startseite.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Startseite',
    component: Startseite
  },
  {
    path: '/teilnehmer',
    name: '>Teilnehmer verwalten',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Teilnehmer.vue')
  },
  {
    path: '/verbotene-paarungen',
    name: 'Verbotene Paarungen verwalten',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/VerbotenePaarungen.vue')
  },
  {
    path: '/erlaubte-partner',
    name: 'Erlaubte Partner',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ErlaubtePartner.vue')
  },
  {
    path: '/erlaubte-kombinationen',
    name: 'Erlaubte Kombinationen',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ErlaubteKombinationen.vue')
  },
  {
    path: '/administration',
    name: 'Administration',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Administration.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
