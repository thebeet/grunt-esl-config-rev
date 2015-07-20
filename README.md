# grunt-esl-config-rev

> Hash AMD JS Module file, save hash config in config.js 

## Getting Started
_If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide._

From the same directory as your project's [Gruntfile][Getting Started] and [package.json][], install this plugin with the following command:

```bash
npm install grunt-esl-config-rev --save-dev
```

Once that's done, add this line to your project's Gruntfile:

```js
grunt.loadNpmTasks('grunt-esl-config-rev');
```

If the plugin has been installed correctly, running `grunt --help` at the command line should list the newly-installed plugin's task or tasks. In addition, the plugin should be listed in package.json as a `devDependency`, which ensures that it will be installed whenever the `npm install` command is run.

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md
[package.json]: https://npmjs.org/doc/json.html

### Overview
In your project's Gruntfile, add a section named `eslrev` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  eslrev: {
    configjs: {
      options: {
          map_tpl: './js/config.js.tpl',
          prefix: ''
      },
      files: [
          {
              cwd: './js/',
              src: ['**/*.js'],
              dest: './js/config.js'
          }
      ]
    }
  },
})
```

### Options

#### options.map_tpl
Type: `String`
Path of hash map template file.

#### options.prefix
Type: `String`
Prefix for script


