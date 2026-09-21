<script setup>
import { ref } from 'vue'

const course = ref({
  name: 'Web 前端框架技术',
  class: '24软工国际-41',
  week: 3,
})
</script>

<template>
  <section class="course-card">
    <p class="label">COURSE 03</p>
    <h1>{{ course.name }}</h1>
    <p class="meta">{{ course.class }} · 第 {{ course.week }} 周</p>
    <p class="topic">Vue 开发基础与微商城项目启动</p>
    <RouterLink to="/list">进入商品列表</RouterLink>
  </section>
</template>

<style scoped>
.course-card {
  max-width: 720px;
  padding: 48px;
  border: 1px solid #d8d4cc;
  border-left: 6px solid #c43d2f;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 18px 48px rgb(45 39 32 / 10%);
}

.label {
  margin: 0 0 28px;
  color: #c43d2f;
  font-size: 12px;
  font-weight: 800;
}

h1 {
  margin: 0;
  font-family: Georgia, "Songti SC", serif;
  font-size: clamp(34px, 6vw, 64px);
  line-height: 1.08;
}

.meta {
  margin: 24px 0 8px;
  color: #66625d;
}

.topic {
  margin: 0 0 36px;
  font-size: 18px;
}

a {
  display: inline-block;
  padding-bottom: 4px;
  border-bottom: 2px solid #c43d2f;
  color: #1d1d1b;
  font-weight: 700;
  text-decoration: none;
}

@media (max-width: 560px) {
  .course-card {
    padding: 32px 24px;
  }
}
</style>
