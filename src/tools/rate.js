import httpClient from './httpClient'
import cheerio from 'cheerio'

export const getRate = async (currency, date) => {
  const page = await httpClient.get(`/${currency.toLowerCase()}/${date}/`)

  const $ = cheerio.load(page.data)

  return (
    Number(
      $('.table-response tbody tr')
        .first()
        .find('.mfm-posr')
        .first()
        .text()
        .split('\n')[0],
    ) ?? 0
  )
}

export const getProfits = async (incomes) => {
  const rate = await Promise.all(
    incomes.map(income => getRate(income.currency, income.date)),
  )

  console.log(rate)

  const totalEarned = incomes
    .map(income => income.summ)
    .reduce((acc, summ) => acc + summ)

  const totalEarnedUAH = incomes
    .map((income, index) => income.summ * rate[index])
    .reduce((acc, summ) => acc + summ)

  const tax5percent = totalEarnedUAH * 0.05

  incomes.forEach((income,index) => {
      income.rate = `${rate[index]}`;
  });

  return {
    totalEarned: totalEarned,
    totalEarnedUAH: totalEarnedUAH,
    tax5percent: tax5percent,
    rawData: incomes,
  }
}