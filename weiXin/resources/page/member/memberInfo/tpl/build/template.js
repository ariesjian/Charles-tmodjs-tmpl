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



    /*v:4*/
template('index',function($data,$filename
/*``*/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,user=$data.user,$string=$utils.$string,getImgPath=$helpers.getImgPath,g=$data.g,$out='';if(user){
$out+='\r\n<div class="mobile_outcontainer">\r\n    <div class="mobile_nopadding_container1" id="modify">\r\n        <div class="c_user_infotop">\r\n        	<img src="/static/resources/images/c_user_card2.png"/>\r\n        	<span>';
$out+=$string(user.card_number);
$out+='</span>\r\n        </div>\r\n        <div class="c_user_bindpho">\r\n            ';
if(user.invite_code){
$out+='\r\n            <div class="c_user_bindpho_inner1 c_user_bindpho_inner1_noborder">\r\n                <label class="c_user_bindpho_inner1_left">邀请码</label>\r\n                <input class="j-invite_code c_user_bindpho_inner1_right" placeholder="选填" value="';
$out+=$string(user.invite_code);
$out+='" disabled/>\r\n            </div>\r\n\r\n            ';
}
$out+='\r\n            ';
if(user.true_name){
$out+='\r\n            <div class="c_user_bindpho_inner1 ">\r\n                <label class="c_user_bindpho_inner1_left">姓名</label>\r\n                <input class="j-true_name c_user_bindpho_inner1_right" placeholder="请输入姓名" value="';
$out+=$string(user.true_name);
$out+='" type="text"/>\r\n            </div>\r\n            ';
}
$out+='\r\n            ';
if(user.sex){
$out+='\r\n            <div class="c_user_bindpho_inner2">\r\n                <div class="c_user_bindpho_inner2_left">性别</div>\r\n                <div class="c_user_bindpho_inner2_right">\r\n                    <div class="c_user_bindpho_inner2_option j-sex"\r\n                         data-sex="1" style="cursor:pointer;"\r\n                         data-checked="';
$out+=$string(2!=user.sex?1:0);
$out+='"\r\n                         style="margin-left: 0;"><b class="c_user_bindpho_inner2_option_btn"><img class="j-img" style="cursor:pointer;"\r\n                                                                                                  src="';
$out+=$string(getImgPath(2!=user.sex?'select2.png':'select1.png'));
$out+='"/></b><label\r\n                            class=" c_user_bindpho_inner2_option_txt">男 </label></div>\r\n                    <div class="c_user_bindpho_inner2_option j-sex" style="cursor:pointer;"  data-sex="2" data-checked="';
$out+=$string(2==user.sex?1:0);
$out+='">\r\n                        <b class="c_user_bindpho_inner2_option_btn"><img class="j-img" style="cursor:pointer;"\r\n                                                                         src="';
$out+=$string(getImgPath(2==user.sex?'select2.png':'select1.png'));
$out+='"/></b><label\r\n                            class="c_user_bindpho_inner2_option_txt">女 </label></div>\r\n                </div>\r\n            </div>\r\n            ';
}
$out+='\r\n            ';
if(user.birthday){
$out+='\r\n            <div class="c_user_bindpho_inner1">\r\n                <label class="c_user_bindpho_inner1_left">生日</label>\r\n            <!--    <input class="j-birthday c_user_bindpho_inner1_right" value="';
$out+=$string(user.birthday.replace(/-/g, '-'));
$out+='" onClick="WdatePicker({dateFmt:\'yyyy-MM-dd\'})"/>\r\n          -->\r\n                <input class="j-birthday weui_input" value="';
$out+=$string(user.birthday.replace(/-/g, '-'));
$out+='"  id="showDatePicker" style="text-align: right;" readonly/>\r\n\r\n            </div>\r\n            ';
}
$out+='\r\n            ';
if(!user.birthday){
$out+='\r\n            <div class="c_user_bindpho_inner1">\r\n                <label class="c_user_bindpho_inner1_left">生日</label>\r\n            <!--    <input class="j-birthday c_user_bindpho_inner1_right" value="" onClick="WdatePicker({dateFmt:\'yyyy-MM-dd\'})"/>\r\n-->\r\n                <input class="j-birthday weui_input" value="" id="showDatePicker" readonly/>\r\n\r\n\r\n            </div>\r\n            ';
}
$out+='\r\n            <a href="/index.php/index/member/pageUpdateMemberMobile" class="c_user_info_inner1">\r\n                <label class="c_user_info_inner1_left">手机号</label>\r\n                <b class="c_user_info_inner1_right">\r\n                    <span class="j-mobile c_user_info_inner1_right_txt">';
$out+=$string(user.mobile);
$out+='</span>\r\n                    <label class="c_user_info_inner1_right_img"><img\r\n                            src="/static/resources/images/arrow_right.png"/></label>\r\n                </b>\r\n            </a>\r\n\r\n        </div>\r\n\r\n        <div class="c_user_bindpho_btn" style="cursor:pointer;"><label class="c_user_bindpho_btn_inner">保存</label></div>\r\n\r\n    </div>\r\n\r\n</div>\r\n\r\n';
}else{
$out+='\r\n<div style="font-size: 30px;text-align: center;">这里什么都没有</div>\r\n';
}
$out+='\r\n';
return new String($out);
});

}()