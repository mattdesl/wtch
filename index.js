var xtend = require('xtend')
var tinylr = require('tiny-lr')
var watch = require('chokidar').watch
var log = require('bole')('wtch')
var Emitter = require('events/')
var match = require('minimatch')

var ignore = [
    'node_modules/**', 'bower_components/**',
    '.git', '.hg', '.svn', '.DS_Store', 
    '*.swp', 'thumbs.db', 'desktop.ini'
]

module.exports = function wtch(glob, opt) {
    opt = xtend({
        event: 'change',
        ignored: ignore,
        ignoreInitial: true
    }, opt)

    if (typeof opt.port !== 'number')
        opt.port = 35729
    
    var ignoreReload = opt.ignoreReload
    var emitter = new Emitter()
    var server = tinylr()
    var closed = false
    var watcher

    if (opt.poll)
        opt.usePolling = true

    server.listen(opt.port, 'localhost', function(a) {
        if (closed)
            return

        log.info('livereload running on '+opt.port)
        watcher = watch(glob, opt)
        watcher.on(opt.event, opt.event === 'all' 
                ? reload 
                : reload.bind(null, 'change'))

        emitter.emit('connect', server)
    })

    function reload(event, path) {
        emitter.emit('watch', event, path)
        log.debug({ type: event, url: path })

        if ((Array.isArray(ignoreReload) || typeof ignoreReload === 'string')
                && reject(path, ignoreReload)) {
            return
        } else if (typeof ignoreReload === 'function' && ignoreReload(path)) {
            return
        }

        try {
            server.changed({ body: { files: [ path ] } })
            emitter.emit('reload', path)
        } catch (e) {
            throw e
        }
    }

    var serverImpl = server.server
    serverImpl.removeAllListeners('error')
    serverImpl.on('error', function(err) {
        if (err.code === 'EADDRINUSE') {
            process.stderr.write('ERROR: livereload not started, port '+opt.port+' is in use\n')
            server.close()
        }
    })

    emitter.close = function() {
        server.close()
        if (watcher)
            watcher.close()
        closed = true
    }

    return emitter
}

function reject(file, ignores) {
    if (!ignores)
        return false
    if (!Array.isArray(ignores))
        ignores = [ ignores ]
    return ignores.some(function(ignore) {
        return match(file, ignore)
    })
}