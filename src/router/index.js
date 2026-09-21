import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/course' },
    {
      path: '/course',
      component: () => import('@/views/CourseCard.vue'),
    },
  ],
})

export default router
