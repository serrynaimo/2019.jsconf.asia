const manifest = require('./http2server.manifest')

module.exports = {
  hosts: [
    {
      domain: 'localhost',
      manifest
    }
  ]
}
