const { runRegexTests } = require('./utils')
const { character } = require('../parser/regex')

runRegexTests({
  regex: character,
  groups: {
    name: undefined,
    paren: undefined,
    dual: undefined,
    powerName: undefined
  },
  cases: [
    {
      input: 'FOOBAR  ',
      output: { name: 'FOOBAR' }
    },
    {
      input: 'FOOBAR (O.S) (On the phone) ',
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
      input: '@foo bar (lowercase name)',
      output: { powerName: 'foo bar', paren: '(lowercase name)' }
    },
    {
      input: '   @Mr. Foobar $lastName #3 (lowercase name)',
      output: {
        powerName: 'Mr. Foobar $lastName #3',
        paren: '(lowercase name)'
      }
    }
  ]
})
