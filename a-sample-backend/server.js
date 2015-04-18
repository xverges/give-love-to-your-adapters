"use strict";

var fs = require('fs'),
    path = require('path');

var PORT = 3000;

var PouchDB = require('pouchdb').defaults({
        db: require('memdown')
    }),
    app = require('express-pouchdb')(PouchDB, {
        configPath: writeCfgFile()
    });

function writeCfgFile() {
    var cfgPath = path.join(__dirname, 'pouchDbCfg.json');
    var logPath = path.join(__dirname, 'log.txt');
    var cfg = {
        log: {
            file: logPath
        }
    };
    fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2));
    return cfgPath;
}

if (!module.parent) {
    // We have not been required
    console.log('pouchdb server listening on port ' + PORT);
    app.listen(PORT);
} else {
    module.exports = app;
}


