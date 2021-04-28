#!/usr/bin/env node

const { debounce, forOwn, noop } = require('lodash')
const serve = require('serve-handler')
const fs = require('fs-extra')
const path = require('path')
const { createServer } = require('http')
const yargs = require('yargs')
const { parse, toHtml } = require('./parser')
const { displayName, description } = require('./package.json')
const logger = require('./parser/logger')

const options = {
  inputFile: {
    alias: 'i',
    description: 'complete path to Fountain file',
    type: 'string',
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
  },
  showTemplate: {
    description: 'echo the default EJS template',
    type: 'boolean',
    default: false
  },
  showScss: {
    description: 'echo the default SCSS file',
    type: 'boolean',
    default: false
  },
  watch: {
    alias: 'w',
    description: 'will watch the inputFile for changes',
    type: 'boolean',
    default: false
  },
  port: {
    description: 'port on which to serve the compiled file when --watch is set',
    type: 'number',
    default: 9000
  }
}
const args = yargs
  .usage(`\n${displayName}\n  ${description}`)
  .options(options)
  .showHelpOnFail(true)
  .help()
  .check((args) => {
    if (args.showScss || args.showTemplate) {
      return args
    }
    if (!args.inputFile || !args.outputFile) {
      throw new Error(
        'Invalid arguments, --inputFile and --outputFile must be provided'
      )
    }
    args.keepNotes = args.keepNotes ? 'inline-notes' : null
    return args
  }).argv

logger.verbose = args.verbose ? console.debug : noop

async function compile() {
  try {
    if (args.showTemplate) {
      console.log(fs.readFileSync(args.templatePath, 'utf-8').toString())
      return
    }
    if (args.showScss) {
      console.log(fs.readFileSync(args.stylesPath, 'utf-8').toString())
      return
    }
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
    logger.log(`Created ${outputFile} (${duration}ms)`)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

const debouncedCompile = debounce(compile, 1000)

function main() {
  compile()
  if (args.watch) {
    const servePath = path.dirname(args.outputFile)
    const config = { public: servePath, renderSingle: true }
    const server = createServer((request, response) =>
      serve(request, response, config)
    )
    server.listen(args.port, () => {
      const cwd = process.cwd()
      const inputFileRelative = path.relative(cwd, args.inputFile)
      const servePathRelative = path.relative(cwd, servePath)
      console.log(`${displayName} is watching:`)
      console.log(`  * Input file ${inputFileRelative}`)
      console.log(`  * Serving ${servePathRelative}/`)
      console.log(`  * Server http://localhost:${args.port}`)
      console.log()
    })
    fs.watch(args.inputFile, debouncedCompile)
  }
}

main()
