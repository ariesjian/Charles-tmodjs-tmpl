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
'use strict';var $utils=this,$helpers=$utils.$helpers,$string=$utils.$string,current_date=$data.current_date,is_today_signed=$data.is_today_signed,continuation_sign_days=$data.continuation_sign_days,start_day_of_week=$data.start_day_of_week,i=$data.i,this_month_days=$data.this_month_days,d=$data.d,$out='';$out+='<div class="mobile_outcontainer">\r\n    <div class="mobile_nopadding_container1">\r\n        <div class="c_user_signtop">\r\n            <div class="c_user_sign_successbox1">';
$out+=$string(current_date);
$out+='</div>\r\n            ';
if(1===is_today_signed){
$out+='\r\n            <div class="c_user_sign_successbox2 singnp" style="cursor:pointer;" ><img src="/static/resources/images/sign1.png" /></div>\r\n            <div class="c_user_sign_successbox3" style="cursor:pointer;" >签到成功</div>\r\n            ';
}
$out+='\r\n            ';
if(0===is_today_signed){
$out+='\r\n            <div class="c_user_sign_successbox2 singnp" style="cursor:pointer;position: relative;" >\r\n                <img src="/static/resources/images/sin1.png" />\r\n                <div class="texts" style="color: white;font-size: 19px; position: absolute;width: 80px;text-align: center;left: calc(50% - 40px); top: 55px;height: 20px;line-height: 20px;">签到</div></div>\r\n            <div class="c_user_sign_successbox3" style="cursor:pointer;" >未签到</div>\r\n            ';
}
$out+='\r\n\r\n        </div>\r\n\r\n        <div class="c_user_signcon">\r\n            <div class="c_user_signcon_inner">\r\n                <div class="c_user_signcon_inner_title">\r\n                    <div class="c_user_signcon_inner_title_left"><img src="/static/resources/images/icon15.png" />签到统计</div>\r\n                    <div class="c_user_signcon_inner_title_right">已坚持';
$out+=$string(continuation_sign_days);
$out+='天</div>\r\n                </div>\r\n                <div class="c_user_signcon_inner_exp">\r\n                    ';
if(1==is_today_signed){
$out+='\r\n                    <div class="c_user_signcon_inner_exp1">\r\n                        <label class="c_user_signcon_inner_exp1_bg"></label>\r\n                        <span class="c_user_signcon_inner_exp1_txt">已签到</span>\r\n                    </div>\r\n                    <div class="c_user_signcon_inner_exp2">\r\n                        <label class="c_user_signcon_inner_exp2_bg"></label>\r\n                        <span class="c_user_signcon_inner_exp2_txt">未签到</span>\r\n                    </div>\r\n                    ';
}
$out+='\r\n                    ';
if(0==is_today_signed){
$out+='\r\n                    <div class="c_user_signcon_inner_exp1">\r\n                        <label class="c_user_signcon_inner_exp1_bg"></label>\r\n                        <span class="c_user_signcon_inner_exp1_txt">未签到</span>\r\n                    </div>\r\n                    <div class="c_user_signcon_inner_exp2">\r\n                        <label class="c_user_signcon_inner_exp2_bg"></label>\r\n                        <span class="c_user_signcon_inner_exp2_txt">已签到</span>\r\n                    </div>\r\n\r\n                    ';
}
$out+='\r\n                </div>\r\n                <div class="c_user_signcon_inner_date">\r\n                    <div class="c_user_signcon_inner_date_title">\r\n                        <span class="c_user_signcon_inner_date_title_inner">一</span>\r\n                        <span class="c_user_signcon_inner_date_title_inner">二</span>\r\n                        <span class="c_user_signcon_inner_date_title_inner">三</span>\r\n                        <span class="c_user_signcon_inner_date_title_inner">四</span>\r\n                        <span class="c_user_signcon_inner_date_title_inner">五</span>\r\n                        <span class="c_user_signcon_inner_date_title_inner">六</span>\r\n                        <span class="c_user_signcon_inner_date_title_inner">日</span>\r\n                    </div>\r\n                    <div class="c_user_signcon_inner_date_con">\r\n                        ';
if(0==start_day_of_week){
$out+='\r\n                        <div class="c_user_signcon_inner_date_con_inner"></div>\r\n                        <div class="c_user_signcon_inner_date_con_inner"></div>\r\n                        <div class="c_user_signcon_inner_date_con_inner"></div>\r\n                        <div class="c_user_signcon_inner_date_con_inner"></div>\r\n                        <div class="c_user_signcon_inner_date_con_inner"></div>\r\n                        <div class="c_user_signcon_inner_date_con_inner"></div>\r\n                        ';
}
$out+='\r\n                        ';
if(1==start_day_of_week){
$out+='\r\n                        ';
}
$out+='\r\n                        ';
if(2==start_day_of_week){
$out+='\r\n                        <div class="c_user_signcon_inner_date_con_inner"></div>\r\n                        ';
}
$out+='\r\n                        ';
if(3==start_day_of_week){
$out+='\r\n                        <div class="c_user_signcon_inner_date_con_inner"></div>\r\n                        <div class="c_user_signcon_inner_date_con_inner"></div>\r\n                        ';
}
$out+='\r\n                        ';
if(4==start_day_of_week){
$out+='\r\n                        <div class="c_user_signcon_inner_date_con_inner"></div>\r\n                        <div class="c_user_signcon_inner_date_con_inner"></div>\r\n                        <div class="c_user_signcon_inner_date_con_inner"></div>\r\n                        ';
}
$out+='\r\n                        ';
if(5==start_day_of_week){
$out+='\r\n                        <div class="c_user_signcon_inner_date_con_inner"></div>\r\n                        <div class="c_user_signcon_inner_date_con_inner"></div>\r\n                        <div class="c_user_signcon_inner_date_con_inner"></div>\r\n                        <div class="c_user_signcon_inner_date_con_inner"></div>\r\n                        ';
}
$out+='\r\n                        ';
if(6==start_day_of_week){
$out+='\r\n                        <div class="c_user_signcon_inner_date_con_inner"></div>\r\n                        <div class="c_user_signcon_inner_date_con_inner"></div>\r\n                        <div class="c_user_signcon_inner_date_con_inner"></div>\r\n                        <div class="c_user_signcon_inner_date_con_inner"></div>\r\n                        <div class="c_user_signcon_inner_date_con_inner"></div>\r\n                        ';
}
$out+='\r\n                        ';

                        for(var i=0;i< this_month_days.length ;i++){
                        var d = this_month_days[i];
                        
$out+='\r\n                        ';
if(0===d.is_signed && (current_date.substr(8,2))-0>(d.day_of_month)-0){
$out+='\r\n                        <div class="c_user_signcon_inner_date_con_inner"><span class="c_sign_nosigned">';
$out+=$string(d.day_of_month);
$out+='</span></div>\r\n                        ';
}
$out+='\r\n                        ';
if(1===d.is_signed && (current_date.substr(8,2))-0>(d.day_of_month)-0){
$out+='\r\n                        <div class="c_user_signcon_inner_date_con_inner"><span class="c_sign_signed">';
$out+=$string(d.day_of_month);
$out+='</span></div>\r\n                        ';
}
$out+='\r\n                        ';
if(0===d.is_signed && (current_date.substr(8,2))-0<(d.day_of_month)-0){
$out+='\r\n                        <div class="c_user_signcon_inner_date_con_inner"><span class="c_sign_waitsign">';
$out+=$string(d.day_of_month);
$out+='</span></div>\r\n                        ';
}
$out+='\r\n                        ';
if( current_date.substr(8,2)-0===d.day_of_month-0){
$out+='\r\n                       <div class="c_user_signcon_inner_date_con_inner"><span class="c_sign_signed_today"><img src="/static/resources/images/sign3.png" /></span></div>';
}
$out+='\r\n                        ';
}
$out+='\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n\r\n</div>\r\n';
return new String($out);
});

}()