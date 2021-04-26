const { runRegexTests } = require('./utils')
const {
  definitions: { centered }
} = require('../parser/tokens')

const { name } = centered

runRegexTests({
  definition: centered,
  cases: [
    {
      input: '> Begin montage <:',
      output: null
    },
    {
      input: '   > Begin montage <  ',
      output: { name, text: 'Begin montage' }
    },
    {
      input: '   >Begin montage<',
      output: { name, text: 'Begin montage' }
    },
    {
      input: '> flash back to when he was a young man <',
      output: { name, text: 'flash back to when he was a young man' }
    },
    {
      input: '>>> hello world <<<',
      output: { name, text: 'hello world' }
    },
    {
      input: '>>> hello world <',
      output: { name, text: 'hello world' }
    },
    {
      input: '> <u>hello world</u> <',
      output: { name, text: '<u>hello world</u>' }
    }
  ]
})
