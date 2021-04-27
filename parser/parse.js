const fs = require('fs-extra')
const { each } = require('lodash')
const { prepare } = require('./prepare')
const { definitions, getToken, names, namesByPriority } = require('./tokens')
const getGitString = require('./git')
const logger = require('./logger')

const defaultChecks = [names.pageBreak]

function parseLine(line, context, next, prevLine) {
  let result = null
  each([...next, ...defaultChecks], (name) => {
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

module.exports = async function parse({
  inputFile,
  inputString,
  keepNotes: notesClass = 'inline-notes',
  gitLine: renderGitLine = false
}) {
  if (!inputFile && !inputString) {
    throw new Error('inputFile or inputString must be provided')
  }
  logger.verbose(`Reading ${inputFile}`)
  const fountainString =
    inputString || (await fs.readFile(inputFile, 'utf-8')).toString()
  logger.verbose('Preprocessing fountain file')
  const lines = prepare(fountainString, notesClass)
  const titlePage = {}
  const titlePageLines = []
  if (renderGitLine) {
    const { titleLine, git } = await getGitString(inputFile)
    titlePage.git = git
    titlePageLines.push(titleLine)
  }
  let context = {}
  let next = [names.titlePage]
  let prevLine = null
  logger.verbose('Parsing lines')
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
  return {
    titlePage,
    lines: result
  }
}
