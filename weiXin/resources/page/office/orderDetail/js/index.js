;$(document).ready(function () {

    !(function ($, request, tpl, wu) {

        var wrap = {

            $container: $('body'),

            areas: [],//id需要唯一

            urls: {
                'getOrderDetail': '/index.php/index/office/getOrderDetail',
                'createOrders': '/index.php/index/office/createOrder',
                'checkIfOrderCanContinue': '/index.php/index/office/checkIfOrderCanContinue',
                'deleteOrder': '/index.php/index/office/deleteOrder'
            },

            init: function () {
                this.render();
                this.bindEvents();
            },

            getContent: function (callback) {

                var self = this;
                request({
                    url: self.urls.getOrderDetail,
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
                var start_date = $('.j-start_date').html().trim();
                var end_date = $('.j-end_date').html().trim();
                var office_price = $('.j-office_price').val().trim() - 0;
                /*   var start = Date.parse(new Date(start_date));
                 var end = Date.parse(new Date(end_date));
                 var times= Math.abs(parseInt((end - start)/1000/3600/24/30));
                 times=times*office_price;*/
                /*       $(".j-total_price").html("&yen; "+times);*/

            },
            getHiddenData: function () {
                //type为hidden的input节点值的object
                return {
                    order_id: $('#order_id').val().trim() - 0,
                }
            },

            getParamsOfGetActivityDetail: function () {
                //传给接口的数据
                return {
                    order_id: this.getHiddenData().order_id
                }
            },


            render: function () {
                this.getContent(this.data2Dom.bind(this));

            },

            bindEvents: function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent, '.confirmBtns', function () {  //查看详情
                    var order_id = $('#order_id').val().trim() - 0;
                 request({
                        url: self.urls.getOrderDetail,
                        data: {order_id:order_id},
                        success: function (data) {
                            var v=data.order.expire_minutes;
                          if(v-0>0){
                  /*  window.location.replace("/index.php/index/wx_pay/pageWxPay?order_id=" +order_id + "&order_type=office");*/
             window.location.replace("/index.php/index/wx_pay/pageWxPay?order_id=" + data.order.id + "&order_type=office");

            }else{
                              wu.topTips('抱歉,您没有在规定时间内完成支付,请重新下单!');
                              window.location.reload("/index.php/index/office/pageOrderDetail?order_id=order_id")
                          }
                        },
                        error: function (err) {
                            wu.topTips(err || '暂时不可以支付,请联系客服人员!')
                        }
                    });

                });

                $container.on(beatEvent, '.picSelected', function () {  //查看详情
                    var noSelectPic = "/static/resources/images/station_pay_icon2.png";
                    var selectedPic = "/static/resources/images/station_pay_icon1.png";
                    var pic = $(".picSelected").attr("src");
                    if (pic == noSelectPic) {
                        $(".picSelected").attr("src", selectedPic);
                    } else {
                        $(".picSelected").attr("src", noSelectPic);
                    }
                });


                //续租
                $container.on(beatEvent, '.xuzu', function () {  //查看详情
                    var order_id = $("#order_id").val().trim() - 0;
                    var office_id = $("#office_id").val().trim() - 0;
                    var start_date = $(".j-start_date").html();
                    var end_date = $(".j-end_date").html();
                    var contact_name = $(".j-contact_name").html();
                    var contact_mobile = $(".j-contact_mobile").html();
                    //获取一天后的时间
                    var arrDate = end_date.split("/");
                    var datas = new Date();
                    datas.setFullYear(arrDate[0]);
                    datas.setMonth(arrDate[1]);
                    datas.setDate(arrDate[2]);
                    var longtime = datas.getTime();
                    longtime = longtime + 24 * 60 * 60 * 1000;//1天后的毫秒数
                    datas = new Date(longtime);
                    var newTime = datas.getFullYear() + "-" + (datas.getMonth()) + "-" + datas.getDate();

                    var start = Date.parse(new Date(start_date));
                    var end = Date.parse(new Date(end_date));
                    var month_length = Math.abs(parseInt((end - start) / 1000 / 3600 / 24 / 30));
                    request({
                        url: self.urls.checkIfOrderCanContinue,
                        data: {
                            order_id: order_id
                        },
                        type: 'get',
                        success: function (data) {
                            window.location.replace("/index.php/index/office/pageFillInForm?office_id=" + office_id + "&start_date=" + newTime + "&month_length=" + month_length + "&is_continue=1&contact_name=" + contact_name + "&contact_mobile=" + contact_mobile);
                        },
                        error: function (err) {
                                wu.topTips(err);
                        }
                    })
                });
           /*     //显示删除弹窗的设置
                $container.on(beatEvent, '.j-delete', function () {
                    if ($(".c_order_popup").hasClass("none")) {
                        $(".c_order_popup").removeClass("none")
                    }

                });*/
        /*        //取消按钮
                $container.on(beatEvent, '.j-undelete', function () {
                    if (!$(".c_order_popup").hasClass("none")) {
                        $(".c_order_popup").addClass("none")
                    }

                });*/

                //超时的订单，才可以删除
                $container.on(beatEvent, '.j-delete', function () {
                    var order_id = $("#order_id").val().trim() - 0;
                    wu.confirm('删除订单','删除后无法恢复，确定吗？',function () {
                    request({
                        url: self.urls.deleteOrder,
                        data: {
                            order_id: order_id
                        },
                        type: 'get',
                        success: function (data) {
                            wu.toast('删除成功');
                            setTimeout(function () {
                                window.location.replace("/index.php/index/office/pageOrderList");
                            },1200);

                        },
                        error: function (err) {
                            setTimeout(function () {
                                wu.topTips(err);
                            },1500);
                        }
                    })
                    },'','c-delete_order_confirm_wrap');
                })
            }
        };

        wrap.init();

    })(Zepto, window.request_g, window.template_g, window.weui_g);//声明外部依赖


});