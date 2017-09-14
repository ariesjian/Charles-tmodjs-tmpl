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
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,orders=$data.orders,statusText=$data.statusText,i=$data.i,d=$data.d,status=$data.status,activity_type=$data.activity_type,$string=$utils.$string,g=$data.g,getImgPath=$helpers.getImgPath,$out='';if(orders && orders.length){
var statusText = {0:'待付款',1:'已支付',2:'已签到',9:'已超时取消',10:'已结束'}

$out+='\n<div class="mobile_outcontainer">\n    <div class="mobile_nopadding_container2">\n        <div class="c_activity_minecon">\n            <ul id="ActivitiesList">\n                ';
for(var i=0;i<orders.length;i++){
                var d = orders[i];
                var status = +d.status;
                var activity_type = +d.activity_type;
                
$out+='\n                <li>\n                    <div class="c_activity_minelist_inner1 j-item" data-id="';
$out+=$string(d.id);
$out+='" style="cursor:pointer;">\n                        <div class="c_activity_minelist_inner1_left"><a href="javascript:void(0);"><img src="';
$out+=$string(d.banner_url||'');
$out+='" /></a></div>\n                        <div class="c_activity_minelist_inner1_right">\n                            <span class="c_activity_minelist_inner1_right1">';
$out+=$string(d.activity_name);
$out+='</span>\n                            <span class="c_activity_minelist_inner1_right2">';
$out+=$string(d.activity_start_time.replace(/-/g,'/')||'');
$out+='~';
$out+=$string(d.activity_end_time.replace(/-/g,'/')||'');
$out+='</span>\n                            <span class="c_activity_minelist_inner1_right2">';
$out+=$string(d.activity_address||'');
$out+='</span>\n                        </div>\n                    </div>\n                    ';
if(0===status){
$out+='\n                    <div class="c_activity_minelist_inner2">\n                        <div class="c_activity_minelist_inner2_left c_activity_minelist_status4">';
$out+=$string(statusText[status]);
$out+='</div>\n                        <div class="c_activity_minelist_inner2_right">\n                            <a href="/index.php/index/activity/pageMemberActivityOrderDetail?order_id=';
$out+=$string(d.id);
$out+='">去支付</a>\n                        </div>\n                    </div>\n                    ';
}else if(1===status){
$out+='\n                    <div class="c_activity_minelist_inner2">\n                        <div class="c_activity_minelist_inner2_left c_activity_minelist_status1">\n                            ';
$out+=$string(statusText[status]);
$out+='\n                        </div>\n                        <div class="c_activity_minelist_inner2_right">\n                            <a href="javascript:void(0);" style="cursor:pointer;" class="j-show-qrcode" data-order_id="';
$out+=$string(d.id);
$out+='" data-activity_name="';
$out+=$string(d.activity_name);
$out+='" data-enroll_qrcode_url="';
$out+=$string(d.enroll_qrcode_url);
$out+='">二维码签到</a>\n                        </div>\n                    </div>\n                    ';
}else if(2===status){
$out+='\n                    <div class="c_activity_minelist_inner2">\n                        <div class="c_activity_minelist_inner2_left c_activity_minelist_status2">';
$out+=$string(statusText[status]);
$out+='</div>\n                    </div>\n                    ';
}else if(9==status){
$out+='\n                    <div class="c_activity_minelist_inner2">\n                        <div class="c_activity_minelist_inner2_left" style="color: #999;">\n                            ';
$out+=$string(statusText[status]);
$out+='\n                        </div>\n                        <div class="c_activity_minelist_inner2_right">\n                            <a href="/index.php/index/activity/pageMemberActivityOrderDetail?order_id=';
$out+=$string(d.id);
$out+='" style="cursor:pointer;color: #999;border-color: #999;" >删除订单</a>\n                        </div>\n                    </div>\n                    ';
}else if(10==status){
$out+='\n                    <div class="c_activity_minelist_inner2">\n                        <div class="c_activity_minelist_inner2_left" style="color: #999;">\n                            ';
$out+=$string(statusText[status]);
$out+='\n                        </div>\n                        <div class="c_activity_minelist_inner2_right">\n                            ';
if(0===+d.is_commented){
$out+='\n                            <a href="/index.php/index/activity/pageMemberCommentActivityOrder?order_id=';
$out+=$string(d.id);
$out+='">评价获取10积分</a>\n                            ';
}else{
$out+='\n                            <a href="javascript:void(0);">已评价</a>\n                            ';
}
$out+='\n                            ';
if(0===+d.is_answered){
$out+='\n                            <a href="/index.php/index/activity/pageAnswerActivityOrderQuestions?order_id=';
$out+=$string(d.id);
$out+='">问卷调查获取10积分</a>\n                            ';
}else{
$out+=' <a href="javascript:void(0);">已问卷调查</a>\n                            ';
}
$out+='\n                        </div>\n                    </div>\n                    ';
}
$out+='\n\n                </li>\n                ';
}
$out+='\n            </ul>\n        </div>\n    </div>\n</div>\n\n';
}else{
$out+='\n<div class="c_nodata_box3">\n    <b class="c_nodata_box3_img"><img src="';
$out+=$string(getImgPath('list_activity.png'));
$out+='" /></b>\n    <span class="c_nodata_box3_txt">您没有参与活动</span>\n</div>\n';
}
return new String($out);
});

}()