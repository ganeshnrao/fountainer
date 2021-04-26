const { forOwn, noop } = require('lodash')
const fs = require('fs-extra')
const path = require('path')
const yargs = require('yargs')
const { parse, toHtml } = require('./parser')
const { description } = require('./package.json')
const logger = require('./parser/logger')

const options = {
  inputFile: {
    alias: 'i',
    description: 'complete path to Fountain file',
    type: 'string',
    required: true,
    coerce(inputFile) {
      return path.resolve(inputFile)
    }
  },
  keepNotes: {
    alias: 'n',
    description: 'print notes from the fountain file',
    type: 'boolean',
    default: false
  },
  gitLine: {
    alias: 'g',
    description:
      'print the draft number by counting the number of commits on the fountain file. Note that this will only work if your fountain file is part of a Git repository',
    type: 'boolean',
    default: false
  },
  lineNumbers: {
    alias: 'l',
    description:
      'print line numbers corresponding to lines in the fountain file',
    choices: ['none', 'all', 'non-empty'],
    type: 'string',
    default: 'none'
  },
  titlePage: {
    alias: 't',
    description: 'render a title page',
    type: 'boolean',
    default: true
  },
  debug: {
    alias: 'd',
    description: 'print inferred class on each line',
    type: 'boolean',
    default: false
  },
  verbose: {
    alias: 'v',
    description: 'print verbose logging',
    type: 'boolean',
    default: false
  },
  outputFile: {
    alias: 'o',
    required: true,
    type: 'string',
    description: 'complete path to output HTML file',
    coerce(outputFile) {
      return path.resolve(outputFile)
    }
  }
}
const args = yargs
  .usage(`\nFountainhead:\n  ${description}`)
  .options(options)
  .showHelpOnFail(true)
  .help().argv

logger.verbose = args.verbose ? console.debug : noop

async function main() {
  const startMs = Date.now()
  logger.verbose()
  logger.verbose('Fountainhead')
  forOwn(options, (value, key) =>
    logger.verbose(`   --${key.padEnd(12)} = ${args[key]}`)
  )
  const { outputFile } = args
  const parsed = await parse(args)
  const html = toHtml(parsed)
  const outputDir = path.dirname(outputFile)
  await fs.ensureDir(outputDir)
  await fs.writeFile(outputFile, html)
  const duration = Date.now() - startMs
  logger.verbose()
  logger.verbose(`Created ${outputFile} (${duration}ms)`)
}

main().catch((error) => {
  logger.error(error)
  process.exit(1)
})
