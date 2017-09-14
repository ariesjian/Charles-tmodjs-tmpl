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



    /*v:9*/
template('content',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,data=$data.data,i=$data.i,info=$data.info,$string=$utils.$string,getImgPath=$helpers.getImgPath,$out='';if(data.cont.merchant_list && data.cont.merchant_list.length){
$out+='\r\n';
for(var i=0;i< data.cont.merchant_list.length;i++){
    var info = data.cont.merchant_list[i];
    
$out+='\r\n    ';
if(info.detail_type==1){
$out+='\r\n    <a href="';
$out+=$string(info.link);
$out+='" style="cursor: pointer;" class="c_service_listdetail_inner" >\r\n        <div class="c_service_listdetail_inner_left">\r\n            <span class="c_service_listdetail_inner_left_inner"><img\r\n                    src="';
$out+=$string(info.logo_url||getImgPath('logo1.png'));
$out+='"/></span>\r\n        </div>\r\n        <div class="c_service_listdetail_inner_right">\r\n            <div class="c_service_listdetail_inner_right_name">\r\n                <label class="c_service_listdetail_inner_right_name_inner">';
$out+=$string(info.name);
$out+='</label>\r\n            </div>\r\n            <div class="c_service_listdetail_inner_right_des">';
$out+=$string(info.summary);
$out+='</div>\r\n        </div>\r\n    </a>\r\n    ';
}
$out+='\r\n    ';
if(info.detail_type==2){
$out+='\r\n    <a style="cursor: pointer;" href="/index.php/index/service_system/pageServiceMerchantDetail?merchant_id=';
$out+=$string(info.id);
$out+='" class="c_service_listdetail_inner" >\r\n        <div class="c_service_listdetail_inner_left">\r\n            <span class="c_service_listdetail_inner_left_inner"><img src="';
$out+=$string(info.logo_url||getImgPath('logo1.png'));
$out+='"/></span>\r\n        </div>\r\n        <div class="c_service_listdetail_inner_right">\r\n            <div class="c_service_listdetail_inner_right_name">\r\n                <label class="c_service_listdetail_inner_right_name_inner">';
$out+=$string(info.name);
$out+='</label>\r\n            </div>\r\n            <div class="c_service_listdetail_inner_right_des">';
$out+=$string(info.summary);
$out+='</div>\r\n        </div>\r\n    </a>\r\n    ';
}
$out+='\r\n    ';
}
$out+='\r\n';
}else{
$out+='\r\n<div class="mobile_outcontainer" style="background: #eaeaea;">\r\n<div class="c_nodata_box4">\r\n    <b class="c_nodata_box4_img"><img src="';
$out+=$string(getImgPath('list_activity.png'));
$out+='" /></b>\r\n    <span class="c_nodata_box4_txt">暂时没有相关的内容</span>\r\n</div></div>\r\n';
}
return new String($out);
});/*v:9*/
template('index','<div class="mobile_outcontainer">\r\n    <div class="mobile_nopadding_container1">\r\n        <div class="c_service_listtop">\r\n            <div class="c_service_listtop_inner" id="items" style="cursor:pointer;" ><span id="navText">服务分类</span><b class="c_service_listtop_inner_img"><img  src="/static/resources/images/down_img2.png" /></b></div>\r\n        </div>\r\n        <div class="c_service_listdetail" id="content">\r\n        </div>\r\n    </div>\r\n    <div class="c_service_selectlist none ">\r\n        <div class="c_service_selectlist_inner " id="list" >\r\n        </div>\r\n    </div>\r\n\r\n</div>');/*v:9*/
template('list',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,data=$data.data,i=$data.i,info=$data.info,$string=$utils.$string,item=$data.item,k=$data.k,d=$data.d,$out='';if(data.lists.first_category_list && data.lists.first_category_list.length){
$out+='\r\n<div class="c_service_selectlist_inner_left" >\r\n    ';
for(var i=0;i< data.lists.first_category_list.length;i++){
    var info = data.lists.first_category_list[i];
    
$out+='\r\n\r\n            <span class="c_service_selectlist_left_option" data-id_first="';
$out+=$string(info.id);
$out+='" data-server_name="';
$out+=$string(info.name);
$out+='" style="cursor: pointer;"><img src="';
$out+=$string(info.img_url);
$out+='" />';
$out+=$string(info.name);
$out+='</span>\r\n            ';
}
$out+='\r\n        </div>\r\n\r\n<div class="c_service_selectlist_inner_right">\r\n    ';
for(var i=0;i< data.lists.first_category_list.length;i++){
    var info = data.lists.first_category_list[i];
    
$out+='\r\n    <div class="j-levelTwo">\r\n        ';

        var item=info.second_category_list
        for(var k=0;k< item.length;k++){
        var d = item[k];
        
$out+='\r\n            <span class="c_service_selectlist_right_option" style="cursor: pointer;" data-id="';
$out+=$string(d.id);
$out+='">';
$out+=$string(d.name);
$out+='</span>\r\n    ';
}
$out+='\r\n    </div>\r\n        ';
}
$out+='\r\n</div>\r\n\r\n';
}
return new String($out);
});

}()