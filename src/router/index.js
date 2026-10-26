import { createRouter, createWebHashHistory } from 'vue-router'

// Preserve old direct URLs when moving the course project from history to hash routing.
if (!location.hash && location.pathname !== '/' && !/\.html?$/.test(location.pathname)) {
  history.replaceState(null, '', '/#' + location.pathname + location.search)
}

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/products' },
    { path: '/products', name: 'products', component: () => import('@/views/ProductList.vue') },
    { path: '/products/:id', name: 'detail', component: () => import('@/views/ProductDetail.vue') },
    { path: '/cart', name: 'cart', component: () => import('@/views/Cart.vue') },
    {
      path: '/course',
      component: () => import('@/views/CourseCard.vue'),
    },
    {
      path: '/list',
      redirect: '/products',
    },
    {
      path: '/holiday',
      component: () => import('@/views/HolidayProducts.vue'),
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFound.vue') },
  ],
})

export default router
