const { forOwn, noop } = require('lodash')
const fs = require('fs-extra')
const path = require('path')
const yargs = require('yargs')
const { parse, toHtml } = require('./parser')
const { displayName, description } = require('./package.json')
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
    description: 'render notes from the fountain file',
    type: 'boolean',
    default: false
  },
  gitLine: {
    alias: 'g',
    description:
      'render the draft number by counting the number of commits on the fountain file. This will only work if the file is part of a Git repository',
    type: 'boolean',
    default: false
  },
  lineNumbers: {
    alias: 'l',
    description:
      'render line numbers corresponding to lines in the fountain file',
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
    description: 'render the inferred class on each line',
    type: 'boolean',
    default: false
  },
  verbose: {
    alias: 'v',
    description: 'print verbose logging to console',
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
  },
  stylesPath: {
    alias: 's',
    description: 'path to a custom CSS or SCSS file',
    default: path.resolve(__dirname, 'parser/styles.scss'),
    coerce(scssPath) {
      return path.resolve(scssPath)
    }
  },
  templatePath: {
    alias: 'p',
    description: 'path to a custom template, can be an EJS or HTML file',
    default: path.resolve(__dirname, 'parser/template.ejs'),
    coerce(template) {
      return path.resolve(template)
    }
  }
}
const args = yargs
  .usage(`\n${displayName}\n  ${description}`)
  .options(options)
  .showHelpOnFail(true)
  .help().argv

logger.verbose = args.verbose ? console.debug : noop

async function main() {
  const startMs = Date.now()
  logger.verbose()
  logger.verbose(`${displayName} arguments:`)
  forOwn(options, (value, key) =>
    logger.verbose(`   --${key.padEnd(12)} = ${args[key]}`)
  )
  const { outputFile } = args
  const parsed = await parse(args)
  const html = toHtml(parsed, args)
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
