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



    /*v:18*/
template('index','<div class="mobile_outcontainer">\r\n    <div class="mobile_nopadding_container1">\r\n        <div class="c_station_paytop">\r\n            <div class="c_station_paytop_inner">\r\n                <div class="c_station_paytop_inner_left"><a href="#"><img class="j-office_list_img_url" src=""/></a>\r\n                </div>\r\n                <div class="c_station_paytop_inner_right">\r\n                    <span class="c_station_paytop_inner_right1 j-office_name"></span>\r\n                    <span class="c_station_paytop_inner_right3 j-office_price"></span>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <div class="c_activity_confirmlist">\r\n            <div class="c_activity_confirmlist_inner">\r\n                <div class="weui-cell">\r\n                    <div class="weui-cell__bd">\r\n                        <p>起始时间</p>\r\n                    </div>\r\n                    <div class="weui-cell__ft j-start_date"></div>\r\n                </div>\r\n                <div class="weui-cell">\r\n                    <div class="weui-cell__bd">\r\n                        <p>结束时间</p>\r\n                    </div>\r\n                    <div class="weui-cell__ft j-end_date"></div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <div class="c_activity_confirmlist">\r\n            <div class="c_activity_confirmlist_inner">\r\n                <div class="weui-cell">\r\n                    <div class="weui-cell__bd">\r\n                        <p>联系人</p>\r\n                    </div>\r\n                    <div class="weui-cell__ft j-contact_name"></div>\r\n                </div>\r\n                <div class="weui-cell">\r\n                    <div class="weui-cell__bd">\r\n                        <p>联系方式</p>\r\n                    </div>\r\n                    <div class="weui-cell__ft j-contact_mobile"></div>\r\n                </div>\r\n                <div class="weui-cell">\r\n                    <div class="weui-cell__bd">\r\n                        <p>支付方式</p>\r\n                    </div>\r\n                    <div class="weui-cell__ft">微信支付</div>\r\n                </div>\r\n                <div class="weui-cell">\r\n                    <div class="weui-cell__bd">\r\n                        <p>合计支付</p>\r\n                    </div>\r\n                    <div class="weui-cell__ft j-total_price"\r\n                         style="color: #ff0234;font-size: 14px;height: 20px;line-height: 20px;"></div>\r\n                </div>\r\n            </div>\r\n\r\n\r\n            <div class="c_activity_confirmlist_inner c_room_detail_listcolor j-piao" style="margin-top: 10px;">\r\n\r\n                <div class="c_room_confirm_costtitle">\r\n                    <div class="c_room_confirm_costtitle_inner1"></div>\r\n                    <div class="c_room_confirm_costtitle_inner2">发票信息</div>\r\n                    <div class="c_room_confirm_costtitle_inner1"></div>\r\n                </div>\r\n\r\n                <div class="weui-cell c_room_confirm_nobefore">\r\n                    <div class="weui-cell__bd">\r\n                        <p>发票类型</p>\r\n                    </div>\r\n                    <div class="weui-cell__ft j-invoice_type"></div>\r\n                </div>\r\n\r\n                <div class="weui-cell">\r\n                    <div class="weui-cell__bd">\r\n                        <p>开票抬头</p>\r\n                    </div>\r\n                    <div class="weui-cell__ft j-invoice_title"></div>\r\n                </div>\r\n                <div class="weui-cell">\r\n                    <div class="weui-cell__bd">\r\n                        <p>邮寄地址</p>\r\n                    </div>\r\n                    <div class="weui-cell__ft j-invoice_mail_address"></div>\r\n                </div>\r\n\r\n                <div class="weui-cell">\r\n                    <div class="weui-cell__bd">\r\n                        <p>企业税号</p>\r\n                    </div>\r\n                    <div class="weui-cell__ft j-invoice_tax_no"></div>\r\n                </div>\r\n\r\n            </div>\r\n\r\n        </div>\r\n\r\n\r\n    </div>\r\n</div>\r\n\r\n<div class="footer_fixed_box">\r\n    <div class="footer_fixed_box_left c_activity_confirm_footer_left c_station_confirm_footer_left">\r\n        <b class="station_pay_footer_left_img"><img class="picSelected"\r\n                                                    src="/static/resources/images/station_pay_icon2.png"\r\n                                                    style="cursor:pointer;"/></b>\r\n        <label class="station_pay_footer_left_txt">同意<a href="#">《预订合同协议》</a></label>\r\n    </div>\r\n    <div class="footer_fixed_box_right confirmBtn" style="cursor:pointer;"><span\r\n            class="footer_fixed_box_right_inner station_pay ">确认订单</span></div>\r\n</div>\r\n\r\n\r\n');

}()