const { runRegexTests } = require('./utils')
const {
  definitions: { section }
} = require('../parser/tokens')

const { name } = section

runRegexTests({
  definition: section,
  cases: [
    {
      input: '# Chapter 1: Hello world!',
      output: { name, text: 'Chapter 1: Hello world!', level: 1 }
    },
    {
      input: '## section',
      output: { name, text: 'section', level: 2 }
    },
    {
      input: '###> section',
      output: { name, text: '> section', level: 3 }
    },
    {
      input: '!## not a section',
      output: null
    }
  ]
})
