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
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,category_list=$data.category_list,i=$data.i,info=$data.info,$string=$utils.$string,getImgPath=$helpers.getImgPath,$out='';if(category_list && category_list.length){
$out+='\r\n\r\n<div class="mobile_outcontainer">\r\n    <div class="mobile_nopadding_container1">\r\n        <div class="c_service_select1_con">\r\n            ';
for(var i=0;i< category_list.length;i++){
            var info = category_list[i];
            
$out+='\r\n            <a style="cursor:pointer;"  href="/index.php/index/service_system/pageServiceMerchantList?first_category_id=';
$out+=$string(info.id);
$out+='&second_category_id=0" class="c_service_select1_con_inner">\r\n                <b class="c_service_select1_con_inner_img"><img src="';
$out+=$string(info.img_url||getImgPath('service_select_img1.png'));
$out+='" /></b>\r\n                <label class="c_service_select1_con_inner_txt">';
$out+=$string(info.name);
$out+='</label>\r\n            </a>\r\n        <!--  <input type="hidden" value="';
$out+=$string(info.id);
$out+='">-->\r\n            ';
}
$out+='\r\n        </div>\r\n    </div>\r\n\r\n    <div class="mobile_footermenu">\r\n        <ul>\r\n            <li>\r\n                <a href="/index.php/index/index/pageIndex" style="cursor:pointer;" >\r\n                    <b class="mobile_footermenu_img"><img src="/static/resources/images/footmenu_img1.png" /></b>\r\n                    <span class="mobile_footermenu_txt">园区</span>\r\n                </a>\r\n            </li>\r\n            <li>\r\n                <a href="/index.php/index/service_system/pageServiceFirstCategory" style="cursor:pointer;" >\r\n                    <b class="mobile_footermenu_img"><img src="/static/resources/images/footmenu_img2_selected.png" /></b>\r\n                    <span class="mobile_footermenu_txt footer_txtcolor">服务</span>\r\n                </a>\r\n            </li>\r\n            <!--<li>\r\n                <a href="#" style="cursor:pointer;" >\r\n                    <b class="mobile_footermenu_img"><img src="/static/resources/images/footmenu_img3.png" /></b>\r\n                    <span class="mobile_footermenu_txt">商城</span>\r\n                </a>\r\n            </li>-->\r\n            <li>\r\n                <a href="/index.php/index/member/pageMemberIndex" style="cursor:pointer;" >\r\n                    <b class="mobile_footermenu_img"><img src="/static/resources/images/footmenu_img4.png" /></b>\r\n                    <span class="mobile_footermenu_txt">我的</span>\r\n                </a>\r\n            </li>\r\n        </ul>\r\n    </div>\r\n\r\n</div>\r\n\r\n\r\n';
}else{
$out+='\r\n<div style="font-size: 30px;text-align: center;"><div class="c_nodata_box4">\r\n    <b class="c_nodata_box4_img"><img src="';
$out+=$string(getImgPath('list_activity.png'));
$out+='" /></b>\r\n    <span class="c_nodata_box4_txt">暂时没有相关的内容</span>\r\n</div></div>\r\n';
}
return new String($out);
});

}()