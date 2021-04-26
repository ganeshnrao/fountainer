const fs = require('fs-extra')
const { template } = require('lodash')
const sass = require('sass')
const path = require('path')

module.exports = function (
  { titlePage, lines, titlePageLines },
  {
    includeTitles = false,
    scssPath = path.resolve(__dirname, 'styles.scss'),
    templatePath = path.resolve(__dirname, 'template.ejs')
  } = {}
) {
  const css = sass.renderSync({ file: scssPath }).css.toString()
  const templateString = fs.readFileSync(templatePath)
  const compileHtml = template(templateString)
  return compileHtml({
    titlePage,
    lines: includeTitles ? [...titlePageLines, ...lines] : lines,
    css
  })
}
