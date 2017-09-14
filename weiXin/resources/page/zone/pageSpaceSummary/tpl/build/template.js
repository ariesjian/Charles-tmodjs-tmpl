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



    /*v:3*/
template('index',function($data,$filename
/*``*/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,summary=$data.summary,$string=$utils.$string,space_list=$data.space_list,i=$data.i,info=$data.info,getImgPath=$helpers.getImgPath,$out='';if(summary){
$out+='\r\n<div class="mobile_outcontainer">\r\n    <div class="mobile_nopadding_container2">\r\n        <div class="c_zone_introtop"><img src="';
$out+=$string(summary.banner_url || '');
$out+='" /></div>\r\n        <div class="c_zone_introdetail">\r\n            <div class="c_zone_ezonedetail_box1">\r\n                <div class="c_zone_ezonedetail_box1_inner">\r\n                    <span>';
$out+=$string(summary.title || '');
$out+='</span><label>';
$out+=$string(summary.address || '');
$out+='</label>\r\n                </div>\r\n            </div>\r\n            <div class="c_zone_introdetail_box2">\r\n                <div class="c_zone_introdetail_box2_export2">\r\n                    ';

                    var space_list=summary.space_list
                    for(var i=0;i< space_list.length;i++){
                    var info = space_list[i];
                    
$out+='\r\n                    <a href="/index.php/index/zone/pageSpaceDetail?space_id=';
$out+=$string(info.id);
$out+='" class="c_zone_introdetail_box2_export2_inner" ';
$out+=$string(2==i?'style=padding-right:0;':'');
$out+=' ><b><img src="';
$out+=$string(info.banner_url || '');
$out+='" /></b><span ';
$out+=$string(2==i?'style=padding-right:0;':'');
$out+=' >';
$out+=$string(info.name || '');
$out+='<img src="/static/resources/images/zone_right.png" /></span></a>\r\n                    ';
}
$out+='\r\n                </div>\r\n                <div class="c_zone_introdetail_box2_title"><b></b><span>空间介绍</span></div>\r\n                <div class="c_zone_introdetail_box2_des">';
$out+=$string(summary.description || '');
$out+='</div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n';
}else{
$out+='\r\n<div style="font-size: 30px;text-align: center;">\r\n    <div class="c_nodata_box4">\r\n        <b class="c_nodata_box4_img"><img src="';
$out+=$string(getImgPath('list_activity.png'));
$out+='" /></b>\r\n        <span class="c_nodata_box4_txt">暂时没有相关的内容</span>\r\n    </div></div>\r\n';
}
return new String($out);
});

}()