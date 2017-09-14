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
'use strict';var $utils=this,$helpers=$utils.$helpers,i=$data.i,date=$data.date,Date=$data.Date,current_date=$data.current_date,year=$data.year,month=$data.month,day=$data.day,month2=$data.month2,day2=$data.day2,$string=$utils.$string,data=$data.data,v=$data.v,info=$data.info,getImgPath=$helpers.getImgPath,p=$data.p,infos=$data.infos,obj=$data.obj,list=$data.list,ix=$data.ix,facilities=$data.facilities,x=$data.x,f=$data.f,$out='';$out+='\r\n<div class="mobile_outcontainer">\r\n    <div class="mobile_nopadding_container2">\r\n        <div class="c_station_listtop"><img src="" class="j-space_banner_url" /></div>\r\n        <div class="c_station_listdetail">\r\n            <div class="c_station_listdetail_box1">\r\n                <div class="c_station_listdetail_box1_inner">\r\n                    <span class="j-space_name"></span><label class="j-space_address"></label>\r\n                </div>\r\n            </div>\r\n            <div class="c_station_listdetail_box2">\r\n                <div class="c_station_listdetail_box2_inner1">\r\n                    <div class="c_station_listdetail_box2_inner1_select">\r\n                        <label class="c_station_listdetail_box2_inner1_select_txt">开始日期</label>\r\n                        <select class="j-start_date">\r\n                            ';
for(var i=0;i<7;i++){
                            var date = new Date((new Date(current_date).getTime()+i*24*60*60*1000));
                            var year = date.getFullYear()+'';
                            var month = date.getMonth()+1+'';
                            var day = date.getDate()+'';
                            var month2 = 1===month.length?'0'+month:month;
                            var day2 = 1===day.length?'0'+day:day;
                            
$out+='\r\n                            <option value="';
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
$out+='日</option>\r\n                            ';
}
$out+='\r\n                        </select>\r\n                        <b><img src="/static/resources/images/down_list.png" /></b>\r\n                    </div>\r\n                    <div class="c_station_listdetail_box2_inner1_select selectItems"  style="cursor: pointer;">\r\n                        <label class="c_station_listdetail_box2_inner1_select_txt">选择时间</label>\r\n                        <select class="j-month_length">\r\n                            <option value="1">1个月</option>\r\n                            <option value="2">2个月</option>\r\n                            <option value="3">3个月</option>\r\n                            <option value="4">4个月</option>\r\n                            <option value="5">5个月</option>\r\n                            <option value="6">6个月</option>\r\n                        </select>\r\n                        <b><img src="/static/resources/images/down_list.png" /></b>\r\n                    </div>\r\n                </div>\r\n                ';
if(data.office_list && data.office_list.length){
                
$out+='\r\n                <div class="c_nodata_box3 none " style="background-color: #eaeaea;">\r\n                    <b class="c_nodata_box3_img"><img src="/static/resources/images/booking_office.png" /></b>\r\n                    <span class="c_nodata_box3_txt" style="margin-bottom: 54px;">没有和办公室相关的数据</span>\r\n                </div>\r\n                <div class="c_station_listdetail_box2_inner2 dd">\r\n                    ';

                    for(var v=0;v< data.office_list.length;v++){
                    var info = data.office_list[v];
                    
$out+='\r\n                    <div class="j-show c_station_listdetail_box2_inner2_box" data-ids="';
$out+=$string(info.id || '');
$out+='" style="cursor: pointer;">\r\n                        <div class="c_station_listdetail_box2_inner2_box_left"><a href="#"><img src="';
$out+=$string(info.list_img_url || '');
$out+='" /></a></div>\r\n                        <div class="c_station_listdetail_box2_inner2_box_right">\r\n                            <span class="c_station_listdetail_box2_inner2_box_right1">';
$out+=$string(info.name || '');
$out+='</span>\r\n                            <span class="c_station_listdetail_box2_inner2_box_right2">\r\n									<div class="c_station_listdetail_box2_inner2_box_right2_left c_office_listdetail_box2_inner2_box_right2_left">\r\n                                    ';
$out+=$string(info.decoration || '');
$out+='\r\n                                    </div>\r\n									<div class="c_station_listdetail_box2_inner2_box_right2_right"> 单价:&yen; ';
$out+=$string(info.price || '');
$out+='/月</div>\r\n								</span>\r\n                            <span class="c_station_listdetail_box2_inner2_box_right3">';
$out+=$string(info.area || '');
$out+='㎡&nbsp;&nbsp;&nbsp;&nbsp;';
$out+=$string(info.person_limit || '');
$out+='人</span>\r\n\r\n                        </div>\r\n                    </div>\r\n                    ';
}
$out+='\r\n                </div>\r\n\r\n                ';
}else{
$out+='\r\n                <div class="c_nodata_box3">\r\n                    <b class="c_nodata_box3_img"><img src="';
$out+=$string(getImgPath('booking_office.png'));
$out+='" /></b>\r\n                    <span class="c_nodata_box3_txt" style="margin-bottom: 54px;">暂无数据</span>\r\n                </div>\r\n                ';
}
$out+='\r\n\r\n            </div>\r\n        </div>\r\n    </div>\r\n    ';
if(data.office_list && data.office_list.length){
    
$out+='\r\n    ';

    for(var p=0;p< data.office_list.length;p++){
    var infos = data.office_list[p];
    var obj = infos.banner_obj;
    
$out+='\r\n    <div class="j-content c_station_detailpopup none" data-detail="';
$out+=$string(infos.id);
$out+='"  >\r\n        <div class="c_station_detailpopup_inner">\r\n            <div class="c_station_detailpopup_inner_banner">\r\n                <a href="javascript:;" class="c_station_detailpopup_close" style="cursor:pointer;z-index: 99;" ><img class="j-close" src="/static/resources/images/close2.png" style="cursor:pointer;"  /></a>\r\n\r\n\r\n                <div id="sliders" class="c_station_detailpopup_inner_bannerimg mui-slider">\r\n                    <div class="mui-slider-group mui-slider-loop">\r\n                        <!-- 额外增加的一个节点(循环轮播：第一个节点是最后一张轮播) -->\r\n                        <div class="mui-slider-item mui-slider-item-duplicate">\r\n                            <a href="#">\r\n                                <img src="';
$out+=$string(obj.last_banner);
$out+='" />\r\n                            </a>\r\n                        </div>\r\n                        ';

                        var list=obj.list;
                        for(var ix=0;ix< list.length;ix++){
$out+='\r\n                        <!-- 第二张 -->\r\n                        <div class="mui-slider-item">\r\n                            <a href="#">\r\n                                <img src="';
$out+=$string(list[ix]);
$out+='" />\r\n                            </a>\r\n                        </div>\r\n                        ';
}
$out+='\r\n                        <!-- 额外增加的一个节点(循环轮播：最后一个节点是第一张轮播) -->\r\n                        <div class="mui-slider-item mui-slider-item-duplicate">\r\n                            <a href="#">\r\n                                <img src="';
$out+=$string(obj.first_banner);
$out+='" />\r\n                            </a>\r\n                        </div>\r\n                    </div>\r\n                    <div class="mui-slider-indicator">\r\n                        <div class="mui-indicator mui-active"></div>\r\n                        ';

                        var list=obj.list;
                        for(var ix=0;ix< list.length-1;ix++){
$out+='\r\n                        <div class="mui-indicator"></div>\r\n                        ';
}
$out+='\r\n                    </div>\r\n                </div>\r\n\r\n\r\n\r\n            </div>\r\n            <div class="c_station_detailpopup_inner_detail">\r\n                <div class="c_station_detailpopup_inner_detail1">\r\n                    <div class="c_station_detailpopup_inner_detail1_left">';
$out+=$string(infos.name || '');
$out+='</div>\r\n                    <div class="c_station_detailpopup_inner_detail1_right">\r\n                        <span class="c_station_detail_money1">&yen;';
$out+=$string(infos.price || '');
$out+='/月</span><label class="c_station_detail_money2">（含水电物业）</label>\r\n                    </div>\r\n                </div>\r\n                <div class="c_station_detailpopup_inner_detail2">\r\n                    ';
if(!infos.facilities.length==0){
                    
$out+='\r\n                    <div class="c_station_detailpopup_inner_detail2_inner">\r\n                        <div class="c_station_detailpopup_inner_detail2_inner_title">\r\n                            <b class="c_station_detailpopup_inner_detail2_inner_title_left"></b>\r\n                            <span class="c_station_detailpopup_inner_detail2_inner_title_right">配置详情</span>\r\n                        </div>\r\n                        <div class="c_station_detailpopup_inner_detail2_inner_show">\r\n                            <div class="c_station_detailpopup_inner_detail2_inner_showbox">\r\n\r\n                                ';

                                var facilities=infos.facilities
                                for(var x=0;x< facilities.length;x++){
                                var f = facilities[x];
                                
$out+='\r\n\r\n                                <div class="c_station_detailpopup_inner_detail2_inner_showbox_inner">\r\n                                    <b class="c_station_detailpopup_inner_detail2_inner_showbox_inner1"><img src="';
$out+=$string(f.icon || '');
$out+='" /></b>\r\n                                    <span class="c_station_detailpopup_inner_detail2_inner_showbox_inner2">';
$out+=$string(f.name || '');
$out+='</span>\r\n                                </div>\r\n                                ';
}
$out+='\r\n\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    ';
}
$out+='\r\n                    <div class="c_station_detailpopup_inner_detail2_inner">\r\n                        <div class="c_station_detailpopup_inner_detail2_inner_title">\r\n                            <b class="c_station_detailpopup_inner_detail2_inner_title_left"></b>\r\n                            <span class="c_station_detailpopup_inner_detail2_inner_title_right">户型详情</span>\r\n                        </div>\r\n                        <div class="c_station_detailpopup_inner_detail2_inner_show">\r\n                            <div class="c_station_detailpopup_inner_detail2_inner_showbox2">\r\n                                <div class="c_station_detailpopup_showbox2_list1">\r\n                                    <span class="c_station_detailpopup_showbox2_list1_left">户型面积</span>\r\n                                    <span class="c_station_detailpopup_showbox2_list1_right">';
$out+=$string(infos.area || '');
$out+='㎡</span>\r\n                                </div>\r\n                                <div class="c_station_detailpopup_showbox2_list2">\r\n                                    <span class="c_station_detailpopup_showbox2_list2_left">容纳</span>\r\n                                    <span class="c_station_detailpopup_showbox2_list2_right">';
$out+=$string(infos.person_limit || '');
$out+='人</span>\r\n                                </div>\r\n                                <div class="c_station_detailpopup_showbox2_list1">\r\n                                    <span class="c_station_detailpopup_showbox2_list1_left">层高</span>\r\n                                    <span class="c_station_detailpopup_showbox2_list1_right">';
$out+=$string(infos.room_height || '');
$out+='米</span>\r\n                                </div>\r\n                                <div class="c_station_detailpopup_showbox2_list2">\r\n                                    <span class="c_station_detailpopup_showbox2_list2_left">装修</span>\r\n                                    <span class="c_station_detailpopup_showbox2_list2_right">\r\n                                    ';
$out+=$string(infos.decoration || '');
$out+='\r\n                                    </span>\r\n                                </div>\r\n                                <div class="c_station_detailpopup_showbox2_list1">\r\n                                    <span class="c_station_detailpopup_showbox2_list1_left">朝向</span>\r\n                                    <span class="c_station_detailpopup_showbox2_list1_right">\r\n                                         ';
$out+=$string(infos.orientation || '');
$out+='\r\n                                    </span>\r\n                                </div>\r\n                                <div class="c_station_detailpopup_showbox2_list2">\r\n                                    <span class="c_station_detailpopup_showbox2_list2_left">层数</span>\r\n                                    <span class="c_station_detailpopup_showbox2_list2_right"> ';
$out+=$string(infos.floor || '');
$out+='楼</span>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n\r\n                </div>\r\n\r\n                <div class="c_station_detailpopup_inner_btn">\r\n                    <a href="/index.php/index/office/pageOfficeAppoint?office_id=';
$out+=$string(infos.id);
$out+='" class="c_station_detailpopup_inner_btn_left j-yuYue" style="cursor:pointer;"  >预约看房</a>\r\n                    <a href="#"  class="c_station_detailpopup_inner_btn_right j-order" style="cursor:pointer;" >立即预定</a>\r\n                </div>\r\n\r\n            </div>\r\n\r\n        </div>\r\n    </div>\r\n    ';
}
$out+='\r\n    ';
}
$out+='\r\n</div>\r\n\r\n\r\n\r\n';
return new String($out);
});

}()