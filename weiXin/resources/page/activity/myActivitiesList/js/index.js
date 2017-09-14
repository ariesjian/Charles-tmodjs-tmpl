;$(document).ready(function () {

    !(function($,request,tpl,wu,qrcodeOnShow){

        var wrap = {

            $container:$('body'),

            areas:['#ActivitiesList'],//id需要唯一

            urls:{
                'getMemberActivityOrders':'/index.php/index/activity/getMemberActivityOrders'
            },

            init:function () {
                this.render();
                this.bindEvents();
            },

            getContent:function (callback) {

                var self = this;
                var errMsg = '获取数据时出错了';
                request({
                    url:self.urls.getMemberActivityOrders,
                    success:function (data) {
                        if(data){
                            callback(data);
                        }else{
                            wu.topTips(errMsg);
                        }
                    },
                    error:function (err) {
                        wu.topTips(err||errMsg);
                    }
                });


            },

            data2Dom:function (data) {
                this.$container.prepend(tpl('index',data));
            },


            render:function () {

                this.getContent(this.data2Dom.bind(this));

            },

            bindEvents:function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent,self.areas[0]+' .j-show-qrcode',function(){

                    qrcodeOnShow({
                        activity_name:$(this).data('activity_name'),
                        enroll_qrcode_url:$(this).data('enroll_qrcode_url'),
                        order_id:$(this).data('order_id')
                    })

                });

                $container.on(beatEvent,'.j-item',function () {
                    window.location.href='/index.php/index/activity/pageMemberActivityOrderDetail?order_id='+$(this).data('id');
                })
            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g,window.util_page_qrcode_onShow_g);//声明外部依赖



});