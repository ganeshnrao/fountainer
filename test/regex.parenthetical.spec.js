const { runRegexTests } = require('./utils')
const { parenthetical } = require('../parser/regex')

runRegexTests({
  regex: parenthetical,
  groups: {
    paren: undefined
  },
  cases: [
    {
      input: '(foo bar)',
      output: { paren: '(foo bar)' }
    },
    {
      input: '    (hello world) (O.S)',
      output: { paren: '(hello world) (O.S)' }
    },
    {
      input: '(beat',
      output: null
    },
    {
      input: 'hello world',
      output: null
    }
  ]
})
