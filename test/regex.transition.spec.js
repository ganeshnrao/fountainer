const { runRegexTests } = require('./utils')
const { transition } = require('../parser/regex')

runRegexTests({
  regex: transition,
  groups: {
    transition: undefined,
    pTransition: undefined
  },
  cases: [
    {
      input: 'FADE TO BLACK:',
      output: { transition: 'FADE TO BLACK:' }
    },
    {
      input: 'CUT TO:',
      output: { transition: 'CUT TO:' }
    },
    {
      input: '    SMASH CUT TO:  ',
      output: { transition: 'SMASH CUT TO:  ' }
    },
    {
      input: '> FADE IN',
      output: { pTransition: 'FADE IN' }
    },
    {
      input: '>    FADE TO WHITE',
      output: { pTransition: 'FADE TO WHITE' }
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
      output: { pTransition: 'foo bar  ' }
    }
  ]
})
