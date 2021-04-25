const { runRegexTests } = require('./utils')
const {
  definitions: { synopsis }
} = require('../parser/tokens')

const { name } = synopsis
runRegexTests({
  definition: synopsis,
  cases: [
    {
      input: '= In this section, the protagonist learns about his weakness',
      output: {
        name,
        text: 'In this section, the protagonist learns about his weakness'
      }
    },
    {
      input: '=He enters the room and sees his brother',
      output: null
    },
    {
      input: '===',
      output: null
    },
    {
      input: '== foo bar',
      output: null
    }
  ]
})
