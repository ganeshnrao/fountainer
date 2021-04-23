const { runRegexTests } = require('./utils')
const { character } = require('../parser/regex')

runRegexTests({
  regex: character,
  groups: {
    name: undefined,
    paren: undefined,
    dual: undefined,
    pName: undefined
  },
  cases: [
    {
      input: 'FOOBAR  ',
      output: { name: 'FOOBAR' }
    },
    {
      input: 'FOOBAR (O.S) (On the phone)   ',
      output: { name: 'FOOBAR', paren: '(O.S) (On the phone)' }
    },
    {
      input: 'FOO(O.S)',
      output: { name: 'FOO', paren: '(O.S)' }
    },
    {
      input: '   FOO BAR (on the phone) ^',
      output: { name: 'FOO BAR', paren: '(on the phone)', dual: '^' }
    },
    {
      input: 'foo bar (on the phone)',
      output: null
    },
    {
      input: '@FooBar ^^',
      output: null
    },
    {
      input: '@foo bar, hello world (lowercase name) ^',
      output: {
        pName: 'foo bar, hello world',
        paren: '(lowercase name)',
        dual: '^'
      }
    },
    {
      input: '   @Mr. Foobar $lastName #3 (lowercase name)',
      output: {
        pName: 'Mr. Foobar $lastName #3',
        paren: '(lowercase name)'
      }
    }
  ]
})
