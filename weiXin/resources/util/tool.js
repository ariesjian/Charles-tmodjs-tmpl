/**
 * Created by jack on 2017/6/26.
 */

window.request_g = function (params) {

    //ajax的入口唯一化的好处是，可以在这里添加公共数据，当要做接口定制、接口统计时，很有用。

    var type = params.type||'get';
    var url = params.url||'';
    var data = params.data||{};
    var dataType = params.dataType||'json';
    var useAsync = params.useAsync || false;//true 使用async.min.js
    var async = params.async!==0;

    var useLoading =  params.useLoading !== 0;//默认使用loading
    var loadingText = params.loadingText||'加载中';
    var loadingModal;
    if(useLoading && !useAsync){//使用async.min.js时，需要在相应的业务代码里写loading
       loadingModal  = window.weui.loading(loadingText);
    }

    if(useAsync){
        return function (callback) {
            $.ajax({
                url:url,
                type:type,
                data:data,
                dataType:dataType,
                success:function (res) {
                    if(res && 0===+res.errcode){
                        callback(null,res.data);
                    }else{
                        callback(null);
                    }
                },
                error:function () {
                    callback(null);
                }
            })
        }
    }else{
        var success = params.success;
        var error = params.error;
        $.ajax({
            url:url,
            type:type,
            data:'get'===type?data:{data:JSON.stringify(data)},
            dataType:dataType,
            async:async,
            success:function (res) {
                useLoading && loadingModal.hide();
                if(res && 0===+res.errcode){
                    'function' === typeof success && success(res.data);
                }else{
                    //99是后台未自定义错误信息的类型
                    'function' === typeof error && error(99===+res.errcode?'':res.errmsg);
                }
            },
            error:function () {
                // alert(arguments[0]);
                // alert(arguments[1]);
                // alert(arguments[2]);
                useLoading && loadingModal.hide();
                'function' === typeof error && error();
            }
        })
    }
};

window.template_g = function (name,data) {
    //使用jquery时，data可以忽略；使用zepto时，data不可为undefined；
    // 因为jquery方法（比如prepend）的参数为函数时，它才会调用该函数，得到字符串；
    if('undefined' === typeof window.template){
        return 'I am sorry. Maybe template has not been loaded!'//是不是忘记引入template.js了
    }else{
        return window.template(name,data||{})
    }
};

window.weui_g = {
    toast:function (msg,timeout) {
        window.weui.toast(msg, {
            duration: timeout||2000,
            className: "bears"
        });
    },
    topTips:function (msg, timeout) {
        window.weui.topTips(msg,{
            duration:timeout||2000
        })
    },
    alert:function (title,content,yesFunc,className) {
        window.weui.alert(content, function () {
            'function'===typeof yesFunc&&yesFunc()
        }, {
            title: title,
            className:className||''
        });

    },
    confirm:function (title,content,yesFunc,noFunc,className) {
        window.weui.confirm(content, function () {
            'function'===typeof yesFunc&&yesFunc()
        }, function () {
            'function'===typeof noFunc&&noFunc()
        }, {
            title: title,
            className:className||''
        });

    }
};

window.validate_g = {
    mobile:function (mobile) {
        return (/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/).test(mobile)?'':'请输入合理的手机号'
    },
    email:function (email) {
        return (/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/).test(email)?'':'请输入合理的邮箱地址'
    },
    positiveInteger:function (value) {
        return (/^[1-9]\d*$/).test(value)?'':'只能输入正整数';
    },
    dateTime:function (dateTime) {
        return (/((((19|20)\d{2})-(0?(1|[3-9])|1[012])-(0?[1-9]|[12]\d|30))|(((19|20)\d{2})-(0?[13578]|1[02])-31)|(((19|20)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))-0?2-29))$/).test(dateTime)?'':'请输入正确的日期yyyy-mm-dd'
    },
    name:function (name) {
        return (/^[\u4e00-\u9fa5a-zA-Z]+$/).test(name)?'':'企业名称只能是中文或者英文!';
    },
};

window.time_g = {
    fullDate:function (time) {
        if(!time){
        var t;
            t = new Date();
        }else{
            t = 'string'===typeof time?new Date(time):time;
        }
        var month = t.getMonth()+1+'';
        month = 1===month.length?'0'+month:month;
        var day = t.getDate()+'';
        day = 1===day.length?'0'+day:day;
        var year = t.getFullYear()+'';
        return [year,month,day].join('-');//2017-01-02
    },
    addDay:function (num,date) {
        //在date上添加num天
        var d;
        if(date){
            if('string'===typeof date){
                d = new Date(date.replace(/-/g,'/'));
            }else{
                d = date;
            }
        }else{
            d = new Date();
        }
        var r = new Date(d.getTime()+num*24*60*60*1000);
        return time_g.fullDate(r);//2017-01-02


    }
};

window.str_g = {
    obj2query:function (obj) {
        if(obj){
            var ret = [];
            for(var k in obj){
                ret.push(k + '=' + obj[k])
            }
            return ret.join('&');
        }else{
            return '';
        }

    }
};

//为了解决：在safari或者ios微信网页中，当元素的事件委托在body或document上，并且该元素默认是不可点击时（比如div），click、tap会失效的问题
window.safariEventDelegation_g = function (selectors) {

    if(selectors&&selectors.length){
        selectors.forEach(function (v) {
            $(v).css('cursor','pointer');
        })
    }
};

window.component_g = {
    lengthLimit:function (inputSelector/*输入框的选择器*/,hintSelector/*提示的zepto对象*/) {

        $('body').on('input',inputSelector, function(e) {
            var $this = $(this);
            var maxLength = $(inputSelector).prop('maxlength');
            var len = $this.val().length;
            $(hintSelector).html((len>maxLength?maxLength:len)+'/'+maxLength);
        });
    }
};