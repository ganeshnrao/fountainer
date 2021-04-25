const fs = require('fs-extra')
const path = require('path')
const { template } = require('lodash')
const { render: renderSass } = require('node-sass')
const parser = require('./parser')

const inputPath = path.resolve(__dirname, 'sample.fountain')
const jsonPath = path.resolve(__dirname, 'ignore/result.json')
const htmlPath = path.resolve(__dirname, 'dist/index.html')
const scssPath = path.resolve(__dirname, 'styles.scss')
const templatePath = path.resolve(__dirname, 'template.ejs')

function getCss() {
  return new Promise((resolve, reject) => {
    renderSass(
      { file: scssPath, outputStyle: 'compressed' },
      (error, result) => {
        return error ? reject(error) : resolve(result.css.toString())
      }
    )
  })
}

async function main() {
  const outputDir = path.dirname(htmlPath)
  fs.ensureDirSync(outputDir)
  const templateString = fs.readFileSync(templatePath, 'utf-8')
  const inputString = fs.readFileSync(inputPath, 'utf-8')
  const css = await getCss()
  const lines = parser(inputString)
  const html = template(templateString)({ lines, css })
  fs.writeFileSync(jsonPath, JSON.stringify(lines, null, '  '))
  fs.writeFileSync(htmlPath, html)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
