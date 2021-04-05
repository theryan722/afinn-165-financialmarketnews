'use strict'

var fs = require('fs')
var https = require('https')
var Transform = require('readable-stream').Transform
var csv = require('csv-streamify')
var wrap = require('wrap-stream')
var join = require('join-stream')
var bail = require('bail')

var endpoint =
  'https://api.github.com/repos/fnielsen/afinn/contents/afinn/data/AFINN-en-165.txt'

https.get(
  endpoint,
  {
    headers: {
      'User-Agent': 'request',
      Accept: 'application/vnd.github.v3.raw'
    }
  },
  onresponse
)

function onresponse(response) {
  response
    .resume()
    .on('error', bail)
    .pipe(csv({delimiter: '\t', objectMode: true}))
    .pipe(new Transform({objectMode: true, transform: onrow}))
    .pipe(join(',\n'))
    .pipe(wrap('{\n', '\n}\n'))
    .pipe(fs.createWriteStream('index.json'))
}

function onrow(chunk, encoding, callback) {
  this.push('  "' + chunk[0] + '": ' + chunk[1])
  callback()
}
