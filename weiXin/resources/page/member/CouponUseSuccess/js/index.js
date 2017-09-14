;$(document).ready(function () {
    !(function($,request,tpl,wu){

        var wrap = {

            $container:$('body'),

            areas:[],//id需要唯一

            urls:{},

            init:function () {
                this.render();
                this.bindEvents();
            },
            render: function () {
                this.$container.prepend(tpl('index'));
                var coupon_name=$('#coupon_name').val().trim();
                $(".c_user_verification_successbox3").html(coupon_name);
            },

            bindEvents:function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent,'.c_user_scorelist_list_inner',function(){

                });
            }
        };
        wrap.init();


    })(Zepto,window.request_g,window.template_g,window.weui_g);//声明外部依赖



});
