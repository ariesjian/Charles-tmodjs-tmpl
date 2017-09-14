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
/*``*/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,totalPrice=$data.totalPrice,basic_price=$data.basic_price,is=$data.is,increment_services=$data.increment_services,JSON=$data.JSON,e=$data.e,increment_service_names=$data.increment_service_names,i=$data.i,reserve_date=$data.reserve_date,start_time=$data.start_time,end_time=$data.end_time,reserve_start_time=$data.reserve_start_time,g=$data.g,reserve_end_time=$data.reserve_end_time,$string=$utils.$string,meeting_room_list_img_url=$data.meeting_room_list_img_url,meeting_room_name=$data.meeting_room_name,meeting_room_address=$data.meeting_room_address,meeting_room_person_limit=$data.meeting_room_person_limit,bake=$data.bake,theme=$data.theme,persons=$data.persons,contact_name=$data.contact_name,contact_mobile=$data.contact_mobile,contact_email=$data.contact_email,is_need_invoice=$data.is_need_invoice,invoice_type=$data.invoice_type,invoice_title=$data.invoice_title,invoice_mail_address=$data.invoice_mail_address,invoice_tax_no=$data.invoice_tax_no,$out='';var totalPrice = +basic_price||0;
var is;
try{
    is = 'string'===typeof increment_services?JSON.parse(increment_services):increment_services;
}catch(e){
    is = null;
}
var increment_service_names = null;
if(is){
    increment_service_names = [];
    for(var i=0;i<is.length;i++){
        totalPrice+=+(is[i].price)||0;
        increment_service_names.push(is[i].name);
    }
}

var reserve_date,start_time,end_time;
try{
reserve_date = reserve_start_time.trim().split(' ')[0].replace(/-/g,'/');
start_time = reserve_start_time.trim().split(' ')[1];
end_time = reserve_end_time.trim().split(' ')[1];
}catch(e){
reserve_date='';
start_time='';
end_time='';
}


