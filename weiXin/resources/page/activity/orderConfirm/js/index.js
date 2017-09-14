;$(document).ready(function () {

    !(function($,request,tpl,wu){

        var wrap = {

            $container:$('body'),

            areas:['#Confirm'],//id需要唯一

            urls:{
                'createActivityOrder':'/index.php/index/activity/createActivityOrder'
            },

            init:function () {
                this.render();
                this.bindEvents();
            },

            getContent:function (callback) {

                callback(this.getHiddenData());

            },

            data2Dom:function (data) {
                this.$container.prepend(tpl('index',data));
                if(data.activity_price-0<=0){
                    document.title = '确认订单';

                    // setTimeout(function(){
                    //     //利用iframe的onload事件刷新页面
                    //     document.title = '确认订单';
                    //     var iframe = document.createElement('iframe');
                    //     iframe.style.visibility = 'hidden';
                    //     iframe.style.width = '1px';
                    //     iframe.style.height = '1px';
                    //     iframe.onload = function () {
                    //         setTimeout(function () {
                    //             document.body.removeChild(iframe);
                    //         }, 0);
                    //     };
                    //     document.body.appendChild(iframe);
                    // },0);
                }
            },


            render:function () {

                this.getContent(this.data2Dom.bind(this));

            },

            getHiddenData:function () {

                return {
                    activity_id:$('#activity_id').val().trim(),
                    activity_name:$('#activity_name').val().trim(),
                    activity_start_time:$('#activity_start_time').val().trim(),
                    activity_end_time:$('#activity_end_time').val().trim(),
                    activity_address:$('#activity_address').val().trim(),
                    activity_price:$('#activity_price').val().trim(),
                    contact_name:$('#contact_name').val().trim(),
                    contact_mobile:$('#contact_mobile').val().trim(),
                    contact_email:$('#contact_email').val().trim(),
                    contact_company:$('#contact_company').val().trim(),
                    contact_sex:$('#contact_sex').val().trim(),
                    is_need_invoice:$('#is_need_invoice').val().trim()||0,
                    invoice_type:$('#invoice_type').val().trim()||1,
                    invoice_title:$('#invoice_title').val().trim()||'',
                    invoice_mail_address:$('#invoice_mail_address').val().trim()||'',
                    invoice_tax_no:$('#invoice_tax_no').val().trim()||''
                }
            },

            getParams:function () {
                return this.getHiddenData();
            },

            bindEvents:function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent,self.areas[0],function(){
                    var errMsg = '此时无法报名，请稍后再试';
                    request({
                        url:self.urls.createActivityOrder,
                        data:self.getParams(),
                        type:'post',
                        success:function (data) {
                            if(data){
                                var url;
                                var need_to_pay = +data.need_to_pay;
                                if(0 === need_to_pay){
                                    url = '/index.php/index/activity/pageActivitySignUpSuccess?order_id='+data.order_id;
                                    window.location.replace(url);
                                }else if(1 === need_to_pay){
                                    url = '/index.php/index/wx_pay/pageWxPay?order_id='+data.order_id+'&order_type=activity';
                                    window.location.replace(url);
                                }else{
                                    wu.topTips(errMsg);
                                }
                            }else{
                                wu.topTips(errMsg);
                            }
                        },
                        error:function (err) {
                            wu.topTips(err||errMsg);
                        }
                    })


                });
            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g);//声明外部依赖



});