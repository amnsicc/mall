import {
  calculateAveragePrice,
  calculateCategoryTotals,
  calculateTotal,
  createReport,
  findMostExpensive,
  products,
} from '../src/data/holidayProducts.js'

export {
  calculateAveragePrice,
  calculateCategoryTotals,
  calculateTotal,
  createReport,
  findMostExpensive,
  products,
}

export const printReport = (items) => console.log(createReport(items))

if (process.argv[1]?.endsWith('holiday.js')) {
  printReport(products)
}
