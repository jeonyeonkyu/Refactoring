// v3

const statement = (invoice, plays) => {
  const enrichPerformance = (aPerformance) => {
    const result = Object.assign({}, aPerformance)
    result.play = playFor(result)
    result.amount = amountFor(result)
    return result
  }

  const playFor = (aPerformance) => {
    return plays[aPerformance.playID]
  }

  const statementData = {
    customer: invoice.customer,
    performances: invoice.performances.map(enrichPerformance),
  }
  return renderPainText(statementData, plays)
}

const renderPainText = (data) => {
  const volumeCreditsFor = (aPerformance) => {
    let result = 0
    result += Math.max(aPerformance.audience - 30, 0)
    if (aPerformance.play.type === 'comedy') {
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
      result += aPerformance.amount
    }
    return result
  }

  let result = `청구 내역 (고객명: ${data.customer})\n`
  for (const aPerformance of data.performances) {
    result += `  ${aPerformance.play.name}: ${usd(aPerformance.amount)} (${
      aPerformance.audience
    }석)\n`
  }

  result += `총액: ${usd(getTotalAmount())}\n`
  result += `적립 포인트: ${getTotalVolumeCredits()}점\n`
  return result
}

const amountFor = (aPerformance) => {
  let result = 0
  switch (aPerformance.play.type) {
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
      throw new Error(`알 수 없는 장르: ${aPerformance.play.type}`)
  }
  return result
}
export default statement
