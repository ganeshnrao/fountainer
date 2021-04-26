const { compact } = require('lodash')
const { exec } = require('child_process')
const path = require('path')
const { names } = require('./tokens')
const logger = require('./logger')

function run(cmd) {
  logger.verbose(`> ${cmd}`)
  return new Promise((resolve, reject) =>
    exec(cmd, (error, stdout, stderr) => {
      const fail = error || stderr.trim()
      logger.verbose(`  ${fail || stdout.trim()}`)
      return fail ? reject(fail) : resolve(stdout.trim())
    })
  )
}

async function getGitHash() {
  try {
    const hash = await run('git rev-parse HEAD | cut -c 1-8')
    return hash
  } catch (error) {
    logger.verbose('Failed to read git hash', error)
    return ''
  }
}

async function getGitCommitCounts(filePath) {
  try {
    const dir = path.dirname(filePath)
    const nCommits = await run(
      `cd ${dir} && git log --oneline ${filePath} | wc -l`
    )
    return nCommits
  } catch (error) {
    logger.verbose('Failed to read git commit count', error)
    return ''
  }
}

module.exports = async function getGitString(inputFile) {
  const hash = await getGitHash()
  const hashString = hash ? ` (${hash})` : ''
  const nCommits = await getGitCommitCounts(inputFile)
  const draftNumber = nCommits ? `Draft #${nCommits}` : ''
  const compileDate = new Date().toISOString().slice(0, 10)
  const git = compact([draftNumber, `${compileDate}${hashString}`])
  const titleLine = {
    lineNumber: '',
    name: names.titlePage,
    field: 'git',
    text: git.join(' ')
  }
  return { git, titleLine }
}
