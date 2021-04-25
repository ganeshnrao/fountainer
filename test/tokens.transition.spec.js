const { runRegexTests } = require('./utils')
const {
  definitions: { transition }
} = require('../parser/tokens')

const { name } = transition

runRegexTests({
  definition: transition,
  cases: [
    {
      input: 'FADE TO BLACK:',
      output: { name, text: 'FADE TO BLACK:' }
    },
    {
      input: 'CUT TO:',
      output: { name, text: 'CUT TO:' }
    },
    {
      input: '    SMASH CUT TO:  ',
      output: { name, text: 'SMASH CUT TO:  ' }
    },
    {
      input: '> FADE IN',
      output: { name, text: 'FADE IN' }
    },
    {
      input: '>    FADE TO WHITE',
      output: { name, text: 'FADE TO WHITE' }
    },
    {
      input: 'HELLO WORLD',
      output: null
    },
    {
      input: '  > CENTERED <',
      output: null
    },
    {
      input: '  > foo bar  ',
      output: { name, text: 'foo bar  ' }
    }
  ]
})
