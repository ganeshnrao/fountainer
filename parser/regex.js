module.exports = {
  sceneHeading: /(^(?<scene>((INT\/EXT|I\/E|INT\.\/EXT|INT|EXT|EST)\.){1}\s*.*)$)|(^\.(?<powerScene>[a-z]+.*)$)/i,
  character: /^\s*((?<name>[A-Z][^(\^\sa-z]*(\s*[^(\^\sa-z]+)*)|(@(?<powerName>[^\^(\s]+(\s*[^\^(\s]+)+))){1}\s*(?<paren>\(.*\))*\s*(?<dual>\^)?\s*$/,
  parenthetical: /^\s*(?<paren>\(.*\))/i
}
