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



    /*v:3*/
template('index',function($data,$filename
/*``*/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,roadshow=$data.roadshow,$string=$utils.$string,getImgPath=$helpers.getImgPath,$out='';if(roadshow){
$out+='\r\n<div class="mobile_outcontainer">\r\n    <div class="mobile_nopadding_container2">\r\n        <div class="c_incubator_detail">\r\n            <div class="c_incubator_detail_inner">\r\n                <div class="c_incubator_detail_inner_title">\r\n                    <span class="c_incubator_detail_inner_title_left"><img src="/static/resources/images/incubator_detail1.png" />企业信息</span>\r\n                    ';
if(0==roadshow.status){
$out+='\r\n                    <label class="c_incubator_detail_inner_title_right check_status1">审核中</label>\r\n                    </label>  ';
}
$out+='\r\n                    ';
if(1==roadshow.status){
$out+='\r\n                    <label class="c_incubator_detail_inner_title_right check_status2">\r\n                        已通过\r\n                    </label>  ';
}
$out+='\r\n                    ';
if(2==roadshow.status){
$out+='\r\n                    <label class="c_incubator_detail_inner_title_right check_status3">\r\n                        未通过\r\n                    </label>  ';
}
$out+='\r\n\r\n                </div>\r\n                <div class="c_incubator_detail_inner_list">\r\n                    <div class="c_incubator_detail_inner_list_inner cc">\r\n                        <label class="c_incubator_detail_inner_list_inner_left">项目名称</label>\r\n                        <span class="c_incubator_detail_inner_list_inner_right">';
$out+=$string(roadshow.project_name);
$out+='</span>\r\n                    </div>\r\n                    ';
if(2==roadshow.status){
$out+='\r\n                    <div class="c_refuse_box">\r\n		            	<div class="c_refuse_box_inner">\r\n			                <div class="c_refuse_box_left">拒绝理由</div>\r\n			                <div class="c_refuse_box_right">';
$out+=$string(roadshow.refuse_reason);
$out+='</div>\r\n		                </div>\r\n		            </div>\r\n                    ';
}
$out+='\r\n                </div>\r\n            </div>\r\n\r\n            <div class="c_incubator_detail_inner">\r\n                <div class="c_incubator_detail_inner_title">\r\n                    <span class="c_incubator_detail_inner_title_left"><img src="/static/resources/images/incubator_detail2.png" />融资信息</span>\r\n                </div>\r\n                <div class="c_incubator_detail_inner_list">\r\n                    <div class="c_incubator_detail_inner_list_inner">\r\n                        <label class="c_incubator_detail_inner_list_inner_left">融资额度</label>\r\n                        <span class="c_incubator_detail_inner_list_inner_right">';
$out+=$string(roadshow.financing_amount);
$out+='</span>\r\n                    </div>\r\n                    <div class="c_incubator_detail_inner_list_inner">\r\n                        <label class="c_incubator_detail_inner_list_inner_left">融资方式</label>\r\n                        <span class="c_incubator_detail_inner_list_inner_right">';
$out+=$string(roadshow.financing_type_name);
$out+='</span>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class="c_incubator_detail_inner">\r\n                <div class="c_incubator_detail_inner_title">\r\n                    <span class="c_incubator_detail_inner_title_left"><img src="/static/resources/images/incubator_detail3.png" />联系信息</span>\r\n                </div>\r\n                <div class="c_incubator_detail_inner_list">\r\n                    <div class="c_incubator_detail_inner_list_inner">\r\n                        <label class="c_incubator_detail_inner_list_inner_left">联系人</label>\r\n                        <span class="c_incubator_detail_inner_list_inner_right">';
$out+=$string(roadshow.project_manager);
$out+='</span>\r\n                    </div>\r\n                    <div class="c_incubator_detail_inner_list_inner">\r\n                        <label class="c_incubator_detail_inner_list_inner_left">联系方式</label>\r\n                        <span class="c_incubator_detail_inner_list_inner_right">';
$out+=$string(roadshow.contact_mobile);
$out+='</span>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class="c_incubator_detail_inner">\r\n                <div class="c_incubator_detail_inner_title2">项目概述</div>\r\n                <div class="c_incubator_detail_inner_des">';
$out+=$string(roadshow.project_desc);
$out+='</div>\r\n            </div>\r\n\r\n            <div class="c_incubator_detail_inner">\r\n                <div class="c_incubator_detail_inner_title2">预期目标</div>\r\n                <div class="c_incubator_detail_inner_des">';
$out+=$string(roadshow.expective_goal);
$out+='</div>\r\n            </div>\r\n\r\n            <div class="c_incubator_detail_inner">\r\n                <div class="c_incubator_detail_inner_title2">用途/期限</div>\r\n                <div class="c_incubator_detail_inner_des">';
$out+=$string(roadshow.usage_deadline);
$out+='</div>\r\n            </div>\r\n\r\n            <div class="c_incubator_detail_inner">\r\n                <div class="c_incubator_detail_inner_title2">股权比例分配</div>\r\n                <div class="c_incubator_detail_inner_des">';
$out+=$string(roadshow.shareholdings);
$out+='</div>\r\n            </div>\r\n\r\n        </div>\r\n    </div>\r\n</div>\r\n';
}else{
$out+='\r\n\r\n<div class="c_nodata_box4">\r\n    <b class="c_nodata_box4_img"><img src="';
$out+=$string(getImgPath('mine_apply.png'));
$out+='" /></b>\r\n    <span class="c_nodata_box4_txt">暂时没有相关的内容</span>\r\n</div>\r\n';
}
return new String($out);
});

}()