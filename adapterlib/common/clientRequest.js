var modules = modules || new Pod();

modules.define('clientRequest', ['logger'], function(logger) {
    "use strict";

    function cookiesAsArray() {
        var arr = [];
        var req = WL.Server.getClientRequest();
        var cookies = req.getCookies();

        for (var ii in cookies) {
            arr.push({
                name: cookies[ii].getName(),
                value: cookies[ii].getValue()
            });
        }
        return arr;
    }
    function headersAsArray(filter) {
        var arr = [];
        var req = WL.Server.getClientRequest();
        var names = req.getHeaderNames();

        while (names.hasMoreElements()) {
            var name = '' + names.nextElement();
            if (!filter || filter.indexOf(name) != -1) {
                var headers = req.getHeaders(name);
                var el = {
                        name: name,
                        header: '' + req.getHeader(name),
                        headers: []
                };
                while (headers.hasMoreElements()) {
                    var value = headers.nextElement();
                    el.headers.push('' + value);
                }
                arr.push(el);
            }
        }
        return arr;
    }
    function logCookies() {
        logger.log(cookiesAsArray(), {prefix: 'client cookies'});
    }
    function logHeaders() {
        logger.log(headersAsArray(), {prefix: 'client headers'});
    }

    return {
        getCookies: cookiesAsArray,
        getHeaders: headersAsArray,
        logCookies: logCookies,
        logHeaders: logHeaders
    };
});
