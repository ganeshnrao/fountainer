const { shuffle } = require('lodash')
const ava = require('ava')
const { prioritize, priority } = require('../parser/tokens')

ava('tokens#prioritize', (t) => {
  const types = Object.keys(priority)
  const shuffled = shuffle(types)
  const actual = prioritize(shuffled)
  t.deepEqual(actual, types)
})
