;$(document).ready(function () {

    !(function($,request,tpl,wu,validate,str,component){

        var wrap = {

            $container:$('body'),

            areas:['#id名'],//id需要唯一

            urls:{
                'getMeetingRoomSpecialServices':'/index.php/index/meeting/getMeetingRoomSpecialServices',
                'checkMeetingRoomAvailable':'/index.php/index/meeting/checkMeetingRoomAvailable',
                'pageMeetingRoomConfirm':'/index.php/index/meeting/pageMeetingRoomConfirm?'
    },

            init:function () {
                this.render();
                this.bindEvents();
            },

            getContent:function (callback) {

                request({
                    url:wrap.urls.getMeetingRoomSpecialServices,
                    data:{
                        meeting_room_id:$('#meeting_room_id').val().trim()
                    },
                    success:function (data) {
                        data = data || {};
                        data.hiddenData = wrap.getHiddenData();
                        data.JSON = JSON;
                        data.Date = Date;
                        callback(data);
                    },
                    error:function (err) {
                        var data =  {};
                        data.hiddenData = wrap.getHiddenData();
                        data.JSON = JSON;
                        data.Date = Date;
                        callback(data);
                    }
                });
            },

            data2Dom:function (data) {
                this.$container.prepend(tpl('index',data));
            },

            getHiddenData:function () {
                //type为hidden的input节点值的object
                return {
                    meeting_room_id:$('#meeting_room_id').val().trim(),
                    meeting_room_name:$('#meeting_room_name').val().trim(),
                    reserve_start_time:$('#reserve_start_time').val().trim(),
                    reserve_end_time:$('#reserve_end_time').val().trim(),
                    current_time:$('#current_time').val().trim(),
                    person_limit:$('#person_limit').val().trim()
                }
            },

            getParamsOfPageMeetingRoomConfirm:function () {

                var hiddenData = wrap.getHiddenData();

                var theme = $('.j-theme').val().trim();
                var persons = $('.j-persons').val().trim();
                var contact_name = $('.j-contact_name').val().trim();
                var contact_mobile = $('.j-contact_mobile').val().trim();
                var contact_email = $('.j-contact_email').val().trim();
                var bake = $('.j-bake').val().trim();
                var increment_services = [];
                $('.j-service-item.c_room_infoinput_inner_detail_inner_selected').each(function (i, v) {
                    var info = $(v).data('info');
                    info = 'string'===typeof info?JSON.parse(info):info;
                    increment_services.push(info);
                });
                if(!theme){return '请输入主题'}

                if(!persons){return '请输入参会人数'}
                if(validate.positiveInteger(persons)){return '参会人数：'+validate.positiveInteger(persons)}
                if(+persons>+hiddenData.person_limit){return '参会人数：最多容纳'+hiddenData.person_limit+'人'}

                if(!contact_name){return '请输入联系人姓名'}
                if(!contact_mobile){return '请输入手机号'}
                if(validate.mobile(contact_mobile)){return validate.mobile(contact_mobile)}
                if(!contact_email){return '请输入电子邮箱'}
                if(validate.email(contact_email)){return validate.email(contact_mobile)}

                //发票
                var $invoice = $('#invoice');
                var is_need_invoice= 0===($invoice.find('[data-invoice="no"]').data('checked')-0)?1:0,
                    invoice_type=1,
                    invoice_title='',
                    invoice_mail_address='',
                    invoice_tax_no='';

                if(1===is_need_invoice){
                    invoice_type = $invoice.find('.j-type').val().trim();
                    invoice_title = $invoice.find('.j-title').val().trim();
                    if(!invoice_title){
                        return '请输入发票抬头';
                    }
                    invoice_mail_address = $invoice.find('.j-address').val().trim();
                    if(!invoice_mail_address){
                        return '请输入邮寄地址';
                    }
                    if(2===+invoice_type){
                        invoice_tax_no = $invoice.find('.j-number').val().trim();
                        if(!invoice_tax_no){
                            return '请输入企业税号';
                        }
                    }
                }


                return {
                    meeting_room_id:hiddenData.meeting_room_id,
                    theme:theme,
                    persons:persons,
                    contact_name:contact_name,
                    contact_mobile:contact_mobile,
                    contact_email:contact_email,
                    bake:bake,
                    increment_services:JSON.stringify(increment_services),
                    reserve_start_time:hiddenData.reserve_start_time,
                    reserve_end_time:hiddenData.reserve_end_time,
                    is_need_invoice:is_need_invoice,
                    invoice_type:invoice_type||1,
                    invoice_title:invoice_title||'',
                    invoice_mail_address:invoice_mail_address||'',
                    invoice_tax_no:invoice_tax_no||''
                }
            },

            getParamsOfCheckMeetingRoomAvailable:function () {
                var hiddenData = wrap.getHiddenData();
                var increment_service_ids = [];
                $('.j-service-item.c_room_infoinput_inner_detail_inner_selected').each(function (i, v) {
                    var info = $(v).data('info');
                    info = 'string'===typeof info?JSON.parse(info):info;
                    increment_service_ids.push(info.id);
                });

                return {
                    meeting_room_id:hiddenData.meeting_room_id,
                    reserve_start_time:hiddenData.reserve_start_time,
                    reserve_end_time:hiddenData.reserve_end_time,
                    increment_service_ids:JSON.stringify(increment_service_ids)
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
                $container.on(beatEvent,'.j-service-switch',function(){

                    var $this = $(this);
                    $this.find('.j-up-arrow').toggleClass('none');
                    $this.find('.j-down-arrow').toggleClass('none');
                    $this.siblings('.j-service-items').toggleClass('none');

                });

                $container.on(beatEvent,'.j-service-option',function () {
                    var $this = $(this);
                    if(0===$this.data('can_click')-0){
                        return false;
                    }
                    $this
                        .toggleClass('none')
                        .siblings('.j-service-option').toggleClass('none');
                    $this.closest('.j-service-item').toggleClass('c_room_infoinput_inner_detail_inner_selected');
                });

                $container.on(beatEvent,'.j-submit',function () {

                    var params = wrap.getParamsOfPageMeetingRoomConfirm();


                    if('string'===typeof params){
                        wu.topTips(params)
                    }else{
                        var errMsg = '无法预定，请稍后再试';
                        request({
                            url:wrap.urls.checkMeetingRoomAvailable,
                            data:wrap.getParamsOfCheckMeetingRoomAvailable(),
                            success:function (data) {
                                var url = wrap.urls.pageMeetingRoomConfirm+str.obj2query(params);
                                window.location.replace(url);
                            },
                            error:function (err) {
                                wu.topTips(err||errMsg)
                            }
                        })
                    }

                });

                $container.on(beatEvent,'#invoice .j-invoice',function () {
                    var $this = $(this);
                    if(1===+$this.data('checked')){
                        return false;
                    }
                    var $sibling = $this.siblings('.j-invoice');
                    $sibling.data('checked',0);
                    $this.data('checked',1);

                    var $img = $this.find('.j-img');
                    var $siblingImg = $sibling.find('.j-img');
                    var siblingImg= $siblingImg.prop('src');
                    $siblingImg.prop('src',$img.prop('src'));
                    $img.prop('src',siblingImg);

                    var statusNo = 'no'===$this.data('invoice');

                    $('#invoice .j-info')[statusNo?'addClass':'removeClass']('none');

                    $('#invoice .j-reminder')[0].scrollIntoView();

                });

                $container.on('change','#invoice .j-type',function () {
                    var isPerson = (1 == $('#invoice .j-type').val());
                    $('#invoice .j-number_wrap')[isPerson?'addClass':'removeClass']('none');
                });

                // $container.on('keyup','.j-invoice,.j-bake',function (e) {
                //     var num=  $(this).val().length;
                //     var maxLength=$(this).prop('maxlength');
                //     $(this).next(".j-limit_num").html(num+"/"+maxLength);
                //
                // });

                component.lengthLimit('.j-invoice','.j-invoice_limit_num');
                component.lengthLimit('.j-bake','.j-bake_limit_num');
            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g,window.validate_g,window.str_g,window.component_g);//声明外部依赖



});