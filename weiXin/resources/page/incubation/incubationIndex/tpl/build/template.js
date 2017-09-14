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



    /*v:15*/
template('index',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,i=$data.i,nature_configs=$data.nature_configs,info=$data.info,$string=$utils.$string,technique_configs=$data.technique_configs,$out='';$out+='<div class="mobile_outcontainer">\r\n    <div class="mobile_nopadding_container2">\r\n        <div class="c_incubator_applylist">\r\n            <div class="c_incubator_applylist_inner">\r\n                <div class="c_incubator_applylist_inner_box c_incubator_applylist_inner_box_noborder">\r\n                    <label class="c_applylist_inner_left">企业名称</label>\r\n                    <input class="j-company_name c_applylist_inner_right"  value="" placeholder="请输入企业名称" type="text"/>\r\n                </div>\r\n                <div class="c_incubator_applylist_inner_box">\r\n                    <label class="c_applylist_inner_left">项目名称</label>\r\n                    <input class="j-project_name c_applylist_inner_right" value="" placeholder="请输入项目名称" type="text"/>\r\n                </div>\r\n            </div>\r\n            <div class="c_incubator_applylist_inner">\r\n                <div class="c_incubator_applylist_inner_box c_incubator_applylist_inner_box_noborder">\r\n                    <label class="c_applylist_inner_left">企业注册时间</label>\r\n                   <!--\r\n                    <input class="j-company_register_date  c_applylist_inner_right" value="" placeholder="注册时间(yyyy-mm-dd)"  onClick="WdatePicker({dateFmt:\'yyyy-MM-dd\'})"/>\r\n              -->\r\n\r\n                    <input class="j-company_register_date  c_applylist_inner_right" value="" id ="showDatePicker" placeholder="请选择注册时间" readonly />\r\n\r\n                </div>\r\n                <div class="c_incubator_applylist_inner_box">\r\n                    <label class="c_applylist_inner_left">企业注册地址</label>\r\n                    <input class="j-company_register_address  c_applylist_inner_right" value=""placeholder="请输入注册地址" type="text"/>\r\n                </div>\r\n                <div class="c_incubator_applylist_inner_box">\r\n                    <label class="c_applylist_inner_left">办公地址</label>\r\n                    <input class="j-office_address c_applylist_inner_right"value="" placeholder="请输入办公地址" type="text"/>\r\n                </div>\r\n\r\n               <div class="weui-cell weui-cell_select weui-cell_select-after">\r\n                    <div class="weui-cell__hd">\r\n                        <label for="" class="weui-label">企业性质</label>\r\n                    </div>\r\n                    <div class="weui-cell__bd">\r\n                        <select class="weui-select" name="select2" id="nature"  >\r\n\r\n                            ';
for(var i=0;i< nature_configs.length;i++){
                            var info = nature_configs[i];
                            
$out+='\r\n                            <option value="';
$out+=$string(info.name);
$out+='"  class="optionclass">';
$out+=$string(info.name);
$out+='</option>\r\n                            ';
}
$out+='\r\n\r\n                        </select>\r\n                    </div>\r\n                </div>\r\n                <div class="weui-cell weui-cell_select weui-cell_select-after">\r\n                    <div class="weui-cell__hd">\r\n                        <label for="" class="weui-label">技术领域</label>\r\n                    </div>\r\n                    <div class="weui-cell__bd">\r\n                        <select class="weui-select" name="select2" id="technique" >\r\n                            ';
for(var i=0;i< technique_configs.length;i++){
                            var info = technique_configs[i];
                            
$out+='\r\n                            <option value="';
$out+=$string(info.name);
$out+='" class="optionclass">';
$out+=$string(info.name);
$out+='</option>\r\n                            ';
}
$out+='\r\n                        </select>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class="c_incubator_applylist_inner_box">\r\n                    <label class="c_applylist_inner_left">注册资本</label>\r\n                    <input class="j-register_capital c_applylist_inner_right" value="" placeholder="请输入注册资本 单位(万)"  onkeyup= "value=value.replace(/[^\\d]/g,\'\')" type="number"/>\r\n                </div>\r\n                <div class="c_incubator_applylist_inner_box">\r\n                    <label class="c_applylist_inner_left">员工总数</label>\r\n                    <input class="j-employee_count c_applylist_inner_right" value="" onkeyup="value=value.replace(/[^\\d]/g,\'\')" placeholder="请输入员工人数 单位(人)" type="number"/>\r\n                </div>\r\n                <div class="c_incubator_applylist_inner_box">\r\n                    <label class="c_applylist_inner_left">营业执照编号</label>\r\n                    <input class="j-business_licence c_applylist_inner_right" placeholder="选填" value="" type="text" />\r\n                </div>\r\n            </div>\r\n\r\n            <div class="c_incubator_applylist_inner">\r\n                <div class="c_incubator_applylist_inner_box c_incubator_applylist_inner_box_noborder">\r\n                    <label class="c_applylist_inner_left">联系人</label>\r\n                    <input class="j-contact_name c_applylist_inner_right" value="" placeholder="请输入联系人" type="text"/>\r\n                </div>\r\n                <div class="c_incubator_applylist_inner_box">\r\n                    <label class="c_applylist_inner_left">联系方式</label>\r\n                    <input class="j-contact_mobile c_applylist_inner_right" value="" onkeyup="value=value.replace(/[^\\d]/g,\'\')" placeholder="请输入联系方式" type="tel"/>\r\n                </div>\r\n                <div class="c_incubator_applylist_inner_box">\r\n                    <label class="c_applylist_inner_left">联系邮箱</label>\r\n                    <input class="j-contact_email c_applylist_inner_right" value="" placeholder="请输入邮箱" type="email"/>\r\n                </div>\r\n            </div>\r\n            <div class="c_incubator_applylist_inner">\r\n                <div class="c_incubator_roadshowlist_inner_box">\r\n                    <label class="c_roadshowlist_inner_title">企业经营范围</label>\r\n                    <textarea placeholder="请输入企业经营范围" class="j-company_business_scope" maxlength="120" ></textarea>\r\n                    <span class="limit_num">0/120</span>\r\n                </div>\r\n            </div>\r\n\r\n            <div class="c_incubator_applylist_inner">\r\n                <div class="c_incubator_roadshowlist_inner_box">\r\n                    <label class="c_roadshowlist_inner_title">公司介绍</label>\r\n                    <textarea placeholder="请输入公司介绍" class="j-company_desc" maxlength="120"></textarea>\r\n                    <span class="limit_num">0/120</span>\r\n                </div>\r\n            </div>\r\n\r\n            <div class="c_incubator_applylist_btn"><label class="c_incubator_applylist_btn_inner" id="Confirm" style="cursor:pointer;" >提交申请</label></div>\r\n        </div>\r\n    </div>\r\n</div>\r\n';
return new String($out);
});

}()