# wtch

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

A small command-line app that watches for file changes and triggers a live-reload on file save. Watches the current working directory for `js,html,css` file changes. ignores `.git` folder, `node_modules` and `bower_components`. 

```sh
npm install wtch -g

#start watching ..
wtch
```

Particularly useful alongside tools like [wzrd](https://github.com/maxogden/wzrd).

```js
wzrd index.js | wtch
```

With options, and using [garnish](https://github.com/mattdesl/garnish) for pretty-printing.

```js
wzrd test/index.js | wtch --dir test -e js,css,es6 | garnish
```

PRs/suggestions welcome.

## Usage

[![NPM](https://nodei.co/npm/wtch.png)](https://www.npmjs.com/package/wtch)

```sh
Usage:
    wtch [opts]

Options:
    --dir -d        current working directory to watch (defaults to cwd)
    --extension -e  specifies an extension or a comma-separated list (default js,css,html)
    --port -p       the port to run livereload (defaults to 35729)
```

## API

#### `wtch(glob, [opt, cb])`

Returns a through stream that watches the glob (or array of globs) with the given options and an optional callback.

Options:

- `cwd` the current working directory for gaze
- `event` the type of event for gaze, such as `"all"` or `"changed"` (defaults to changed)
- `port` the port for livereload, defaults to 35729

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/wtch/blob/master/LICENSE.md) for details.
