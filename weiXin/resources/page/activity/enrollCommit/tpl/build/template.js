/*TMODJS:{"version":"1.0.0"}*/
!function () {

    function template (filename, content) {
        return (
            /string|function/.test(typeof content)
            ? compile : renderFile
        )(filename, content);
    };


    var cache = template.cache = {};
    var String = this.String;

    function toString (value, type) {

        if (typeof value !== 'string') {

            type = typeof value;
            if (type === 'number') {
                value += '';
            } else if (type === 'function') {
                value = toString(value.call(value));
            } else {
                value = '';
            }
        }

        return value;

    };


    var escapeMap = {
        "<": "&#60;",
        ">": "&#62;",
        '"': "&#34;",
        "'": "&#39;",
        "&": "&#38;"
    };


    function escapeFn (s) {
        return escapeMap[s];
    }


    function escapeHTML (content) {
        return toString(content)
        .replace(/&(?![\w#]+;)|[<>"']/g, escapeFn);
    };


    var isArray = Array.isArray || function(obj) {
        return ({}).toString.call(obj) === '[object Array]';
    };


    function each (data, callback) {
        if (isArray(data)) {
            for (var i = 0, len = data.length; i < len; i++) {
                callback.call(data, data[i], i, data);
            }
        } else {
            for (i in data) {
                callback.call(data, data[i], i);
            }
        }
    };


    function resolve (from, to) {
        var DOUBLE_DOT_RE = /(\/)[^/]+\1\.\.\1/;
        var dirname = ('./' + from).replace(/[^/]+$/, "");
        var filename = dirname + to;
        filename = filename.replace(/\/\.\//g, "/");
        while (filename.match(DOUBLE_DOT_RE)) {
            filename = filename.replace(DOUBLE_DOT_RE, "/");
        }
        return filename;
    };


    var utils = template.utils = {

        $helpers: {},

        $include: function (filename, data, from) {
            filename = resolve(from, filename);
            return renderFile(filename, data);
        },

        $string: toString,

        $escape: escapeHTML,

        $each: each
        
    };


    var helpers = template.helpers = utils.$helpers;


    function renderFile (filename, data) {
        var fn = template.get(filename) || showDebugInfo({
            filename: filename,
            name: 'Render Error',
            message: 'Template not found'
        });
        return data ? fn(data) : fn; 
    };


    function compile (filename, fn) {

        if (typeof fn === 'string') {
            var string = fn;
            fn = function () {
                return new String(string);
            };
        }

        var render = cache[filename] = function (data) {
            try {
                return new fn(data, filename) + '';
            } catch (e) {
                return showDebugInfo(e)();
            }
        };

        render.prototype = fn.prototype = utils;
        render.toString = function () {
            return fn + '';
        };

        return render;
    };


    function showDebugInfo (e) {

        var type = "{Template Error}";
        var message = e.stack || '';

        if (message) {
            // 利用报错堆栈信息
            message = message.split('\n').slice(0,2).join('\n');
        } else {
            // 调试版本，直接给出模板语句行
            for (var name in e) {
                message += "<" + name + ">\n" + e[name] + "\n\n";
            }  
        }

        return function () {
            if (typeof console === "object") {
                console.error(type + "\n\n" + message);
            }
            return type;
        };
    };


    template.get = function (filename) {
        return cache[filename.replace(/^\.\//, '')];
    };


    template.helper = function (name, helper) {
        helpers[name] = helper;
    };


    if (typeof define === 'function') {define(function() {return template;});} else if (typeof exports !== 'undefined') {module.exports = template;} else {this.template = template;}
    /**
 * Created by jack on 2017/6/27.
 */
template.helper('dateFormat', function (date, format) {

    date = new Date(date.replace(/-/g,'/'));

    var map = {
        "M": date.getMonth() + 1, //月份
        "d": date.getDate(), //日
        "h": date.getHours(), //小时
        "m": date.getMinutes(), //分
        "s": date.getSeconds(), //秒
        "q": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    format = format.replace(/([yMdhmsqS])+/g, function(all, t){
        var v = map[t];
        if(v !== undefined){
            if(all.length > 1){
                v = '0' + v;
                v = v.substr(v.length-2);
            }
            return v;
        }
        else if(t === 'y'){
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;
});

template.helper('getImgPath',function (imgName) {
    return '/static/resources/images/'+imgName;
});

template.helper('getActivityDescByType',function (type) {
    //活动列表页、活动详情页，都会用到，故放在这，维护数据一致性。
    return ['','报名中','报名截止','进行中','已结束'][type||4];
});



    /*v:17*/
template('index',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,order=$data.order,d=$data.d,$string=$utils.$string,g=$data.g,getImgPath=$helpers.getImgPath,errMsg=$data.errMsg,$out='';if(order){
var d = order;

$out+='\n<div class="mobile_outcontainer">\n    <div class="mobile_nopadding_container2">\n        <div class="c_activity_bindtop">\n            <div class="c_activity_bindtop_inner">\n                <div class="c_activity_bindtop_inner_left"><a href="#"><img src="';
$out+=$string(d.banner_url);
$out+='" /></a></div>\n                <div class="c_activity_bindtop_inner_right">\n                    <span class="c_activity_bindtop_inner_right1">';
$out+=$string(d.activity_name);
$out+='</span>\n                    <span class="c_activity_bindtop_inner_right2">';
$out+=$string(d.activity_address);
$out+='</span>\n                    <span class="c_activity_bindtop_inner_right2">';
$out+=$string(d.activity_start_time.replace(/-/g,'/'));
$out+='-';
$out+=$string(d.activity_end_time.replace(/-/g,'/'));
$out+='</span>\n                </div>\n            </div>\n        </div>\n\n        <div class="c_activity_signconfirmlist">\n            <div class="c_activity_signconfirmlist_author">\n                <div class="c_activity_signconfirmlist_author_inner1">\n                    <div class="c_activity_signconfirmlist_author_inner1_border"></div>\n                </div>\n                <div class="c_activity_signconfirmlist_author_inner2"><img src="';
$out+=$string(d.headimgurl);
$out+='" /></div>\n                <div class="c_activity_signconfirmlist_author_inner1">\n                    <div class="c_activity_signconfirmlist_author_inner1_border"></div>\n                </div>\n            </div>\n            <div class="c_activity_signconfirmlist_inner">\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>签到成员</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(d.contact_name);
$out+='</div>\n                </div>\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>电话</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(d.contact_mobile);
$out+='</div>\n                </div>\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>邮箱</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(d.contact_email);
$out+='</div>\n                </div>\n            </div>\n        </div>\n\n        <div class="c_activity_bindbtn"><a href="javascript:;" style="cursor:pointer;" class="c_activity_bindbtn_inner" id="Submit">确认签到</a></div>\n\n    </div>\n</div>\n';
}else{
$out+='\n<div class="c_nodata_box3">\n    <b class="c_nodata_box3_img"><img src="';
$out+=$string(getImgPath('list_activity.png'));
$out+='" /></b>\n    <span class="c_nodata_box3_txt">';
$out+=$string(errMsg);
$out+='</span>\n</div>\n';
}
return new String($out);
});

}()