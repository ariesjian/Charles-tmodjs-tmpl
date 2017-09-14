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
'use strict';var $utils=this,$helpers=$utils.$helpers,coupons=$data.coupons,i=$data.i,d=$data.d,$string=$utils.$string,getImgPath=$helpers.getImgPath,$out='';if(coupons && coupons.length >0){
$out+='\r\n<div class="mobile_outcontainer">\r\n    <div class="mobile_nopadding_container1">\r\n        <div class="c_user_scoretop">\r\n            <div class="c_user_scoretop_inner">\r\n                <div class="c_user_scoretop_inner_box1"><a style="cursor:pointer;"  href="/index.php/index/member/pageMemberScoreDetail" class="c_user_scoretop_inner_todetail">积分明细</a></div>\r\n                <div class="c_user_scoretop_inner_box2 tallcore">   </div>\r\n                <div class="c_user_scoretop_inner_box3">我的积分</div>\r\n            </div>\r\n        </div>\r\n        <div class="c_user_scorelist">\r\n            <div class="c_user_scorelist_title">\r\n                <b class="c_user_scorelist_title_line"></b>\r\n                <span class="c_user_scorelist_title_txt">优惠券兑换</span>\r\n                <b class="c_user_scorelist_title_line"></b>\r\n            </div>\r\n            ';

            for(var i=0;i< coupons.length ;i++){
            var d = coupons[i];
            
$out+='\r\n\r\n            <div class="c_user_scorelist_list">\r\n                <input type="hidden" value="';
$out+=$string(d.id);
$out+='" class="ids">\r\n                <div class="c_user_scorelist_list_inner">\r\n                    <div class="c_user_scorelist_list_innerbox">\r\n                        <div class="c_user_scorelist_list_innerbox_left">\r\n                            <div class="c_user_scorelist_listleft_img"><img src="';
$out+=$string(d.cover_img);
$out+='" /></div>\r\n                            <div class="c_user_scorelist_listleft_txt">\r\n                                ';
if(2==d.benefit_type){
$out+='\r\n                                <label class="c_user_scorelist_listleft_txt1">减 </label>\r\n                                <label class="c_user_scorelist_listleft_txt2"><b class="c_user_scorelist_listleft_txt3">&yen;</b>';
$out+=$string(d.reduction);
$out+='</label>\r\n                                ';
}
$out+='\r\n                                ';
if(1==d.benefit_type){
$out+='\r\n                                <label class="c_user_scorelist_listleft_txt1">折扣</label>\r\n                                <label class="c_user_scorelist_listleft_txt2">';
$out+=$string(d.discount);
$out+='<b class="c_user_scorelist_listleft_txt3">%</b></label>\r\n                                ';
}
$out+='\r\n                            </div>\r\n                        </div>\r\n                        <div class="c_user_scorelist_list_innerbox_right">\r\n                            <div class="c_user_scorelist_list_innerbox_right1">';
$out+=$string(d.name);
$out+='</div>\r\n                            <div class="c_user_scorelist_list_innerbox_right2">\r\n                                <div class="c_user_scorelist_list_innerbox_right2_box1">\r\n                                    <div class="c_user_scorelist_list_innerbox_right2_inner">满';
$out+=$string(d.min_charge);
$out+='元可用</div>\r\n                                    <div class="c_user_scorelist_list_innerbox_right2_inner">';
$out+=$string(d.store_name);
$out+='</div>\r\n                                    <div class="c_user_scorelist_list_innerbox_right2_inner">有效时长：';
$out+=$string(d.valid_days);
$out+='天</div>\r\n                                </div>\r\n                                <div class="c_user_scorelist_list_innerbox_right2_box2">\r\n                                    <span class="c_score_innerscores">';
$out+=$string(d.score_cost);
$out+='<label>积分</label></span>\r\n                                    <em class="c_score_innerexchange_outer"><a  class="c_score_innerexchange exchange" style="cursor:pointer;" >兑换</a></em>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            ';
}
$out+='\r\n        </div>\r\n    </div>\r\n\r\n</div>\r\n';
}else{
$out+='\r\n\r\n<div class="c_nodata_box4">\r\n    <b class="c_nodata_box4_img"><img src="';
$out+=$string(getImgPath('list_activity.png'));
$out+='" /></b>\r\n    <span class="c_nodata_box4_txt">暂时没有相关的内容</span>\r\n</div>\r\n';
}
return new String($out);
});

}()