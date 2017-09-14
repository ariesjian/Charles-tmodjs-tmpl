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



    /*v:2*/
template('index',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,isContinue=$data.isContinue,is_continue=$data.is_continue,$string=$utils.$string,office_list_img_url=$data.office_list_img_url,office_name=$data.office_name,office_price=$data.office_price,nowTime=$data.nowTime,Date=$data.Date,start_date=$data.start_date,startTime=$data.startTime,i=$data.i,date=$data.date,year=$data.year,month=$data.month,day=$data.day,month2=$data.month2,day2=$data.day2,calcTime=$data.calcTime,isCurrent=$data.isCurrent,selected=$data.selected,getImgPath=$helpers.getImgPath,month_length=$data.month_length,contact_name=$data.contact_name,contact_mobile=$data.contact_mobile,$out='';
var isContinue = (1==is_continue);

$out+='\r\n<div class="mobile_outcontainer">\r\n    <div class="mobile_nopadding_container1">\r\n        <div class="c_station_paytop">\r\n            <div class="c_station_paytop_inner">\r\n                <div class="c_station_paytop_inner_left"><a href="#"><img src="';
$out+=$string(office_list_img_url);
$out+='" /></a></div>\r\n                <div class="c_station_paytop_inner_right">\r\n                    <span class="c_station_paytop_inner_right1">';
$out+=$string(office_name);
$out+='</span>\r\n\r\n                    <span class="c_station_paytop_inner_right3">单价:   &yen;';
$out+=$string(office_price);
$out+='/月</span>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <div class="c_station_listdetail_box2_inner1">\r\n            <div class="c_station_listdetail_box2_inner1_select">\r\n                <label class="c_station_listdetail_box2_inner1_select_txt">开始日期</label>\r\n                ';
if(!isContinue){
$out+='\r\n                <select id="startDate">\r\n\r\n                    ';
var nowTime = new Date(start_date).getTime();
                    var startTime = new Date(start_date).getTime();
                    for(var i=0;i<7;i++){
                    var date = new Date((nowTime+i*24*60*60*1000));
                    var year = date.getFullYear()+'';
                    var month = date.getMonth()+1+'';
                    var day = date.getDate()+'';
                    var month2 = 1===month.length?'0'+month:month;
                    var day2 = 1===day.length?'0'+day:day;
                    var calcTime = new Date([year,month2,day2].join('-')).getTime();
                    var isCurrent = startTime===calcTime;
                    
$out+='\r\n                    <option ';
$out+=$string(isCurrent?selected="selected":"");
$out+=' value="';
$out+=$string(year);
$out+='-';
$out+=$string(month2);
$out+='-';
$out+=$string(day2);
$out+='">';
$out+=$string(year);
$out+='年';
$out+=$string(month);
$out+='月';
$out+=$string(day);
$out+='日</option>\r\n                    ';
}
$out+='\r\n                </select>\r\n                <b><img src="';
$out+=$string(getImgPath('down_list.png'));
$out+='" /></b>\r\n                ';
}else{
$out+='\r\n                <div id="startDateContinue" class="c-start_date">';
$out+=$string(start_date);
$out+='</div>\r\n\r\n                ';
}
$out+='\r\n\r\n\r\n            </div>\r\n            <div class="c_station_listdetail_box2_inner1_select">\r\n                <label class="c_station_listdetail_box2_inner1_select_txt">选择时间</label>\r\n                <select id="monthLength">\r\n                    <option ';
$out+=$string((month_length==1)?selected="selected":"");
$out+=' value="1">1个月</option>\r\n                    <option ';
$out+=$string((month_length==2)?selected="selected":"");
$out+=' value="2">2个月</option>\r\n                    <option ';
$out+=$string((month_length==3)?selected="selected":"");
$out+=' value="3">3个月</option>\r\n                    <option ';
$out+=$string((month_length==4)?selected="selected":"");
$out+=' value="4">4个月</option>\r\n                    <option ';
$out+=$string((month_length==5)?selected="selected":"");
$out+=' value="5">5个月</option>\r\n                    <option ';
$out+=$string((month_length==6)?selected="selected":"");
$out+=' value="6">6个月</option>\r\n                </select>\r\n                <b><img src="';
$out+=$string(getImgPath('down_list.png'));
$out+='" /></b>\r\n            </div>\r\n        </div>\r\n\r\n\r\n        <div class="c_station_paybox">\r\n            <div class="c_station_paybox_inner">\r\n                <div class="c_station_paybox_inner_box">\r\n                    <label class="c_station_paybox_inner_box_left">联系人</label>\r\n                    ';
if(isContinue){
$out+='\r\n                    <input class="c_station_paybox_inner_box_right" maxlength="100" id="contactName" value="';
$out+=$string(contact_name);
$out+='" type="text"/>\r\n                    ';
}else{
$out+='\r\n                    <input class="c_station_paybox_inner_box_right" maxlength="100" id="contactName" placeholder="请输入您的姓名" type="text"/>\r\n                    ';
}
$out+='\r\n                </div>\r\n                <div class="c_station_paybox_inner_box">\r\n                    <label class="c_station_paybox_inner_box_left">联系方式</label>\r\n                    ';
if(isContinue){
$out+='\r\n                    <input class="c_station_paybox_inner_box_right" maxlength="11" id="contactMobile" value="';
$out+=$string(contact_mobile);
$out+='" type="tel" />\r\n                    ';
}else{
$out+='\r\n                    <input class="c_station_paybox_inner_box_right" maxlength="11" id="contactMobile" type="tel" placeholder="请输入您的联系号码" onkeyup="value=value.replace(/[^\\d]/g,\'\')"/>\r\n                    ';
}
$out+='\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <div class="c_activity_enrollpay">\r\n            <div class="c_activity_enrollpay_title">支付方式</div>\r\n            <div class="c_activity_enrollpay_list">\r\n                <div class="c_activity_enrollpay_list_left">\r\n                    <b class="c_activity_enrollpay_list_left_img"><img src="';
$out+=$string(getImgPath('activity_eroll_icon1.png'));
$out+='" /></b>\r\n                    <span class="c_activity_enrollpay_list_left_txt">微信支付</span>\r\n                </div>\r\n                <div class="c_activity_enrollpay_list_right">\r\n                    <div class="c_enroll_select_option" style="margin-top: 3px;"><b class="c_enroll_select_option_btn"><img src="';
$out+=$string(getImgPath('select4.png'));
$out+='" /></b></div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <div class="c_activity_enrolllist">\r\n            <div class="c_enroll_select">\r\n                <div class="c_enroll_select_inner">\r\n                    <div class="c_enroll_select_inner_left">是否开据发票</div>\r\n                    <div class="c_enroll_select_inner_right">\r\n                        <div class="c_enroll_select_option j-is_need_invoice" data-datas="0"  data-checked="4" style="margin-left: 0;cursor: pointer;"><b class="c_enroll_select_option_btn j-img"><img class="imgs" src="/static/resources/images/select4.png" /></b><label class="c_enroll_select_option_txt">否</label></div>\r\n                        <div class="c_enroll_select_option j-is_need_invoice"  data-datas="1" data-checked="2" style="margin-left: 20px; cursor: pointer;"><b class="c_enroll_select_option_btn j-img"><img class="imgs" src="/static/resources/images/select1.png" /></b><label class="c_enroll_select_option_txt">是</label></div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class="c_enroll_invoiceslist j-detail none">\r\n                <div class="weui-cell weui-cell_select weui-cell_select-after">\r\n                    <div class="weui-cell__hd">\r\n                        <label for="" class="weui-label">发票类型</label>\r\n                    </div>\r\n                    <div class="weui-cell__bd">\r\n                        <select class="weui-select j-invoice_type" name="select2">\r\n                            <option value="1">个人</option>\r\n                            <option value="2">企业</option>\r\n                        </select>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class="c_activity_enrolllist_inner_box">\r\n                    <label class="c_enrolllist_inner_left">开票抬头</label>\r\n                    <input class="c_enrolllist_inner_right j-invoice_title"  placeholder="请输入开票抬头信息" type="text" />\r\n                </div>\r\n                <div class="c_activity_enrolllist_inner_box">\r\n                    <label class="c_enrolllist_inner_left">邮寄地址</label>\r\n                    <input class="c_enrolllist_inner_right j-invoice_mail_address"  placeholder="请输入邮寄地址" type="text"/>\r\n                </div>\r\n                <div class="c_activity_enrolllist_inner_box j-q none">\r\n                    <label class="c_enrolllist_inner_left">企业税号</label>\r\n                    <input class="c_enrolllist_inner_right j-invoice_tax_no" placeholder="请输入企业税号" type="number" />\r\n                </div>\r\n                <div class="c_activity_enrolllist_inner_box">\r\n                    <b class="c_enrolllist_inner_box_remindtxt">请核对填写信息，如有错误责任自负！</b>\r\n                </div>\r\n\r\n            </div>\r\n\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<div class="footer_fixed_box">\r\n    <div class="footer_fixed_box_left c_activity_enroll_footer_left">支付：&yen;<span id="totalPrice">';
$out+=$string(office_price*month_length ||'');
$out+='</span></div>\r\n    <div class="footer_fixed_box_right"><a href="javascript:;" style="cursor:pointer;" id="submit" class="footer_fixed_box_right_inner station_pay">确认订单</a></div>\r\n</div>\r\n';
return new String($out);
});

}()