;$(document).ready(function () {

    !(function($,request,tpl,wu,qrcodeOnShow,sed){

        var wrap = {

            $container:$('body'),

            areas:['#ShowQRCode','#QRCodeView'],//id需要唯一

            urls:{
                'getMemberActivityOrderDetail':'/index.php/index/activity/getMemberActivityOrderDetail'
            },

            eventSelectors:['#ShowQRCode'],

            init:function () {
                this.render();
                this.bindEvents();
            },

            getContent:function (callback) {

                var self = this;
                var errMsg = '获取活动订单详情时出错了';
                //1
                request({
                    url:self.urls.getMemberActivityOrderDetail,
                    data:self.getParams(),
                    success:function (data) {
                        if(data){
                            callback(data);
                        }else{

                            wu.topTips(errMsg)
                        }
                    },
                    error:function (err) {
                        wu.topTips(err||errMsg)
                    }
                });

            },

            data2Dom:function (data) {
                this.$container.prepend(tpl('index',data));
                sed(wrap.eventSelectors);
            },

            getHiddenData:function () {
                //type为hidden的input节点值的object
                return {
                    "order_id":$('#order_id').val().trim()
                }
            },

            getParams:function () {
                //传给接口的数据
                return this.getHiddenData();
            },


            render:function () {

                this.getContent(this.data2Dom.bind(this));

            },

            bindEvents:function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;


                (function qrcode() {

                    $container.on(beatEvent,self.areas[0],function(){

                        qrcodeOnShow({
                            activity_name:$(this).data('activity_name'),
                            enroll_qrcode_url:$(this).data('enroll_qrcode_url'),
                            order_id:$(this).data('order_id')
                        })

                    });

                })();



            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g,window.util_page_qrcode_onShow_g,window.safariEventDelegation_g);//声明外部依赖



});

