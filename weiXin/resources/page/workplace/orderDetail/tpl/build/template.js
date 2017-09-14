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
'use strict';var $utils=this,$helpers=$utils.$helpers,errMsg=$data.errMsg,$string=$utils.$string,getImgPath=$helpers.getImgPath,status=$data.status,desc_status=$data.desc_status,isBottomVisible=$data.isBottomVisible,desc_text=$data.desc_text,parseInt=$data.parseInt,expire_minutes=$data.expire_minutes,workplace_list_img_url=$data.workplace_list_img_url,workplace_name=$data.workplace_name,workplace_price=$data.workplace_price,refuse_reason=$data.refuse_reason,start_date=$data.start_date,g=$data.g,end_date=$data.end_date,workplace_count=$data.workplace_count,contact_name=$data.contact_name,contact_mobile=$data.contact_mobile,is_need_invoice=$data.is_need_invoice,invoice_type=$data.invoice_type,invoice_title=$data.invoice_title,invoice_mail_address=$data.invoice_mail_address,invoice_tax_no=$data.invoice_tax_no,total_price=$data.total_price,$out='';if(errMsg){
$out+='\n<div class="c_nodata_box3">\n    <b class="c_nodata_box3_img"><img src="';
$out+=$string(getImgPath('list_activity.png'));
$out+='" /></b>\n    <span class="c_nodata_box3_txt">';
$out+=$string(errMsg);
$out+='</span>\n</div>\n';
}else{
$out+='\n';

var status = +status;
var desc_status ={0:'待支付',1:'已支付',2:'已交付',3:'审核拒绝',9:'已超时取消'};
var isBottomVisible = [0,1,9].indexOf(status)!==-1
var desc_text = {
0:'请于'+parseInt(expire_minutes,10)+'分钟内完成缴费，否则订单将自动取消',
1:'您的订单已支付成功，正在审核请耐心等待',
2:'您的订单已交付，请核对相关信息并确认',
3:'您的订单审核失败，请及时与相关人员联系',
9:'您的订单因超时已自动取消，如有需要请重新支付'
}

$out+='\n<div class="mobile_outcontainer">\n    ';
if(isBottomVisible){
$out+='\n    <div class="mobile_nopadding_container1">\n    ';
}else{
$out+='\n    <div class="mobile_nopadding_container1" style="padding-bottom: 10px">\n    ';
}
$out+='\n\n        <div class="c_activity_confirmtop c_station_confirmtop">\n            <div class="c_activity_confirmtop_inner1">\n                ';
if(0===status){
$out+='\n                <b><img src="';
$out+=$string(getImgPath('icon_time.png'));
$out+='" /></b>\n                ';
}
$out+='\n                <span>';
$out+=$string(desc_status[status]);
$out+='</span>\n            </div>\n            <div class="c_activity_confirmtop_inner2">\n                <span>';
$out+=$string(desc_text[status]);
$out+='</span>\n            </div>\n        </div>\n\n        ';
if(3===status){
$out+='\n        <div class="c_station_paytop">\n            <div class="c_station_paytop_inner cc">\n                <div class="c_station_paytop_inner_left"><a href="#"><img src="';
$out+=$string(workplace_list_img_url);
$out+='" /></a></div>\n                <div class="c_station_paytop_inner_right">\n                    <span class="c_station_paytop_inner_right1">';
$out+=$string(workplace_name);
$out+='</span>\n                    <span class="c_station_paytop_inner_right2">&yen;';
$out+=$string(workplace_price);
$out+='/位/月</span>\n                </div>\n            </div>\n            <!--<div class="c_station_paytop_inner">\r\n                <div style="width: 22%;">拒绝理由\r\n                </div>\r\n\r\n                <div class="weui-cell__ft" style="text-align: right;width: 78%;">';
$out+=$string(refuse_reason || '');
$out+='</div>\r\n\r\n            </div>-->\n            <div class="c_refuse_box">\n            	<div class="c_refuse_box_inner">\n	                <div class="c_refuse_box_left">拒绝理由:</div>\n	                <div class="c_refuse_box_right">';
$out+=$string(refuse_reason || '');
$out+='</div>\n                </div>\n            </div>\n        </div>\n        ';
}
$out+='\n        <div class="c_activity_confirmlist">\n            <div class="c_activity_confirmlist_inner">\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>起始时间</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(start_date.replace(/-/g,'/'));
$out+='</div>\n                </div>\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>结束时间</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(end_date.replace(/-/g,'/'));
$out+='</div>\n                </div>\n            </div>\n        </div>\n\n        <div class="c_activity_confirmlist">\n            <div class="c_activity_confirmlist_inner">\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>工位数量</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(workplace_count);
$out+='</div>\n                </div>\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>联系人</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(contact_name);
$out+='</div>\n                </div>\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>联系方式</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(contact_mobile);
$out+='</div>\n                </div>\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>支付方式</p>\n                    </div>\n                    <div class="weui-cell__ft">微信支付</div>\n                </div>\n            </div>\n        </div>\n\n        <div class="c_activity_confirmlist">\n            <div class="c_activity_confirmlist_inner c_room_detail_listcolor" style="margin-top: 10px;">\n\n            <div class="c_room_confirm_costtitle">\n                <div class="c_room_confirm_costtitle_inner1"></div>\n                <div class="c_room_confirm_costtitle_inner2">发票信息</div>\n                <div class="c_room_confirm_costtitle_inner1"></div>\n            </div>\n\n            <div class="weui-cell c_room_confirm_nobefore">\n                <div class="weui-cell__bd">\n                    <p>发票类型</p>\n                </div>\n                <div class="weui-cell__ft">';
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
$out+='\n        </div>\n        </div>\n\n        <div class="c_activity_confirmlist">\n            <div class="c_activity_confirmlist_inner">\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>合计支付</p>\n                    </div>\n                    <div class="weui-cell__ft" style="color: #ff0234;font-size: 14px;height: 20px;line-height: 20px;">&yen;';
$out+=$string(total_price);
$out+='</div>\n                </div>\n            </div>\n        </div>\n\n    </div>\n\n</div>\n';
if(0==status){
$out+='\n\n<div class="footer_fixed_box">\n    <div class="footer_fixed_box_left c_activity_confirm_footer_left">支付：&yen;';
$out+=$string(total_price||0);
$out+='</div>\n    <div class="footer_fixed_box_right" style="float: right;"><a href="javascript:;" style="cursor:pointer;" id="submit" class="footer_fixed_box_right_inner station_pay">确认支付</a></div>\n</div>\n\n';
}else if(2==status){
$out+='\n\n<div class="footer_fixed_box">\n    <a href="javascript:;" style="cursor:pointer;float: right;width: 50%" id="continue" class="footer_fixed_box_right_inner station_pay">续租</a>\n</div>\n\n';
}else if(9==status){
$out+='\n    <div class="footer_fixed_box">\n        <a href="javascript:;" style="cursor:pointer;float: right;width: 50%" id="deleteOrder" class="footer_fixed_box_right_inner station_pay">删除订单</a>\n    </div>\n';
}
$out+='\n\n';
}
return new String($out);
});

}()