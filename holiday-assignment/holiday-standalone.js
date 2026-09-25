const products = [
  { name: '罗技 M185 无线鼠标', category: '数码', price: 69, quantity: 1 },
  { name: '小米自带线充电宝 10000mAh 33W', category: '数码', price: 119, quantity: 1 },
  { name: '美的 HJ1566 1.5L 电热水壶', category: '家电', price: 65, quantity: 1 },
  { name: '维达超韧抽纸 126抽20包', category: '日用', price: 38.7, quantity: 1 },
  { name: '蓝月亮除菌洗衣液 2kg', category: '日用', price: 30.8, quantity: 1 },
  { name: '洁柔纯水湿巾 80片', category: '日用', price: 9.9, quantity: 2 },
  { name: '奥利奥经典原味夹心饼干 194g', category: '零食', price: 10.8, quantity: 2 },
  { name: '农夫山泉饮用天然水 550ml 24瓶', category: '饮料', price: 35.9, quantity: 1 },
  { name: '可口可乐经典摩登罐 330ml 24罐', category: '饮料', price: 49.9, quantity: 1 },
  { name: '得力 S01 黑色中性笔 30支', category: '文具', price: 25.9, quantity: 1 },
]

const roundMoney = (value) => Number(value.toFixed(2))

const total = roundMoney(
  products.reduce((sum, product) => sum + product.price * product.quantity, 0),
)

const mostExpensive = products.reduce((highest, product) =>
  product.price > highest.price ? product : highest,
)

const averagePrice = roundMoney(
  products.map((product) => product.price).reduce((sum, price) => sum + price, 0) /
    products.length,
)

const categoryTotals = products.reduce((totals, product) => {
  totals[product.category] = roundMoney(
    (totals[product.category] ?? 0) + product.price * product.quantity,
  )
  return totals
}, {})

console.log('===== 商品清单报告 =====')
products.forEach((product, index) => {
  console.log(
    `${index + 1}. ${product.name}｜${product.category}｜¥${product.price.toFixed(2)} × ${product.quantity}`,
  )
})
console.log('------------------------')
console.log(`总花费：¥${total.toFixed(2)}`)
console.log(`最贵商品：${mostExpensive.name}`)
console.log(`平均单价：¥${averagePrice.toFixed(2)}`)
console.log('分类小计：')
Object.entries(categoryTotals).forEach(([category, subtotal]) => {
  console.log(`${category}：¥${subtotal.toFixed(2)}`)
})
