const { runRegexTests } = require('./utils')
const {
  definitions: { notes }
} = require('../parser/tokens')

const { name } = notes

runRegexTests({
  definition: notes,
  cases: [
    {
      input:
        'Some statement with [[multiple instances of]] notes [[in between, on the same line]]',
      output: {
        name,
        text: 'Some statement with  notes ',
        notes: ['multiple instances of', 'in between, on the same line'],
        context: { isInsideNote: false }
      }
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
      output: {
        name,
        text: 'line with ',
        notes: ['a note started'],
        context: { isInsideNote: true }
      }
    },
    {
      input: 'a note ended here]] then regular action text',
      output: {
        name,
        text: ' then regular action text',
        notes: ['a note ended here'],
        context: { isInsideNote: false }
      }
    },
    {
      input:
        'a note ended]] on this line [[second note]] some more text [[third note]]',
      output: {
        name,
        text: ' on this line  some more text ',
        notes: ['a note ended', 'second note', 'third note'],
        context: { isInsideNote: false }
      }
    }
  ]
})
