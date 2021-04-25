const { camelCase, uniq } = require('lodash')

const names = {
  action: 'action',
  centered: 'centered',
  character: 'character',
  default: 'default',
  dialogue: 'dialogue',
  empty: 'empty',
  notes: 'notes',
  paren: 'paren',
  scene: 'scene',
  section: 'section',
  synopsis: 'synopsis',
  titlePage: 'title-page',
  transition: 'transition'
}
const namesByPriority = [
  names.empty,
  names.titlePage,
  names.centered,
  names.transition,
  names.scene,
  names.section,
  names.synopsis,
  names.character,
  names.paren,
  names.action,
  names.dialogue,
  names.default
]
const priority = namesByPriority.reduce((acc, type, index) => {
  acc[type] = index
  return acc
}, {})

function prioritize(types) {
  return uniq(types).sort((a, b) => priority[a] - priority[b])
}

const definitions = {
  [names.action]: {
    name: names.action,
    regex: /^!(?<action>.+)$/,
    next: prioritize([
      names.empty,
      names.action,
      names.centered,
      names.transition,
      names.scene,
      names.section,
      names.synopsis,
      names.character
    ]),
    post({ groups: { action } }) {
      return { text: action }
    }
  },
  [names.centered]: {
    name: names.centered,
    next: prioritize([
      names.empty,
      names.scene,
      names.transition,
      names.section,
      names.synopsis,
      names.centered,
      names.character,
      names.notes,
      names.action
    ]),
    regex: /^\s*>+\s*(?<centered>([^<\s]+)(\s*[^<\s])*)\s*<+\s*$/,
    post({ groups: { centered } }) {
      return { text: centered }
    }
  },
  [names.character]: {
    name: names.character,
    next: prioritize([names.paren, names.dialogue]),
    onNoMatch(parsedLine) {
      parsedLine.name = names.action
      delete parsedLine.dual
    },
    regex: /^\s*((?<name>[A-Z][^(^\sa-z]*(\s*[^(^\sa-z]+)*)|(@(?<pName>[^^(\s]+(\s*[^^(\s]+)+))){1}\s*(?<paren>\(.*\))*\s*(?<dual>\^)?\s*$/,
    post({ groups: { name = '', pName = '', paren = '', dual } }) {
      return {
        text: `${name || pName}${paren ? ` ${paren}` : ''}`,
        dual: !!dual
      }
    }
  },
  [names.dialogue]: {
    name: names.dialogue,
    regex: /^.+$/,
    next: prioritize([names.empty, names.paren, names.dialogue]),
    post(matches, line) {
      return { text: line }
    }
  },
  [names.empty]: {
    name: names.empty,
    regex: /^$/,
    next: prioritize([
      names.empty,
      names.centered,
      names.character,
      names.scene,
      names.section,
      names.synopsis,
      names.transition,
      names.action
    ]),
    post() {
      return { text: '' }
    }
  },
  [names.notes]: {
    name: names.notes,
    regex: /(\[\[([^\]]+)(\]\])*)|([^\][]+\]\])/gi,
    post(matches, line) {
      let text = line
      const notes = []
      matches.forEach((match) => {
        text = text.replace(match, '')
        notes.push(match.replace(/(\[\[\s*|\s*\]\]?)/g, ''))
      })
      const lastNote = matches.pop()
      const isInsideNote = !lastNote.endsWith(']]')
      return { text, notes, context: { isInsideNote } }
    }
  },
  [names.paren]: {
    name: names.paren,
    regex: /^\s*(?<paren>\(.*\))/i,
    next: prioritize([names.empty, names.paren, names.dialogue]),
    post({ groups: { paren } }) {
      return { text: paren }
    }
  },
  [names.scene]: {
    name: names.scene,
    regex: /^(?<scene>((INT\/EXT|I\/E|INT\.\/EXT|INT|EXT|EST)\.){1}\s*.*)$|^\.(?<pScene>[a-z]+.*)$/i,
    next: prioritize([
      names.empty,
      names.centered,
      names.character,
      names.transition,
      names.section,
      names.synopsis,
      names.action
    ]),
    post({ groups: { scene, pScene } }) {
      return { text: scene || pScene }
    }
  },
  [names.section]: {
    name: names.section,
    regex: /^(?<depth>#+)\s*(?<section>.+)/i,
    next: prioritize([
      names.empty,
      names.centered,
      names.character,
      names.transition,
      names.section,
      names.synopsis,
      names.action
    ]),
    post({ groups: { depth, section } }) {
      return { level: depth.length, text: section }
    }
  },
  [names.synopsis]: {
    name: names.synopsis,
    regex: /^=\s+(?<synopsis>.+)/i,
    next: prioritize([
      names.empty,
      names.centered,
      names.character,
      names.transition,
      names.section,
      names.synopsis,
      names.action
    ]),
    post({ groups: { synopsis } }) {
      return { text: synopsis }
    }
  },
  [names.titlePage]: {
    name: names.titlePage,
    regex: /^\s*(?<field>title|credit|authors?|source|draft|(draft )?date|contact|copyright|notes):\s*(?<value>.*)/i,
    next: prioritize([names.titlePage, names.empty]),
    post({ groups: { field, value } }) {
      let fieldName = camelCase(field)
      if (fieldName === 'author') {
        fieldName = 'authors'
      }
      if (fieldName === 'draftDate') {
        fieldName = 'date'
      }
      return {
        text: value.trim(),
        field: fieldName,
        context: { titlePageField: fieldName }
      }
    }
  },
  [names.transition]: {
    name: names.transition,
    regex: /^\s*(?<transition>(FADE [^a-z]+:)|([^a-z]+ TO:)\s*)|(>\s*(?<pTransition>[^<]+))$/,
    next: prioritize([
      names.empty,
      names.scene,
      names.character,
      names.section,
      names.synopsis,
      names.transition,
      names.centered,
      names.action
    ]),
    post({ groups: { transition, pTransition } }) {
      return { text: transition || pTransition }
    }
  }
}

function getToken(definition, line) {
  const { name, regex, post } = definition
  const matches = line.match(regex)
  if (matches) {
    return { name, ...post(matches, line) }
  }
  return null
}

module.exports = {
  getToken,
  definitions,
  names,
  priority,
  namesByPriority,
  prioritize
}
