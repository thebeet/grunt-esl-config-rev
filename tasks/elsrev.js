/*
 * grunt-rev
 * https://github.com/cbas/grunt-rev
 *
 * Copyright (c) 2013 Sebastiaan Deckers
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
    path = require('path'),
    crypto = require('crypto');

module.exports = function(grunt) {

    function md5(filepath, algorithm, encoding) {
        var hash = crypto.createHash(algorithm);
        grunt.log.verbose.write('Hashing ' + filepath + '...');
        hash.update(grunt.file.read(filepath));
        return hash.digest(encoding);
    }

    grunt.registerMultiTask('eslrev', 'Prefix static asset file names with a content hash', function() {

        var options = this.options({
            algorithm: 'md5',
            length: 8,
            config_tpl: 'static/js/config.js.tpl',
            MAP_BLOCK_RE: /\/\*map start\*\/[\s\S]*\/\*map end\*\//,
            prefix: ''
        });

        var done = this.async();

        this.files.forEach(function(f) {
            if (!f.dest) {
                grunt.log.error('Dest map file does not specified');
                return false;
            }


            var encoding = options.encoding;
            var cwd = f.cwd;
            var mapping = [];
            var dest = f.dest;
            var MAP_TPL = grunt.file.read(options.map_tpl);

            var src = f.src.filter(function(filepath) {
                filepath = realpath(filepath);
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            });

            src.forEach(function(filepath) {
                var r = realpath(filepath), d;
                var shasum = crypto.createHash(options.algorithm);
                var s = fs.ReadStream(r);
                s.on('data', function(data) {
                    shasum.update(data, encoding);
                });
                s.on('end', function() {
                    d = shasum.digest('hex');
                    mapping.push([filepath,  d]);
                    if (mapping.length === src.length) {
                        output();
                    }
                });
            });

            function realpath(filepath) {
                return cwd ? path.join(cwd, filepath) : filepath;
            }

            function output() {
                mapping.sort();
                var urlArgs = {};
                mapping.forEach(function (item) {
                    urlArgs[item[0].replace(/\.js$/, '')] = 'v=' + item[1];
                });
                var preFixUrlArgs = {};
                for (var k in urlArgs) {
                    preFixUrlArgs[options.prefix + k] = urlArgs[k];
                }
                console.log(preFixUrlArgs);
                var config = '';
                if (grunt.file.exists(options.config_tpl)) {
                    config = grunt.file.read(options.config_tpl);
                }
                config = config.replace(options.MAP_BLOCK_RE, '').trim();

                config = grunt.template.process(MAP_TPL, {
                    data: {
                        urlArgs: JSON.stringify(preFixUrlArgs, null, '\t')
                    }
                }) + '\n' + config;
                grunt.file.write(dest, config);

                grunt.log.oklns('Hash map config write to file: "' + dest + '".');
                done();
            }
        });

    });

};
