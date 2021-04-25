const _ = require('lodash')
const prepare = require('./prepare')
const { definitions, getToken, names, namesByPriority } = require('./tokens')

let nTests = 0

function parseLine(line, context, next, prevLine) {
  let result = null
  const tested = []
  _.each(next, (name) => {
    const definition = definitions[name]
    result = getToken(definition, line)
    nTests += 1
    tested.push(definition.name)
    if (result) {
      return false
    }
  })
  const tests = tested.join()
  if (result) {
    return { ...result, tests }
  }
  if (context && context.titlePageField) {
    return {
      name: names.titlePage,
      field: context.titlePageField,
      text: line.trim(),
      context,
      tests
    }
  }
  if (prevLine) {
    const { name } = prevLine
    const { onNoMatch } = definitions[name]
    if (onNoMatch) {
      onNoMatch(prevLine)
    }
  }
  return { name: names.action, text: line, tests }
}

module.exports = function parse(fountainString) {
  const startMs = Date.now()
  const lines = prepare(fountainString)
  let context = {}
  let next = [names.titlePage]
  let prevLine = null
  const result = _.map(lines, ({ line, lineNumber }) => {
    const parsed = parseLine(line, context, next, prevLine)
    const { name } = parsed
    context = parsed.context
    next = definitions[name] ? definitions[name].next : namesByPriority
    prevLine = { lineNumber, ...parsed }
    return prevLine
  })
  console.log(`nTests   · ${nTests}`)
  console.log(`duration · ${Date.now() - startMs}ms`)
  return result
}
