const manifest = require('./http2server.manifest')

module.exports = {
  hosts: [
    {
      domain: '2019.jsconf.asia',
      manifest
    }
  ]
}
