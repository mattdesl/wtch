var test = require('tape')
var wtch = require('../')
var fs = require('fs')
var path = require('path')

test('should connect to live reload server', function(t) {
    var filepath = path.join(__dirname, 'tmp.txt')
    var live = wtch(filepath)
    t.plan(3)
    live.on('connect', function() {
        t.ok(true, 'connected to server')
        setTimeout(function() {
            fs.writeFileSync(filepath, ''+new Date())
        }, 10)
    })

    live.on('file', function(event, file) {
        t.equal(event, 'change', 'received change event')
        t.equal(file, filepath, 'received change file')
        live.close()
    })
})
