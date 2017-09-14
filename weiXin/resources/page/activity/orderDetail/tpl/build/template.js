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
'use strict';var $utils=this,$helpers=$utils.$helpers,order=$data.order,d=$data.d,status=$data.status,$string=$utils.$string,getImgPath=$helpers.getImgPath,$out='';if(order){
var d = order;
var status = +d.status;

$out+='\n\n    <div id="Shell">\n    </div>\n\n';
}else{
$out+='\n<div class="c_nodata_box3">\n    <b class="c_nodata_box3_img"><img src="';
$out+=$string(getImgPath('list_activity.png'));
$out+='" /></b>\n    <span class="c_nodata_box3_txt">无法加载页面，请稍后再试</span>\n</div>\n';
}
return new String($out);
});/*v:1*/
template('nonPayment',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,d=$data.d,order=$data.order,status=$data.status,is_need_invoice=$data.is_need_invoice,invoice_type=$data.invoice_type,invoice_title=$data.invoice_title,invoice_mail_address=$data.invoice_mail_address,invoice_tax_no=$data.invoice_tax_no,$string=$utils.$string,getImgPath=$helpers.getImgPath,parseInt=$data.parseInt,$out='';
var d = order;
var status = +d.status;

var is_need_invoice = d.is_need_invoice;
var invoice_type = d.invoice_type;
var invoice_title = d.invoice_title;
var invoice_mail_address = d.invoice_mail_address;
var invoice_tax_no = d.invoice_tax_no;


$out+='\n<div class="mobile_outcontainer">\n    <div class="mobile_nopadding_container1">\n\n        <div class="c_activity_confirmtop">\n            <div class="c_activity_confirmtop_inner1">\n                <b><img src="';
$out+=$string(getImgPath('icon_time.png'));
$out+='"></b>\n                <span>待支付</span>\n            </div>\n            <div class="c_activity_confirmtop_inner2">\n                <span>请于';
$out+=$string(parseInt(d.expire_minutes,10));
$out+='分钟内完成缴费，否则订单将自动取消</span>\n            </div>\n        </div>\n\n        <!--<div class="c_activity_enrolltop">\n            <div class="c_activity_enrolltop1">';
$out+=$string(d.activity_name||'');
$out+='</div>\n            <div class="c_activity_enrolltop2">';
$out+=$string(d.activity_start_time);
$out+='~';
$out+=$string(d.activity_end_time);
$out+='</div>\n            <div class="c_activity_enrolltop3">';
$out+=$string(d.activity_address||'');
$out+='</div>\n        </div>-->\n        \n        <div class="c_activity_bindtop">\n			<a href="http://www.baidu.com" class="c_activity_bindtop_inner">\n				<div class="c_activity_bindtop_inner_left"><img src="';
$out+=$string(d.banner_url||'');
$out+='" /></div>\n				<div class="c_activity_bindtop_inner_right">\n					<span class="c_activity_bindtop_inner_right1">';
$out+=$string(d.activity_name||'');
$out+='</span>\n					<span class="c_activity_bindtop_inner_right2">';
$out+=$string(d.activity_start_time);
$out+='~';
$out+=$string(d.activity_end_time);
$out+='</span>\n					<span class="c_activity_bindtop_inner_right3">';
$out+=$string(d.activity_address||'');
$out+='</span>\n				</div>\n			</a>\n		</div>\n\n        <div class="c_activity_confirmlist">\n            <div class="c_activity_confirmlist_inner">\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>姓名</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(d.contact_name||'');
$out+='</div>\n                </div>\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>联系方式</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(d.contact_mobile||'');
$out+='</div>\n                </div>\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>电子邮箱</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(d.contact_email||'');
$out+='</div>\n                </div>\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>公司名称</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(d.contact_company||'');
$out+='</div>\n                </div>\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>性别</p>\n                    </div>\n                    <div class="weui-cell__ft">女士</div>\n                </div>\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>支付方式</p>\n                    </div>\n                    <div class="weui-cell__ft">微信支付</div>\n                </div>\n            </div>\n\n            <div class="c_activity_confirmlist_inner c_room_detail_listcolor" style="margin-top: 10px;">\n\n                <div class="c_room_confirm_costtitle">\n                    <div class="c_room_confirm_costtitle_inner1"></div>\n                    <div class="c_room_confirm_costtitle_inner2">发票信息</div>\n                    <div class="c_room_confirm_costtitle_inner1"></div>\n                </div>\n\n                <div class="weui-cell c_room_confirm_nobefore">\n                    <div class="weui-cell__bd">\n                        <p>发票类型</p>\n                    </div>\n                    <div class="weui-cell__ft">';
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
$out+='\n            </div>\n        </div>\n\n    </div>\n</div>\n\n<div class="footer_fixed_box">\n    <div class="footer_fixed_box_left c_activity_confirm_footer_left">支付：&yen;';
$out+=$string(d.price||0);
$out+='</div>\n    <div class="footer_fixed_box_right"><a href="/index.php/index/wx_pay/pageWxPay?order_id=';
$out+=$string(d.id);
$out+='&order_type=activity" class="footer_fixed_box_right_inner">确认支付</a></div>\n</div>';
return new String($out);
});/*v:2*/
template('paid',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,d=$data.d,order=$data.order,status=$data.status,status_text=$data.status_text,status_explain=$data.status_explain,is_need_invoice=$data.is_need_invoice,invoice_type=$data.invoice_type,invoice_title=$data.invoice_title,invoice_mail_address=$data.invoice_mail_address,invoice_tax_no=$data.invoice_tax_no,$string=$utils.$string,g=$data.g,$out='';
var d = order;
var status = +d.status;
var status_text = {1:'已支付',2:'已签到',9:'已超时取消',10:'已结束'}
var status_explain = {1:'您的订单已支付成功，请准时前往参加活动',2:'签到已成功，谢谢您的参与',9:'您的订单已超时，请重新支付',10:'活动已结束，完成问卷与评价可获得相应积分'}

var is_need_invoice = d.is_need_invoice;
var invoice_type = d.invoice_type;
var invoice_title = d.invoice_title;
var invoice_mail_address = d.invoice_mail_address;
var invoice_tax_no = d.invoice_tax_no;


$out+='\n<div class="mobile_outcontainer">\n    <div class="mobile_nopadding_container1">\n\n        <div class="c_activity_confirmtop">\n            <div class="c_activity_confirmtop_inner1">\n                <span>';
$out+=$string(status_text[status]);
$out+='</span>\n            </div>\n            <div class="c_activity_confirmtop_inner2">\n                <span>';
$out+=$string(status_explain[status]);
$out+='</span>\n            </div>\n        </div>\n\n\n        <!--<div class="c_activity_enrolltop">\n            <div class="c_activity_enrolltop1">';
$out+=$string(d.activity_name||'');
$out+='</div>\n            <div class="c_activity_enrolltop2">';
$out+=$string(d.activity_start_time.replace(/-/g,'/'));
$out+='-';
$out+=$string(d.activity_end_time.replace(/-/g,'/'));
$out+='</div>\n            <div class="c_activity_enrolltop3">';
$out+=$string(d.activity_address||'');
$out+='</div>\n        </div>-->\n        \n        <div class="c_activity_bindtop">\n			<a href="/index.php/index/activity/pageActivityDetail?activity_id=';
$out+=$string(d.activity_id);
$out+='" class="c_activity_bindtop_inner">\n				<div class="c_activity_bindtop_inner_left"><img src="';
$out+=$string(d.banner_url||'');
$out+='" /></div>\n				<div class="c_activity_bindtop_inner_right">\n					<span class="c_activity_bindtop_inner_right1">';
$out+=$string(d.activity_name||'');
$out+='</span>\n					<span class="c_activity_bindtop_inner_right2">';
$out+=$string(d.activity_start_time.replace(/-/g,'/'));
$out+='-';
$out+=$string(d.activity_end_time.replace(/-/g,'/'));
$out+='</span>\n					<span class="c_activity_bindtop_inner_right3">';
$out+=$string(d.activity_address||'');
$out+='</span>\n				</div>\n			</a>\n		</div>\n\n        ';
if(1===status){
$out+='\n        <div class="c_activity_confirmlist">\n            <div class="c_activity_confirmlist_inner">\n                <a class="weui-cell weui-cell_access" href="javascript:;">\n\n                    <div class="weui-cell__bd" style="font-size: 15px;cursor:pointer;" id="ShowQRCode" data-order_id="';
$out+=$string(d.id);
$out+='" data-activity_name="';
$out+=$string(d.activity_name);
$out+='" data-enroll_qrcode_url="';
$out+=$string(d.enroll_qrcode_url);
$out+='">\n                        <p>我的二维码</p>\n                    </div>\n                    <div class="weui-cell__ft">\n                    </div>\n                </a>\n            </div>\n        </div>\n        ';
}
$out+='\n\n\n        <div class="c_activity_confirmlist">\n            <div class="c_activity_confirmlist_inner">\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>姓名</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(d.contact_name||'');
$out+='</div>\n                </div>\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>联系方式</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(d.contact_mobile||'');
$out+='</div>\n                </div>\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>电子邮箱</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(d.contact_email||'');
$out+='</div>\n                </div>\n                ';
if(d.contact_company){
$out+='\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>公司名称</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string(d.contact_company);
$out+='</div>\n                </div>\n                ';
}
$out+='\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>性别</p>\n                    </div>\n                    <div class="weui-cell__ft">';
$out+=$string((1===+d.contact_sex)?'男士':'女士');
$out+='</div>\n                </div>\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>支付金额</p>\n                    </div>\n                    <div class="weui-cell__ft">&yen;';
$out+=$string(d.price);
$out+='</div>\n                </div>\n                <div class="weui-cell">\n                    <div class="weui-cell__bd">\n                        <p>支付方式</p>\n                    </div>\n                    <div class="weui-cell__ft">微信支付</div>\n                </div>\n            </div>\n\n            <div class="c_activity_confirmlist_inner c_room_detail_listcolor" style="margin-top: 10px;">\n\n                <div class="c_room_confirm_costtitle">\n                    <div class="c_room_confirm_costtitle_inner1"></div>\n                    <div class="c_room_confirm_costtitle_inner2">发票信息</div>\n                    <div class="c_room_confirm_costtitle_inner1"></div>\n                </div>\n\n                <div class="weui-cell c_room_confirm_nobefore">\n                    <div class="weui-cell__bd">\n                        <p>发票类型</p>\n                    </div>\n                    <div class="weui-cell__ft">';
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
$out+='\n            </div>\n        </div>\n\n    </div>\n</div>\n\n';
if(9==status){
$out+='\n<div class="footer_fixed_box">\n    <div class="footer_fixed_box_right" style="float: right;">\n        <a id="deleteOrder" href="javascript:;" style="cursor:pointer;" class="footer_fixed_box_join_right_inner">删除订单</a>\n    </div>\n</div>\n';
}
$out+='\n\n';
if(10==status){
$out+='\n<div class="footer_fixed_box">\n    <div class="footer_fixed_box_left footer_fixed_box_join_left">\n        ';
if(0==d.is_answered){
$out+='\n        <a target="_self" href="/index.php/index/activity/pageAnswerActivityOrderQuestions?order_id=';
$out+=$string(d.id);
$out+='" class="footer_fixed_box_join_left_inner">调查问卷</a>\n        ';
}else if(1==d.is_answered){
$out+='\n        <a href="javascript:;" class="footer_fixed_box_join_left_inner">已答卷</a>\n        ';
}
$out+='\n    </div>\n    <div class="footer_fixed_box_right">\n        ';
if(0==d.is_commented){
$out+='\n        <a target="_self" href="/index.php/index/activity/pageMemberCommentActivityOrder?order_id=';
$out+=$string(d.id);
$out+='" class="footer_fixed_box_join_right_inner">评价活动</a>\n        ';
}else if(1==d.is_commented){
$out+='\n        <a href="javascript:;" class="footer_fixed_box_join_right_inner">已评价</a>\n        ';
}
$out+='\n    </div>\n</div>\n';
}
return new String($out);
});

}()