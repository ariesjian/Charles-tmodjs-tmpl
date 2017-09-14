;$(document).ready(function () {

    !(function($,request,tpl,wu){

        var wrap = {

            $container:$('body'),

            areas:["#singnp"],//id需要唯一

            urls:{
                'getMemberSigninSummaryData':'/index.php/index/member/getMemberSigninSummaryData',
                'memberSignin':'/index.php/index/member/memberSignin'
            },

            init:function () {
                this.render();
                this.bindEvents();
            },

            getContent:function (callback) {

                var self = this;
                request({
                    url:self.urls.getMemberSigninSummaryData,
                    data:self.getParams(),
                    success:function (data) {
                        if(data){
                            callback(data);
                        }else{

                        }
                    },
                    error:function (err) {
                        wu.topTips(err||'什么都没有')
                    }
                });
            },
            data2Dom:function (data) {
                this.$container.prepend(tpl('index',data));
            },



            getParams:function () {


            },


            render:function () {
                this.getContent(this.data2Dom.bind(this));

            },

            bindEvents:function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent,'.singnp',function(){
                    request({
                        url:self.urls.memberSignin,
                   data:{},
                        success:function (data) {
                            wu.toast('签到成功');
                            setTimeout(function () {
                                window.location.reload("/index.php/index/member/pageMemberSigninIndex");
                            },1000);

                        },
                        error:function (err) {

                            wu.topTips(err||'当日已签到，请勿重复签到')
                        }
                    });

                });
            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g);//声明外部依赖



});