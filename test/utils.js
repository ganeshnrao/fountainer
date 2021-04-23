const ava = require('ava')

function runRegexTests({ regex, cases, groups }) {
  cases.forEach(({ input, output }) => {
    ava(input, (t) => {
      const matches = input.match(regex)
      if (groups) {
        t.deepEqual(
          matches ? matches.groups : matches,
          output ? { ...groups, ...output } : output
        )
      } else {
        t.deepEqual(matches[0], output)
      }
    })
  })
}

module.exports = {
  runRegexTests
}
