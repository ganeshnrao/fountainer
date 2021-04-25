const { runRegexTests } = require('./utils')
const {
  definitions: { scene }
} = require('../parser/tokens')

const { name } = scene

runRegexTests({
  definition: scene,
  cases: [
    {
      input: 'A RIVER.',
      output: null
    },
    {
      input: 'int. living room - day',
      output: { name, text: 'int. living room - day' }
    },
    {
      input: 'ext. park - night',
      output: { name, text: 'ext. park - night' }
    },
    {
      input: 'i/e. living room - night',
      output: { name, text: 'i/e. living room - night' }
    },
    {
      input: 'int./ext. living room - night',
      output: { name, text: 'int./ext. living room - night' }
    },
    {
      input: 'est. living room - night',
      output: { name, text: 'est. living room - night' }
    },
    {
      input: 'EST. Living Room - Night',
      output: { name, text: 'EST. Living Room - Night' }
    },
    {
      input: '.hello world',
      output: { name, text: 'hello world' }
    },
    {
      input: '  INT. BEDROOM - DAY',
      output: null
    },
    {
      input: ' .HOTEL ROOM - NIGHT',
      output: null
    },
    {
      input: '...this is an action not a scene',
      output: null
    },
    {
      input: 'int living room day',
      output: null
    },
    {
      input: '..hello world',
      output: null
    },
    {
      input: '. hello world',
      output: null
    },
    {
      input: 'int/ext hotel room',
      output: null
    },
    {
      input: 'i/e foobar',
      output: null
    }
  ]
})
