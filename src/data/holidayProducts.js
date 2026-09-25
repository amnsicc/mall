export const products = [
  { id: 1, name: '罗技 M185 无线鼠标', category: '数码', price: 69, quantity: 1, stock: 18, img: '/img/holiday/mouse.jpg', sourceUrl: 'https://item.jd.com/product/pWrkPb75a1pc2I1p5op2pw.html' },
  { id: 2, name: '小米自带线充电宝 10000mAh 33W', category: '数码', price: 119, quantity: 1, stock: 26, img: '/img/holiday/powerbank.jpg', sourceUrl: 'https://item.jd.com/product/XPzCPmvQ4rcMb8Z_1kjCdw.html' },
  { id: 3, name: '美的 HJ1566 1.5L 电热水壶', category: '家电', price: 65, quantity: 1, stock: 12, img: '/img/holiday/kettle.png', sourceUrl: 'https://item.jd.com/product/QcOuvmqZMmZ_x_JhwMWldg.html' },
  { id: 4, name: '维达超韧抽纸 126抽20包', category: '日用', price: 38.7, quantity: 1, stock: 35, img: '/img/holiday/tissues.jpg', sourceUrl: 'https://item.jd.com/product/_t8Xa832EMgAX-_bayVtwg.html' },
  { id: 5, name: '蓝月亮除菌洗衣液 2kg', category: '日用', price: 30.8, quantity: 1, stock: 9, img: '/img/holiday/detergent.png', sourceUrl: 'https://item.jd.com/product/-mqwekwFyhxukpky_YDQYw.html' },
  { id: 6, name: '洁柔纯水湿巾 80片', category: '日用', price: 9.9, quantity: 2, stock: 42, img: '/img/holiday/wipes.jpg', sourceUrl: 'https://item.jd.com/product/HYSVQdPNPgfFycIwVUJa6g.html' },
  { id: 7, name: '奥利奥经典原味夹心饼干 194g', category: '零食', price: 10.8, quantity: 2, stock: 31, img: '/img/holiday/oreo.jpg', sourceUrl: 'https://item.jd.com/product/sJUF1M8HJqU0dEvX-1KgPw.html' },
  { id: 8, name: '农夫山泉饮用天然水 550ml 24瓶', category: '饮料', price: 35.9, quantity: 1, stock: 50, img: '/img/holiday/water.jpg', sourceUrl: 'https://item.jd.com/848851.html' },
  { id: 9, name: '可口可乐经典摩登罐 330ml 24罐', category: '饮料', price: 49.9, quantity: 1, stock: 28, img: '/img/holiday/cola.jpg', sourceUrl: 'https://item.jd.com/10196796484584.html' },
  { id: 10, name: '得力 S01 黑色中性笔 30支', category: '文具', price: 25.9, quantity: 1, stock: 21, img: '/img/holiday/pens.jpg', sourceUrl: 'https://item.jd.com/7204129.html' },
]

const roundMoney = (value) => Number(value.toFixed(2))

export const calculateTotal = (items) =>
  roundMoney(items.reduce((sum, item) => sum + item.price * item.quantity, 0))

export const findMostExpensive = (items) => {
  if (items.length === 0) return null
  return items.reduce((highest, item) => (item.price > highest.price ? item : highest))
}

export const calculateAveragePrice = (items) => {
  if (items.length === 0) return 0
  const priceSum = items.map((item) => item.price).reduce((sum, price) => sum + price, 0)
  return roundMoney(priceSum / items.length)
}

export const calculateCategoryTotals = (items) =>
  items.reduce((totals, item) => {
    totals[item.category] = roundMoney(
      (totals[item.category] ?? 0) + item.price * item.quantity,
    )
    return totals
  }, {})

export const createReport = (items) => {
  const mostExpensive = findMostExpensive(items)
  const categoryTotals = calculateCategoryTotals(items)
  const productLines = items.map(
    (item, index) =>
      `${index + 1}. ${item.name}｜${item.category}｜¥${item.price.toFixed(2)} × ${item.quantity}`,
  )
  const categoryLines = Object.entries(categoryTotals).map(
    ([category, subtotal]) => `${category}：¥${subtotal.toFixed(2)}`,
  )

  return [
    '===== 商品清单报告 =====',
    ...productLines,
    '------------------------',
    `总花费：¥${calculateTotal(items).toFixed(2)}`,
    `最贵商品：${mostExpensive?.name ?? '无'}`,
    `平均单价：¥${calculateAveragePrice(items).toFixed(2)}`,
    '分类小计：',
    ...categoryLines,
  ].join('\n')
}
