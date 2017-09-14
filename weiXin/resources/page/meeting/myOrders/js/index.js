;$(document).ready(function () {

    !(function($,request,tpl,wu){

        var wrap = {

            $container:$('body'),

            areas:['#id名'],//id需要唯一

            urls:{
                'getMemberMeetingRoomOrders':'/index.php/index/meeting/getMemberMeetingRoomOrders',
                'createMeetingRoomOrder':'/index.php/index/meeting/createMeetingRoomOrder',
                // 'getMeetingRoomOrderDetail':'/index.php/index/meeting/getMeetingRoomOrderDetail',
                // 'applyOrderRefund':'/index.php/index/meeting/applyOrderRefund'
            },

            init:function () {
                this.render();
                this.bindEvents();
            },

            getContent:function (callback) {

                var errMsg = '无法加载页面，请稍后再试';
                request({
                    url:wrap.urls.getMemberMeetingRoomOrders,
                    success:function (data) {
                        if(data&&data.orders&&data.orders.length){
                            callback(data);
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

                }
            },

            getParamsOfGetMeetingRoomOrderDetail:function () {
                //传给接口的数据
                return this.getHiddenData();
            },

            // getMeetingRoomOrderDetail:function (order_id, callback) {
            //     request({
            //         url:wrap.urls.getMeetingRoomOrderDetail,
            //         data:{order_id:order_id},
            //         success:function (data) {
            //             callback(data);
            //         },
            //         error:function (err) {
            //             wu.topTips('无法创建订单');
            //         }
            //     })
            // },
            createMeetingRoomOrder:function (data) {
                request({
                    url:wrap.urls.createMeetingRoomOrder,
                    type:'post',
                    data:wrap.getParamsOfCreateMeetingRoomOrder(data),
                    success:function (data) {
                        if(data&&data.order_id){
                            var url = '/index.php/index/wx_pay/pageWxPay?order_id='+data.order_id+'&order_type=meeting';
                            window.location.replace(url);
                        }else{
                            wu.topTips('无法生成订单号，请稍后再试');
                        }
                    },
                    error:function (err) {
                        wu.topTips(err||'请稍后再试')
                    }
                })
            },

            getParamsOfCreateMeetingRoomOrder:function (data) {
                var order = data.order;
                var increment_services = order.increment_services;
                if(increment_services&&increment_services.length){
                    order.increment_service_ids = JSON.stringify(increment_services.map(function (v, i) {
                        return v.id;
                    }));
                }
                var params = {};
                params.meeting_room_id = order.meeting_room_id;
                params.reserve_start_time = order.reserve_start_time;
                params.reserve_end_time = order.reserve_end_time;
                params.theme = order.theme;
                params.persons = order.persons;
                params.contact_name = order.contact_name;
                params.contact_mobile = order.contact_mobile;
                params.contact_email = order.contact_email;
                params.company_name = order.company_name;
                if(order.invoice){params.invoice = order.invoice}
                if(order.bake){params.bake = order.bake}
                if(order.increment_service_ids){params.increment_service_ids = order.increment_service_ids}
                return params;
            },

            // applyOrderRefund:function (order_id) {
            //
            //     request({
            //         url:wrap.urls.applyOrderRefund,
            //         data:{order_id:order_id},
            //         success:function (data) {
            //             wu.toast('退款成功。即将刷新');
            //             setTimeout(function () {
            //                 window.location.reload();
            //             },1500)
            //         },
            //         error:function (err) {
            //             wu.topTips(err||'退款失败，请稍后再试')
            //         }
            //     })
            // },


            render:function () {

                this.getContent(this.data2Dom.bind(this));

            },

            bindEvents:function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                // $container.on(beatEvent,'.j-pay',function(){
                //
                //     var order_id = $(this).data('order_id');
                //
                //     wrap.getMeetingRoomOrderDetail(order_id,wrap.createMeetingRoomOrder);
                //
                // });
                // $container.on(beatEvent,'.j-refund',function(){
                //     var order_id = $(this).data('order_id');
                //     wrap.applyOrderRefund(order_id);
                // });
                $container.on(beatEvent,'.j-item',function () {
                    window.location.href = '/index.php/index/meeting/pageMeetingRoomOrderDetail?order_id='+$(this).data('id');

                })
            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g);//声明外部依赖



});