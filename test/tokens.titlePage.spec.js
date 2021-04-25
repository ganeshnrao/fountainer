const { runRegexTests } = require('./utils')
const {
  definitions: { titlePage }
} = require('../parser/tokens')

const { name } = titlePage

runRegexTests({
  definition: titlePage,
  cases: [
    {
      input: 'title: the god father',
      output: {
        name,
        field: 'title',
        text: 'the god father',
        context: { titlePageField: 'title' }
      }
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
      output: {
        name,
        field: 'date',
        text: '2020-02-03',
        context: { titlePageField: 'date' }
      }
    },
    {
      input: 'Author: Ganesh Rao',
      output: {
        name,
        field: 'authors',
        text: 'Ganesh Rao',
        context: { titlePageField: 'authors' }
      }
    },
    {
      input: 'Authors: Foo Bar, Fiz Biz',
      output: {
        name,
        field: 'authors',
        text: 'Foo Bar, Fiz Biz',
        context: { titlePageField: 'authors' }
      }
    },
    {
      input: 'copyright: Ganesh Rao, (c) 2021',
      output: {
        name,
        field: 'copyright',
        text: 'Ganesh Rao, (c) 2021',
        context: { titlePageField: 'copyright' }
      }
    }
  ]
})
