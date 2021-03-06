const http = require('http')
const chalk = require('chalk')
const fs = require('fs')
const fsPromises = fs.promises
const path = require('path')
const Config = require('../lib/Config')
const { logIntro } = require('../lib/log')

const CLIENT_DIRECTORY = path.join(__dirname, './client')

const MIME_TYPES = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.eot': 'appliaction/vnd.ms-fontobject',
  '.ttf': 'aplication/font-sfnt'
}

module.exports = class HttpServer {
  constructor () {
    this.port = Config.port

    this.createServer()
  }

  createServer () {
    this.server = http.createServer(async (req, res) => {
      const url = new URL(req.url, 'http://localhost')
      const sanitizePath = path.normalize(url.pathname).replace(/^(\.\.[/\\])+/, '')
      let pathname = path.join(CLIENT_DIRECTORY, sanitizePath)

      try {
        await fsPromises.access(pathname)

        if (fs.statSync(pathname).isDirectory()) {
          pathname = path.join(pathname, 'index.html')
        }

        const file = await fsPromises.readFile(pathname)

        const ext = path.parse(pathname).ext
        res.setHeader('Content-type', MIME_TYPES[ext] || 'text/plain')
        res.end(file)
      } catch (err) {
        if (err.code === 'ENOENT') {
          res.statusCode = 404
          res.end(`File ${pathname} not found!`)
        } else {
          res.statusCode = 500
          res.end(`Error getting the file: ${err}.`)
        }
      }
    })
  }

  start () {
    this.server.listen(this.port, null, err => {
      if (err) {
        throw err
      }

      logIntro(`Server listening at ${chalk.green(`http://locahost:${Config.port}`)}`)
    })
  }
}
