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
/*``*/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,special_services=$data.special_services,d=$data.d,hiddenData=$data.hiddenData,$string=$utils.$string,g=$data.g,hoursGap=$data.hoursGap,Date=$data.Date,spe_ser=$data.spe_ser,a=$data.a,b=$data.b,getImgPath=$helpers.getImgPath,i=$data.i,s=$data.s,canSelectable=$data.canSelectable,JSON=$data.JSON,$out='';
var special_services = special_services||[];
var d = hiddenData || {};

$out+='\n<div class="mobile_outcontainer">\n    <div class="mobile_nopadding_container2">\n        <div class="c_incubator_applylist">\n            <div class="c_room_infodetail_top">\n                <div class="c_room_infodetail_top_inner"><label>会议室：</label><span style="font-size: 14px">';
$out+=$string(d.meeting_room_name||'');
$out+='</span></div>\n                <div class="c_room_infodetail_top_inner">时间：<span style="font-size: 14px;">';
$out+=$string(d.reserve_start_time.replace(/-/g,'/'));
$out+='-';
$out+=$string(d.reserve_end_time.replace(/-/g,'/'));
$out+='</span></div>\n            </div>\n            <div class="c_incubator_applylist_inner">\n                <div class="c_incubator_applylist_inner_box c_incubator_applylist_inner_box_noborder">\n                    <label class="c_applylist_inner_left">主题</label>\n                    <input class="j-theme c_applylist_inner_right" placeholder="请输入会议议题" maxlength="100" />\n                </div>\n                <div class="c_incubator_applylist_inner_box c_incubator_applylist_inner_box_noborder">\n                    <label class="c_applylist_inner_left">参会人数</label>\n                    <input class="j-persons c_applylist_inner_right" placeholder="请输入参会人数" maxlength="10" type="number" />\n                </div>\n            </div>\n            <div class="c_incubator_applylist_inner">\n                <div class="c_incubator_applylist_inner_box c_incubator_applylist_inner_box_noborder">\n                    <label class="c_applylist_inner_left">联系人</label>\n                    <input class="j-contact_name c_applylist_inner_right" placeholder="请输入联系人姓名" />\n                </div>\n                <div class="c_incubator_applylist_inner_box">\n                    <label class="c_applylist_inner_left">联系方式</label>\n                    <input class="j-contact_mobile c_applylist_inner_right" placeholder="请输入联系人方式" type="tel" />\n                </div>\n                <div class="c_incubator_applylist_inner_box">\n                    <label class="c_applylist_inner_left">电子邮箱</label>\n                    <input class="j-contact_email c_applylist_inner_right" placeholder="请输入电子邮箱" type="email"/>\n                </div>\n            </div>\n            ';

            var hoursGap = (new Date(d.reserve_start_time.replace(/-/g,'/')).getTime() - new Date(d.current_time.replace(/-/g,'/')).getTime())/(1000*60*60);
            var spe_ser = special_services.sort(function(a,b){return a.advance_hours-0>=b.advance_hours-0});
            if(spe_ser && spe_ser.length){
$out+='\n            <div class="c_room_infoinput_inner">\n                <div class="j-service-switch c_room_infoinput_inner_title" style="cursor:pointer;"><label class="c_room_infoinput_inner_title_left">选择服务</label><b class="c_room_infoinput_inner_title_right">\n                    <img data-direction="unfold" class="j-down-arrow c-service-arrow none" src="';
$out+=$string(getImgPath('down_img2.png'));
$out+='"  />\n                    <img data-direction="fold" class="j-up-arrow c-service-arrow" src="';
$out+=$string(getImgPath('down_img1.png'));
$out+='" />\n                </b></div>\n                <div class="j-service-items c_room_infoinput_inner_detail">\n                    ';
for(var i=0;i<spe_ser.length;i++){
                    var s = spe_ser[i];
                    var canSelectable = s.advance_hours<=hoursGap;
                    
$out+='\n                    <div data-info=';
$out+=$string(JSON.stringify(s));
$out+=' class="j-service-item c_room_infoinput_inner_detail_inner ';
$out+=$string(0==i?'c_room_infoinput_inner_detail_inner_noborder':' ');
$out+=' ';
$out+=$string(canSelectable?'c_room_infoinput_inner_detail_inner_selectable':' ');
$out+='">\n                        <div class="c_room_infoinput_inner_detail_inner_left">';
$out+=$string(s.name||'');
$out+='<label class="c_room_infoinput_inner_detail_inner_left_remind">提前';
$out+=$string(s.advance_hours||0);
$out+='小时</label></div>\n                        <div class="c_room_infoinput_inner_detail_inner_right">&yen;';
$out+=$string(s.price||0);
$out+='\n                            <b class="c_room_infoinput_inner_detail_inner_right_select">\n                                <img style="cursor:pointer;" data-can_click=';
$out+=$string(canSelectable?1:0);
$out+=' class="j-service-option" data-selected="0" src="';
$out+=$string(getImgPath('station_pay_icon2.png'));
$out+='" />\n                                <img style="cursor:pointer;" data-can_click=';
$out+=$string(canSelectable?1:0);
$out+=' class="j-service-option none" data-selected="1" src="';
$out+=$string(getImgPath('station_pay_icon3.png'));
$out+='" />\n                            </b>\n                        </div>\n                    </div>\n                    ';
}
$out+='\n                </div>\n            </div>\n            ';
}
$out+='\n\n            <div class="c_activity_enrollpay">\n                <div class="c_activity_enrollpay_title">支付方式</div>\n                <div class="c_activity_enrollpay_list">\n                    <div class="c_activity_enrollpay_list_left">\n                        <b class="c_activity_enrollpay_list_left_img"><img src="';
$out+=$string(getImgPath('activity_eroll_icon1.png'));
$out+='" /></b>\n                        <span class="c_activity_enrollpay_list_left_txt">微信支付</span>\n                    </div>\n                    <div class="c_activity_enrollpay_list_right">\n                        <div class="c_enroll_select_option" style="margin-top: 3px;"><b class="c_enroll_select_option_btn"><img src="';
$out+=$string(getImgPath('select3.png'));
$out+='" /></b></div>\n                    </div>\n                </div>\n            </div>\n            <div class="c_activity_enrolllist" id="invoice">\n                <div class="c_enroll_select">\n                    <div class="c_enroll_select_inner">\n                        <div class="c_enroll_select_inner_left" style="color: #999;">是否开据发票</div>\n                        <div class="c_enroll_select_inner_right">\n                            <div class="j-invoice c_enroll_select_option" data-invoice="no" data-checked="1" style="margin-left: 0;cursor: pointer;"><b class="c_enroll_select_option_btn"><img class="j-img" src="';
$out+=$string(getImgPath('select3.png'));
$out+='" /></b><label class="c_enroll_select_option_txt">否</label></div>\n                            <div class="j-invoice c_enroll_select_option" data-invoice="yes" data-checked="0" style="margin-left: 20px;cursor: pointer;"><b class="c_enroll_select_option_btn"><img class="j-img" src="';
$out+=$string(getImgPath('select1.png'));
$out+='" /></b><label class="c_enroll_select_option_txt">是</label></div>\n\n                        </div>\n                    </div>\n                </div>\n\n\n                <div class="j-info c_enroll_invoiceslist none">\n                    <div class="weui-cell weui-cell_select weui-cell_select-after">\n                        <div class="weui-cell__hd">\n                            <label for="" class="weui-label">发票类型</label>\n                        </div>\n                        <div class="weui-cell__bd">\n                            <select class="weui-select j-type" name="select2">\n                                <option value="1">个人</option>\n                                <option value="2">企业</option>\n                            </select>\n                        </div>\n                    </div>\n\n                    <div class="c_activity_enrolllist_inner_box">\n                        <label class="c_enrolllist_inner_left">开票抬头</label>\n                        <input class="j-title c_enrolllist_inner_right" placeholder="请输入开票抬头" />\n                    </div>\n                    <div class="c_activity_enrolllist_inner_box">\n                        <label class="c_enrolllist_inner_left">邮寄地址</label>\n                        <input class="j-address c_enrolllist_inner_right" placeholder="请输入邮寄地址"  />\n                    </div>\n                    <div class="j-number_wrap c_activity_enrolllist_inner_box none">\n                        <label class="c_enrolllist_inner_left">企业税号</label>\n                        <input class="j-number c_enrolllist_inner_right" placeholder="请输入企业税号" />\n                    </div>\n                    <div class="c_activity_enrolllist_inner_box">\n                        <b class="j-reminder c_enrolllist_inner_box_remindtxt">请核对填写信息，如有错误责任自负！</b>\n                    </div>\n\n                </div>\n\n            </div>\n\n\n            <div class="c_room_inputdetail_inner">\n                <div class="c_incubator_roadshowlist_inner_box">\n                    <label class="c_roadshowlist_inner_title">备注</label>\n                    <textarea class="j-bake" maxlength="120" placeholder="选填" style="padding-left: 0;"></textarea>\n                    <span class="j-bake_limit_num limit_num">0/120</span>\n                </div>\n            </div>\n\n\n\n\n\n            <div class="c_incubator_applylist_btn" style="margin-top: 12px;"><label style="cursor:pointer;" class="j-submit c_incubator_applylist_btn_inner c_room_infoinput_btn_inner">立即预定</label></div>\n\n        </div>\n    </div>\n</div>';
return new String($out);
});

}()