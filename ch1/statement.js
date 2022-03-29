// v3

const statement = (invoice, plays) => {
  const enrichPerformance = (aPerformance) => Object.assign({}, aPerformance)

  const statementData = {
    customer: invoice.customer,
    performances: invoice.performances.map(enrichPerformance),
  }
  return renderPainText(statementData, plays)
}

const renderPainText = (data, plays) => {
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

  const getTotalVolumeCredits = () => {
    let result = 0 // 적립포인트
    for (const aPerformance of data.performances) {
      result += volumeCreditsFor(aPerformance)
    }
    return result
  }

  const getTotalAmount = () => {
    let result = 0
    for (const aPerformance of data.performances) {
      result += amountFor(aPerformance)
    }
    return result
  }

  let result = `청구 내역 (고객명: ${data.customer})\n`
  for (const aPerformance of data.performances) {
    result += `  ${playFor(aPerformance).name}: ${usd(
      amountFor(aPerformance)
    )} (${aPerformance.audience}석)\n`
  }

  result += `총액: ${usd(getTotalAmount())}\n`
  result += `적립 포인트: ${getTotalVolumeCredits()}점\n`
  return result
}

export default statement
