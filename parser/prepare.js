module.exports = function prepare(fountainString) {
  // TODO remove boneyard content
  return fountainString
    .split('\n')
    .map((line, index) => ({ line, lineNumber: index + 1 }))
}
