const { each } = require('lodash')
const { prepare } = require('./prepare')
const { definitions, getToken, names, namesByPriority } = require('./tokens')

function parseLine(line, context, next, prevLine) {
  let result = null
  each(next, (name) => {
    result = getToken(definitions[name], line)
    if (result) {
      return false
    }
  })
  if (result) {
    return result
  }
  if (context && context.titlePageField) {
    return {
      name: names.titlePage,
      field: context.titlePageField,
      text: line.trim(),
      context
    }
  }
  if (prevLine) {
    const { name } = prevLine
    const { onNoMatch } = definitions[name]
    if (onNoMatch) {
      onNoMatch(prevLine)
    }
  }
  return { name: names.action, text: line }
}

module.exports = function parse(fountainString, keepNotes = false) {
  const lines = prepare(fountainString, keepNotes)
  const titlePage = {}
  const titlePageLines = []
  let context = {}
  let next = [names.titlePage]
  let prevLine = null
  const result = lines.reduce((acc, { line, lineNumber }) => {
    const parsed = parseLine(line, context, next, prevLine)
    const { name } = parsed
    context = parsed.context
    next = definitions[name] ? definitions[name].next : namesByPriority
    prevLine = { lineNumber, ...parsed }
    if (name === names.titlePage) {
      const { field, text } = parsed
      if (text) {
        titlePage[field] = titlePage[field] || []
        titlePage[field].push(text)
      }
      titlePageLines.push(prevLine)
    } else {
      acc.push(prevLine)
    }
    return acc
  }, [])
  return { titlePage, lines: result, titlePageLines }
}
