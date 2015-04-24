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

    grunt.util.linefeed = "\n";

    grunt.config.init({
        concat: {
            options: {
                process: function(src, filepath) {
                    return '// #### File ' + filepath + ' ####\n\n' + 
                           src.replace(/\r/g, '') + '\n\n';
                }
            }
            // Tasks are created programatically for adapterlib subfolders
        },
        copy: {
            pods: {
                src: 'node_modules/pods/pods.js',
                dest: 'adapterlib/common/',
                expand: true,
                flatten: true
            }
        },
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

    (function updateConcatOptionsForEveryJsAdapter() {

        grunt.file.expand('adapterlib/*').forEach(function(dir) {
            var concat;
            var adapter = dir.substr(dir.lastIndexOf('/')+1);
            if (adapter !== 'common') {
                concat = grunt.config.get('concat') || {};
                concat[adapter] = {
                    src: ['adapterlib/common/pods.js',
                          'adapterlib/common/*.js',
                          'adapterlib/' + adapter + '/*.js',
                         '!adapterlib/' + adapter + '/exports.js',
                          'adapterlib/' + adapter + '/exports.js'],
                    dest: 'adapters/' + adapter + '/' + adapter + '-impl.js'
                };
                grunt.config.set('concat', concat);
            }
        });
    })();

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-express');

    grunt.registerTask('setup', ['copy']);

};
