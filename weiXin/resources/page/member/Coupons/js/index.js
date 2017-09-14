;$(document).ready(function () {

    !(function ($, request, tpl, wu) {

        var wrap = {

            $container: $('body'),

            areas: [],//id需要唯一

            urls: {
                'getMemberCoupons': '/index.php/index/member/getMemberCoupons',
                'checkCouponUsed': '/index.php/index/member/checkCouponUsed'
            },
            listenRecodeTimerId: null,
            init: function () {
                this.render();
                this.bindEvents();
            },

            getContent: function (callback) {

                var self = this;
                request({
                    url: self.urls.getMemberCoupons,
                    data: self.getParams(),
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


            getParams: function () {

            },

            render: function () {
                this.getContent(this.data2Dom.bind(this));

            },

            bindEvents: function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;

                /*打开二维码*/
                $container.on(beatEvent, '.j-second', function () {
                    var coupon_id =$(this).parent(".j-first").find(".ids").val();
                    var item=$(this).parent(".j-first");
                    if (item.next(".j-code").hasClass("none")) {
                        item.next(".j-code").removeClass("none");
                    }

                    listenRecord(coupon_id);
                });


                function listenRecord(a) {

                    request({
                        url: self.urls.checkCouponUsed,
                        useLoading: 0,
                        data: {
                            coupon_id: a
                        },
                        success: function (data) {

                            var status = data.status;

                            if (status == 0) {
                                wrap.listenRecodeTimerId = setTimeout(function(){listenRecord(a)},2000);
                                /* /!*未使用*!/*/
                            } else {
                                if (status == 1) {
                                    wu.toast('核销成功');

                                    setTimeout(function () {
                                        window.location.reload("/index.php/index/member/pageMemberCouponIndex");
                                    },1200);
                                }
                                if (status == 2) {
                                    wrap.listenRecodeTimerId = setTimeout(function(){listenRecord(a)},2000);
                                    /*     /!*          wu.toast('已过期');*!/*/
                                }

                            }
                        },
                        error: function (err) {
                            wu.topTips(err || '自定义消息内容')
                        }
                    });
                }

                //关闭二维码
                $container.on(beatEvent, '.c_activity_codepopup_close', function () {
                    $(this).parent(".c_activity_codepopup_inner_title").parent(".c_activity_codepopup_inner").parent(".j-code").addClass("none");
                    clearTimeout( wrap.listenRecodeTimerId);//这里面是要传函数的返回值
                    wrap.listenRecodeTimerId = null;
                });

            }
        };
        wrap.init();


    })(Zepto, window.request_g, window.template_g, window.weui_g);//声明外部依赖


});