$out+='\n<div class="mobile_outcontainer">\n    <div class="mobile_nopadding_container1">\n\n        <div class="c_room_paytop">\n            <div class="c_room_paytop_inner">\n                <div class="c_room_paytop_inner_left"><a href="#"><img src="';
$out+=$string(meeting_room_list_img_url);
$out+='" /></a></div>\n                <div class="c_room_paytop_inner_right">\n                    <span class="c_room_paytop_inner_right1">';
$out+=$string(meeting_room_name);
$out+='</span>\n                    <span class="c_room_paytop_inner_right2">';
$out+=$string(meeting_room_address);
$out+='</span>\n                    <span class="c_room_paytop_inner_right3">容纳：';
$out+=$string(meeting_room_person_limit);
$out+='人</span>\n                </div>\n            </div>\n        </div>\n\n        <div class="c_activity_confirmlist">\n            <div class="c_activity_confirmlist_inner">\n\n                <div class="c_room_confirm_costtitle">\n                    <div class="c_room_confirm_costtitle_inner1"></div>\n                    <div class="c_room_confirm_costtitle_inner2">费用合计</div>\n                    <div class="c_room_confirm_costtitle_inner1"></div>\n                </div>\n\n                <div class="weui-cell c_room_confirm_nobefore">\n                    <div class="weui-cell__bd">\n                        <p>会议室费用</p>\n                    </div>\n                    <div class="weui-cell__ft">&yen;';
$out+=$string(basic_price||0);
$out+='</div>\n                </div>\n                ';
if(is&&is.length){
                for(var i=0;i<is.length;i++){
                
$out+='\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>';
$out+=$string(is[i].name);
$out+='</p>\n                    </div>\n                    <div class="weui-cell__ft">&yen;';
$out+=$string(is[i].price||0);
$out+='</div>\n                </div>\n                ';
}
$out+='\n                ';
}
$out+='\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p></p>\n                    </div>\n                    <div class="weui-cell__ft">待支付：<label style="font-size: 16px;color: #ff0234;">&yen;';
$out+=$string(totalPrice);
$out+='</label></div>\n                </div>\n            </div>\n        </div>\n\n        <div class="c_activity_confirmlist">\n            <div class="c_activity_confirmlist_inner">\n\n                <div class="c_room_confirm_costtitle">\n                    <div class="c_room_confirm_costtitle_inner1"></div>\n                    <div class="c_room_confirm_costtitle_inner2">订单信息</div>\n                    <div class="c_room_confirm_costtitle_inner1"></div>\n                </div>\n\n                <div class="weui-cell c_room_confirm_nobefore">\n                    <div class="weui-cell__bd">\n                        <p>支付方式</p>\n                    </div>\n                    <div class="weui-cell__ft">微信支付</div>\n                </div>\n                ';
if(bake){
$out+='\n                <div class="c_room_confirm_inputbox1">\n                    <div class="c_room_confirm_inputbox1_left">备注</div>\n                    <div class="c_room_confirm_inputbox1_right">';
$out+=$string(bake);
$out+='</div>\n                </div>\n                ';
}
$out+='\n            </div>\n        </div>\n\n        <div class="c_activity_confirmlist">\n            <div class="c_activity_confirmlist_inner">\n\n                <div class="c_room_confirm_costtitle">\n                    <div class="c_room_confirm_costtitle_inner1"></div>\n                    <div class="c_room_confirm_costtitle_inner2">预定信息</div>\n                    <div class="c_room_confirm_costtitle_inner1"></div>\n                </div>\n\n                <div class="weui-cell c_room_confirm_nobefore">\n                    <div class="weui-cell__bd">\n                        <p>会议主题</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(theme);
$out+='</div>\n                </div>\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>参会人数</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(persons||0);
$out+='</div>\n                </div>\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>会议时间</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string((reserve_date+' '+start_time));
$out+='-';
$out+=$string(end_time);
$out+='</div>\n                </div>\n                ';
if(increment_service_names&&increment_service_names.length){
$out+='\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>增值服务</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(increment_service_names.join(','));
$out+='</div>\n                </div>\n                ';
}
$out+='\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>联系人</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(contact_name||'');
$out+='</div>\n                </div>\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>联系方式</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(contact_mobile||'');
$out+='</div>\n                </div>\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>电子邮箱</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(contact_email||'');
$out+='</div>\n                </div>\n            </div>\n        </div>\n\n        <div class="c_activity_confirmlist">\n            <div class="c_activity_confirmlist_inner c_room_detail_listcolor" style="margin-top: 10px;">\n\n            <div class="c_room_confirm_costtitle">\n                <div class="c_room_confirm_costtitle_inner1"></div>\n                <div class="c_room_confirm_costtitle_inner2">发票信息</div>\n                <div class="c_room_confirm_costtitle_inner1"></div>\n            </div>\n\n            <div class="weui-cell c_room_confirm_nobefore">\n                <div class="weui-cell__bd">\n                    <p>发票类型</p>\n                </div>\n                <div class="weui-cell__ft">';
$out+=$string((1==is_need_invoice)?(1==invoice_type?"个人":"企业"):"无");
$out+='</div>\n            </div>\n            ';
if(1==is_need_invoice){
$out+='\n            <div class="weui-cell">\n                <div class="weui-cell__bd">\n                    <p>开票抬头</p>\n                </div>\n                <div class="weui-cell__ft">';
$out+=$string(invoice_title||"");
$out+='</div>\n            </div>\n            <div class="weui-cell">\n                <div class="weui-cell__bd">\n                    <p>邮寄地址</p>\n                </div>\n                <div class="weui-cell__ft">';
$out+=$string(invoice_mail_address||"");
$out+='</div>\n            </div>\n            ';
if(2==invoice_type){
$out+='\n            <div class="weui-cell">\n                <div class="weui-cell__bd">\n                    <p>企业税号</p>\n                </div>\n                <div class="weui-cell__ft">';
$out+=$string(invoice_tax_no||"");
$out+='</div>\n            </div>\n            ';
}
$out+='\n            ';
}
$out+='\n        </div>\n        </div>\n\n    </div>\n</div>\n\n<div class="footer_fixed_box">\n    <div class="footer_fixed_box_left c_activity_confirm_footer_left">支付：&yen;';
$out+=$string(totalPrice||0);
$out+='</div>\n    <div class="footer_fixed_box_right"><a href="javascript:;" style="cursor:pointer;" class="j-submit footer_fixed_box_right_inner room_pay">确认支付</a></div>\n</div>';
return new String($out);
});

}()