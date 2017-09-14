;$(document).ready(function () {

    !(function($,request,tpl,wu,vld){

        var wrap = {

            $container:$('body'),

            areas:["#modify"],

            urls:{
                'getMemberDetail':'/index.php/index/member/getMemberDetail',
                'updateMemberMobile':'/index.php/index/member/updateMemberMobile',
                'sendVerifyCode':'/index.php/index/member/sendVerifyCode'
            },

            init:function () {
                this.render();
                this.bindEvents();
                //this.focusName();
            },

            getContent: function (callback) {

                var self = this;
                request({
                    url: self.urls.getMemberDetail,
                    data: self.getParams(),
                    success: function (data) {
                        if (data) {
                            callback(data);
                        } else {

                        }
                    },
                    error: function (err) {
                        wu.topTips(err || '自定义消息内容')
                    }
                });
            },

            data2Dom: function (data) {
                this.$container.prepend(tpl('index', data));


            },
            render: function () {
                this.getContent(this.data2Dom.bind(this));

            },
            getParams:function () {
                var $content = $(this.areas[0]);
                var code = $content.find('.j-code').val();
                var mobile = $content.find('.j-mobile').val();
                if(!mobile){ return '请填写手机号码';}
                if(vld.mobile(mobile)){
                    return vld.mobile(mobile);
                }
                if(!code){ return '请输入验证码';}
                return {
                    code:code,
                    mobile:mobile

                }

            },

            bindEvents:function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent,' .j-send_code',function(){
                    var mobile = $(".j-mobile").val().trim()-0;
                    var unClick = $(".j-send_code").hasClass("codeColor");/* 当有这个类时是不可以点击状态,返回true/false*/
                    var countdown=60;
                    var btn = $(".j-send_code");
                    if(unClick){
                        return false;
                    }
                    if($(".j-mobile").val() == "" || isNaN($(".j-mobile").val()) || $(".j-mobile").val().length != 11 ){
                        wu.topTips("请输入合法的手机号");
                        return false;
                    }
                    $(".j-send_code").addClass("codeColor");
                    settime();
                    request({
                        url:self.urls.sendVerifyCode,
                        data:{mobile:mobile},
                        type:'get',
                        success:function (data) {

                            if(data.code){
                         /*     alert(data.code)*/
                            }else{

                            }
                        },
                        error:function (err) {
                               wu.topTips(err||"");
                        }
                    });


                    function settime() {
                        if (countdown == 0) {
                            $(".j-send_code").removeClass("codeColor");
                            btn.html("获取验证码");
                            countdown = 60;
                            return false;
                        } else {
                            $(".j-send_code").addClass("codeColor");
                            btn.html(countdown+"S");
                            countdown--;
                        }
                        setTimeout(function() {
                            settime();
                        },1000);

                    }
                });

                $container.on(beatEvent,' .c_user_bindpho_btn',function(){
                    var queryData =self.getParams();
                    if ('string' === typeof queryData) {
                        wu.topTips(queryData);
                    } else {
                    request({
                        url:self.urls.updateMemberMobile,
                        data:queryData,
                        type:'post',
                        success:function (data) {
                            if(data.errcode==0){
                               wu.toast("修改成功");
                                setTimeout(function () {
                                    window.location.replace("/index.php/index/member/pageMemberInfo");
                                },1000);

                            }
                            if(data.errcode==1){
                                wu.topTips(data.errmsg);
                            }
                            if(data.errcode==2){
                                wu.topTips(data.errmsg);
                            }
                        },
                        error:function (err) {
                            wu.topTips(err);
                        }
                    })}
                });
                $container.on(beatEvent,' .j-sex',function () {
                    var $content = $(this);
                    if(1===+$content.data('checked')){
                        return false;
                    }
                    var $sibling = $content.siblings('.j-sex');
                    $sibling.data('checked',0);
                    $content.data('checked',1);

                    var $img = $content.find('.j-img');
                    var $siblingImg = $sibling.find('.j-img');
                    var siblingImg= $siblingImg.prop('src');
                    $siblingImg.prop('src',$img.prop('src'));
                    $img.prop('src',siblingImg);

                });
            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g,validate_g);//声明外部依赖



});