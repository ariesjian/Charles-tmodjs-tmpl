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



    /*v:16*/
template('index',function($data,$filename
/*``*/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,user=$data.user,$string=$utils.$string,getImgPath=$helpers.getImgPath,$out='';if(user){
$out+='\r\n<div class="mobile_outcontainer">\r\n    <div class="mobile_nopadding_container1">\r\n        <div class="c_user_homepagetop">\r\n            <div class="c_user_homepagetop_box1">\r\n                <a href="/index.php/index/member/pageMemberInfo" class="c_user_homepagetop_box1_inner" style="cursor:pointer;" >\r\n                    <span class="c_user_homepagetop_box1_inner_left">\r\n                    	<b><img src="';
$out+=$string(user.headimgurl||getImgPath('logo1.jpg'));
$out+='" /></b>\r\n                    	<label>\r\n                    		<em style="font-size: 16px;">';
$out+=$string(user.true_name);
$out+='</em>\n                    		<em style="font-size: 14px;">';
$out+=$string(user.card_number);
$out+='</em>\r\n                    	</label>\r\n                    </span>\r\n                    <span class="c_user_homepagetop_box1_inner_right"><img src="/static/resources/images/arrow_right3.png" /></span>\r\n                </a>\r\n                <b class="c_user_homepagetop_box1_inner_bg"><img src="/static/resources/images/card2.png" /></b>\r\n            </div>\r\n            <div class="c_user_homepagetop_box2">\r\n                <a href="/index.php/index/member/pageMemberMessageIndex" style="cursor:pointer;" >\r\n                <div class="c_user_homepagetop_box2_inner">\r\n                    <b class="c_user_homepagetop_box2_inner_img"><img src="/static/resources/images/homepage_icon1.png" /></b>\r\n                    <span class="c_user_homepagetop_box2_inner_txt">消息</span>\r\n                </div></a>\r\n                <a href="/index.php/index/member/pageMemberScoreIndex" style="cursor:pointer;" >\r\n                <div class="c_user_homepagetop_box2_inner">\r\n                    <b class="c_user_homepagetop_box2_inner_img"><img src="/static/resources/images/homepage_icon2.png" /></b>\r\n                    <span class="c_user_homepagetop_box2_inner_txt">积分</span>\r\n                </div></a>\r\n                <a href="/index.php/index/member/pageMemberCouponIndex" style="cursor:pointer;" >\r\n                <div class="c_user_homepagetop_box2_inner">\r\n                    <b class="c_user_homepagetop_box2_inner_img"><img src="/static/resources/images/homepage_icon4.png" /></b>\r\n                    <span class="c_user_homepagetop_box2_inner_txt">优惠券</span>\r\n                </div>\r\n                </a>\r\n                <a href="/index.php/index/member/pageMemberSigninIndex" style="cursor:pointer;" >\r\n                <div class="c_user_homepagetop_box2_inner">\r\n                    <b class="c_user_homepagetop_box2_inner_img"><img src="/static/resources/images/homepage_icon3.png" /></b>\r\n                    <span class="c_user_homepagetop_box2_inner_txt">签到</span>\r\n                </div></a>\r\n            </div>\r\n        </div>\r\n        <div class="c_user_homepagelist">\r\n            <a href="/index.php/index/activity/pageManagedActivities" class="c_user_homepagelist_inner" style="cursor:pointer;" >\r\n                <div class="c_user_homepagelist_inner_left"><img src="/static/resources/images/homepage_list_icon1.png" /></div>\r\n                <div class="c_user_homepagelist_inner_right">\r\n                    <div class="c_user_homepagelist_inner_right_txt">我负责的活动</div>\r\n                    <div class="c_user_homepagelist_inner_right_img"><img src="/static/resources/images/arrow_right.png" /></div>\r\n                </div>\r\n            </a>\r\n            <a href="/index.php/index/activity/pageMemberActivityOrders" class="c_user_homepagelist_inner" style="cursor:pointer;" >\r\n                <div class="c_user_homepagelist_inner_left"><img src="/static/resources/images/homepage_list_icon2.png" /></div>\r\n                <div class="c_user_homepagelist_inner_right c_user_homepagelist_inner_noborder">\r\n                    <div class="c_user_homepagelist_inner_right_txt">我参与的活动</div>\r\n                    <div class="c_user_homepagelist_inner_right_img"><img src="/static/resources/images/arrow_right.png" /></div>\r\n                </div>\r\n            </a>\r\n        </div>\r\n\r\n        <div class="c_user_homepagelist">\r\n            <a href="/index.php/index/meeting/pageMemberMeetingRoomOrders" class="c_user_homepagelist_inner">\r\n                <div class="c_user_homepagelist_inner_left"><img src="/static/resources/images/homepage_list_icon3.png" /></div>\r\n                <div class="c_user_homepagelist_inner_right">\r\n                    <div class="c_user_homepagelist_inner_right_txt">会议室</div>\r\n                    <div class="c_user_homepagelist_inner_right_img"><img src="/static/resources/images/arrow_right.png" /></div>\r\n                </div>\r\n            </a>\r\n            <a href="/index.php/index/office/pageOrderList" class="c_user_homepagelist_inner" style="cursor:pointer;" >\r\n                <div class="c_user_homepagelist_inner_left"><img src="/static/resources/images/homepage_list_icon4.png" /></div>\r\n                <div class="c_user_homepagelist_inner_right">\r\n                    <div class="c_user_homepagelist_inner_right_txt">办公室</div>\r\n                    <div class="c_user_homepagelist_inner_right_img"><img src="/static/resources/images/arrow_right.png" /></div>\r\n                </div>\r\n            </a>\r\n            <a href="/index.php/index/workplace/pageOrderList" class="c_user_homepagelist_inner" style="cursor:pointer;" >\r\n                <div class="c_user_homepagelist_inner_left"><img src="/static/resources/images/homepage_list_icon5.png" /></div>\r\n                <div class="c_user_homepagelist_inner_right c_user_homepagelist_inner_noborder">\r\n                    <div class="c_user_homepagelist_inner_right_txt">工位</div>\r\n                    <div class="c_user_homepagelist_inner_right_img"><img src="/static/resources/images/arrow_right.png" /></div>\r\n                </div>\r\n            </a>\r\n        </div>\r\n\r\n        <div class="c_user_homepagelist">\r\n            <a href="/index.php/index/incubation/pageMemberIncubationList" class="c_user_homepagelist_inner" style="cursor:pointer;" >\r\n                <div class="c_user_homepagelist_inner_left"><img src="/static/resources/images/homepage_list_icon6.png" /></div>\r\n                <div class="c_user_homepagelist_inner_right">\r\n                    <div class="c_user_homepagelist_inner_right_txt">孵化项目</div>\r\n                    <div class="c_user_homepagelist_inner_right_img"><img src="/static/resources/images/arrow_right.png" /></div>\r\n                </div>\r\n            </a>\r\n            <a href="/index.php/index/roadshow/pageMemberRoadshowList" class="c_user_homepagelist_inner" style="cursor:pointer;" >\r\n                <div class="c_user_homepagelist_inner_left"><img src="/static/resources/images/homepage_list_icon7.png" /></div>\r\n                <div class="c_user_homepagelist_inner_right">\r\n                    <div class="c_user_homepagelist_inner_right_txt">投资路演</div>\r\n                    <div class="c_user_homepagelist_inner_right_img"><img src="/static/resources/images/arrow_right.png" /></div>\r\n                </div>\r\n            </a>\r\n            <a href="/index.php/index/convenient/pageMemberRepairs" class="c_user_homepagelist_inner" style="cursor:pointer;" >\r\n                <div class="c_user_homepagelist_inner_left"><img src="/static/resources/images/homepage_list_icon8.png" /></div>\r\n                <div class="c_user_homepagelist_inner_right c_user_homepagelist_inner_noborder">\r\n                    <div class="c_user_homepagelist_inner_right_txt">物业报修</div>\r\n                    <div class="c_user_homepagelist_inner_right_img"><img src="/static/resources/images/arrow_right.png" /></div>\r\n                </div>\r\n            </a>\r\n        </div>\r\n\r\n        <div class="c_user_homepagelist">\r\n            ';
if(1==user.is_award_open){
$out+='\r\n            <a href="/index.php/index/game/pageGameLottery" class="c_user_homepagelist_inner" style="cursor:pointer;" >\r\n                <div class="c_user_homepagelist_inner_left"><img src="/static/resources/images/game.png" /></div>\r\n                <div class="c_user_homepagelist_inner_right">\r\n                    <div class="c_user_homepagelist_inner_right_txt">抽奖小游戏</div>\r\n                    <div class="c_user_homepagelist_inner_right_img"><img src="/static/resources/images/arrow_right.png" /></div>\r\n                </div>\r\n            </a>\r\n            ';
}
$out+='\r\n            <a href="/index.php/index/game/pageMemberAwardRecord" class="c_user_homepagelist_inner" style="cursor:pointer;" >\r\n                <div class="c_user_homepagelist_inner_left"><img src="/static/resources/images/record_of_winning_a_prize.png" /></div>\r\n                <div class="c_user_homepagelist_inner_right">\r\n                    <div class="c_user_homepagelist_inner_right_txt">中奖记录</div>\r\n                    <div class="c_user_homepagelist_inner_right_img"><img src="/static/resources/images/arrow_right.png" /></div>\r\n                </div>\r\n            </a>\r\n        </div>\r\n\r\n        <div class="c_user_homepagelist" style="display: none;">\r\n            <a href="#" class="c_user_homepagelist_inner" style="cursor:pointer;" >\r\n                <div class="c_user_homepagelist_inner_left"><img src="/static/resources/images/homepage_list_icon9.png" /></div>\r\n                <div class="c_user_homepagelist_inner_right c_user_homepagelist_inner_noborder">\r\n                    <div class="c_user_homepagelist_inner_right_txt">我的订单</div>\r\n                    <div class="c_user_homepagelist_inner_right_img"><img src="/static/resources/images/arrow_right.png" /></div>\r\n                </div>\r\n            </a>\r\n        </div>\r\n\r\n    </div>\r\n\r\n    <div class="mobile_footermenu">\r\n        <ul>\r\n            <li>\r\n                <a href="/index.php/index/index/pageIndex" style="cursor:pointer;" >\r\n                    <b class="mobile_footermenu_img"><img src="/static/resources/images/footmenu_img1.png" /></b>\r\n                    <span class="mobile_footermenu_txt">园区</span>\r\n                </a>\r\n            </li>\r\n            <li>\r\n                <a href="/index.php/index/service_system/pageServiceFirstCategory" style="cursor:pointer;" >\r\n                    <b class="mobile_footermenu_img"><img src="/static/resources/images/footmenu_img2.png" /></b>\r\n                    <span class="mobile_footermenu_txt">服务</span>\r\n                </a>\r\n            </li>\r\n            <!--<li>\r\n                <a href="#" style="cursor:pointer;" >\r\n                    <b class="mobile_footermenu_img"><img src="/static/resources/images/footmenu_img3.png" /></b>\r\n                    <span class="mobile_footermenu_txt">商城</span>\r\n                </a>\r\n            </li>-->\r\n            <li>\r\n                <a href="/index.php/index/member/pageMemberIndex" style="cursor:pointer;" >\r\n                    <b class="mobile_footermenu_img"><img src="/static/resources/images/footmenu_img4_selected.png" /></b>\r\n                    <span class="mobile_footermenu_txt footer_txtcolor">我的</span>\r\n                </a>\r\n            </li>\r\n        </ul>\r\n    </div>\r\n\r\n</div>\r\n';
}else{
$out+='\r\n<div class="c_nodata_box4">\r\n    <b class="c_nodata_box4_img"><img src="';
$out+=$string(getImgPath('list_activity.png'));
$out+='" /></b>\r\n    <span class="c_nodata_box4_txt">暂时没有相关的内容</span>\r\n</div>\r\n';
}
return new String($out);
});

}()