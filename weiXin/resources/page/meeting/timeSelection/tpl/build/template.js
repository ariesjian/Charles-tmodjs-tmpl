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



    /*v:14*/
template('index',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,errMsg=$data.errMsg,$string=$utils.$string,getImgPath=$helpers.getImgPath,i=$data.i,sevenDays=$data.sevenDays,meeting_room_name=$data.meeting_room_name,$out='';if(errMsg){
$out+='\n<div class="c_nodata_box3">\n    <b class="c_nodata_box3_img"><img src="';
$out+=$string(getImgPath('list_activity.png'));
$out+='" /></b>\n    <span class="c_nodata_box3_txt">';
$out+=$string(errMsg);
$out+='</span>\n</div>\n';
}else{
$out+='\n<div class="mobile_outcontainer">\n    <div class="mobile_nopadding_container1" style="padding-bottom: 74px;">\n        <div class="c_room_listtab2">\n            <div class="c_room_listtab2_box">\n                <ul>\n                    ';
for(var i=0;i<sevenDays.length;i++){
$out+='\n                    <li style="cursor:pointer;" class="j-nav c_room_listtab2_inner ';
$out+=$string(0==i?'c_room_tabselected':' ');
$out+='" data-date="';
$out+=$string(sevenDays[i].fullDate);
$out+='">\n                        <a href="javascript:;" class="c_room_listtab2_inner_a">\n                            <span class="c_room_listtab2_inner_week">';
$out+=$string(sevenDays[i].week);
$out+='</span>\n                            <span class="c_room_listtab2_inner_date">';
$out+=$string(sevenDays[i].monthDay);
$out+='</span>\n                        </a>\n                    </li>\n                    ';
}
$out+='\n                </ul>\n            </div>\n        </div>\n\n        <div class="c_room_timeselectcon">\n            <div class="j-name c_room_timeselectcon_box1">';
$out+=$string(meeting_room_name||'');
$out+='</div>\n            <div class="c_room_timeselectcon_box2">\n                <div class="c_room_timeselectcon_box2_inner" style="margin-left: 0;">\n                    <b class="c_room_timeselectcon_box2_inner_status c_timeselect_status1"></b>\n                    <span class="c_room_timeselectcon_box2_inner_txt">不可预定</span>\n                </div>\n                <div class="c_room_timeselectcon_box2_inner">\n                    <b class="c_room_timeselectcon_box2_inner_status c_timeselect_status2"></b>\n                    <span class="c_room_timeselectcon_box2_inner_txt">可预定</span>\n                </div>\n                <div class="c_room_timeselectcon_box2_inner">\n                    <b class="c_room_timeselectcon_box2_inner_status c_timeselect_status3"></b>\n                    <span class="c_room_timeselectcon_box2_inner_txt">我的预定</span>\n                </div>\n            </div>\n\n            <div class="c_room_timeselectcon_box3">\n                <div class="c_room_timeselectcon_box3_title">上午</div>\n                <div class="c_room_timeselectcon_box3_options">\n                    <span style="cursor:pointer;margin-left: 0;" data-index="0" class="j-time-option c_room_timeselectcon_box3_options_inner" >08:00-08:30</span>\n                    <span style="cursor:pointer;" data-index="1" class="j-time-option c_room_timeselectcon_box3_options_inner">08:30-09:00</span>\n                    <span style="cursor:pointer;" data-index="2" class="j-time-option c_room_timeselectcon_box3_options_inner">09:00-09:30</span>\n                    <span style="cursor:pointer;margin-left: 0;" data-index="3" class="j-time-option c_room_timeselectcon_box3_options_inner" >09:30-10:00</span>\n                    <span style="cursor:pointer;" data-index="4" class="j-time-option c_room_timeselectcon_box3_options_inner">10:00-10:30</span>\n                    <span style="cursor:pointer;" data-index="5" class="j-time-option c_room_timeselectcon_box3_options_inner">10:30-11:00</span>\n                    <span style="cursor:pointer;margin-left: 0;" data-index="6" class="j-time-option c_room_timeselectcon_box3_options_inner" >11:00-11:30</span>\n                    <span style="cursor:pointer;" data-index="7" class="j-time-option c_room_timeselectcon_box3_options_inner">11:30-12:00</span>\n                </div>\n            </div>\n            <div class="c_room_timeselectcon_box3">\n                <div class="c_room_timeselectcon_box3_title">下午</div>\n                <div class="c_room_timeselectcon_box3_options">\n                    <span style="cursor:pointer;margin-left: 0;" data-index="8" class="j-time-option c_room_timeselectcon_box3_options_inner" >12:00-12:30</span>\n                    <span style="cursor:pointer;" data-index="9" class="j-time-option c_room_timeselectcon_box3_options_inner">12:30-13:00</span>\n                    <span style="cursor:pointer;" data-index="10" class="j-time-option c_room_timeselectcon_box3_options_inner">13:00-13:30</span>\n                    <span style="cursor:pointer;margin-left: 0;" data-index="11" class="j-time-option c_room_timeselectcon_box3_options_inner" >13:30-14:00</span>\n                    <span style="cursor:pointer;" data-index="12" class="j-time-option c_room_timeselectcon_box3_options_inner">14:00-14:30</span>\n                    <span style="cursor:pointer;" data-index="13" class="j-time-option c_room_timeselectcon_box3_options_inner">14:30-15:00</span>\n                    <span style="cursor:pointer;margin-left: 0;" data-index="14" class="j-time-option c_room_timeselectcon_box3_options_inner" >15:00-15:30</span>\n                    <span style="cursor:pointer;" data-index="15" class="j-time-option c_room_timeselectcon_box3_options_inner">15:30-16:00</span>\n                    <span style="cursor:pointer;" data-index="16" class="j-time-option c_room_timeselectcon_box3_options_inner">16:00-16:30</span>\n                    <span style="cursor:pointer;margin-left: 0;" data-index="17" class="j-time-option c_room_timeselectcon_box3_options_inner" >16:30-17:00</span>\n                </div>\n            </div>\n            <div class="c_room_timeselectcon_box3">\n                <div class="c_room_timeselectcon_box3_title">晚上</div>\n                <div class="c_room_timeselectcon_box3_options">\n                    <span style="cursor:pointer;margin-left: 0;" data-index="18" class="j-time-option c_room_timeselectcon_box3_options_inner" >17:00-17:30</span>\n                    <span style="cursor:pointer;" data-index="19" class="j-time-option c_room_timeselectcon_box3_options_inner">17:30-18:00</span>\n                    <span style="cursor:pointer;" data-index="20" class="j-time-option c_room_timeselectcon_box3_options_inner">18:00-18:30</span>\n                    <span style="cursor:pointer;margin-left: 0;" data-index="21" class="j-time-option c_room_timeselectcon_box3_options_inner" >18:30-19:00</span>\n                    <span style="cursor:pointer;" data-index="22" class="j-time-option c_room_timeselectcon_box3_options_inner">19:00-19:30</span>\n                    <span style="cursor:pointer;" data-index="23" class="j-time-option c_room_timeselectcon_box3_options_inner">19:30-20:00</span>\n                </div>\n            </div>\n\n        </div>\n\n    </div>\n\n    <div class="c_room_timeselect_fixed_box">\n        <div class="j-submit c_room_timeselect_fixed_box_inner" style="cursor:pointer;"><span class="c_room_timeselect_fixed_box_inner_btn">确认</span></div>\n    </div>\n\n</div>\n';
}
return new String($out);
});

}()