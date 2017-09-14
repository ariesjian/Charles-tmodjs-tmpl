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
template('index',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,questions=$data.questions,i=$data.i,di=$data.di,type=$data.type,details=$data.details,name=$data.name,$string=$utils.$string,j=$data.j,dj=$data.dj,getImgPath=$helpers.getImgPath,k=$data.k,dk=$data.dk,$out='';if(questions && questions.length){
$out+='\n<div class="mobile_outcontainer" id="Questions">\n    <div class="mobile_nopadding_container2">\n        ';
for(var i=0;i<questions.length;i++){
        var di = questions[i];
        var type = +di.type;
        var details = di.details||[];
        var name = di.name;
        
$out+='\n        ';
if(1===type){
$out+='\n        <div class="c_activity_surveybox">\n            <div class="j-name-1 c_activity_surveybox_title" data-name="';
$out+=$string(name);
$out+='">Q1:';
$out+=$string(name);
$out+='：</div>\n            ';
if(details.length){
$out+='\n            <div class="j-type-1 c_activity_surveybox_questionbox1">\n                ';
for(var j=0;j<details.length;j++){
                var dj = details[j];
                
$out+='\n                <div class="j-single-option c_activity_surveybox_questionbox1_inner" style="cursor:pointer;">\n                    <input type="radio" name="radiobutton" class="c_surveybox_select_option_btn">\n                    <img data-img="0" class="c-img ';
$out+=$string(0!==j?'c-show':'');
$out+='" src="';
$out+=$string(getImgPath('select1.png'));
$out+='" />\n                    <img data-img="1" class="c-img ';
$out+=$string(0===j?'c-show':'');
$out+='" src="';
$out+=$string(getImgPath('select2.png'));
$out+='" />\n                    <label class="j-text c_surveybox_select_option_txt">';
$out+=$string(dj);
$out+='</label>\n                </div>\n                ';
}
$out+='\n            </div>\n            ';
}
$out+='\n        </div>\n        ';
}
$out+='\n\n        ';
if(2===type){
$out+='\n        <div class="c_activity_surveybox">\n            <div class="j-name-2 c_activity_surveybox_title" data-name="';
$out+=$string(name);
$out+='">Q2:';
$out+=$string(name);
$out+='（多选）：</div>\n            <div class="j-type-2 c_activity_surveybox_questionbox2">\n                ';
for(var k=0;k<details.length;k++){
                var dk = details[k];
                
$out+='\n                <span class="j-multi-option c-multi-option" style="cursor:pointer;">';
$out+=$string(dk);
$out+='</span>\n                ';
}
$out+='\n            </div>\n        </div>\n        ';
}
$out+='\n\n        ';
if(3===type){
$out+='\n        <div class="c_activity_surveybox">\n            <div class="j-name-3 c_activity_surveybox_title" data-name="';
$out+=$string(name);
$out+='">Q3:';
$out+=$string(name);
$out+='</div>\n            <div class="j-type-3 c_activity_surveybox_questionbox3">\n                <textarea class="j-text-3" placeholder="请输入详细回答" maxlength="1000"></textarea>\n            </div>\n        </div>\n        ';
}
$out+='\n\n        ';
}
$out+='\n\n        <div class="c_activity_surveysubmit"><a href="javascript:;" style="cursor:pointer;" class="j-submit c_activity_surveysubmit_inner">确认提交</a></div>\n\n    </div>\n</div>\n';
}else{
$out+='\n<div class="c_nodata_box3">\n    <b class="c_nodata_box3_img"><img src="';
$out+=$string(getImgPath('list_activity.png'));
$out+='" /></b>\n    <span class="c_nodata_box3_txt">该活动暂无问卷调查，感谢您的关注</span>\n</div>\n';
}
return new String($out);
});/*v:1*/
template('success','<div class="c_activity_getscorepopup">\n    <div class="c_activity_getscorepopup_inner">\n        <div class="c_activity_getscorepopup_inner_title">提交成功</div>\n        <div class="c_activity_getscorepopup_inner_remind">恭喜您，获得10积分</div>\n        <div class="c_activity_getscorepopup_inner_btns">\n            <a href="javascript:;" style="cursor:pointer;" class="c_activity_getscorepopup_inner_btns_close">关闭</a>\n            <a href="javascript:;" style="cursor:pointer;" class="c_activity_signcon_inner_btns_tosee">去看看</a>\n        </div>\n    </div>\n</div>');

}()