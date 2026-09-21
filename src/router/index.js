import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/course' },
    {
      path: '/course',
      component: () => import('@/views/CourseCard.vue'),
    },
    {
      path: '/list',
      component: () => import('@/views/ProductList.vue'),
    },
  ],
})

export default router
