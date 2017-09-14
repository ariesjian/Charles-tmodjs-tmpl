;$(document).ready(function () {

    !(function($,request,tpl,wu){

        var wrap = {

            $container:$('body'),

            areas:["#exchange"],//id需要唯一

            urls:{
                'getscore':'/index.php/index/member/getStoreCoupons',
                'getscorecoupon':'/index.php/index/member/exchangeStoreCoupon'
            },

            init:function () {
                this.render();
                this.bindEvents();
            },

            getContent:function (callback) {

                var self = this;
                request({
                    url:self.urls.getscore,
                    data:{},
                    success:function (data) {
                        if(data){
                            self.getParamsOfGetActivityDetail()
                            callback(data);
                        }else{

                        }
                    },
                    error:function (err) {
                        wu.topTips(err||'自定义消息内容')
                    }
                });
            },

            data2Dom:function (data) {
                this.$container.prepend(tpl('index',data));
                var num=$('#score').val().trim()-0;
                $('.tallcore').html(num);/*插入数据的时候要写在转换里面*/
            },
            getHiddenData:function () {
                //type为hidden的input节点值的object
                return {
                    score:$('#score').val().trim()-0,
                }
            },

            getParamsOfGetActivityDetail:function () {

                //传给接口的数据
                return {
                    score:this.getHiddenData().score
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
                $container.on(beatEvent,'.exchange',function(){
                   var  store_coupon_id=$(this).parents(".c_user_scorelist_list").find(".ids").val().trim()-0;
                    request({
                        url:self.urls.getscorecoupon,
                        data:{
                            store_coupon_id:store_coupon_id
                        },
                        success:function (data) {
                                wu.toast('兑换成功');
                            setTimeout(function () {
                                window.location.reload("/index.php/index/member/pageMemberScoreIndex")
                            },1200);



                        },
                        error:function (err) {
                            wu.topTips(err)
                        }
                    });

                });
            }
        };

        wrap.init();


    })(Zepto,window.request_g,window.template_g,window.weui_g);//声明外部依赖



});