<script setup>
import { computed, ref } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import {
  calculateAveragePrice,
  calculateCategoryTotals,
  calculateTotal,
  findMostExpensive,
  products,
} from '@/data/holidayProducts.js'

const productList = ref(products)
const total = computed(() => calculateTotal(productList.value))
const average = computed(() => calculateAveragePrice(productList.value))
const mostExpensive = computed(() => findMostExpensive(productList.value))
const categoryCount = computed(
  () => Object.keys(calculateCategoryTotals(productList.value)).length,
)
</script>

<template>
  <section class="holiday-page">
    <dl class="summary" aria-label="商品统计摘要">
      <div>
        <dt>预计总花费</dt>
        <dd>¥{{ total.toFixed(2) }}</dd>
      </div>
      <div>
        <dt>平均单价</dt>
        <dd>¥{{ average.toFixed(2) }}</dd>
      </div>
      <div>
        <dt>最贵商品</dt>
        <dd>{{ mostExpensive.name }}</dd>
      </div>
      <div>
        <dt>商品类别</dt>
        <dd>{{ categoryCount }} 类</dd>
      </div>
    </dl>

    <div class="section-heading">
      <h2>商品清单</h2>
    </div>

    <div class="product-grid">
      <ProductCard
        v-for="product in productList"
        :key="product.id"
        :goods="product"
      />
    </div>
  </section>
</template>

<style scoped>
.holiday-page {
  color: #20211f;
}

.summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: 0 0 42px;
  border-block: 1px solid #c9c7c1;
}

.summary div {
  min-width: 0;
  padding: 20px;
  border-right: 1px solid #c9c7c1;
}

.summary div:last-child {
  border-right: 0;
}

dt {
  margin-bottom: 8px;
  color: #777169;
  font-size: 12px;
}

dd {
  margin: 0;
  overflow-wrap: anywhere;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.35;
}

.section-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

.section-heading h2 {
  margin: 0;
}

.section-heading h2 {
  font-size: 24px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

@media (max-width: 820px) {
  .summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .summary div:nth-child(2) {
    border-right: 0;
  }

  .summary div:nth-child(-n + 2) {
    border-bottom: 1px solid #c9c7c1;
  }

  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .summary,
  .product-grid {
    grid-template-columns: 1fr;
  }

  .summary div,
  .summary div:nth-child(2) {
    border-right: 0;
    border-bottom: 1px solid #c9c7c1;
  }

  .summary div:last-child {
    border-bottom: 0;
  }
}
</style>
