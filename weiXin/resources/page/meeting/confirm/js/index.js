;$(document).ready(function () {

    !(function($,request,tpl,wu){

        var wrap = {

            $container:$('body'),

            urls:{
                'createMeetingRoomOrder':'/index.php/index/meeting/createMeetingRoomOrder'
            },

            init:function () {
                this.render();
                this.bindEvents();
            },

            getContent:function (callback) {
                var data = wrap.getHiddenData();
                data.JSON = JSON;
                callback(data);
            },

            data2Dom:function (data) {
                this.$container.prepend(tpl('index',data));
                // $(this.areas[0]).html(tpl('模板名',data))
            },

            getHiddenData:function () {
                //type为hidden的input节点值的object
                return {
                    is_company_manager:$('#is_company_manager').val().trim(),
                    meeting_room_id:$('#meeting_room_id').val().trim(),
                    meeting_room_name:$('#meeting_room_name').val().trim(),
                    meeting_room_address:$('#meeting_room_address').val().trim(),
                    // meeting_room_list_img_url:$('#meeting_room_list_img_url').val().trim(),
                    meeting_room_list_img_url:$('#meeting_room_banner_url').val().trim(),//todo use up code
                    meeting_room_person_limit:$('#meeting_room_person_limit').val().trim(),
                    basic_price:$('#basic_price').val().trim(),
                    theme:$('#theme').val().trim(),
                    persons:$('#persons').val().trim(),
                    contact_name:$('#contact_name').val().trim(),
                    contact_mobile:$('#contact_mobile').val().trim(),
                    contact_email:$('#contact_email').val().trim(),
                    company_name:$('#company_name').val().trim(),
                    invoice:$('#invoice').val().trim(),
                    bake:$('#bake').val().trim(),
                    increment_services:$('#increment_services').val().trim(),
                    reserve_start_time:$('#reserve_start_time').val().trim(),
                    reserve_end_time:$('#reserve_end_time').val().trim(),
                    is_need_invoice:$('#is_need_invoice').val().trim()||0,
                    invoice_type:$('#invoice_type').val().trim()||1,
                    invoice_title:$('#invoice_title').val().trim()||'',
                    invoice_mail_address:$('#invoice_mail_address').val().trim()||'',
                    invoice_tax_no:$('#invoice_tax_no').val().trim()||''
                }
            },

            getParams:function () {
                //传给接口的数据
                var params = wrap.getHiddenData();
                var increment_services = params.increment_services;
                increment_services = 'string'===typeof increment_services?JSON.parse(increment_services):increment_services;
                if(increment_services&&increment_services.length){
                    params.increment_service_ids = increment_services.map(function (v, i) {
                        return v.id;
                    })
                }
                return params;
            },


            render:function () {

                this.getContent(this.data2Dom.bind(this));

            },

            bindEvents:function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent,'.j-submit',function(){

                    request({
                        url:wrap.urls.createMeetingRoomOrder,
                        type:'post',
                        data:wrap.getParams(),
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

                });
            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g);//声明外部依赖



});