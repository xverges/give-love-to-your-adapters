/* jshint node: true */
module.exports = function(grunt) {
    'use strict';

    var path = require('path');

    var patterns = {
        js: {
            gruntfile: 'Gruntfile.js',
            adapters: 'adapters/**/*.js',
            apps: ['apps/*/common/js/**/*.js', '!apps/*/common/js/lib/**/*.js'],
            libs: 'apps/*/common/js/lib/**/*.js',
            testAdapters: 'test/js/server/**/*.js',
            testApps: 'test/js/apps/**/*.js',
            testLib: 'test/js/lib/*.js'
        },
        html: {
            index: 'apps/*/common/index.html'
        }
    };


    grunt.initConfig({
        express: {
            backend: {
                options: {
                    server: path.join(__dirname, 'a-sample-backend', 'server.js'),
                    port: 3000
                }
            }
        },
        jshint: {
            options: {
                jshintrc: true
            },
            gruntfile: {
                src: [patterns.js.gruntfile]
            },
            js: {
                src: [patterns.js.adapters,
                      patterns.js.apps,
                      patterns.js.testAdapters,
                      patterns.js.testApps,
                      patterns.js.testLib]
            },
            html: {
                src: [patterns.html.index],
                options: {
                    extract: 'always'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-express');
};
