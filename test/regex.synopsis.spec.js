const { runRegexTests } = require('./utils')
const { synopsis } = require('../parser/regex')

runRegexTests({
  regex: synopsis,
  groups: {
    synopsis: undefined
  },
  cases: [
    {
      input: '= In this section, the protagonist learns about his weakness',
      output: {
        synopsis: 'In this section, the protagonist learns about his weakness'
      }
    },
    {
      input: 'He enters the room and sees his brother',
      output: null
    }
  ]
})
