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
template('content',function($data,$filename
/*``*/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,meeting_room_list=$data.meeting_room_list,room=$data.room,k=$data.k,r=$data.r,$string=$utils.$string,getImgPath=$helpers.getImgPath,$out='';if(meeting_room_list&&meeting_room_list.length){
var room = meeting_room_list;

$out+='\n\n    ';
for(var k=0;k<room.length;k++){
    var r = room[k];
    
$out+='\n    <div class="c_room_listshow_detail_inner">\n        <a href="/index.php/index/meeting/pageMeetingRoomBasicInfor?meeting_room_id=';
$out+=$string(r.id);
$out+='" class="c_room_listshow_detail_inner_box1">\n            <div class="c_room_listshow_detail_inner_left"><img src="';
$out+=$string(r.list_img_url);
$out+='" /></div>\n            <div class="c_room_listshow_detail_inner_right">\n                <span class="c_room_listshow_detail_inner_right1">';
$out+=$string(r.name||'');
$out+='</span>\n                <span class="c_room_listshow_detail_inner_right2">容纳：';
$out+=$string(r.person_limit||0);
$out+='人&nbsp;&nbsp;面积：';
$out+=$string(r.area||0);
$out+='㎡</span>\n                <span class="c_room_listshow_detail_inner_right2">';
$out+=$string(r.address||'');
$out+='</span>\n            </div>\n            <div class="c_room_listshow_detail_inner_rightarrow"><img src="';
$out+=$string(getImgPath('arrow_right2.png'));
$out+='" /></div>\n        </a>\n        ';
if(r.basic_services){
$out+='\n        <span class="c_room_listshow_detail_inner_box2">基本服务：';
$out+=$string(r.basic_services);
$out+='</span>\n        ';
}
$out+='\n    </div>\n    ';
}
$out+='\n\n';
}
return new String($out);
});/*v:1*/
template('errMsg',function($data,$filename
/*``*/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$string=$utils.$string,getImgPath=$helpers.getImgPath,errMsg=$data.errMsg,$out='';$out+='<div class="c_nodata_box3">\n    <b class="c_nodata_box3_img"><img src="';
$out+=$string(getImgPath('list_activity.png'));
$out+='" /></b>\n    <span class="c_nodata_box3_txt">';
$out+=$string(errMsg);
$out+='</span>\n</div>';
return new String($out);
});/*v:1*/
template('index',function($data,$filename
/*``*/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,errMsg=$data.errMsg,$string=$utils.$string,getImgPath=$helpers.getImgPath,d=$data.d,space_list=$data.space_list,i=$data.i,sl=$data.sl,cur=$data.cur,space_id=$data.space_id,j=$data.j,$out='';if(errMsg){
$out+='\n<div class="c_nodata_box3">\n    <b class="c_nodata_box3_img"><img src="';
$out+=$string(getImgPath('list_activity.png'));
$out+='" /></b>\n    <span class="c_nodata_box3_txt">';
$out+=$string(errMsg);
$out+='</span>\n</div>\n';
}else{
var d = space_list;

$out+='\n<div class="mobile_outcontainer">\n    <div class="mobile_nopadding_container2">\n        <div class="c_room_listtab">\n            <ul class="c-room_list_ul" id="tabWrap">\n                ';
for(var i=0;i<d.length;i++){
                var sl = d[i];
                var cur;
                if(0==space_id){
                    cur = 0;
                }else if(space_id==sl.id){
                    cur = i;
                }
                
$out+='\n                <li data-space_id="';
$out+=$string(sl.id);
$out+='" style="cursor:pointer;" class="j-tab c_room_listtab_inner ';
$out+=$string(i==cur?'c_room_tabselected':' ');
$out+='"><a href="javascript:;">';
$out+=$string(sl.name||'');
$out+='</a></li>\n                ';
}
$out+='\n            </ul>\n        </div>\n        <div class="c_room_listshow_remind">\n            <div class="c_room_listshow_remind_inner">预定会议室请提前2小时，方便工作人员准备</div>\n        </div>\n\n        <div class="j-content c_room_listshow">\n            ';
for(var j=0;j<d.length;j++){
            var sl = d[j];
            
$out+='\n            <div class="j-list c_room_listshow_detail" style="';
$out+=$string(cur!=j?'display:none':' ');
$out+='">\n\n            </div>\n            ';
}
$out+='\n        </div>\n\n    </div>\n</div>\n';
}
return new String($out);
});

}()