module.exports = {
  formatMarkdownCode: function(s) {
    return `\`${s}\``
  },
  formatMarkdownLinkOrText: function(text, options) {
    const { href } = options.hash
    return href ? `[${text}](${href})` : text
  }
}
