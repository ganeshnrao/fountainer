const { runRegexTests } = require('./utils')
const { section } = require('../parser/regex')

runRegexTests({
  regex: section,
  groups: {
    section: undefined,
    depth: undefined
  },
  cases: [
    {
      input: '# Chapter 1: Hello world!',
      output: { section: 'Chapter 1: Hello world!', depth: '#' }
    },
    {
      input: '## section',
      output: { section: 'section', depth: '##' }
    },
    {
      input: '#> section',
      output: { section: '> section', depth: '#' }
    },
    {
      input: '!## not a section',
      output: null
    }
  ]
})
