import test from 'node:test'
import assert from 'node:assert/strict'

import {
  calculateAveragePrice,
  calculateCategoryTotals,
  calculateTotal,
  createReport,
  findMostExpensive,
  products,
} from './holiday.js'

test('商品数据包含 10 件云逛街商品', () => {
  assert.equal(products.length, 10)
  assert.ok(products.every((product) => product.sourceUrl.includes('jd.com')))
})

test('总花费按单价乘数量计算', () => {
  assert.equal(calculateTotal(products), 475.6)
})

test('最贵商品按单价判断', () => {
  assert.equal(findMostExpensive(products)?.name, '小米自带线充电宝 10000mAh 33W')
})

test('平均单价按商品种类计算', () => {
  assert.equal(calculateAveragePrice(products), 45.49)
})

test('分类小计包含数量', () => {
  assert.deepEqual(calculateCategoryTotals(products), {
    数码: 188,
    家电: 65,
    日用: 89.3,
    零食: 21.6,
    饮料: 85.8,
    文具: 25.9,
  })
})

test('空数组返回安全结果', () => {
  assert.equal(calculateTotal([]), 0)
  assert.equal(calculateAveragePrice([]), 0)
  assert.equal(findMostExpensive([]), null)
  assert.deepEqual(calculateCategoryTotals([]), {})
})

test('清单报告包含关键统计结果', () => {
  const report = createReport(products)

  assert.match(report, /商品清单报告/)
  assert.match(report, /总花费：¥475\.60/)
  assert.match(report, /平均单价：¥45\.49/)
})
