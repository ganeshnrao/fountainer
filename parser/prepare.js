const regex = {
  italics: /\*{1}([^*]+)\*{1}/gim,
  bold: /\*{2}([^*]+)\*{2}/gim,
  boldItalics: /\*{3}([^*]+)\*{3}/gim,
  underline: /_{1}([^_]+)_{1}/gim,
  boneyard: /\n?\/\*[^]*?\*\/\n?/gim,
  notes: /\[\[([^]*?)\]\]/gim,
  skip: /\[skip\]/gm
}
const skip = '[skip]'

function replaceWithSpanNotes(match, noteString) {
  return noteString
    .split('\n')
    .map((note) => `<span class="notes">${note}</span>`)
    .join('\n')
}

function replaceWithSkip(match) {
  const nLines = match.split('\n').length
  return new Array(nLines).join(`${skip}\n`)
}

function removeBoneyards(fountainString) {
  return fountainString.replace(regex.boneyard, replaceWithSkip)
}

function prepare(fountainString, keepNotes) {
  return removeBoneyards(fountainString)
    .replace(regex.notes, keepNotes ? replaceWithSpanNotes : replaceWithSkip)
    .replace(regex.underline, '<u>$1</u>')
    .replace(regex.boldItalics, '<em><strong>$1</strong></em>')
    .replace(regex.bold, '<strong>$1</strong>')
    .replace(regex.italics, '<em>$1</em>')
    .split('\n')
    .reduce((acc, line, index) => {
      if (line !== skip) {
        acc.push({
          line: line.replace(regex.skip, ''),
          lineNumber: index + 1
        })
      }
      return acc
    }, [])
}

module.exports = {
  removeBoneyards,
  prepare
}
