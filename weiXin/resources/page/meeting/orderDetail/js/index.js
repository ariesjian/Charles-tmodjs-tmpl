;$(document).ready(function () {

    !(function($,request,tpl,wu){

        var wrap = {

            $container:$('body'),

            urls:{
                'getMeetingRoomOrderDetail':'/index.php/index/meeting/getMeetingRoomOrderDetail',
                'applyOrderRefund':'/index.php/index/meeting/applyOrderRefund',
                'deleteOrder':'/index.php/index/meeting/deleteOrder'
            },

            init:function () {
                this.render();
                this.bindEvents();
            },

            orderDetailData:{},

            getContent:function (callback) {

                var self = this;
                //1
                var errMsg = '无法加载页面，请稍后再试';
                request({
                    url:self.urls.getMeetingRoomOrderDetail,
                    data:wrap.getParamsOfGetMeetingRoomOrderDetail(),
                    success:function (data) {
                        if(data&&data.order){
                            wrap.orderDetailData = data;
                            data.order.JSON = JSON;
                            data.order.parseInt = parseInt;
                            callback(data.order);
                        }else{
                            callback({errMsg:errMsg})
                        }
                    },
                    error:function (err) {
                        callback({errMsg:errMsg})
                    }
                });

            },

            data2Dom:function (data) {
                this.$container.prepend(tpl('index',data));
            },

            getHiddenData:function () {
                //type为hidden的input节点值的object

                return {
                    order_id:$('#order_id').val().trim()
                }
            },

            getParamsOfGetMeetingRoomOrderDetail:function () {
                //传给接口的数据
                return this.getHiddenData();
            },

            getParamsOfApplyOrderRefund:function () {
                return wrap.getHiddenData();
            },

            getParamsOfDeleteOrder:function () {
                return {
                    order_id:wrap.getHiddenData().order_id
                }
            },


            render:function () {

                this.getContent(this.data2Dom.bind(this));

            },

            bindEvents:function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent,'.j-pay',function(){
                    var url = '/index.php/index/wx_pay/pageWxPay?order_id='+$(this).data('id')+'&order_type=meeting';
                    window.location.replace(url);
                });
                $container.on(beatEvent,'.j-close',function () {
                    if(  $(".j-reson").hasClass("none")){
                        return;
                    }else {
                        $(".j-reson").addClass("none");
                    }
                });
                $container.on(beatEvent,'.j-refund',function () {
                    if(  $(".j-reson").hasClass("none")){
                        $(".j-reson").removeClass("none");
                    }else {
                       return;
                    }
                });
                $container.on(beatEvent,'.j-con',function () {
                          var refund_reason=$(".j-c").val().trim();
                           var order_id=$('#order_id').val().trim();
                           if(!refund_reason){
                               wu.topTips('请输入退款信息');
                               return;
                           }else{
                    request({
                        url:wrap.urls.applyOrderRefund,
                        data:{
                            refund_reason:refund_reason,order_id:order_id
                        },
                        success:function (data) {
                            wu.toast('申请退款成功，请耐心等待！');
                            setTimeout(function () {
                                var url = '/index.php/index/meeting/pageMemberMeetingRoomOrders';
                                window.location.replace(url);
                            },1000);
                        },
                        error:function (err) {
                            wu.topTips(err||'申请失败，请稍后再试')
                        }
                    })      }
                });

                $container.on(beatEvent,'.j-delete',function () {

                    wu.confirm('删除订单','删除后无法恢复，确定吗？',function () {
                        request({
                            url:wrap.urls.deleteOrder,
                            data:wrap.getParamsOfDeleteOrder(),
                            success:function (data) {
                                wu.toast('删除成功，即将跳转');
                                setTimeout(function () {
                                    var url ='/index.php/index/meeting/pageMemberMeetingRoomOrders';
                                    window.location.replace(url);
                                },1500);
                            },
                            error:function (err) {
                                wu.topTips(err||'删除失败，请稍后再试');
                            }
                        })
                    },'','c-delete_order_confirm_wrap');


                });

            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g);//声明外部依赖



});