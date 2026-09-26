<template>
  <header class="site-header">
    <RouterLink class="brand" to="/holiday">微商城</RouterLink>
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

main {
  width: min(1080px, 88vw);
  margin: 0 auto;
  padding: 56px 0 80px;
}

@media (max-width: 560px) {
  .site-header {
    padding: 0 20px;
  }
  main {
    width: calc(100% - 40px);
    padding-top: 36px;
  }
}
</style>
