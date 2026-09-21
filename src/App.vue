<template>
  <header class="site-header">
    <RouterLink class="brand" to="/course">微商城</RouterLink>
    <nav>
      <RouterLink to="/course">课程名片</RouterLink>
      <RouterLink to="/list">商品列表</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
.site-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6vw;
  border-bottom: 1px solid #dedbd5;
  background: #fff;
}

.brand {
  color: #1d1d1b;
  font-size: 20px;
  font-weight: 800;
  text-decoration: none;
}

nav {
  display: flex;
  gap: 24px;
}

nav a {
  color: #66625d;
  font-size: 14px;
  text-decoration: none;
}

nav a.router-link-active {
  color: #c43d2f;
  font-weight: 700;
}

main {
  width: min(1080px, 88vw);
  margin: 0 auto;
  padding: 56px 0 80px;
}

@media (max-width: 560px) {
  .site-header {
    padding: 0 20px;
  }

  nav {
    gap: 14px;
  }

  main {
    width: calc(100% - 40px);
    padding-top: 36px;
  }
}
</style>
