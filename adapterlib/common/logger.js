var modules = modules || new Pod();

/**
 * log() WL.Logger with some extras
 *
 * Make sure that logging
 *
 * @param {string|object} info - if an object, JSON.strigify is called
 * @param {object} [options]
 * @param {number} [options.limit] -max number of characters
 * @param {string} [options.method] - debug|log|info|warn|error (default: log)
 * @param {string} [options.prefix] - to be used printed before info
 */
modules.define('logger', function() {
    "use strict";

    function log(info, options) {
        var toLog = null; 
        var method = options && options.method? options.method : 'info';
        if (info) {
            try {
                toLog = typeof info === 'string'? info : JSON.stringify(info, null, 2);
            } catch (x) {
                toLog = info;
                WL.Logger.error('Exception stringifying while logging. ' + x.message);
                if (typeof info === 'object') {
                    var fields = [];
                    for (var field in info) {
                        // Watchout! A typeof may cause an additional exception!
                        fields.push(field);
                    }
                    WL.Logger.error('Object to be logged has these fields: ' + JSON.stringify(fields));
                }
                if (options && options.limit) {
                    delete options.limit;
                }
            }
        }
        if (options && options.limit && toLog) {
            toLog = toLog.substring(0, options.limit) + '...';
        }
        if (options && options.prefix) {
            toLog = options.prefix + ' ' + toLog;
        }
        toLog = (new Date()).toISOString().substr(11, 12) + ' ' + toLog;

        WL.Logger[method](toLog);
    }

    return {
        log: log
    };
});
