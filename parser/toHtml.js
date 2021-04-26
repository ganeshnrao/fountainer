const fs = require('fs-extra')
const { template } = require('lodash')
const sass = require('sass')
const path = require('path')

module.exports = function (
  parsed,
  {
    scssPath = path.resolve(__dirname, 'styles.scss'),
    templatePath = path.resolve(__dirname, 'template.ejs')
  } = {}
) {
  const css = sass.renderSync({ file: scssPath }).css.toString()
  const templateString = fs.readFileSync(templatePath)
  const compileHtml = template(templateString)
  return compileHtml({ ...parsed, css })
}
