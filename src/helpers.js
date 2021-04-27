module.exports = {
  formatMarkdownCode: function(s) {
    return `\`${s}\``
  },
  formatMarkdownCodeList: function(l) {
    return [...l.map((s) => `\`${s}\``)]
  },
  formatMarkdownLinkOrText: function(text, options) {
    const { href } = options.hash
    return href ? `[${text}](${href})` : text
  },
  formatIndent: function(indent) {
    return indent ? '  ' : ''
  }
}
