const ava = require('ava')
const { getToken } = require('../parser/tokens')

function runRegexTests({ definition, cases }) {
  cases.forEach(({ input, output }) => {
    ava(input, (t) => {
      const actual = getToken(definition, input)
      t.deepEqual(actual, output)
    })
  })
}

module.exports = {
  runRegexTests
}
