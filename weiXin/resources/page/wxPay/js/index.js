;$(document).ready(function () {

    !(function($,request,tpl,wu){

        var wrap = {

            $container:$('body'),

            urls:{
                'unifiedOrder':'/index.php/index/wx_pay/unifiedOrder',
                'queryOrder':'/index.php/index/wx_pay/queryOrder',
                'page':{
                    'activity':'/index.php/index/activity/pageActivitySignUpSuccess',
                    'meeting':'/index.php/index/meeting/pageMeetingRoomOrderSuccess',
                    'workplace':'/index.php/index/workplace/pageOrderSuccess',
                    'office':'/index.php/index/office/pageOrderSuccess'
                },
                'orderListPage':{
                    'activity':'/index.php/index/activity/pageMemberActivityOrders',
                    'meeting':'/index.php/index/meeting/pageMemberMeetingRoomOrders',
                    'workplace':'/index.php/index/workplace/pageOrderList',
                    'office':'/index.php/index/office/pageOrderList'
                }
            },

            order_id:$('#order_id').val().trim(),

            init:function () {
                this.wxPay();
            },

            getHiddenData:function () {

                return {
                    order_id:$('#order_id').val().trim(),
                    order_type:$('#order_type').val().trim()
                }

            },

            getParams:function () {
                return this.getHiddenData();
            },

            wxPay:function () {
                var self = this;
                var errMsg = '无法统一下单，请稍后再试';
                request({
                    url:self.urls.unifiedOrder,
                    data:self.getParams(),
                    success:function (data) {
                        if(data){
                            var jsonData = 'string'===typeof data?JSON.parse(data):data;
                            var msg = {
                                appId:jsonData.appId,
                                timeStamp:jsonData.timeStamp,
                                nonceStr:jsonData.nonceStr,
                                package:jsonData.package,
                                signType:jsonData.signType,
                                paySign:jsonData.paySign
                            };

                            self.triggerBridgeReady(msg);


                        }else{
                            wu.toast(errMsg);
                        }
                    },
                    error:function (err) {

                        wu.toast(err||errMsg);
                    }
                })
            },

            triggerBridgeReady:function (msg) {
                var self = this;
                if (typeof WeixinJSBridge === "undefined") {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', function(){self.onBridgeReady(msg)}, false);
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', function(){self.onBridgeReady(msg)});
                        document.attachEvent('onWeixinJSBridgeReady', function(){self.onBridgeReady(msg)});
                    }
                } else {
                    this.onBridgeReady(msg);
                }

            },

            onBridgeReady:function(msg) {
                var self = this;
                var order_type = wrap.getHiddenData().order_type;
                WeixinJSBridge.invoke('getBrandWCPayRequest', msg,
                    function (res) {
                        if (res.err_msg === "get_brand_wcpay_request:ok") {
                            request({
                                url:self.urls.queryOrder,
                                data:{order_id:wrap.order_id,order_type:order_type},
                                success:function (data) {
                                    window.location.replace( self.urls.page[order_type]+'?order_id='+wrap.order_id);
                                },
                                error:function (err) {
                                    wu.toast(err||'查询下单结果时出错了');
                                }
                            })
                        } else if (res.err_msg === "get_brand_wcpay_request:fail") {
                            wu.toast(res.err_code + res.err_desc + res.err_msg);

                        } else if (res.err_msg === "get_brand_wcpay_request:cancel") {

                            wu.toast('支付已取消，即将跳转订单列表');
                            setTimeout(function () {
                                window.location.replace( self.urls.orderListPage[order_type] );
                            },1500);
                        }
                    }
                );
            }
        };

        wrap.init();

    })(Zepto, window.request_g, window.template_g, window.weui_g);//声明外部依赖


});