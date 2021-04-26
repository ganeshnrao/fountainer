const fs = require('fs-extra')
const { template } = require('lodash')
const sass = require('sass')
const path = require('path')
const logger = require('./logger')
const { minify } = require('html-minifier')

module.exports = function (
  parsed,
  {
    scssPath = path.resolve(__dirname, 'styles.scss'),
    templatePath = path.resolve(__dirname, 'template.ejs')
  } = {}
) {
  logger.verbose(`Rendering SCSS file ${scssPath}`)
  const result = sass.renderSync({ file: scssPath, outputStyle: 'compressed' })
  const css = result.css.toString()
  logger.verbose(`Reading template ${templatePath}`)
  const templateString = fs.readFileSync(templatePath)
  logger.verbose('Compiling HTML')
  const compileHtml = template(templateString)
  const html = compileHtml({ ...parsed, css })
  logger.verbose('Minifying HTML')
  return minify(html, {
    removeComments: true,
    removeEmptyAttributes: true,
    html5: true,
    collapseWhitespace: true
  })
}
