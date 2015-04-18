/* jshint node: true */
module.exports = function(grunt) {
    'use strict';

    var path = require('path');

    grunt.initConfig({
        express: {
            backend: {
                options: {
                    server: path.join(__dirname, 'a-sample-backend', 'server.js'),
                    port: 3000
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-express');
};
