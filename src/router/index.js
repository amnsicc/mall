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
    { path: '/props/:id', name: 'detail-props', props: true, component: () => import('@/views/ProductDetailProps.vue') },
    { path: '/cart', name: 'cart', component: () => import('@/views/Cart.vue') },
    { path: '/login', name: 'login', meta: { guest: true }, component: () => import('@/views/Login.vue') },
    {
      path: '/admin', component: () => import('@/views/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/admin/products' },
        { path: 'products', name: 'admin-products', component: () => import('@/views/AdminProducts.vue') },
        { path: 'orders', name: 'admin-orders', component: () => import('@/views/AdminOrders.vue') },
      ],
    },
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

router.beforeEach((to) => {
  if (to.meta.guest) return true
  // Read storage on each navigation, including the first navigation after a refresh.
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    return { name: 'login', query: { from: to.fullPath } }
  }
  return true
})

export default router
