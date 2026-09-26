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

const total = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0)

const mostExpensive = (items) =>
  items.reduce((highest, item) => (item.price > highest.price ? item : highest))

const averagePrice = (items) =>
  items.map((item) => item.price).reduce((sum, price) => sum + price, 0) / items.length

const categoryTotals = (items) =>
  items.reduce((result, item) => {
    result[item.category] = (result[item.category] ?? 0) + item.price * item.quantity
    return result
  }, {})

const printReport = (items) => {
  console.log('===== 商品清单报告 =====')
  items.forEach((item, index) => {
    console.log(
      `${index + 1}. ${item.name}｜${item.category}｜¥${item.price.toFixed(2)} × ${item.quantity}`,
    )
  })
  console.log('------------------------')
  console.log(`总花费：¥${total(items).toFixed(2)}`)
  console.log(`最贵商品：${mostExpensive(items).name}`)
  console.log(`平均单价：¥${averagePrice(items).toFixed(2)}`)
  console.log('分类小计：')
  Object.entries(categoryTotals(items)).forEach(([category, subtotal]) => {
    console.log(`${category}：¥${subtotal.toFixed(2)}`)
  })
}

printReport(products)
