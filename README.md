# wtch

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

A small command-line app that watches for file changes and triggers a live-reload on file save (to be used with the LiveReload plugin). Watches the current working directory for `js,html,css` file changes. Ignores `.git`, `node_modules` and `bower_components` folders. 

```sh
npm install wtch -g

#start watching ..
wtch
```

You can use [garnish](https://github.com/mattdesl/garnish) for pretty-printing logs and limiting log level. 

```js
wtch | garnish --level debug
```

See [examples](#examples) for use with browserify and other tools. 

PRs/suggestions welcome.

## Usage

[![NPM](https://nodei.co/npm/wtch.png)](https://www.npmjs.com/package/wtch)

```sh
Usage:
    wtch [globs] [opts]

Options:
    --dir -d        current working directory to watch (defaults to cwd)
    --extension -e  specifies an extension or a comma-separated list (default js,css,html)
    --event         the type of event to watch, "all" or "change" (default "change")
    --port -p       the port to run livereload (defaults to 35729)
    --poll          enable polling for file watching
```

By default, it looks for `**/*` with the specified extensions. If `globs` is specified, they will *override* this behaviour. So you can do this to only watch a single file:

```
wtch bundle.js
```

## API

#### `wtch(glob, [opt, cb])`

Returns a through stream that watches the glob (or array of globs) with the given options and an optional callback.

Supported options:

- `cwd` the current working directory for chokidar
- `poll` whether to use polling, default false
- `event` the type of event to watch, can be `"change"` (default, only file save) or `"all"` (remove/delete/etc)
- `port` the port for livereload, defaults to 35729

## Examples

This can be used for live-reloading alongside [wzrd](https://github.com/maxogden/wzrd), [beefy](https://github.com/maxogden/beefy) and similar development servers. For example:   

```sh
wzrd test/index.js | wtch --dir test -e js,css,es6 | garnish
```

It can also be used to augment [watchify](https://github.com/maxogden/watchify) with a browser live-reload event. 

```sh
watchify index.js -o bundle.js | wtch bundle.js
```

Or, even for a simple site with no JS content. The following example uses [http-server](https://www.npmjs.com/package/http-server) and listens for HTML/CSS changes in the current directory. 

```sh
http-server -o -p 8000 | wtch | garnish -l debug
```

See this package.json's script field for examples. 

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/wtch/blob/master/LICENSE.md) for details.
