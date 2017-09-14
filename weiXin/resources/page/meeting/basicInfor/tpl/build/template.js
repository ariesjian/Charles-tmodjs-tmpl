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



    /*v:2*/
template('index',function($data,$filename
/*``*/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,errMsg=$data.errMsg,$string=$utils.$string,getImgPath=$helpers.getImgPath,d=$data.d,meeting_room=$data.meeting_room,is_company_manager=$data.is_company_manager,sers=$data.sers,k=$data.k,r=$data.r,$out='';if(errMsg){
$out+='\n<div class="c_nodata_box3">\n    <b class="c_nodata_box3_img"><img src="';
$out+=$string(getImgPath('list_activity.png'));
$out+='" /></b>\n    <span class="c_nodata_box3_txt">';
$out+=$string(errMsg);
$out+='</span>\n</div>\n';
}else{
var d = meeting_room;

$out+='\n<div class="mobile_outcontainer">\n    <div class="mobile_nopadding_container1">\n        <div class="c_zone_introtop"><img src="';
$out+=$string(d.banner_url);
$out+='" /></div>\n        <div class="c_zone_introdetail">\n            <div class="c_zone_company_box1 c_room_detail_box1">\n                <div class="c_zone_company_box1_inner c_room_detail_box1_inner">\n                    <div class="c_room_showdetail_topleft">\n                        <span>';
$out+=$string(d.name);
$out+='</span><label>';
$out+=$string(d.address);
$out+='</label>\n                    </div>\n                    <div class="c_room_showdetail_topright">&yen;';
$out+=$string(0==is_company_manager?d.price:d.vip_price);
$out+='/半小时</div>\n                </div>\n                <div class="c_room_detail_box1_inner_bottom"></div>\n            </div>\n            <div class="c_zone_introdetail_box2 c_roomdetail_box2">\n                <div class="c_zone_introdetail_box2_title c_roomdetail_box2_title"><b></b><span>会议室配置</span></div>\n                <div class="c_zone_introdetail_box2_des">\n                    <div class="c_roomdetail_box2_des_inner">\n                        <label class="c_roomdetail_box2_des_inner_left">容纳</label><b class="c_roomdetail_box2_des_inner_right">';
$out+=$string(d.person_limit||0);
$out+='人</b>\n                    </div>\n                    <div class="c_roomdetail_box2_des_inner">\n                        <label class="c_roomdetail_box2_des_inner_left">面积</label><b class="c_roomdetail_box2_des_inner_right">';
$out+=$string(d.area||0);
$out+='㎡</b>\n                    </div>\n                    <div class="c_roomdetail_box2_des_inner">\n                        <label class="c_roomdetail_box2_des_inner_left">基本服务</label><b class="c_roomdetail_box2_des_inner_right">';
$out+=$string(d.basic_services||'');
$out+='</b>\n                    </div>\n                </div>\n            </div>\n\n\n\n            <div class="c_zone_introdetail_incrementbox">\n                <div class="c_zone_introdetail_incrementbox_title"><b></b><span>增值服务</span></div>\n                <div class="c_zone_introdetail_incrementbox_des">\n                	';

                        var sers=d.special_services;
                        for(var k=0;k<sers.length;k++){
                        var r = sers[k];
                        
$out+='\n                    <div class="c_zone_introdetail_incrementbox_des_inner">\n                        <label class="c_zone_introdetail_incrementbox_des_inner_top">提前';
$out+=$string(r.hours);
$out+='小时</label>\n                        <b class="c_zone_introdetail_incrementbox_des_inner_bottom">';
$out+=$string(r.services);
$out+='</b>\n                    </div>\n                    ';
}
$out+='\n                </div>\n            </div>\n\n\n        </div>\n    </div>\n\n    <div class="footer_fixed_box" style="padding: 0 15px;border-top: none;height: auto;box-shadow: 0 0 10px #ddd;">\n        <a href="/index.php/index/meeting/pageMeetingRoomTimeSelection?meeting_room_id=';
$out+=$string(d.id);
$out+='" class="footer_fixed_room_box" style="margin: 12px 0;cursor:pointer;">预定</a>\n    </div>\n\n</div>\n';
}
return new String($out);
});

}()