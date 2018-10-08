const fs = require('fs')
const NodeRSA = require('node-rsa')
const { getOptions } = require('loader-utils')

module.exports = function (source) {
  const options = getOptions(this)
  const key = fs.readFileSync(options.key)
  const rsa = new NodeRSA(key)
  let execution
  eval(source.replace(/module\.exports/g, 'execution'))
  const signature = rsa.sign(execution.toString()).toString('base64')

  return source + `
    module.exports.signature = '${signature}'
  `
}
