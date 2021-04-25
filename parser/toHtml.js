const fs = require('fs-extra')
const { template } = require('lodash')
const { render: renderSass } = require('node-sass')
const path = require('path')

function getCss(scssPath) {
  return new Promise((resolve, reject) => {
    renderSass(
      { file: scssPath, outputStyle: 'compressed' },
      (error, result) => {
        return error ? reject(error) : resolve(result.css.toString())
      }
    )
  })
}

module.exports = async function (
  { titlePage, lines },
  {
    scssPath = path.resolve(__dirname, 'styles.scss'),
    templatePath = path.resolve(__dirname, 'template.ejs')
  } = {}
) {
  const css = await getCss(scssPath)
  const templateString = await fs.readFile(templatePath)
  const compileHtml = template(templateString)
  return compileHtml({ titlePage, lines, css })
}
