var through2 = require('through2')
var xtend = require('xtend')
var tinylr = require('tiny-lr')
var gaze = require('gaze')
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
        event: 'changed'
    }, opt)
    var out = through2()
    var server = tinylr()

    server.listen(opt.port, 'localhost', function(a) {
        console.log(JSON.stringify({
            time:new Date(), 
            level: 'info', 
            message: 'livereload running on '+opt.port
        }))

        gaze(glob, opt, function(err, watcher) {
            this.on(opt.event, function(filepath) {
                try {
                    server.changed({ body: { files: [ filepath ] } })
                } catch (e) {
                    throw e
                }
            })
            cb(err)
            cb = noop
        })
    })

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