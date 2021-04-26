const fs = require('fs-extra')
const { template } = require('lodash')
const sass = require('sass')
const logger = require('./logger')
const { minify } = require('html-minifier')

function compileCss(scssPath) {
  if (scssPath) {
    logger.verbose(`Compiling styles from ${scssPath}`)
    const result = sass.renderSync({
      file: scssPath,
      outputStyle: 'compressed'
    })
    return result.css.toString()
  }
  return ''
}

module.exports = function (parsed, options) {
  const { stylesPath, templatePath } = options
  const css = compileCss(stylesPath)
  logger.verbose(`Reading template ${templatePath}`)
  const templateString = fs.readFileSync(templatePath)
  logger.verbose('Compiling HTML')
  const compileHtml = template(templateString)
  const html = compileHtml({ ...parsed, css, options })
  logger.verbose('Minifying HTML')
  return minify(html, {
    removeComments: true,
    removeEmptyAttributes: true,
    html5: true,
    collapseWhitespace: true
  })
}
