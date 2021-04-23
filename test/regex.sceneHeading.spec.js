const { runRegexTests } = require('./utils')
const { sceneHeading } = require('../parser/regex')

runRegexTests({
  regex: sceneHeading,
  groups: {
    scene: undefined,
    pScene: undefined
  },
  cases: [
    {
      input: 'int. living room - day',
      output: { scene: 'int. living room - day' }
    },
    {
      input: 'ext. park - night',
      output: { scene: 'ext. park - night' }
    },
    {
      input: 'i/e. living room - night',
      output: { scene: 'i/e. living room - night' }
    },
    {
      input: 'int./ext. living room - night',
      output: { scene: 'int./ext. living room - night' }
    },
    {
      input: 'est. living room - night',
      output: { scene: 'est. living room - night' }
    },
    {
      input: 'EST. Living Room - Night',
      output: { scene: 'EST. Living Room - Night' }
    },
    {
      input: '.hello world',
      output: { pScene: 'hello world' }
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
