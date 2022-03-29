// v2

const statement = (invoice, plays) => {
  const amountFor = (aPerformance) => {
    let result = 0
    switch (playFor(aPerformance).type) {
      case 'tragedy': {
        result = 40000
        if (aPerformance.audience > 30)
          result += 1000 * (aPerformance.audience - 30)
        break
      }
      case 'comedy': {
        result = 30000
        if (aPerformance.audience > 20)
          result += 10000 + 500 * (aPerformance.audience - 20)
        result += 300 * aPerformance.audience
        break
      }
      default:
        throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`)
    }
    return result
  }

  const playFor = (aPerformance) => {
    return plays[aPerformance.playID]
  }

  let totalAmount = 0 // 총액
  let volumeCredits = 0 // 적립포인트
  let result = `청구 내역 (고객명: ${invoice.customer})\n`
  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format

  for (let aPerformance of invoice.performances) {
    let thisAmount = amountFor(aPerformance)

    volumeCredits += Math.max(aPerformance.audience - 30, 0)
    if (playFor(aPerformance).type === 'comedy')
      volumeCredits += Math.floor(aPerformance.audience / 5)
    result += `  ${playFor(aPerformance).name}: ${format(thisAmount / 100)} (${
      aPerformance.audience
    }석)\n`
    totalAmount += thisAmount
  }
  result += `총액: ${format(totalAmount / 100)}\n`
  result += `적립 포인트: ${volumeCredits}점\n`
  return result
}

export default statement
