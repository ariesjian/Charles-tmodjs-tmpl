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
'use strict';var $utils=this,$helpers=$utils.$helpers,order=$data.order,d=$data.d,$string=$utils.$string,getImgPath=$helpers.getImgPath,g=$data.g,$out='';if(order){
var d = order;

$out+='\n<div class="mobile_outcontainer">\n    <div class="mobile_nopadding_container1">\n\n        <div class="c_station_reserve">\n            <div class="c_station_reserve_inner">\n                <b class="c_station_reserve_inner_img"><img src="';
$out+=$string(getImgPath('enroll_success.png'));
$out+='" /></b>\n                <label class="c_station_reserve_inner_txt1">报名成功</label>\n                <label class="c_station_reserve_inner_txt2">欢迎参加 ';
$out+=$string(d.activity_name);
$out+='</label>\n            </div>\n        </div>\n\n        <div class="c_station_reservelist">\n            <div class="c_activity_confirmlist_inner" style="border-radius: 0;">\n                <div class="c_ordersuccess_title">\n                    <div class="weui-cell">\n                        <div class="weui-cell__bd">\n                            <p>订单编号</p>\n                        </div>\n                        <div class="weui-cell__ft">';
$out+=$string(d.order_number);
$out+='</div>\n                    </div>\n                </div>\n                <div class="c_ordersuccess_box">\n                    <div class="weui-cell">\n                        <div class="weui-cell__bd">\n                            <p>地址</p>\n                        </div>\n                        <div class="weui-cell__ft">';
$out+=$string(d.activity_address);
$out+='</div>\n                    </div>\n                    <div class="weui-cell">\n                        <div class="weui-cell__bd">\n                            <p>活动时间</p>\n                        </div>\n                        <div class="weui-cell__ft">';
$out+=$string(d.activity_start_time.replace(/-/g,'/'));
$out+='-';
$out+=$string(d.activity_end_time.replace(/-/g,'/'));
$out+='</div>\n                    </div>\n                    <div class="weui-cell">\n                        <div class="weui-cell__bd">\n                            <p>总金额</p>\n                        </div>\n                        <div class="weui-cell__ft">&yen;';
$out+=$string(d.price);
$out+='</div>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n        <div class="c_station_reservelist">\n            <div class="c_activity_confirmlist_inner" style="border-radius: 0;">\n                <div class="c_ordersuccess_box">\n                    <a class="weui-cell weui-cell_access" href="javascript:;" id="ShowQRCode" data-order_id="';
$out+=$string(d.id);
$out+='" data-activity_name="';
$out+=$string(d.activity_name);
$out+='" data-enroll_qrcode_url="';
$out+=$string(d.enroll_qrcode_url);
$out+='">\n                        <div class="weui-cell__bd" style="font-size: 15px;">\n                            <p>我的二维码</p>\n                        </div>\n                        <div class="weui-cell__ft">\n                        </div>\n                    </a>\n                </div>\n            </div>\n        </div>\n        <div class="c_activity_enroll_btn"><a href="/index.php/index/activity/pageMemberActivityOrderDetail?order_id=';
$out+=$string(d.id);
$out+='" class="c_activity_enroll_btn_inner">查看订单详情</a></div>\n\n    </div>\n</div>\n';
}else{
$out+='\n<div class="c_nodata_box3">\n    <b class="c_nodata_box3_img"><img src="';
$out+=$string(getImgPath('list_activity.png'));
$out+='" /></b>\n    <span class="c_nodata_box3_txt">无法加载页面，请稍后再试</span>\n</div>\n';
}
return new String($out);
});/*v:1*/
template('qrcode',function($data,$filename
/*``*/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$string=$utils.$string,activity_name=$data.activity_name,getImgPath=$helpers.getImgPath,enroll_qrcode_url=$data.enroll_qrcode_url,$out='';$out+='<div class="c_activity_codepopup" id="QRCodeView">\n    <div class="c_activity_codepopup_inner">\n        <div class="c_activity_codepopup_inner_title">\n            <span class="c_activity_codepopup_inner_title_txt">';
$out+=$string(activity_name||'');
$out+='</span>\n            <a href="javascript:;" class="j-close c_activity_codepopup_close"><img src="';
$out+=$string(getImgPath('close.png'));
$out+='" /></a>\n        </div>\n        <div class="c_activity_codepopup_inner_img">\n            <span class="c_activity_codepopup_inner_img_txt">扫描二维码<br />可获得10积分</span>\n            <b class="c_activity_codepopup_inner_img_img"><img src="';
$out+=$string(enroll_qrcode_url);
$out+='" /></b>\n        </div>\n    </div>\n</div>\n';
return new String($out);
});

}()