;$(document).ready(function () {

    !(function($,request,tpl,wu,vld,str){

        var wrap = {

            $container:$('body'),

            areas:[],//id需要唯一

            urls:{
                'getWorkplaceAvailableCount':'/index.php/index/workplace/getWorkplaceAvailableCount',
                'pageOrderConfirm':'/index.php/index/workplace/pageOrderConfirm?'
            },

            init:function () {
                this.render();
                this.bindEvents();
            },

            getContent:function (callback) {

                callback($.extend({},wrap.getHiddenData(),{Date:Date}));
            },

            loadAvailableCount:function () {
                var errMsg = '无法加载页面，请稍后再试';
                request({
                    url: wrap.urls.getWorkplaceAvailableCount,
                    data: wrap.getParamsOfGetWorkplaceAvailableCount(),
                    success: function (data) {
                        if (data) {
                            $('#availableCount').html(data.available_count||0);

                        } else {
                            wu.topTips(errMsg);
                        }
                    },
                    error: function (err) {
                        wu.topTips(err || errMsg)
                    }
                });
            },

            submit:function () {
                var queryData = wrap.getQueryDataOfSubmit();
                if('string'===typeof queryData){
                    wu.topTips(queryData);
                }else{
                    var errMsg = '可预定工位数不足';
                    request({
                        url: wrap.urls.getWorkplaceAvailableCount,
                        data: wrap.getParamsOfGetWorkplaceAvailableCount(),
                        success: function (data) {
                            if (data) {
                                if(queryData.workplace_count-0>data.available_count-0){
                                    $('#availableCount').html(data.available_count);
                                    wu.topTips(errMsg);
                                }else{
                                    var url =wrap.urls.pageOrderConfirm+str.obj2query(queryData);
                                    window.location.replace(url);
                                }
                            } else {
                                wu.topTips(errMsg);
                            }
                        },
                        error: function (err) {
                            wu.topTips(err || errMsg)
                        }
                    });
                }


            },

            loadTotalPrice:function () {

                var monthLength = $('#monthLength').val();
                var singlePrice = wrap.getHiddenData().workplace_price;
                var workplaceCount = $('#workplaceCount').val().trim()-0;
                $('#totalPrice').html(monthLength*singlePrice*workplaceCount);
            },

            data2Dom:function (data) {
                wrap.$container.prepend(tpl('index',data));
                wrap.loadAvailableCount();
            },

            getHiddenData:function () {
                //type为hidden的input节点值的object
                return {
                    workplace_id:$('#workplace_id').val().trim(),
                    workplace_name:$('#workplace_name').val().trim(),
                    workplace_price:$('#workplace_price').val().trim(),
                    workplace_list_img_url:$('#workplace_list_img_url').val().trim(),
                    start_date:$('#start_date').val().trim(),
                    month_length:$('#month_length').val().trim(),
                    is_continue:$('#is_continue').val().trim(),
                    current_date:$('#current_date').val().trim(),
                    workplace_count:$('#workplace_count').val().trim(),
                    contact_name:$('#contact_name').val().trim(),
                    contact_mobile:$('#contact_mobile').val().trim()
                }
            },

            getParamsOfGetWorkplaceAvailableCount:function () {
                return {
                    workplace_id:wrap.getHiddenData().workplace_id,
                    start_date:(wrap.getHiddenData().is_continue!=1)?$('#startDate').val().trim():$('#startDateContinue').text().trim(),
                    month_length:$('#monthLength').val().trim()
                }
            },


            getQueryDataOfSubmit:function () {

                var workplaceId = wrap.getHiddenData().workplace_id;
                var startDate = (wrap.getHiddenData().is_continue!=1)?$('#startDate').val().trim():$('#startDateContinue').text().trim();
                var monthLength = $('#monthLength').val().trim();
                var workplaceCount = $('#workplaceCount').val().trim()-0;
                var contactName = $('#contactName').val().trim();
                var contactMobile = $('#contactMobile').val().trim();

                var maxWorkplaceCount = $('#availableCount').text().trim()-0;
                if(workplaceCount-0>maxWorkplaceCount-0){
                    return '可预定工位数不足';
                }
                if(vld.positiveInteger(workplaceCount)){
                    return '请输入合理的工位数量';
                }
                if(!contactName){
                    return '请输入联系人姓名';
                }
                if(vld.mobile(contactMobile)){
                    return vld.mobile(contactMobile);
                }

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
                    workplace_id:workplaceId,
                    start_date:startDate,
                    month_length:monthLength,
                    workplace_count:workplaceCount,
                    contact_name:contactName,
                    contact_mobile:contactMobile,
                    is_need_invoice:is_need_invoice,
                    invoice_type:invoice_type||1,
                    invoice_title:invoice_title||'',
                    invoice_mail_address:invoice_mail_address||'',
                    invoice_tax_no:invoice_tax_no||''
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
                $container.on('change','#startDate',function (e) {
                    wrap.loadAvailableCount();
                    wrap.loadTotalPrice();
                });
                $container.on('change','#monthLength',function (e) {
                    wrap.loadAvailableCount();
                    wrap.loadTotalPrice();
                });
                $container.on('input','#workplaceCount',function (e) {
                    var count = $(this).val().trim()-0;
                    if(!vld.positiveInteger(count)){
                        wrap.loadTotalPrice();
                    }
                });
                $container.on(beatEvent,'#submit',function (e) {
                    wrap.submit();
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
                })

            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g,window.validate_g,window.str_g);//声明外部依赖



});