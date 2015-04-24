/* exported getStories,  getStoriesFiltered */

/**
 *  WL.Server.invokeHttp(parameters) accepts the following json object as an argument:
 *  
 *  {
 *      // Mandatory 
 *      method : 'get' , 'post', 'delete' , 'put' or 'head' 
 *      path: value,
 *      
 *      // Optional 
 *      returnedContentType: any known mime-type or one of "json", "css", "csv", "plain", "xml", "html"  
 *      returnedContentEncoding : 'encoding', 
 *      parameters: {name1: value1, ... }, 
 *      headers: {name1: value1, ... }, 
 *      cookies: {name1: value1, ... }, 
 *      body: { 
 *          contentType: 'text/xml; charset=utf-8' or similar value, 
 *          content: stringValue 
 *      }, 
 *      transformation: { 
 *          type: 'default', or 'xslFile', 
 *          xslFile: fileName 
 *      } 
 *  } 
 */


var modules = modules || new Pod();

/**
 * @param interest
 *            must be one of the following: world, africa, sport, technology, ...
 *            (The list can be found in http://edition.cnn.com/services/rss/)
 * @returns json list of items
 */
function getStories(interest) {
    "use strict";
    var path = getPath(interest);

    var input = {
        method : 'get',
        returnedContentType : 'xml',
        path : path
    };

    var clientRequest = modules.require('clientRequest');
    clientRequest.logHeaders();
    clientRequest.logCookies();
    var logger = modules.require('logger');
    var req= WL.Server.getClientRequest();
    logger.log(req.getRequestURI(), {prefix: 'uri'});

    logger.log(req.getServerName(), {prefix: 'server Name'});
    logger.log(req.getServletContext().getServerInfo(), {prefix: 'server info'});
    logger.log(req.getServletContext().getServletContextName(), {prefix: 'context name'});
    logger.log(req.getServletContext().getRealPath('/'), {prefix: 'real path'});
    logger.log(req.getRemoteAddr(), {prefix: 'remote addr'});
    logger.log(req.getPathInfo(), {prefix: 'path info'});
    logger.log(java.lang.System.getenv("PATH"), {prefix: 'environment'});



    return WL.Server.invokeHttp(input);
}
/**
 * 
 * @param interest
 *            must be one of the following: world, africa, sport, technology, ...
 *            (The list can be found in http://edition.cnn.com/services/rss/)
 * @returns json list of items
 */
function getStoriesFiltered(interest) {
    "use strict";
    var path = getPath(interest);

    var input = {
        method : 'get',
        returnedContentType : 'xml',
        path : path,
        transformation : {
            type : 'xslFile',
            xslFile : 'filtered.xsl'
        }
    };

    return WL.Server.invokeHttp(input);
}



function getPath(interest) {
    "use strict";
    if (interest === undefined || interest === '') {
        interest = '';
    }else {
        interest = '_' + interest;
    }
    return 'rss/edition' + interest + '.rss';
}

