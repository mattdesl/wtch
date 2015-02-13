# wtch

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

A small command-line app that watches for file changes and triggers a live-reload on file save (to be used with the [LiveReload plugin](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en)). Watches the current working directory for `js,html,css` file changes. Ignores `.git`, `node_modules` and `bower_components` folders. 

```sh
npm install wtch -g

#start watching ..
wtch
```

You can use [garnish](https://github.com/mattdesl/garnish) for pretty-printing logs and limiting log level. 

```js
wtch | garnish --level debug
```

See [setup](#setup) for a basic how-to, and [tooling](#Tooling) for more advanced uses with browserify, watchify, etc.

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

Returns a through stream that watches the glob (or array of globs) with the given options and an optional callback when LiveReload is listening.

Supported options:

- `cwd` the current working directory for chokidar
- `poll` whether to use polling, default false
- `event` the type of event to watch, can be `"change"` (default, only file save) or `"all"` (remove/delete/etc)
- `port` the port for livereload, defaults to 35729

## Setup

First, install the LiveReload plugin for your browser of choice (e.g. [Chrome](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en)). 

Now, install some tools globally. 

```sh
npm install wtch http-server garnish -g
```

Create a basic `index.html` file that references scripts and/or CSS files.

Then, you can run your development server like so:

```sh
http-server | wtch | garnish
```

Enable LiveReload by clicking the plugin so the center of it turns black. You may need to refresh the page first.

![Click to enable](http://i.imgur.com/YdCgusY.png)

Now when you save a JS/HTML/CSS file in the current directory, it will trigger a live-reload event on your `localhost:8080` tab. CSS files will be injected without a page refresh.

## Tooling

This can be used for live-reloading alongside [wzrd](https://github.com/maxogden/wzrd), [beefy](https://github.com/maxogden/beefy) and similar development servers. For example:   

```sh
wzrd test/index.js | wtch --dir test -e js,css,es6 | garnish
```

It can also be used to augment [watchify](https://github.com/maxogden/watchify) with a browser live-reload event. This is better suited for larger bundles.

```sh
watchify index.js -o bundle.js | wtch bundle.js
```

See [this package.json's](https://github.com/mattdesl/wtch/blob/master/package.json) script field for more detailed examples. 

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/wtch/blob/master/LICENSE.md) for details.
