;$(document).ready(function () {

    !(function($,request,tpl,wu,vld,str,time){

        var wrap = {

            $container:$('body'),

            areas:['#id名'],//id需要唯一

            urls:{
                'getWorkplaceOrderList':'/index.php/index/workplace/getWorkplaceOrderList',
                'checkIfOrderCanContinue':'/index.php/index/workplace/checkIfOrderCanContinue'
            },

            init:function () {
                this.render();
                this.bindEvents();
            },

            getContent:function (callback) {

                //1
                var errMsg = '无法加载页面，请稍后再试';
                request({
                    url:wrap.urls.getWorkplaceOrderList,
                    success:function (data) {
                        if(data){
                            data.JSON = JSON;
                            callback(data);
                        }else{
                            wu.topTips(errMsg);
                        }
                    },
                    error:function (err) {
                        wu.topTips(err||errMsg)
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
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;

                $container.on(beatEvent,'#continue',function () {

                    var $this = $(this);

                    try{
                        var order = $this.data('order');
                        order = 'string'===order?JSON.parse(order):order;
                    }catch (e){
                        order = null;
                    }
                    var errMsg = '无法续租，请稍后再试';
                    if(null === order){
                        wu.topTips(errMsg);
                    }else{

                        window.location.href = '/index.php/index/workplace/pageOrderDetail?order_id='+order.id;
                        // var obj = {
                        //     workplace_id:order.workplace_id,
                        //     start_date:time.addDay(1,order.end_date),
                        //     month_length:1,
                        //     is_continue:1,
                        //     workplace_count:order.workplace_count,
                        //     contact_name:order.contact_name,
                        //     contact_mobile:order.contact_mobile
                        // };
                        // window.location.href = '/index.php/index/workplace/pageFillInForm?'+str.obj2query(obj);


                        // request({
                        //     url:wrap.urls.checkIfOrderCanContinue,
                        //     data:{order_id:order.id},
                        //     success:function (data) {
                        //         var obj = {
                        //             workplace_id:order.workplace_id,
                        //             start_date:time.addDay(1,order.end_date),
                        //             month_length:1,
                        //             is_continue:1,
                        //             workplace_count:order.workplace_count,
                        //             contact_name:order.contact_name,
                        //             contact_mobile:order.contact_mobile
                        //         };
                        //         window.location.href = '/index.php/index/workplace/pageFillInForm?'+str.obj2query(obj);
                        //     },
                        //     error:function (err) {
                        //         wu.topTips(err||errMsg)
                        //     }
                        // });
                    }
                });
            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g,window.validate_g,window.str_g,window.time_g);//声明外部依赖



});