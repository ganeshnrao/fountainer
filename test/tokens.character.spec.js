const { runRegexTests } = require('./utils')
const {
  definitions: { character }
} = require('../parser/tokens')

const { name } = character

runRegexTests({
  definition: character,
  cases: [
    {
      input: 'FOOBAR  ',
      output: {
        name,
        text: 'FOOBAR',
        dual: false
      }
    },
    {
      input: 'FOOBAR (O.S) (On the phone)   ',
      output: {
        name,
        text: 'FOOBAR (O.S) (On the phone)',
        dual: false
      }
    },
    {
      input: 'FOO(O.S)',
      output: {
        name,
        text: 'FOO (O.S)',
        dual: false
      }
    },
    {
      input: '   FOO BAR (on the phone) ^',
      output: {
        name,
        text: 'FOO BAR (on the phone)',
        dual: true
      }
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
        name,
        text: 'foo bar, hello world (lowercase name)',
        dual: true
      }
    },
    {
      input: '   @Mr. Foobar $lastName #3 (lowercase name)',
      output: {
        name,
        text: 'Mr. Foobar $lastName #3 (lowercase name)',
        dual: false
      }
    }
  ]
})
