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



    /*v:8*/
template('index',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$string=$utils.$string,activity_name=$data.activity_name,activity_start_time=$data.activity_start_time,g=$data.g,activity_end_time=$data.activity_end_time,activity_address=$data.activity_address,contact_name=$data.contact_name,contact_mobile=$data.contact_mobile,contact_email=$data.contact_email,contact_company=$data.contact_company,contact_sex=$data.contact_sex,activity_price=$data.activity_price,is_need_invoice=$data.is_need_invoice,invoice_type=$data.invoice_type,invoice_title=$data.invoice_title,invoice_mail_address=$data.invoice_mail_address,invoice_tax_no=$data.invoice_tax_no,$out='';$out+='<div class="mobile_outcontainer">\n    <div class="mobile_nopadding_container1">\n\n\n        <div class="c_activity_enrolltop">\n            <div class="c_activity_enrolltop1">';
$out+=$string(activity_name||'');
$out+='</div>\n            <div class="c_activity_enrolltop2">';
$out+=$string(activity_start_time.replace(/-/g,'/')||'');
$out+='-';
$out+=$string(activity_end_time.replace(/-/g,'/')||'');
$out+='</div>\n            <div class="c_activity_enrolltop3">';
$out+=$string(activity_address||'');
$out+='</div>\n        </div>\n\n        <div class="c_activity_confirmlist">\n            <div class="c_activity_confirmlist_inner">\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>姓名</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(contact_name||'');
$out+='</div>\n                </div>\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>联系方式</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(contact_mobile||'');
$out+='</div>\n                </div>\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>电子邮箱</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(contact_email||'');
$out+='</div>\n                </div>\n                ';
if(contact_company){
$out+='\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>公司名称</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(contact_company);
$out+='</div>\n                </div>\n                ';
}
$out+='\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>性别</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string((2==contact_sex)?'女士':'男士');
$out+='</div>\n                </div>\n                ';
if(+activity_price>0){
$out+='\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>支付方式</p>\n                    </div>\n                    <div class="weui-cell__ft">微信支付</div>\n                </div>\n                ';
}
$out+='\n            </div>\n\n            <div class="c_activity_confirmlist_inner c_room_detail_listcolor" style="margin-top: 10px;">\n\n                <div class="c_room_confirm_costtitle">\n                    <div class="c_room_confirm_costtitle_inner1"></div>\n                    <div class="c_room_confirm_costtitle_inner2">发票信息</div>\n                    <div class="c_room_confirm_costtitle_inner1"></div>\n                </div>\n\n                <div class="weui-cell c_room_confirm_nobefore">\n                    <div class="weui-cell__bd">\n                        <p>发票类型</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string((1==is_need_invoice)?(1==invoice_type?"个人":"企业"):"无");
$out+='</div>\n                </div>\n                ';
if(1==is_need_invoice){
$out+='\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>开票抬头</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(invoice_title||"");
$out+='</div>\n                </div>\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>邮寄地址</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(invoice_mail_address||"");
$out+='</div>\n                </div>\n                ';
if(2==invoice_type){
$out+='\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>企业税号</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(invoice_tax_no||"");
$out+='</div>\n                </div>\n                ';
}
$out+='\n                ';
}
$out+='\n            </div>\n\n        </div>\n\n    </div>\n</div>\n\n<div class="footer_fixed_box">\n    <div class="footer_fixed_box_left c_activity_confirm_footer_left">支付：&yen;';
$out+=$string(activity_price);
$out+='</div>\n    <div class="footer_fixed_box_right"><a href="javascript:;" style="cursor:pointer;" class="footer_fixed_box_right_inner" id="Confirm">';
$out+=$string(activity_price-0>0?'确认支付':'确认订单');
$out+='</a></div>\n</div>';
return new String($out);
});

}()