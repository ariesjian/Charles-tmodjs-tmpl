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



    /*v:1*/
template('index',function($data,$filename
/*``*/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,order_list=$data.order_list,i=$data.i,info=$data.info,$string=$utils.$string,getImgPath=$helpers.getImgPath,$out='';if(order_list && order_list.length){
$out+='\r\n<div class="mobile_outcontainer">\r\n    <div class="mobile_nopadding_container2">\r\n        <div class="c_station_minecon">\r\n            <ul>\r\n                ';

                for(var i=0;i< order_list.length;i++){
                var info = order_list[i];
                
$out+='\r\n\r\n                <li>\r\n\r\n                   <a href="/index.php/index/office/pageOrderDetail?order_id=';
$out+=$string(info.id);
$out+='" class="c_station_minelist_inner1">\r\n                    <div class="c_station_minelist_inner1_left"><img src="';
$out+=$string(info.office_list_img_url || '');
$out+='" /></div>\r\n                        <div class="c_station_minelist_inner1_right">\r\n                            <span class="c_station_minelist_inner1_right1">';
$out+=$string(info.office_name || '');
$out+=' </span>\r\n                            <span class="c_station_minelist_inner1_right3">单价: &yen;';
$out+=$string(info.office_price || '');
$out+='/月</span>\r\n                        </div>\r\n                    </a>\r\n                    <div class="c_station_minelist_inner2">\r\n                        ';
if(info.status==9){
$out+='\r\n                        <div class="c_station_minelist_inner2_left c_station_minelist_status3">超时已取消</div>\r\n                        <div class="c_station_minelist_inner2_right">\r\n                            <a href="/index.php/index/office/pageOrderDetail?order_id=';
$out+=$string(info.id);
$out+='" style="cursor:pointer;" >删除订单</a></div>\r\n                        ';
}
$out+='\r\n                        ';
if(info.status==3){
$out+='\r\n                        <div class="c_station_minelist_inner2_left c_station_minelist_status2">审核失败</div>\r\n                        ';
}
$out+='\r\n                        ';
if(info.status==2){
$out+='\r\n                        <div class="c_station_minelist_inner2_left c_station_minelist_status1">已交付<label class="c_minelist_leftcolor">（审核通过）</label></div>\r\n                        ';
}
$out+='\r\n                        ';
if(info.status==1){
$out+='\r\n                        <div class="c_station_minelist_inner2_left c_station_minelist_status1">已支付<label class="c_minelist_leftcolor">（审核中）</label></div>\r\n                        ';
}
$out+='\r\n                        ';
if(info.status==0){
$out+='\r\n                        <div class="c_station_minelist_inner2_left c_station_minelist_status4">未支付</div>\r\n                        ';
}
$out+='\r\n                        <div class="c_station_minelist_inner2_right">\r\n                            ';
if(info.status==1 || info.status==2){
$out+='\r\n                            <a href="#" style="cursor:pointer;" >查看合同</a>\r\n                            ';
}
$out+='\r\n                            ';
if(info.status==2){
$out+='\r\n                            <a href="/index.php/index/office/pageOrderDetail?order_id=';
$out+=$string(info.id);
$out+='" class="xuzu1" style="cursor:pointer;" >续租</a>\r\n                            <input type="hidden" class="orderId" value="';
$out+=$string(info.id || '');
$out+='">\r\n                            <input type="hidden" class="office_id" value="';
$out+=$string(info.office_id || '');
$out+='">\r\n                            <input type="hidden" class="start_date" value="';
$out+=$string(info.start_date || '');
$out+='">\r\n                            <input type="hidden" class="end_date" value="';
$out+=$string(info.end_date || '1');
$out+='">\r\n                            <input type="hidden" class="contact_name" value="';
$out+=$string(info.contact_name || '');
$out+='">\r\n                            <input type="hidden" class="contact_mobile" value="';
$out+=$string(info.contact_mobile || '1');
$out+='">\r\n                            ';
}
$out+='\r\n                            ';
if(info.status==0){
$out+='\r\n                            <a href="/index.php/index/office/pageOrderDetail?order_id=';
$out+=$string(info.id);
$out+='" class="zhifu" style="cursor:pointer;" >去支付</a>\r\n                            ';
}
$out+='\r\n                        </div>\r\n                    </div>\r\n                </li>\r\n                ';
}
$out+='\r\n\r\n            </ul>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n';
}else{
$out+='\r\n<div class="c_nodata_box4">\r\n    <b class="c_nodata_box4_img"><img src="';
$out+=$string(getImgPath('booking_office.png'));
$out+='" /></b>\r\n    <span class="c_nodata_box4_txt">暂时没有相关的内容</span>\r\n</div>\r\n';
}
$out+='\r\n';
return new String($out);
});

}()