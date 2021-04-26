const fs = require('fs-extra')
const path = require('path')
const { parse, toHtml } = require('./parser')

const samplePath = path.resolve(__dirname, 'sample.theBigFish.fountain')
const htmlPath = path.resolve(__dirname, 'dist/index.html')
const jsonPath = path.resolve(__dirname, 'dist/parsed.json')

async function main() {
  const outputDir = path.dirname(htmlPath)
  const parsed = await parse({ inputFile: samplePath, lineNumbers: true })
  const html = toHtml(parsed)
  fs.ensureDirSync(outputDir)
  fs.writeFileSync(jsonPath, JSON.stringify(parsed, null, '  '))
  fs.writeFileSync(htmlPath, html)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
