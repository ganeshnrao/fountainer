const { runRegexTests } = require('./utils')
const {
  definitions: { paren }
} = require('../parser/tokens')

const { name } = paren

runRegexTests({
  definition: paren,
  cases: [
    {
      input: '(foo bar)',
      output: { name, text: '(foo bar)' }
    },
    {
      input: '    (hello world) (O.S)',
      output: { name, text: '(hello world) (O.S)' }
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
