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
template('commentsDescDec',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,data=$data.data,d=$data.d,is_manager=$data.is_manager,comments=$data.comments,comments5=$data.comments5,$string=$utils.$string,r=$data.r,n=$data.n,g=$data.g,i=$data.i,cmt=$data.cmt,score=$data.score,getImgPath=$helpers.getImgPath,$out='';if(data && data.activity){
var d = data.activity;
var is_manager = +d.is_manager;
var comments = d.comments||[];
comments5 = comments.slice(0,5);

$out+='\n<div class="c_activity_detailall_tab">\n    <ul>\n        <li class="j-title c_activity_detailall_tab_inner c_activity_tabselected"><a href="javascript:;">详情</a></li>\n        <li class="j-title c_activity_detailall_tab_inner"><a href="javascript:;">声明</a></li>\n        <li class="j-title c_activity_detailall_tab_inner "><a href="javascript:;">评价</a></li>\n    </ul>\n</div>\n<div class="c_activity_detailall_content">\n    <div class="j-content   c_activity_detailall_content_comment">\n        <!--详情-->\n        ';
$out+=$string( d.description.replace(/\r\n/g,'<br/>'));
$out+='\n    </div>\n    <div class="j-content none  c_activity_detailall_content_desc">\n        <!--声明-->\n        ';
$out+=$string( d.declaration.replace(/\r\n/g,'<br/>'));
$out+='\n    </div>\n    <div class="j-content none c_activity_detailall_content_dec">\n        <ul>\n            ';
for(var i=0;i<comments5.length;i++){
            var cmt = comments5[i];
            var score = cmt.score;
            
$out+='\n            <li class="j-comment" data-comment_id="';
$out+=$string(cmt.id);
$out+='">\n                <div class="c_activity_detailcomment_left"><img src="';
$out+=$string(cmt.headimgurl);
$out+='" /></div>\n                <div class="j-right c_activity_detailcomment_right">\n                    <div class="c_activity_detailcomment_right1">\n                        <label>';
$out+=$string(cmt.true_name);
$out+='</label>\n                        <b>\n                            <img src="';
$out+=$string(getImgPath((score>=1)?'star1.png':'star2.png'));
$out+='" />\n                            <img src="';
$out+=$string(getImgPath((score>=2)?'star1.png':'star2.png'));
$out+='" />\n                            <img src="';
$out+=$string(getImgPath((score>=3)?'star1.png':'star2.png'));
$out+='" />\n                            <img src="';
$out+=$string(getImgPath((score>=4)?'star1.png':'star2.png'));
$out+='" />\n                            <img src="';
$out+=$string(getImgPath((score>=5)?'star1.png':'star2.png'));
$out+='" />\n                        </b>\n                    </div>\n                    <div class="c_activity_detailcomment_right2">';
$out+=$string(cmt.content||'');
$out+='</div>\n                    <div class="c_activity_detailcomment_right3 ">\n                        <span class="c_activity_detailcomment_right3_left">';
$out+=$string(cmt.create_time.replace(/-/g,'/')||'');
$out+='</span>\n                        ';
if(null == cmt.reply_manager_id && 1===is_manager){
$out+='\n                        <a href="javascript:;" class="j-reply c_activity_detailcomment_right3_right"><img src="';
$out+=$string(getImgPath('activity_detail_icon3.png'));
$out+='" />回复</a>\n                        ';
}
$out+='\n                    </div>\n                    ';
if(cmt.reply_manager_id != null){
$out+='\n                    <div class="c_activity_detailcomment_right4">\n                        <div class="c_activity_detailcomment_right4_point"><img src="';
$out+=$string(getImgPath('activity_detail_icon4.png'));
$out+='" /></div>\n                        <div class="c_activity_detailcomment_right4_inner">\n                            <label class="c_activity_comment_title">';
$out+=$string(cmt.reply_manager_name||'');
$out+='</label>\n                            <span class="c_activity_comment_des">';
$out+=$string(cmt.reply_content||'');
$out+='</span>\n                            <b class="c_activity_comment_time">';
$out+=$string(cmt.reply_time.replace(/-/g,'/')||'');
$out+='</b>\n                        </div>\n                    </div>\n                    ';
}
$out+='\n                </div>\n            </li>\n            ';
}
$out+='\n        </ul>\n        ';
if(comments.length>5){
$out+='\n        <a href="/index.php/index/activity/pageActivityComments?activity_id=';
$out+=$string(d.id);
$out+='" class="activity_detail_comment_more">查看全部</a>\n        ';
}
$out+='\n    </div>\n\n</div>\n';
}
return new String($out);
});/*v:1*/
template('errMsg',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$string=$utils.$string,getImgPath=$helpers.getImgPath,errMsg=$data.errMsg,$out='';$out+='<div class="c_nodata_box3">\n    <b class="c_nodata_box3_img"><img src="';
$out+=$string(getImgPath('list_activity.png'));
$out+='" /></b>\n    <span class="c_nodata_box3_txt">';
$out+=$string(errMsg);
$out+='</span>\n</div>';
return new String($out);
});/*v:1*/
template('index',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,data=$data.data,d=$data.d,orders=$data.orders,is_manager=$data.is_manager,order_id=$data.order_id,activity_type=$data.activity_type,activity_id=$data.activity_id,$string=$utils.$string,getActivityDescByType=$helpers.getActivityDescByType,getImgPath=$helpers.getImgPath,g=$data.g,orders7=$data.orders7,i=$data.i,$out='';if(data && data.activity){
var d = data.activity;
var orders = d.orders||[];
var is_manager = +d.is_manager||0;
var order_id = +d.order_id||0;
var activity_type = +d.activity_type||0;
var activity_id = d.id;

$out+='\n<div class="mobile_outcontainer">\n    <div class="mobile_nopadding_container1">\n        <div class="c_activity_detailtop" id="Activity">\n            <div class="c_activity_detailtop_img">\n                <span class="c_activity_detailimg_txt listimg_txtcolor_status2">';
$out+=$string(getActivityDescByType(d.activity_type));
$out+='</span>\n                <b class="c_activity_detailimg_img"><img alt="活动图片" src="';
$out+=$string(d.banner_url);
$out+='" /></b>\n            </div>\n            <div class="c_activity_detailtop_txt">\n                <div class="c_activity_detailtop_txt_inner1">\n                    <span>';
$out+=$string(d.name);
$out+='</span>\n                    <b>\n                        <img data-collected="0" class="j-collect ';
$out+=$string((1==+d.is_collected)?'none':'');
$out+='" src="';
$out+=$string(getImgPath('follow_star1.png'));
$out+='" />\n                        <img data-collected="1" class="j-collect ';
$out+=$string((0==+d.is_collected)?'none':'');
$out+='" src="';
$out+=$string(getImgPath('follow_star2.png'));
$out+='" />\n                    </b>\n                </div>\n                <div class="c_activity_detailtop_txt_inner2">\n                    <div class="c_activity_detailtop_txt_inner2_info1">\n                        <div class="c_activity_detailtop_txt_inner2_info1_left">\n                            <img src="';
$out+=$string(getImgPath('activity_detail_icon1.png'));
$out+='" />\n                            ';
$out+=$string(d.activity_start_time.replace(/-/g,'/')||'');
$out+='-';
$out+=$string(d.activity_end_time.replace(/-/g,'/')||'');
$out+='\n                        </div>\n                        <div class="c_activity_detailtop_txt_inner2_info1_right">\n                            ';
if(1==d.activity_type&&d.enroll_left_desc){
$out+='\n                            距报名结束还剩';
$out+=$string(d.enroll_left_desc);
$out+='\n                            ';
}else if(2==d.activity_type){
$out+='\n                            报名已结束\n                            ';
}
$out+='\n                        </div>\n                    </div>\n                    <div class="c_activity_detailtop_txt_inner2_info2"><img src="';
$out+=$string(getImgPath('activity_detail_icon2.png'));
$out+='" /><span class="c_activity_detailtop_txt_inner2_info2_inner">';
$out+=$string(d.address);
$out+='</span></div>\n                </div>\n            </div>\n        </div>\n\n        <div class="c_activity_detailpeople" id="Enroll">\n            <div class="c_activity_detailpeople_title">已报名（';
$out+=$string(orders.length||0);
$out+='人）</div>\n            <div class="c_activity_detailpeople_show">\n                <ul>\n                    <!--最多7张图片-->\n                    ';

                    var orders7 = orders.slice(0,7);
                    for(var i=0;i<orders7.length;i++){
                    
$out+='\n                    <li ';
$out+=$string(6==i?'style=margin-right:0;':'');
$out+=' ><b class="c_activity_detailpeople_inner"><img src="';
$out+=$string(orders7[i].headimgurl);
$out+='" /></b></li>\n                    ';
}
$out+='\n                </ul>\n            </div>\n        </div>\n\n        <div class="c_activity_detailall" id="CommentsDescDec">\n            <!--评论、详情、声明-->\n        </div>\n\n    </div>\n</div>\n\n<div class="footer_fixed_box" id="Footer">\n    <div class="footer_fixed_box_left">活动价格：<b>&yen;';
$out+=$string(d.price||0);
$out+='</b></div>\n    ';
if(0==is_manager&&0===order_id&&1==activity_type){
$out+='\n    <div class="footer_fixed_box_right"><a href="/index.php/index/activity/pageActivitySignUp?activity_id=';
$out+=$string(activity_id);
$out+='" class="footer_fixed_box_right_inner">马上报名</a></div>\n    ';
}else if(0==is_manager&&order_id!==0){
$out+='\n    <div class="footer_fixed_box_right"><a href="/index.php/index/activity/pageMemberActivityOrderDetail?order_id=';
$out+=$string(order_id);
$out+='" class="footer_fixed_box_right_inner">活动订单</a></div>\n    ';
}else if(1==is_manager){
$out+='\n    <div class="footer_fixed_box_right"><a href="/index.php/index/activity/pageActivityEnrollList?activity_id=';
$out+=$string(activity_id);
$out+='" class="footer_fixed_box_right_inner">报名列表</a></div>\n    ';
}
$out+='\n</div>\n';
}
return new String($out);
});/*v:1*/
template('replyModal','<div class="c_reply_getscorepopup" id="ReplyModal" style="display: none;">\n    <div class="c_reply_getscorepopup_inner">\n        <div class="c_reply_getscorepopup_inner_box1">\n            <textarea maxlength="140" placeholder="请在这里输入（不超过140字）" class="j-textarea c_reply_getscorepopup_inner_box1_textarea"></textarea>\n        </div>\n        <div class="c_reply_getscorepopup_inner_box2">\n            <a href="javascript:;" class="j-cancel c_reply_getscorepopup_inner_box2_cancel">取消</a>\n            <a href="javascript:;" class="j-submit c_reply_getscorepopup_inner_box2_submit">提交</a>\n        </div>\n    </div>\n</div>');/*v:1*/
template('replyView',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$string=$utils.$string,getImgPath=$helpers.getImgPath,reply_manager_name=$data.reply_manager_name,reply_content=$data.reply_content,reply_time=$data.reply_time,g=$data.g,$out='';$out+='<div class="c_activity_detailcomment_right4">\n    <div class="c_activity_detailcomment_right4_point"><img src="';
$out+=$string(getImgPath('activity_detail_icon4.png'));
$out+='" /></div>\n    <div class="c_activity_detailcomment_right4_inner">\n        <label class="c_activity_comment_title">';
$out+=$string(reply_manager_name||'');
$out+='</label>\n        <span class="c_activity_comment_des">';
$out+=$string(reply_content||'');
$out+='</span>\n        <b class="c_activity_comment_time">';
$out+=$string(reply_time.replace(/-/g,'/')||'');
$out+='</b>\n    </div>\n</div>';
return new String($out);
});

}()