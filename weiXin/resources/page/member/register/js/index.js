;$(document).ready(function () {

    !(function($,request,tpl,wu){

        var wrap = {

            $container:$('body'),

            areas:['#Register'],

            urls:{
                'getreg':'/index.php/index/member/registerMember',
                "getcode":"/index.php/index/member/sendVerifyCode"
            },

            init:function () {
                this.render();
                this.bindEvents();
                //this.focusName();
            },

            getContent:function (callback) {

                callback();

            },

            data2Dom:function () {

                this.$container.prepend(tpl('index'));
            },


            render:function () {

                this.getContent(this.data2Dom.bind(this));

            },
            getParams:function () {
                var $register = $(this.areas[0]);
                var true_name = $register.find('.j-true_name').val().trim();
                var mobile = $register.find('.j-mobile').val().trim();
                var code = $register.find('.j-code').val().trim();
                var sex = $register.find('.j-sex[data-checked="1"]').data('sex');
                var invite_code=$register.find(".j-invite_code").val().trim();
                if(!true_name){ return '请输入姓名';}
                if(!mobile){ return '请输入手机号';}
                if(!sex){ return '请选择性别';}
                if(!code){ return '请填写验证码';}
                return {
                    true_name:true_name,
                    sex:sex,
                    mobile:mobile,
                    code:code,
                    invite_code:invite_code
                }

            },

            bindEvents:function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent,self.areas[0]+' .j-send_code',function(){
                    var mobile = $(".j-mobile").val().trim()-0;
                    var unClick = $(".j-send_code").hasClass("codeColor");/* 当有这个类时是不可以点击状态,返回true/false*/
                    var countdown=60;
                    var btn = $(".j-send_code");
                    if(unClick){
                        return false;
                    }
                    if($(".j-mobile").val() == "" || isNaN($(".j-mobile").val()) || $(".j-mobile").val().length != 11 ){
                        wu.topTips("手机号不合法");
                        return false;
                    }
                    $(".j-send_code").addClass("codeColor");
                    settime();
                    request({
                        url:self.urls.getcode,
                        data:{mobile:mobile},
                        type:'get',
                        success:function (data) {

                            if(data.code){

                            }else{
                                wu.topTips('验证码获取失败');
                            }
                        },
                        error:function (err) {
                            wu.topTips(err||'验证码获取失败');
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

                $container.on(beatEvent,self.areas[0]+' .j-confirm',function(){
                    var errMsg = '此时无法注册，请稍后再试';
                    var queryData =self.getParams();
                    if ('string' === typeof queryData) {
                        wu.topTips(queryData);
                    } else {
                    request({
                        url:self.urls.getreg,
                        data:queryData,
                        type:'post',
                        success:function (data) {
                            /*if(data){*/
                              /*  var errcode = data.errcode;
                                if(errcode==0){*/
                                    window.location.replace("/index.php/index/member/pageMemberIndex");
                        /*        }
                                if(errcode==1){
                                    wu.topTips(data.errmsg);
                                }
                                if(errcode==2){
                                    wu.topTips(data.errmsg);
                                }
                                if(errcode==3){
                                    wu.topTips(data.errmsg);
                                }*/
                      /*      }else{
                                wu.topTips(errMsg);
                            }*/
                        },
                        error:function (err) {
                            wu.topTips(err||errMsg);
                        }
                    })}
                });

                $container.on(beatEvent,' .j-sex',function () {

                    var $this = $(this);
                    if(1===+$this.data('checked')){
                        return false;
                    }
                    var $sibling = $this.siblings('.j-sex');
                    $sibling.data('checked',0);
                    $this.data('checked',1);

                    var $img = $this.find('.j-img');
                    var $siblingImg = $sibling.find('.j-img');
                    var siblingImg= $siblingImg.prop('src');
                    $siblingImg.prop('src',$img.prop('src'));
                    $img.prop('src',siblingImg);

                });
            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g);//声明外部依赖



});