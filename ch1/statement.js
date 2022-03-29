// v3

import createStatement from './createStatement.js'
import renderPlainText from './renderPlainText.js'

const statement = (invoice, plays) => {
  return renderPlainText(createStatement(invoice, plays))
}

export default statement
