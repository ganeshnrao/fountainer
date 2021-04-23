const { runRegexTests } = require('./utils')
const { notes } = require('../parser/regex')

runRegexTests({
  regex: notes,
  cases: [
    {
      input:
        'Some statement with [[multiple instances of]] notes [[in between, on the same line]]',
      output: ['[[multiple instances of]]', '[[in between, on the same line]]']
    },
    {
      input: 'line without any notes',
      output: null
    },
    {
      input: 'line without [notes]',
      output: null
    },
    {
      input: 'line with [[a note started',
      output: ['[[a note started']
    },
    {
      input: 'a note ended here]] then regular action text',
      output: ['a note ended here]]']
    },
    {
      input:
        'a note ended]] on this line [[second note]] some more text [[third note]]',
      output: ['a note ended]]', '[[second note]]', '[[third note]]']
    }
  ]
})
