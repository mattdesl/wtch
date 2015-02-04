#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2))
var wtch = require('./')

if (argv.p)
    argv.port = argv.p    

var watch = ['!.git/**', '!node_modules/**', '!bower_components/**']
var extension = argv.e || argv.extension || ['js', 'html', 'css']

if (!Array.isArray(extension))
    extension = [extension||'']

//strip dots from extensions, split commas
extension = extension
    .filter(Boolean)
    .map(function(e) {
        return e.split(',')
    })
    .reduce(function(a, b) {
        return a.concat(b)
    }, [])
    .map(function(e) {
        if (e.indexOf('.')===0)
            return e.substring(1)
        return e
    })

//turn into a glob
var files = extension.length === 0 
    ? ['**/*']
    : ['**/*.{' + extension.join(',') + '}']

var glob = files.concat(watch)
argv.cwd = argv.dir || argv.d

process.stdin
    .pipe(wtch(glob, argv))
    .pipe(process.stdout)