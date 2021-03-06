/**
 *   @switer
 */
'use strict';

var util = {
    /**
     *  Function.bind
     */
    bind: function (func, context) {
        return function () {
            func.apply(context, arguments);
        }
    },
    /**
    *   bind all function for a object
    */
    bindAll: function (object, ctx) {
        ctx = ctx || object;
        util.each(object, function (func, name) {
            if (util.type(func) === 'function') {
                object[name] = util.bind(func, ctx);
            }
        });
        return object;
    },
    /**
      * forEach
      * I don't want to import underscore, is looks like so heavy if use in chain
      */
    each: function(obj, iterator, context) {
        context = context || this;
        if (!obj) return;
        else if (obj.forEach) {
            obj.forEach(iterator);
        } else if (obj.length === +obj.length){
            for (var i = 0; i < obj.length; i++) {
                if(iterator.call(context, obj[i], i)) break;
            }
        } else {
            for (var key in obj) {
                if(iterator.call(context, obj[key], key)) break;
            }
        }
    },
    /**
     *  Object extend api
     **/
    extend: function (obj, extObj, isNotOverRide) {

        this.each(extObj, function (value, key) {
            if (extObj.hasOwnProperty(key)) {
                if (isNotOverRide && obj.hasOwnProperty(key)) {
                    return;
                } else {
                    obj[key] = value;
                }
            }
        });
        return obj;
    },
    /**
     *   jude a element if has specified selector
     */
    is: function(target, selector, times) {
        selector = selector.trim();
        if (times === undefined) times = 3;
        var $tar = $(target),
            $curtar = this.parent($tar, 2, function ($el) {
                if ($el.is(selector)) return true;
                else return false;
            });
        return $curtar;
    },
    /**
     *   search parent or ancestors element
     */
    parent: function (target, maxlevel, judge, _count) {
        var $tar = $(target);

        if (_count === undefined) _count = 0;
        /*search in bubbling*/
        if (!judge($tar) && _count >= maxlevel) {
            return null;
        } else if (judge($tar)) {
            return $tar;
        } else {
            _count ++;
            return this.parent.call(this, $tar.parent(), maxlevel, judge, _count);
        }
    },
    repeat: function(str, times) {
        var index = 0,
            ctn = '';
        while (index < times) {
            ctn += str;
            index++;
        }
        return ctn;
    },
    /**
     *  Array.slice
     */
    slice: function (array) {
        return Array.prototype.slice.call(array);
    },
    /**
     *  Get a object type
     **/
    type: function (obj) {
        var type;
        if (obj == null) {
            type = String(obj);
        } else {
            type = Object.prototype.toString.call(obj).toLowerCase();
            type = type.substring(8, type.length - 1);
        }
        return type;
    },
    /**
     *  针对ajax请求封装一下
     **/
    request: function (method, url, param, /*, [option]*/ success, error) {
        var args = Array.prototype.slice(arguments),
            option = {},
            setting;

        if (util.type(args[3]) == 'object') {
            option = args[3];
            success = args[4];
            error = args[5]
        }
        // 拼裝ajax請求参数对象
        setting = util.extend({
            url: url,
            method: method,
            data: param,
            dataType: 'json',
            success: success,
            error: error
        }, option);

        $.ajax(setting);
    }
};
module.exports = util;
