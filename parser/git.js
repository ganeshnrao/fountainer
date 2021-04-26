const { compact } = require('lodash')
const { exec } = require('child_process')
const { names } = require('./tokens')

function run(cmd) {
  return new Promise((resolve, reject) =>
    exec(cmd, (error, stdout, stderr) => {
      const fail = error || stderr.trim()
      return fail ? reject(fail) : resolve(stdout.trim())
    })
  )
}

async function getGitHash() {
  try {
    const hash = await run('git rev-parse HEAD | cut -c 1-8')
    return hash
  } catch (error) {
    console.debug('Failed to read git hash')
    return ''
  }
}

async function getGitCommitCounts(filePath) {
  try {
    const nCommits = await run(`git log --oneline ${filePath} | wc -l`)
    return nCommits
  } catch (error) {
    console.debug('Failed to read git commit count')
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
