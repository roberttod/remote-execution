const NodeRSA = require('node-rsa')
const getRawBody = require('raw-body')
const contentType = require('content-type')

const fs = require('fs')
const path = require('path')
const rsa = NodeRSA(fs.readFileSync(path.join(__dirname, './example/keys/public')))

module.exports = function executeMiddlewear (serverOptions) {
  return function (req, res, next) {
    getRawBody(req, {
      length: req.headers['content-length'],
      limit: '1mb',
      encoding: contentType.parse(req).parameters.charset
    }, async function (err, body) {
      if (err) return next(err)
      const data = JSON.parse(body)
      try {
        const { execution, signature } = data
        const verified = rsa.verify(execution, signature, 'utf8', 'base64')
        if (!verified) throw new Error('Execution not verified, refusing to eval')
        const fn = eval(execution)
        fn({ ...serverOptions, req, res, require }, data.clientOptions)
      } catch (e) {
        console.error('Failed to eval', e.message)
        next(e)
      }
      next()
    })
  }
}
