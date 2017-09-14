;$(document).ready(function () {

    !(function($,request,tpl,wu){

        var wrap = {

            $container:$('body'),

            areas:["#submitBtn"],//id需要唯一

            urls:{
                'getCouponConfirmDetail':'/index.php/index/member/getCouponConfirmDetail',
                'confirmUseCoupon':'/index.php/index/member/confirmUseCoupon'
            },

            init:function () {
                this.render();
                this.bindEvents();
            },

            getContent: function (callback) {

                var self = this;
                request({
                    url: self.urls.getCouponConfirmDetail,
                    data: self.getParamsOfGetActivityDetail(),
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

            getHiddenData:function () {
                //type为hidden的input节点值的object
                return {
                    coupon_id:$('#coupon_id').val().trim(),
                }
            },
            getParamsOfGetActivityDetail:function () {
                //传给接口的数据
                return {
                    coupon_id:this.getHiddenData().coupon_id
                }
            },


            render: function () {
                this.getContent(this.data2Dom.bind(this));

            },

            bindEvents:function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent,'#submitBtn',function(){
                    var  coupon_id=$('#coupon_id').val().trim();
                    request({
                        url:self.urls.confirmUseCoupon,
                        data: {coupon_id:coupon_id},
                        type:'get',
                        success:function (data) {
                             window.location.replace("/index.php/index/member/pageCouponUseSuccess?coupon_id="+coupon_id);
                        },

                        error:function (err) {

                            wu.topTips(err||'自定义消息内容')
                        }
                    });

                });

            }
        };
        wrap.init();


    })(Zepto,window.request_g,window.template_g,window.weui_g);//声明外部依赖
});
