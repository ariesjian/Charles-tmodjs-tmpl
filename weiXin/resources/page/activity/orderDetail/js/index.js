;$(document).ready(function () {

    !(function($,request,tpl,wu,qrcodeOnShow){

        var wrap = {

            $container:$('body'),

            areas:['#Shell','#ShowQRCode'],//id需要唯一

            urls:{
                'getMemberActivityOrderDetail':'/index.php/index/activity/getMemberActivityOrderDetail',
                'deleteOrder':'/index.php/index/activity/deleteOrder'
            },

            init:function () {
                this.render();
                this.bindEvents();
            },

            getContent:function (callback) {

                var self = this;
                //1
                var errMsg = '无法加载页面，请稍后再试';
                request({
                    url:self.urls.getMemberActivityOrderDetail,
                    data:wrap.getParams(),
                    success:function (data) {
                        if(data&&data.order){
                            data.parseInt = parseInt;
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


                if(!data.errMsg){

                    data&&data.order&&$(wrap.areas[0]).html(tpl((0===+data.order.status?'nonPayment':'paid'),data));
                }

            },

            getHiddenData:function () {
                //type为hidden的input节点值的object
                return {
                    order_id:$('#order_id').val().trim()
                }
            },

            getParams:function () {
                //传给接口的数据
                return this.getHiddenData();
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
                $container.on(beatEvent,wrap.areas[1],function(){
                    qrcodeOnShow({
                        activity_name:$(this).data('activity_name'),
                        enroll_qrcode_url:$(this).data('enroll_qrcode_url'),
                        order_id:$(this).data('order_id')
                    })

                });

                $container.on(beatEvent,'#deleteOrder',function () {

                    wu.confirm('删除订单','删除后无法恢复，确定吗？',function () {
                        request({
                            url:wrap.urls.deleteOrder,
                            data:wrap.getParamsOfDeleteOrder(),
                            success:function (data) {
                                wu.toast('删除成功，即将跳转');
                                setTimeout(function () {
                                    var url ='/index.php/index/activity/pageMemberActivityOrders';
                                    window.location.replace(url);
                                },1500);
                            },
                            error:function (err) {
                                wu.topTips(err||'删除失败，请稍后再试');
                            }
                        })
                    },'','c-delete_order_confirm_wrap');

                })
            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g,window.util_page_qrcode_onShow_g);//声明外部依赖



});