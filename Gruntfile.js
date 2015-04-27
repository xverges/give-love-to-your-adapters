/* jshint node: true */
module.exports = function(grunt) {
    'use strict';

    var fs = require('fs'),
        path = require('path');

    var envs = ['release', 'solo'];
    var patterns = {
        js: {
            gruntfile: 'Gruntfile.js',
            adapters: 'adapters/**/*.js',
            apps: ['apps/*/common/js/**/*.js', '!apps/*/common/js/lib/**/*.js'],
            libs: 'apps/*/common/js/lib/**/*.js',
            tests: 'test/js/**/*.js'
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
        jasmine: {
            adapterlib: {
                src: [ 'adapterlib/**/*.js',
                      '!adapterlib/**/exports.js',  
                      '!adapterlib/common/pods.js'],
                options: {
                    vendor: ['adapterlib/common/pods.js',
                             'test/js/libs/wl.server-side.dummy.js'],
                    specs: 'test/js/adapterlib/**/*Spec.js'
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
                      patterns.js.tests]
            },
            html: {
                src: [patterns.html.index],
                options: {
                    extract: 'always'
                }
            }
        }
    });


    (function updateTaskConfigForEveryJsAdapter() {
        var configOptions = {
            concat: {
                perEnv: false,
                subTarget: function(adapter) { return adapter; },
                settings: function(adapter) {
                    return {
                        src: ['adapterlib/common/pods.js',
                              'adapterlib/common/*.js',
                              'adapterlib/' + adapter + '/*.js',
                              '!adapterlib/' + adapter + '/exports.js',
                              'adapterlib/' + adapter + '/exports.js'],
                        dest: 'adapters/' + adapter + '/' + adapter + '-impl.js'
                    };
                }
            },
            copy: {
                perEnv: true,
                subTarget: function(adapter, env) { return adapter + '_' + env; },
                settings: function(adapter, env) {
                    var src = '';
                    var dest = path.join('adapters', adapter);
                    var srcEnv = path.join('adapterlib', adapter, adapter + '_' + env + '.xml');
                    var srcCommon = path.join('adapterlib', adapter, adapter + '.xml');
                    if (fs.existsSync(srcEnv)) {
                        src = srcEnv;
                    } else if (fs.existsSync(srcCommon) ) {
                        src = srcCommon;
                    }
                    if (src) {
                        return {
                            src: src,
                            dest: dest,
                            rename: function(dest, src) {   // jshint ignore:line
                                return path.join(dest, adapter + '.xml');
                            },
                            expand: true,
                            flatten: true
                        };
                    }
                }
            }
        };
        function taskConfig(task, adapter, env) {
            var cfg = grunt.config.get(task) || {};
            var key = configOptions[task].subTarget(adapter, env);
            var settings = configOptions[task].settings(adapter, env);
            if (settings) { 
                cfg[key] = settings;
                grunt.config.set(task, cfg);
            }
        }

        grunt.file.expand('adapterlib/*').forEach(function(dir) {
            var adapter = dir.substr(dir.lastIndexOf('/')+1);
            if (adapter !== 'common') {
                Object.keys(configOptions).forEach(function(task) {
                    var limit = configOptions[task].perEnv? envs.length : 1;
                    for (var ii=0; ii < limit; ii++) {
                        taskConfig(task, adapter, envs[ii]);
                    }
                });
            }
        });
    })();

    function subTasksForEnv(task, env) {
        var tasks = [];
        var suffix = '_' + env;
        Object.keys(grunt.config.data[task]).forEach(function(subtask) {
            var endOf = subtask.length - suffix.length;
            if (subtask.indexOf(suffix, endOf) !== -1) {
                tasks.push(task + ':' + subtask);
            }
        });
        return tasks;

    }

    function dependeciesForSetupTask(env) {
        var tasks = [];
        tasks = tasks.concat(['copy:pods']);
        tasks = tasks.concat(['concat']);
        tasks = tasks.concat(subTasksForEnv('copy', env));
        return tasks;
    }

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-express');

    grunt.registerTask('build', 'Build adapters for a given environment',
                       function(env) {
        if (-1 == envs.indexOf(env)) {
            grunt.fail.fatal('You have to specify a target enviroment (' +
                             envs + '). Eg. grunt build:' + envs[0]);
        } else {
            grunt.task.run(dependeciesForSetupTask(env));
            grunt.task.run('jshint');
            grunt.task.run('jasmine');
        }
    });

    grunt.registerTask('setup', dependeciesForSetupTask(envs[0]));

};
