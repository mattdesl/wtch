var through2 = require('through2')
var xtend = require('xtend')
var tinylr = require('tiny-lr')
var watch = require('chokidar').watch

var noop = function(){} 

module.exports = function wtch(glob, opt, cb) {
    if (typeof opt === 'function') {
        cb = opt
        opt = {}
    } else {
        cb = cb || noop
    }

    opt = xtend({
        port: 35729,
        event: 'change'
    }, opt)
    if (opt.event === 'changed') //backwards compatible with v1
        opt.event = 'change'

    var out = through2()
    var server = tinylr()

    if (opt.poll)
        opt.usePolling = true

    server.listen(opt.port, 'localhost', function(a) {
        console.log(JSON.stringify({
            time:new Date(), 
            level: 'info', 
            message: 'livereload running on '+opt.port
        }))
        var watcher = watch(glob, opt)

        watcher.on(opt.event, opt.event === 'all' 
                ? reload 
                : reload.bind(null, 'change'))

        cb()
        cb = noop
    })

    function reload(event, path) {
        if (opt.verbose) {
            console.log(JSON.stringify({
                time:new Date(), 
                level: 'info', 
                type: event,
                url: path
            }))
        }
        try {
            server.changed({ body: { files: [ path ] } })
        } catch (e) {
            throw e
        }
    }

    var emitter = server.server
    emitter.removeAllListeners('error')
    emitter.on('error', function(err) {
        if (err.code === 'EADDRINUSE') {
            process.stderr.write('ERROR: livereload not started, port '+opt.port+' is in use\n')
            server.close()
        }
        cb(err)
        cb = noop
    })
    return out
}