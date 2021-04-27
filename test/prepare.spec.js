const { removeBoneyards, prepare } = require('../parser/prepare')
const ava = require('ava')

const cases = [
  {
    fn: removeBoneyards,
    name:
      'as an intermediate step, replace multiline comments with a "[skip]\\n" string',
    input: `
remove multi line comments /*
this
is 
a comment
*/ here's another /* comment */`,
    expected: `
remove multi line comments [skip]
[skip]
[skip]
[skip]
 here's another `
  },
  {
    fn: prepare,
    name: 'remove boneyards but maintain original line numbers',
    input: `hello world
this paragraph has some **bold** elements
some *italics* elements, some ***bold italics***
some _underlines_ /* some boneyard comments */
/*

example of a 
multiline
boneyard

*//*
more comments
*/ _***and some of everything!***_`,
    expected: [
      {
        line: 'hello world',
        lineNumber: 1
      },
      {
        line: 'this paragraph has some <strong>bold</strong> elements',
        lineNumber: 2
      },
      {
        line:
          'some <em>italics</em> elements, some <em><strong>bold italics</strong></em>',
        lineNumber: 3
      },
      {
        line: 'some <u>underlines</u> ',
        lineNumber: 4
      },
      {
        line: ' <u><em><strong>and some of everything!</strong></em></u>',
        lineNumber: 13
      }
    ]
  },
  {
    fn: prepare,
    name: 'from sample',
    input: `NADISI, is *sobbing* in a cell. She **stares** at the crescent moon from a ***small window***. A _low-pitched_ drum is ***_beating in the background_***. The sound of two men walking towards the cell can be heard. Their footsteps become louder. Her hands begin to tremble. /* She starts shivering and hyperventilating.
    The men peer through the metal door. They see her curled up in a ball in the dark corner, trying to hide. They unlock the door with a large key. The door opens with a long squeal. They enter the cell with cold and distant faces and grab her. */`,
    expected: [
      {
        line:
          'NADISI, is <em>sobbing</em> in a cell. She <strong>stares</strong> at the crescent moon from a <em><strong>small window</strong></em>. A <u>low-pitched</u> drum is <em><strong><u>beating in the background</u></strong></em>. The sound of two men walking towards the cell can be heard. Their footsteps become louder. Her hands begin to tremble. ',
        lineNumber: 1
      },
      {
        line: '',
        lineNumber: 2
      }
    ]
  },
  {
    fn: (input) => prepare(input, 'notes'),
    name: 'keep notes',
    input: 'hello world [[this note will be kept]] some more [[text]]',
    expected: [
      {
        line:
          'hello world <span class="notes">this note will be kept</span> some more <span class="notes">text</span>',
        lineNumber: 1
      }
    ]
  },
  {
    fn: (input) => prepare(input, 'notes'),
    name: 'keep multiline notes',
    input: `hello world [[this note 
will be kept]] some more text`,
    expected: [
      {
        line: 'hello world <span class="notes">this note </span>',
        lineNumber: 1
      },
      {
        line: '<span class="notes">will be kept</span> some more text',
        lineNumber: 2
      }
    ]
  },
  {
    fn: (input) => prepare(input, 'notes'),
    name: 'keep whole line notes',
    input: `[[hello world this note 
will be kept some more text]]`,
    expected: [
      {
        line: '<span class="notes">hello world this note </span>',
        lineNumber: 1
      },
      {
        line: '<span class="notes">will be kept some more text</span>',
        lineNumber: 2
      }
    ]
  },
  {
    fn: prepare,
    name: 'multiline styles',
    input: `this **bold string
spans multiple lines** but it won't work`,
    expected: [
      {
        line: 'this <strong>bold string</strong>',
        lineNumber: 1
      },
      {
        line: "<strong>spans multiple lines</strong> but it won't work",
        lineNumber: 2
      }
    ]
  },
  {
    fn: prepare,
    name: 'keep escaped characters',
    input: 'hello \\_\\*world\\*\\_ some more text',
    expected: [{ lineNumber: 1, line: 'hello _*world*_ some more text' }]
  }
]

cases.forEach(({ fn, name, input, expected }) => {
  ava(`#${fn.name}: ${name}`, (t) => t.deepEqual(fn(input), expected))
})
