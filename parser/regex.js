module.exports = {
  centered: /^\s*>+\s*(?<centered>([^<\s]+)(\s*[^<\s])*)\s*<+\s*$/,
  character: /^\s*((?<name>[A-Z][^(\^\sa-z]*(\s*[^(\^\sa-z]+)*)|(@(?<pName>[^\^(\s]+(\s*[^\^(\s]+)+))){1}\s*(?<paren>\(.*\))*\s*(?<dual>\^)?\s*$/,
  notes: /(\[\[([^\]]+)(\]\])*)|([^\]\[]+\]\])/gi,
  parenthetical: /^\s*(?<paren>\(.*\))/i,
  sceneHeading: /(^(?<scene>((INT\/EXT|I\/E|INT\.\/EXT|INT|EXT|EST)\.){1}\s*.*)$)|(^\.(?<pScene>[a-z]+.*)$)/i,
  section: /^(?<depth>#+)\s*(?<section>.+)/i,
  transition: /^\s*(?<transition>(FADE [^a-z]+:)|([^a-z]+ TO:)\s*)|(>\s*(?<pTransition>[^\<]+))$/
}
