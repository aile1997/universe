import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/Home',
  },
  // {
  //   path: "/",
  //   name: "home",
  //   component: () => import("@/components/Home.vue"),
  // },
  {
    path: '/Home',
    name: 'Home',
    component: () => import('@/view/Home.vue'),
  },
  {
    path: '/Universe',
    name: 'Universe',
    component: () => import('@/view/Universe.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
