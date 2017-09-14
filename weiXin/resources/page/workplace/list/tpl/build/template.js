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
'use strict';var $utils=this,$helpers=$utils.$helpers,$string=$utils.$string,space_banner_url=$data.space_banner_url,space_name=$data.space_name,space_address=$data.space_address,i=$data.i,date=$data.date,Date=$data.Date,current_date=$data.current_date,year=$data.year,month=$data.month,day=$data.day,month2=$data.month2,day2=$data.day2,getImgPath=$helpers.getImgPath,$out='';$out+='<div class="mobile_outcontainer">\n    <div class="mobile_nopadding_container2">\n        <div class="c_station_listtop"><img src="';
$out+=$string(space_banner_url);
$out+='" /></div>\n        <div class="c_station_listdetail">\n            <div class="c_station_listdetail_box1">\n                <div class="c_station_listdetail_box1_inner">\n                    <span>';
$out+=$string(space_name);
$out+='</span><label>';
$out+=$string(space_address);
$out+='</label>\n                </div>\n            </div>\n            <div class="c_station_listdetail_box2">\n                <div class="c_station_listdetail_box2_inner1">\n                    <div class="c_station_listdetail_box2_inner1_select">\n                        <label class="c_station_listdetail_box2_inner1_select_txt">开始日期</label>\n                        <select id="startDate">\n                            ';
for(var i=0;i<7;i++){
                            var date = new Date((new Date(current_date).getTime()+i*24*60*60*1000));
                            var year = date.getFullYear()+'';
                            var month = date.getMonth()+1+'';
                            var day = date.getDate()+'';
                            var month2 = 1===month.length?'0'+month:month;
                            var day2 = 1===day.length?'0'+day:day;
                            
$out+='\n                            <option value="';
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
$out+='日</option>\n                            ';
}
$out+='\n                        </select>\n                        <b><img src="';
$out+=$string(getImgPath('down_list.png'));
$out+='" /></b>\n                    </div>\n                    <div class="c_station_listdetail_box2_inner1_select" >\n                        <label class="c_station_listdetail_box2_inner1_select_txt">选择时间</label>\n                        <select id="monthLength">\n                            <option value="1">1个月</option>\n                            <option value="2">2个月</option>\n                            <option value="3">3个月</option>\n                            <option value="4">4个月</option>\n                            <option value="5">5个月</option>\n                            <option value="6">6个月</option>\n                        </select>\n                        <b><img src="';
$out+=$string(getImgPath('down_list.png'));
$out+='" /></b>\n                    </div>\n                </div>\n                <div class="c_station_listdetail_box2_inner2" id="workplaceList">\n\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div id="detailPopup" class="c_station_detailpopup none">\n\n    </div>\n</div>';
return new String($out);
});/*v:30*/
template('popup',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$string=$utils.$string,getImgPath=$helpers.getImgPath,banner_obj=$data.banner_obj,list=$data.list,ix=$data.ix,len=$data.len,name=$data.name,price=$data.price,facilities=$data.facilities,i=$data.i,id=$data.id,$out='';$out+='<div class="c_station_detailpopup_inner">\n    <div class="c_station_detailpopup_inner_banner">\n        <a id="closePopup" href="javascript:;" class="c_station_detailpopup_close" style="z-index: 99;"><img  src="';
$out+=$string(getImgPath('close2.png'));
$out+='" /></a>\n\n        <div id="slider" class="c_station_detailpopup_inner_bannerimg mui-slider">\n            <div class="mui-slider-group mui-slider-loop">\n                <!-- 额外增加的一个节点(循环轮播：第一个节点是最后一张轮播) -->\n                <div class="mui-slider-item mui-slider-item-duplicate">\n                    <a href="#">\n                        <img src="';
$out+=$string(banner_obj.last_banner);
$out+='" />\n                    </a>\n                </div>\n                ';

                var list=banner_obj.list;
                for(var ix=0;ix<list.length;ix++){
$out+='\n                <!-- 第二张 -->\n                <div class="mui-slider-item">\n                    <a href="#">\n                        <img src="';
$out+=$string(list[ix]);
$out+='" />\n                    </a>\n                </div>\n                ';
}
$out+='\n                <!-- 额外增加的一个节点(循环轮播：最后一个节点是第一张轮播) -->\n                <div class="mui-slider-item mui-slider-item-duplicate">\n                    <a href="#">\n                        <img src="';
$out+=$string(banner_obj.first_banner);
$out+='" />\n                    </a>\n                </div>\n            </div>\n            <div class="mui-slider-indicator">\n                <div class="mui-indicator mui-active"></div>\n\n                ';

                var list=banner_obj.list;
                for(var len=0;len< list.length-1 ;len++){
$out+='\n                <div class="mui-indicator"></div>\n                ';
}
$out+='\n\n            </div>\n        </div>\n    </div>\n    <div class="c_station_detailpopup_inner_detail">\n        <div class="c_station_detailpopup_inner_detail1">\n            <div class="c_station_detailpopup_inner_detail1_left">';
$out+=$string(name);
$out+='</div>\n            <div class="c_station_detailpopup_inner_detail1_right">\n                <span class="c_station_detail_money1">&yen;';
$out+=$string(price);
$out+='/位/月</span><label class="c_station_detail_money2">（含水电物业）</label>\n            </div>\n        </div>\n        ';
if(facilities&&facilities.length){
$out+='\n        <div class="c_station_detailpopup_inner_detail2">\n            <div class="c_station_detailpopup_inner_detail2_inner">\n                <div class="c_station_detailpopup_inner_detail2_inner_title">\n                    <b class="c_station_detailpopup_inner_detail2_inner_title_left"></b>\n                    <span class="c_station_detailpopup_inner_detail2_inner_title_right">配置详情</span>\n                </div>\n                <div class="c_station_detailpopup_inner_detail2_inner_show">\n                    <div class="c_station_detailpopup_inner_detail2_inner_showbox">\n                        ';
for(var i=0;i<facilities.length;i++){
$out+='\n                        <div class="c_station_detailpopup_inner_detail2_inner_showbox_inner">\n                            <b class="c_station_detailpopup_inner_detail2_inner_showbox_inner1"><img src="';
$out+=$string(facilities[i].icon);
$out+='" /></b>\n                            <span class="c_station_detailpopup_inner_detail2_inner_showbox_inner2">';
$out+=$string(facilities[i].name);
$out+='</span>\n                        </div>\n                        ';
}
$out+='\n                    </div>\n                </div>\n            </div>\n        </div>\n        ';
}
$out+='\n        <div class="c_station_detailpopup_inner_btn">\n            <a href="/index.php/index/workplace/pageWorkplaceAppoint?workplace_id=';
$out+=$string(id);
$out+='" style="cursor:pointer;" class="c_station_detailpopup_inner_btn_left">预约看房</a>\n            <a href="#" id="order" style="cursor:pointer;" class="c_station_detailpopup_inner_btn_right">立即预定</a>\n        </div>\n\n    </div>\n\n</div>';
return new String($out);
});/*v:1*/
template('workplaceList',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,workplace_list=$data.workplace_list,i=$data.i,d=$data.d,$string=$utils.$string,JSON=$data.JSON,getImgPath=$helpers.getImgPath,$out='';if(workplace_list&&workplace_list.length){
$out+='\n';
for(var i=0;i<workplace_list.length;i++){
var d = workplace_list[i];

$out+='\n<div style="cursor:pointer;" class="j-item c_station_listdetail_box2_inner2_box" data-info=';
$out+=$string(JSON.stringify(d));
$out+=' >\n    <div class="c_station_listdetail_box2_inner2_box_left"><a href="javascript:void(0);"><img src="';
$out+=$string(d.list_img_url);
$out+='" /></a></div>\n    <div class="c_station_listdetail_box2_inner2_box_right">\n        <span class="c_station_listdetail_box2_inner2_box_right1">';
$out+=$string(d.name);
$out+='</span>\n        <span class="c_station_listdetail_box2_inner2_box_right2">\n									<div class="c_station_listdetail_box2_inner2_box_right2_left">剩余：<label>';
$out+=$string(d.available_count||0);
$out+='</label></div>\n									<div class="c_station_listdetail_box2_inner2_box_right2_right">&yen;';
$out+=$string(d.price);
$out+='/位/月</div>\n								</span>\n    </div>\n</div>\n';
}
$out+='\n';
}else{
$out+='\n<div class="c_nodata_box3" style="height: 350px;">\n    <b class="c_nodata_box3_img"><img src="';
$out+=$string(getImgPath('list_activity.png'));
$out+='" /></b>\n    <span class="c_nodata_box3_txt" style="margin-bottom: 54px;">暂无数据</span>\n</div>\n';
}
return new String($out);
});

}()