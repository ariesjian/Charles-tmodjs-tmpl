;$(document).ready(function () {

    !(function($,request,tpl,wu,vld){

        var wrap = {

            $container:$('body'),

            areas:['#id名'],//id需要唯一

            urls:{
                'createOrder':'/index.php/index/workplace/createOrder'
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
            },

            getHiddenData:function () {
                //type为hidden的input节点值的object
                return {
                    workplace_id:$('#workplace_id').val().trim(),
                    workplace_name:$('#workplace_name').val().trim(),
                    workplace_price:$('#workplace_price').val().trim(),
                    workplace_list_img_url:$('#workplace_list_img_url').val().trim(),
                    start_date:$('#start_date').val().trim(),
                    end_date:$('#end_date').val().trim(),
                    month_length:$('#month_length').val().trim(),
                    workplace_count:$('#workplace_count').val().trim(),
                    contact_name:$('#contact_name').val().trim(),
                    contact_mobile:$('#contact_mobile').val().trim(),
                    total_price:$('#total_price').val().trim(),
                    is_need_invoice:$('#is_need_invoice').val().trim()||0,
                    invoice_type:$('#invoice_type').val().trim()||1,
                    invoice_title:$('#invoice_title').val().trim()||'',
                    invoice_mail_address:$('#invoice_mail_address').val().trim()||'',
                    invoice_tax_no:$('#invoice_tax_no').val().trim()||''
                }
            },

            getParams:function () {
                //传给接口的数据
                return {
                    workplace_id:wrap.getHiddenData().workplace_id,
                    start_date:wrap.getHiddenData().start_date,
                    month_length:wrap.getHiddenData().month_length,
                    workplace_count:wrap.getHiddenData().workplace_count,
                    contact_name:wrap.getHiddenData().contact_name,
                    contact_mobile:wrap.getHiddenData().contact_mobile,
                    is_need_invoice:wrap.getHiddenData().is_need_invoice,
                    invoice_type:wrap.getHiddenData().invoice_type,
                    invoice_title:wrap.getHiddenData().invoice_title,
                    invoice_mail_address:wrap.getHiddenData().invoice_mail_address,
                    invoice_tax_no:wrap.getHiddenData().invoice_tax_no
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
                $container.on(beatEvent,'#submit',function(){
                    if($('.j-whether_agree[data-agree="1"]').hasClass('none')){
                        wu.topTips('需同意预定合同');
                    }else{
                        var errMsg = '下单失败，请稍后再试';
                        request({
                            url:wrap.urls.createOrder,
                            type:'post',
                            data:wrap.getParams(),
                            success:function (data) {
                                if(data && data.order_id){
                                    var url = '/index.php/index/wx_pay/pageWxPay?order_id='+data.order_id+'&order_type=workplace';
                                    window.location.replace(url);
                                }else{
                                    wu.topTips(errMsg);
                                }
                            },
                            error:function (err) {
                                wu.topTips(err||errMsg);
                            }
                        });
                    }

                });

                $container.on(beatEvent,'.j-whether_agree',function () {
                    $(this).toggleClass('none');
                    $(this).siblings('.j-whether_agree').toggleClass('none');
                });
            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g,window.validate_g);//声明外部依赖



});