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



    /*v:51*/
template('index',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,selections=$data.selections,i=$data.i,info=$data.info,$string=$utils.$string,$out='';$out+='\r\n<div class="mobile_outcontainer">\r\n    <div class="mobile_nopadding_container2">\r\n        <div class="c_repaire_propretytop">\r\n            <span style=" margin-bottom: 10px;line-height: 20px; padding-right: 1px;  font-size: 13px;color: #999;margin-bottom: 5px;">最多上传10张，每张最大10M,支持：jpg/jpeg/png/gif 。</span>\r\n            <div class="weui-uploader__bd" id="uploader"  >\r\n                <ul class=" weui-uploader__files" id="uploaderFiles" style="cursor: pointer;">\r\n                </ul>\r\n                <div class="weui-uploader__input-box" >\r\n                    <input id="uploaderInput" class="j-imgs weui-uploader__input" type="file" accept="image/*" multiple/>\r\n                </div>\r\n\r\n            </div>\r\n        </div>\r\n\r\n        <div class="c_repaire_propretylist">\r\n            <div class="c_incubator_applylist_inner">\r\n                <div class="weui-cell weui-cell_select weui-cell_select-after">\r\n                    <div class="weui-cell__hd">\r\n                        <label for="" class="weui-label">所属物业</label>\r\n                    </div>\r\n                    <div class="weui-cell__bd right_color2">\r\n                        <select class="weui-select" name="select2" id="j-property_company_id">\r\n                            ';
if(selections && selections.length){
$out+='\r\n                            ';
for(var i=0;i< selections.length;i++){
                            var info = selections[i];
                            
$out+='\r\n                            <option value="';
$out+=$string(info.id);
$out+='">';
$out+=$string(info.name);
$out+='</option>\r\n                            ';
}
$out+='\r\n                            ';
}
$out+='\r\n                        </select>\r\n                    </div>\r\n                </div>\r\n                <div class="c_incubator_applylist_inner_box right_color2">\r\n                    <label class="c_applylist_inner_left">报修地址</label>\r\n                    <input class="j-address c_applylist_inner_right" placeholder="请输入报修地址" type="text" />\r\n                </div>\r\n            </div>\r\n            <div class="c_incubator_applylist_inner">\r\n                <div class="c_incubator_applylist_inner_box c_incubator_applylist_inner_box_noborder">\r\n                    <label class="c_applylist_inner_left">联系人</label>\r\n                    <input class="j-contact_name c_applylist_inner_right" placeholder="请输入联系人" type="text"/>\r\n                </div>\r\n                <div class="c_incubator_applylist_inner_box">\r\n                    <label class="c_applylist_inner_left">联系方式</label>\r\n                    <input class="j-contact_mobile c_applylist_inner_right"  type="tel" onkeyup="value=value.replace(/[^\\d]/g,\'\')" placeholder="请输入联系方式" maxlength="11"/>\r\n                </div>\r\n            </div>\r\n            <div class="c_incubator_applylist_inner">\r\n                <div class="c_incubator_roadshowlist_inner_box">\r\n                    <label class="c_roadshowlist_inner_title">报修详情</label>\r\n                    <textarea placeholder="请输入报修详情" style="padding-left: 0;" class="j-repair_detail" maxlength="120"></textarea>\r\n                    <span class="limit_num">0/120</span>\r\n                </div>\r\n            </div>\r\n            <div class="c_repaire_proprety_btn"><label style="cursor: pointer;" class="c_repaire_proprety_btn_inner" id="submitBtn">提交申请</label></div>\r\n        </div>\r\n\r\n    </div>\r\n</div>\r\n\r\n';
return new String($out);
});

}()