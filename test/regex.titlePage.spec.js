const { runRegexTests } = require('./utils')
const { titlePage } = require('../parser/regex')

runRegexTests({
  regex: titlePage,
  groups: {
    field: undefined,
    value: undefined
  },
  cases: [
    {
      input: 'title: the god father',
      output: { field: 'title', value: 'the god father' }
    },
    {
      input: 'some unknown field: the god father',
      output: null
    },
    {
      input: 'hello world:',
      output: null
    },
    {
      input: 'Draft date: 2020-02-03',
      output: { field: 'Draft date', value: '2020-02-03' }
    },
    {
      input: 'Author: Ganesh Rao',
      output: { field: 'Author', value: 'Ganesh Rao' }
    },
    {
      input: 'Authors: Foo Bar, Fiz Biz',
      output: { field: 'Authors', value: 'Foo Bar, Fiz Biz' }
    },
    {
      input: 'copyright: Ganesh Rao, (c) 2021',
      output: { field: 'copyright', value: 'Ganesh Rao, (c) 2021' }
    }
  ]
})
