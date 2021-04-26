const fs = require('fs-extra')
const { template } = require('lodash')
const sass = require('sass')
const path = require('path')
const logger = require('./logger')

module.exports = function (
  parsed,
  {
    scssPath = path.resolve(__dirname, 'styles.scss'),
    templatePath = path.resolve(__dirname, 'template.ejs')
  } = {}
) {
  logger.verbose(`Rendering SCSS file ${scssPath}`)
  const result = sass.renderSync({ file: scssPath })
  const css = result.css.toString()
  logger.verbose(`Reading template ${templatePath}`)
  const templateString = fs.readFileSync(templatePath)
  logger.verbose('Compiling HTML')
  const compileHtml = template(templateString)
  return compileHtml({ ...parsed, css })
}
