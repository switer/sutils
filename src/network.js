!function () {
    var _id = 0,
        _jsonpwap = 'jsonpwrap';

    var SNetwork = {
        urlFixed: function (url) {
            if (url.match(/\?/) ) { //添加与 symbol "&""
                if (!url.match(/\?$/)) url += '&';
            } else { //添加search symbol "?""
                url += '?';
            }
            return url;
        },
        /*parse url search params to a object*/
        urlParse : function (url) {
            if ( _.isEmpty(url) ) return {};
            var params = url.replace(/^\?/, '').split('&'),
                source,
                login_count,
                paramMap = {};

            _.each(params, function (item) {
                var keyValues = item.split('='),
                    key = keyValues[0],
                    value = keyValues[1];
                paramMap[key] = value;
            })
            return paramMap;
        },
        /*JSONP request*/
        /*depens [@_id]*/
        jsonp: function (url, callbacks) {
            _id ++;
            /*成功回调*/
            window[_jsonpwap + _id] = callbacks.success || function () {};
            /*添加 "?" 或 "&" */
            url = this.urlFixed(url);

            url += 'callback=' + _jsonpwap +_id;
            var script = document.createElement('script');
                script.type = 'text\/javascript';
                script.src = url;

            script.onload = function () {
                script.remove();
            }
            script.onerror = function () {
                callback.error && callback.error();
                script.remove();
            }
            document.body.appendChild(script);
            /*链式调用*/
            return this;
        }
    }
}();