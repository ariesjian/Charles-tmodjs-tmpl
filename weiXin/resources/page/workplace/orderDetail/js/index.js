;$(document).ready(function () {

    !(function($,request,tpl,wu,vld,str,time){

        var wrap = {

            $container:$('body'),

            areas:['#id名'],//id需要唯一

            urls:{
                'getOrderDetail':'/index.php/index/workplace/getOrderDetail',
                'deleteOrder':'/index.php/index/workplace/deleteOrder',
                'checkIfOrderCanContinue':'/index.php/index/workplace/checkIfOrderCanContinue'


            },

            order:'',//订单详情

            init:function () {
                this.render();
                this.bindEvents();
            },

            getContent:function (callback) {

                var errMsg = '无法加载页面，请稍后再试';
                request({
                    url:wrap.urls.getOrderDetail,
                    data:wrap.getParamsOfGetOrderDetail(),
                    success:function (data) {
                        if(data&&data.order){
                            wrap.order = data.order;
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

            getParamsOfGetOrderDetail:function () {
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
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;

                $container.on(beatEvent,'.j-whether_agree',function () {
                    $(this).toggleClass('none');
                    $(this).siblings('.j-whether_agree').toggleClass('none');
                });

                $container.on(beatEvent,'#submit',function(){
                    if($('.j-whether_agree[data-agree="1"]').hasClass('none')){
                        wu.topTips('需同意预定合同');
                    }else {
                        var url = '/index.php/index/wx_pay/pageWxPay?order_id='+wrap.getHiddenData().order_id+'&order_type=workplace';
                        window.location.replace(url);
                    }
                });

                $container.on(beatEvent,'#continue',function () {
                    var errMsg = '无法续租，请稍后再试';
                    request({
                        url:wrap.urls.checkIfOrderCanContinue,
                        data:{order_id:wrap.order.id},
                        success:function (data) {
                            var obj = {
                                workplace_id:wrap.order.workplace_id,
                                start_date:time.addDay(1,wrap.order.end_date),
                                month_length:1,
                                is_continue:1,
                                workplace_count:wrap.order.workplace_count,
                                contact_name:wrap.order.contact_name,
                                contact_mobile:wrap.order.contact_mobile

                            };

                            window.location.href = '/index.php/index/workplace/pageFillInForm?'+str.obj2query(obj);

                        },
                        error:function (err) {
                            wu.topTips(err||errMsg)
                        }
                    });




                });

                $container.on(beatEvent,'#deleteOrder',function () {

                    wu.confirm('删除订单','删除后无法恢复，确定吗？',function () {
                        request({
                            url:wrap.urls.deleteOrder,
                            data:wrap.getParamsOfDeleteOrder(),
                            success:function (data) {
                                wu.toast('删除成功，即将跳转');
                                setTimeout(function () {
                                    var url ='/index.php/index/workplace/pageOrderList';
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

    })(Zepto,window.request_g,window.template_g,window.weui_g,window.validate_g,window.str_g,window.time_g);//声明外部依赖



});