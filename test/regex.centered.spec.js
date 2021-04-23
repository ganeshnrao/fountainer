const { runRegexTests } = require('./utils')
const { centered } = require('../parser/regex')

runRegexTests({
  regex: centered,
  groups: {
    centered: undefined
  },
  cases: [
    {
      input: '> Begin montage <:',
      output: null
    },
    {
      input: '   > Begin montage <  ',
      output: { centered: 'Begin montage' }
    },
    {
      input: '   >Begin montage<',
      output: { centered: 'Begin montage' }
    },
    {
      input: '> flash back to when he was a young man <',
      output: { centered: 'flash back to when he was a young man' }
    },
    {
      input: '>>> hello world <<<',
      output: { centered: 'hello world' }
    },
    {
      input: '>>> hello world <',
      output: { centered: 'hello world' }
    }
  ]
})
