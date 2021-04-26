const regex = {
  italics: /\*{1}([^*]+)\*{1}/gim,
  bold: /\*{2}([^*]+)\*{2}/gim,
  boldItalics: /\*{3}([^*]+)\*{3}/gim,
  underline: /_{1}([^_]+)_{1}/gim,
  boneyard: /\n?\/\*[^]*?\*\/\n?/gim,
  notes: /\[\[([^]*?)\]\]/gim,
  skip: /\[skip\]/gm,
  escapedCharacters: /\\([*_]{1})/gim,
  restoreEscapedCharacters: /(\[escape:(star|underscore)\])/gim
}
const skip = '[skip]'

function replaceWithSkip(match) {
  const nLines = match.split('\n').length
  return new Array(nLines).join(`${skip}\n`)
}

function getNotesReplacer(notesClass) {
  return notesClass
    ? (match, noteString) => {
        return noteString
          .split('\n')
          .map((note) => `<span class="${notesClass}">${note}</span>`)
          .join('\n')
      }
    : replaceWithSkip
}

function removeBoneyards(fountainString) {
  return fountainString.replace(regex.boneyard, replaceWithSkip)
}

function getTagWrapReplacer(...tags) {
  const prefix = []
  const suffix = []
  tags.forEach((tag) => {
    prefix.push(`<${tag}>`)
    suffix.unshift(`</${tag}>`)
  })
  const open = prefix.join('')
  const close = suffix.join('')
  return (match, innerString) => {
    return innerString
      .split('\n')
      .map((text) => `${open}${text}${close}`)
      .join('\n')
  }
}

function getEscapeCharacterReplacer(match, character) {
  return character === '*' ? '[escape:star]' : '[escape:underscore]'
}

function restoreEscapedCharactersReplacer(match) {
  return match === '[escape:star]' ? '*' : '_'
}

function prepare(fountainString, notesClass = null) {
  return removeBoneyards(fountainString)
    .replace(regex.escapedCharacters, getEscapeCharacterReplacer)
    .replace(regex.notes, getNotesReplacer(notesClass))
    .replace(regex.underline, getTagWrapReplacer('u'))
    .replace(regex.boldItalics, getTagWrapReplacer('em', 'strong'))
    .replace(regex.bold, getTagWrapReplacer('strong'))
    .replace(regex.italics, getTagWrapReplacer('em'))
    .replace(regex.restoreEscapedCharacters, restoreEscapedCharactersReplacer)
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
