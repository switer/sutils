/**
 *   @switer
 */
define(function(require, exports, module) {
    'use strict';

    var util =require('util'),
        _id = 0, // jsonp request id
        _jsonpwap = '_jsonpwrapper', // jsonp wrapper namespace
        global = window; // global variable

    /**
     *  network, url parser
     **/
    var net = {

        /*depens [@_id]*/
        jsonp: function (url, success, fail) {
            _id ++;
            /*save jsonp success callback in gobal*/
            global[_jsonpwap + _id] = success || function () {};
            /*append "?" or "&" */
            url = net.urlfix(url);

            url += 'callback=' + _jsonpwap +_id;
            var script = document.createElement('script');
                script.type = 'text\/javascript';
                script.src = url;

            script.onload = function () {
                script.remove();
            }
            script.onerror = function () {
                fail && fail();
                script.remove();
            }
            document.body.appendChild(script);
            /*chain call*/
            return net;
        },
        /**
         *  params in url of location.search
         **/
        queries: function (surl) {
            var search = (surl || window.location.search).match(/\?.*(?=\b|#)/);
            search && (search = search[0].replace(/^\?/, ''));
            if (!search) return {};
            var queries = {},
                params = search.split('&');

            util.each(params, function (item) {
               var param = item.split('=');
               queries[param[0]] = param[1];
            });

            return queries;
        },
        /**
         *  append '?' or '&' to the url
         **/
        urlfix: function (url) {
            if (url.match(/\?/) ) { //add and symbol "&"
                if (!url.match(/\?$/)) url += '&';
            } else { //add search symbol "?""
                url += '?';
            }
            return url;
        },
    }

    module.exports = net;
});