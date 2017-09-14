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



    /*v:45*/
template('index',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,errMsg=$data.errMsg,$string=$utils.$string,getImgPath=$helpers.getImgPath,desc_status=$data.desc_status,i=$data.i,orders=$data.orders,d=$data.d,reserve_date=$data.reserve_date,start_time=$data.start_time,end_time=$data.end_time,g=$data.g,e=$data.e,$out='';if(errMsg){
$out+='\n<div class="c_nodata_box3">\n    <b class="c_nodata_box3_img"><img src="';
$out+=$string(getImgPath('list_activity.png'));
$out+='" /></b>\n    <span class="c_nodata_box3_txt">';
$out+=$string(errMsg);
$out+='</span>\n</div>\n';
}else{
var desc_status ={
0:'待支付',
1:'已支付',
2:'退款申请中',
3:'退款审核通过',
4:'退款审核拒绝',
9:'已超时取消'
};

$out+='\n<div class="mobile_outcontainer">\n    <div class="mobile_nopadding_container2">\n        <div class="c_room_minecon">\n            <ul>\n                ';
for(var i=0;i<orders.length;i++){
                var d = orders[i];
                var reserve_date,start_time,end_time;
                try{
                    reserve_date = d.reserve_start_time.trim().split(' ')[0].replace(/-/g,'/');
                    start_time = d.reserve_start_time.trim().split(' ')[1];
                    end_time = d.reserve_end_time.trim().split(' ')[1];
                }catch(e){
                reserve_date='';
                start_time='';
                end_time='';
                }

                
$out+='\n                <li class="j-item" data-id="';
$out+=$string(d.id);
$out+='" style="cursor:pointer;">\n                    <div class="c_room_minelist_inner1">\n                        <div class="c_room_minelist_inner1_left">\n                            <span class="c_room_minelist_inner1_left1">';
$out+=$string(d.theme||'');
$out+='</span>\n                            <span class="c_room_minelist_inner1_left2">地点：';
$out+=$string(d.meeting_room_address||'');
$out+='</span>\n                            <span class="c_room_minelist_inner1_left2">时间：';
$out+=$string((reserve_date.replace(/-/g,'/')+' '+start_time));
$out+='-';
$out+=$string(end_time);
$out+='</span>\n                        </div>\n                        <div class="c_room_minelist_inner1_right">\n                            ';
if(0==d.status||2==d.status){
$out+='\n                            <span class="c_room_minelist_inner1_right_inner1 c_room_minelist_status4">';
$out+=$string(desc_status[d.status]);
$out+='</span>\n                            ';
}else if(1==d.status||3==d.status){
$out+='\n\n                            <label class="c_room_minelist_inner1_right_inner2" style="color: #66d260;">';
$out+=$string(desc_status[d.status]);
$out+='</label>\n\n                            ';
}else if(4==d.status){
$out+='\n\n                            <label class="c_room_minelist_inner1_right_inner2" style="color: #ff0234;">';
$out+=$string(desc_status[d.status]);
$out+='</label>\n\n                            ';
}else if(9==d.status){
$out+='\n                            <label class="c_room_minelist_inner1_right_inner2" style="color: #999;">';
$out+=$string(desc_status[d.status]);
$out+='</label>\n                            ';
}
$out+='\n                        </div>\n                    </div>\n                    ';
if(0==d.status){
$out+='\n                    <div class="c_room_minelist_inner2">\n                        <div class="c_room_minelist_inner2_right">\n                            <a href="/index.php/index/meeting/pageMeetingRoomOrderDetail?order_id=';
$out+=$string(d.id);
$out+='" style="cursor:pointer;" class="c-delete_order" data-order_id="';
$out+=$string(d.id);
$out+='">去支付</a>\n                        </div>\n                    </div>\n                    ';
}else if(1==d.status&&1==d.time_status){
$out+='\n                    <div class="c_room_minelist_inner2">\n                        <div class="c_room_minelist_inner2_right">\n                            <a class="c-delete_order" href="/index.php/index/meeting/pageMeetingRoomOrderDetail?order_id=';
$out+=$string(d.id);
$out+='" style="cursor:pointer;" data-order_id="';
$out+=$string(d.id);
$out+='">申请退款</a>\n                        </div>\n                    </div>\n                    ';
}else if(9==d.status){
$out+='\n                    <div class="c_room_minelist_inner2">\n                        <div class="c_room_minelist_inner2_right">\n                            <a class="c-delete_order" href="/index.php/index/meeting/pageMeetingRoomOrderDetail?order_id=';
$out+=$string(d.id);
$out+='" style="cursor:pointer;">删除订单</a>\n                        </div>\n                    </div>\n                    ';
}
$out+='\n                </li>\n                ';
}
$out+='\n            </ul>\n        </div>\n    </div>\n</div>\n';
}
return new String($out);
});

}()