/* global modules, WL */

describe('logger', function() {
    "use strict";
    var logger = modules.require('logger');

    it('exposes a log function', function() {
        expect(logger.log).toBeDefined();
        expect(typeof logger.log).toBe('function');
    });

    it('log has a prefix option that adds a prefix', function() {
        var logged;
        spyOn(WL.Logger, "info").and.callFake(function(str) {
            logged = str;
        });
        logger.log("text", {prefix: "prefix"});
        expect(logged).toMatch(/prefix text$/);
    });

    it('log has a method option that sets the WL.Logger method', function() {
        var logged;
        spyOn(WL.Logger, "error").and.callFake(function(str) {
            logged = str;
        });
        logger.log("text", {method: "error"});
        expect(logged).toMatch(/text$/);
    });

    it('log has a limit option that limits the number of chars', function() {
        var logged;
        spyOn(WL.Logger, "info").and.callFake(function(str) {
            logged = str;
        });
        logger.log("123456", {limit: 2});
        expect(logged).toMatch(/12...$/);
    });
});

