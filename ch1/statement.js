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

  const volumeCreditsFor = (aPerformance) => {
    let result = 0
    result += Math.max(aPerformance.audience - 30, 0)
    if (playFor(aPerformance).type === 'comedy') {
      result += Math.floor(aPerformance.audience / 5)
    }
    return result
  }

  const usd = (aNumber) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(aNumber / 100)
  }

  let result = `청구 내역 (고객명: ${invoice.customer})\n`
  let totalAmount = 0 // 총액
  for (const aPerformance of invoice.performances) {
    result += `  ${playFor(aPerformance).name}: ${usd(
      amountFor(aPerformance)
    )} (${aPerformance.audience}석)\n`
    totalAmount += amountFor(aPerformance)
  }

  let volumeCredits = 0 // 적립포인트
  for (const aPerformance of invoice.performances) {
    volumeCredits += volumeCreditsFor(aPerformance)
  }

  result += `총액: ${usd(totalAmount)}\n`
  result += `적립 포인트: ${volumeCredits}점\n`
  return result
}

export default statement
