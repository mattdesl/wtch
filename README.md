# wtch

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

A small command-line app that watches for file changes and triggers a live-reload on file save (using [LiveReload](http://livereload.com/)). Watches the current working directory for `js,html,css` file changes. Ignores `.git`, `node_modules`, and `bower_components`, and other hidden files. 

```sh
npm install wtch -g

#start watching ..
wtch
```

You can use [garnish](https://github.com/mattdesl/garnish) for pretty-printing logs and limiting log level. 

```js
wtch | garnish --level debug
```

See [setup](#livereload-setup) for a basic how-to, and [tooling](#Tooling) for more advanced uses with browserify, watchify, etc.

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

#### `live = wtch(glob, [opt])`

Returns a through stream that watches the glob (or array of globs) and returns an event emitter.

Supported options:

- `cwd` the current working directory for chokidar
- `poll` whether to use polling, default false
- `event` the type of event to watch, can be `"change"` (default, only file save) or `"all"` (remove/delete/etc)
- `port` the port for livereload, defaults to 35729
- `ignoreReload` allows ignoring LiveReload events for specific files; can be a file path, or an array of paths, or a function that returns `true` to ignore the reload, Example:

```js
wtch('**/*.js', { 
  ignoreReload: function(file) {
    //don't trigger LiveReload for this file
    if (file === fileToIgnore)
      return true
    return false
  } 
})
  //instead, manually decide what to do when that file changes
  .on('watch', handler)
```

#### `live.on('connect')`

An event dispatched when the connection to live-reload server occurs.

#### `live.on('watch')`

An event dispatched when file change occurs. The first parameter is `event` type (e.g. `"change"`), the second is `file` path.

#### `live.on('reload')`

An event dispatched after the live reload trigger. First parameter will be the file path. 

## LiveReload Setup

There are two common ways of enabling LiveReload.

#### Script Tag

You can insert the following script tag in your HTML file. This will work across browsers and devices.

```html
<script>document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')</script>
```

Or you could use [inject-lr-script](https://github.com/mattdesl/inject-lr-script) to inject it while serving HTML content.

#### Browser Plugin

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

Open `localhost:8080` and enable LiveReload by clicking the plugin. The center circle will turn black. You may need to refresh the page first.

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
