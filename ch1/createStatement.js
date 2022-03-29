const createStatement = (invoice, plays) => {
  const enrichPerformance = (aPerformance) => {
    const result = Object.assign({}, aPerformance)
    result.play = playFor(result)
    result.amount = amountFor(result)
    result.volumeCredits = volumeCreditsFor(result)
    return result
  }

  const playFor = (aPerformance) => {
    return plays[aPerformance.playID]
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

  const volumeCreditsFor = (aPerformance) => {
    let result = 0
    result += Math.max(aPerformance.audience - 30, 0)
    if (aPerformance.play.type === 'comedy') {
      result += Math.floor(aPerformance.audience / 5)
    }
    return result
  }

  const getTotalVolumeCredits = (data) => {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0)
  }

  const getTotalAmount = (data) => {
    return data.performances.reduce((total, p) => total + p.amount, 0)
  }

  const result = {}
  result.customer = invoice.customer
  result.performances = invoice.performances.map(enrichPerformance)
  result.totalAmount = getTotalAmount(result)
  result.totalVolumeCredits = getTotalVolumeCredits(result)

  return result
}

export default createStatement
