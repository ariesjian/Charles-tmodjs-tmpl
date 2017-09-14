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



    /*v:19*/
template('index',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$string=$utils.$string,contact_sex=$data.contact_sex,getImgPath=$helpers.getImgPath,$out='';$out+='<div class="mobile_outcontainer" id="Register">\n    <div class="mobile_nopadding_container2">\n        <div class="c_user_bindpho">\n            <div class="c_user_bindpho_inner1">\n                <label class="c_user_bindpho_inner1_left">姓名</label>\n                <input class="j-true_name c_user_bindpho_inner1_right" maxlength="30" value="" placeholder="请输入姓名" type="text"/>\n            </div>\n\n            <div class="c_user_bindpho_inner2">\n                <div class="c_user_bindpho_inner2_left">性别</div>\n                <div class="c_user_bindpho_inner2_right">\n                    <div style="cursor:pointer;" class="c_user_bindpho_inner2_option j-sex" data-sex="1" data-checked="';
$out+=$string(2!=contact_sex?1:0);
$out+='" style="margin-left: 0;"><b class="c_user_bindpho_inner2_option_btn"><img class="j-img" src="';
$out+=$string(getImgPath(2!=contact_sex?'select2.png':'select1.png'));
$out+='" style="cursor:pointer;"/></b><label class=" c_user_bindpho_inner2_option_txt">男 </label></div>\n                    <div style="cursor:pointer;" class="c_user_bindpho_inner2_option j-sex" data-sex="2" data-checked="';
$out+=$string(2==contact_sex?1:0);
$out+='"> <b class="c_user_bindpho_inner2_option_btn"><img class="j-img" src="';
$out+=$string(getImgPath(2==contact_sex?'select2.png':'select1.png'));
$out+='"  style="cursor:pointer;" /></b><label class="c_user_bindpho_inner2_option_txt">女 </label> </div>\n                </div>\n            </div>\n\n            <div class="c_user_bindpho_inner1">\n                <label class="c_user_bindpho_inner1_left">手机号</label>\n                <input type="text" maxlength="11" class="j-mobile c_user_bindpho_inner1_right"  onkeyup="value=value.replace(/[^\\d]/g,\'\')"  value="" placeholder="请输入手机号"/>\n            </div>\n\n            <div class="c_user_bindpho_inner3">\n                <input maxlength="8" class="j-code c_user_bindpho_inner3_left" placeholder="输入验证码" type="number"/>\n                <span class="j-send_code c_user_bindpho_inner3_right" style="cursor:pointer;">发送验证码</span>\n            </div>\n            <div class="c_user_bindpho_inner1">\n                <label class="c_user_bindpho_inner1_left">邀请码</label>\n                <input class="j-invite_code c_user_bindpho_inner1_right" maxlength="30" value="" placeholder="请输入邀请码（选填）"/>\n            </div>\n        </div>\n\n        <div class="c_user_bindpho_btn"><label style="cursor:pointer;" class="j-confirm  c_user_bindpho_btn_inner">确认</label></div>\n\n    </div>\n\n</div>';
return new String($out);
});

}()