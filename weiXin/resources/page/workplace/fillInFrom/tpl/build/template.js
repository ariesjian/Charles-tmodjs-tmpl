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



    /*v:7*/
template('index',function($data,$filename
/*``*/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,isContinue=$data.isContinue,is_continue=$data.is_continue,$string=$utils.$string,workplace_list_img_url=$data.workplace_list_img_url,workplace_name=$data.workplace_name,workplace_price=$data.workplace_price,nowTime=$data.nowTime,Date=$data.Date,current_date=$data.current_date,startTime=$data.startTime,start_date=$data.start_date,i=$data.i,date=$data.date,year=$data.year,month=$data.month,day=$data.day,month2=$data.month2,day2=$data.day2,calcTime=$data.calcTime,isCurrent=$data.isCurrent,selected=$data.selected,getImgPath=$helpers.getImgPath,month_length=$data.month_length,workplace_count=$data.workplace_count,contact_name=$data.contact_name,contact_mobile=$data.contact_mobile,$out='';
var isContinue = (1==is_continue);

$out+='\n<div class="mobile_outcontainer">\n    <div class="mobile_nopadding_container1">\n        <div class="c_station_paytop">\n            <div class="c_station_paytop_inner">\n                <div class="c_station_paytop_inner_left"><a href="#"><img src="';
$out+=$string(workplace_list_img_url);
$out+='" /></a></div>\n                <div class="c_station_paytop_inner_right">\n                    <span class="c_station_paytop_inner_right1">';
$out+=$string(workplace_name);
$out+='</span>\n                    <span class="c_station_paytop_inner_right3">&yen;';
$out+=$string(workplace_price);
$out+='/位/月</span>\n                </div>\n            </div>\n        </div>\n\n        <div class="c_station_listdetail_box2_inner1">\n            <div class="c_station_listdetail_box2_inner1_select">\n                <label class="c_station_listdetail_box2_inner1_select_txt">开始日期</label>\n                ';
if(!isContinue){
$out+='\n                <select id="startDate">\n\n                        ';
var nowTime = new Date(current_date).getTime();
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
                            
$out+='\n                            <option ';
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
$out+='日</option>\n                        ';
}
$out+='\n                </select>\n                <b><img src="';
$out+=$string(getImgPath('down_list.png'));
$out+='" /></b>\n                ';
}else{
$out+='\n                <div id="startDateContinue" class="c-start_date">';
$out+=$string(start_date);
$out+='</div>\n\n                ';
}
$out+='\n\n\n            </div>\n            <div class="c_station_listdetail_box2_inner1_select">\n                <label class="c_station_listdetail_box2_inner1_select_txt">选择时间</label>\n                <select id="monthLength">\n                    <option ';
$out+=$string((month_length==1)?selected="selected":"");
$out+=' value="1">1个月</option>\n                    <option ';
$out+=$string((month_length==2)?selected="selected":"");
$out+=' value="2">2个月</option>\n                    <option ';
$out+=$string((month_length==3)?selected="selected":"");
$out+=' value="3">3个月</option>\n                    <option ';
$out+=$string((month_length==4)?selected="selected":"");
$out+=' value="4">4个月</option>\n                    <option ';
$out+=$string((month_length==5)?selected="selected":"");
$out+=' value="5">5个月</option>\n                    <option ';
$out+=$string((month_length==6)?selected="selected":"");
$out+=' value="6">6个月</option>\n                </select>\n                <b><img src="';
$out+=$string(getImgPath('down_list.png'));
$out+='" /></b>\n            </div>\n            <div class="c-station_rest">剩余工位：<span id="availableCount" class="c-text"></span></div>\n        </div>\n\n\n        <div class="c_station_paybox">\n            <div class="c_station_paybox_inner">\n                <div class="c_station_paybox_inner_box c_station_paybox_inner_box_noborder">\n                    <label class="c_station_paybox_inner_box_left">工位数量</label>\n                    ';
if(isContinue){
$out+='\n                    <input class="c_station_paybox_inner_box_right" placeholder="请输入工位数量" type="number" maxlength="100" id="workplaceCount" value="';
$out+=$string(workplace_count);
$out+='" />\n                    ';
}else{
$out+='\n                    <input class="c_station_paybox_inner_box_right" placeholder="请输入工位数量" type="number" maxlength="100" id="workplaceCount"  />\n                    ';
}
$out+='\n                </div>\n                <div class="c_station_paybox_inner_box">\n                    <label class="c_station_paybox_inner_box_left">联系人</label>\n                    ';
if(isContinue){
$out+='\n                    <input class="c_station_paybox_inner_box_right" placeholder="请输入联系人姓名" maxlength="100" id="contactName" value="';
$out+=$string(contact_name);
$out+='" />\n                    ';
}else{
$out+='\n                    <input class="c_station_paybox_inner_box_right" placeholder="请输入联系人姓名" maxlength="100" id="contactName" />\n                    ';
}
$out+='\n                </div>\n                <div class="c_station_paybox_inner_box">\n                    <label class="c_station_paybox_inner_box_left">联系方式</label>\n                    ';
if(isContinue){
$out+='\n                    <input class="c_station_paybox_inner_box_right" placeholder="请输入联系方式" maxlength="11" id="contactMobile" value=';
$out+=$string(contact_mobile);
$out+=' />\n                    ';
}else{
$out+='\n                    <input class="c_station_paybox_inner_box_right" placeholder="请输入联系方式" maxlength="11" id="contactMobile" />\n                    ';
}
$out+='\n                </div>\n            </div>\n        </div>\n\n        <div class="c_activity_enrollpay">\n            <div class="c_activity_enrollpay_title">支付方式</div>\n            <div class="c_activity_enrollpay_list">\n                <div class="c_activity_enrollpay_list_left">\n                    <b class="c_activity_enrollpay_list_left_img"><img src="';
$out+=$string(getImgPath('activity_eroll_icon1.png'));
$out+='" /></b>\n                    <span class="c_activity_enrollpay_list_left_txt">微信支付</span>\n                </div>\n                <div class="c_activity_enrollpay_list_right">\n                    <div class="c_enroll_select_option" style="margin-top: 3px;"><b class="c_enroll_select_option_btn"><img src="';
$out+=$string(getImgPath('select4.png'));
$out+='" /></b></div>\n                </div>\n            </div>\n        </div>\n\n        <div class="c_activity_enrolllist" id="invoice">\n            <div class="c_enroll_select">\n                <div class="c_enroll_select_inner">\n                    <div class="c_enroll_select_inner_left" >是否开据发票</div>\n                    <div class="c_enroll_select_inner_right">\n                        <div class="j-invoice c_enroll_select_option" data-invoice="no" data-checked="1" style="margin-left: 0;cursor: pointer;"><b class="c_enroll_select_option_btn"><img class="j-img" src="';
$out+=$string(getImgPath('select4.png'));
$out+='" /></b><label class="c_enroll_select_option_txt">否</label></div>\n                        <div class="j-invoice c_enroll_select_option" data-invoice="yes" data-checked="0" style="margin-left: 20px;cursor: pointer;"><b class="c_enroll_select_option_btn"><img class="j-img" src="';
$out+=$string(getImgPath('select1.png'));
$out+='" /></b><label class="c_enroll_select_option_txt">是</label></div>\n\n                    </div>\n                </div>\n            </div>\n\n            <div class="j-info c_enroll_invoiceslist none">\n                <div class="weui-cell weui-cell_select weui-cell_select-after">\n                    <div class="weui-cell__hd">\n                        <label for="" class="weui-label">发票类型</label>\n                    </div>\n                    <div class="weui-cell__bd">\n                        <select class="weui-select j-type" name="select2">\n                            <option value="1">个人</option>\n                            <option value="2">企业</option>\n                        </select>\n                    </div>\n                </div>\n\n                <div class="c_activity_enrolllist_inner_box">\n                    <label class="c_enrolllist_inner_left">开票抬头</label>\n                    <input class="j-title c_enrolllist_inner_right"  placeholder="请输入开票抬头信息"/>\n                </div>\n                <div class="c_activity_enrolllist_inner_box">\n                    <label class="c_enrolllist_inner_left">邮寄地址</label>\n                    <input class="j-address c_enrolllist_inner_right" placeholder="请输入邮寄地址" />\n                </div>\n                <div class="j-number_wrap c_activity_enrolllist_inner_box none">\n                    <label class="c_enrolllist_inner_left">企业税号</label>\n                    <input class="j-number c_enrolllist_inner_right" placeholder="请输入企业税号" />\n                </div>\n                <div class="c_activity_enrolllist_inner_box">\n                    <b class="j-reminder c_enrolllist_inner_box_remindtxt">请核对填写信息，如有错误责任自负！</b>\n                </div>\n\n            </div>\n\n        </div>\n\n\n    </div>\n</div>\n\n<div class="footer_fixed_box">\n    <div class="footer_fixed_box_left c_activity_enroll_footer_left">支付：&yen;<span id="totalPrice">';
$out+=$string(workplace_price*month_length);
$out+='</span></div>\n    <div class="footer_fixed_box_right"><a href="javascript:;" style="cursor:pointer;" id="submit" class="footer_fixed_box_right_inner station_pay">确认订单</a></div>\n</div>\n';
return new String($out);
});

}()