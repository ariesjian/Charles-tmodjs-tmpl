;$(document).ready(function () {

    !(function($,request,tpl,wu,validate,sed,str){

        var wrap = {

            $container:$('body'),

            areas:['#Contact','#Confirm'],

            urls:{},

            activity_id:$('#activity_id').val().trim(),
            contact_sex:$('#contact_sex').val().trim()||1,

            eventSelectors:['#Confirm','#Contact .j-sex'],

            init:function () {
                this.render();
                this.bindEvents();
            },

            getContent:function (callback) {

                var data =   {
                    activity_id:$('#activity_id').val().trim(),
                    activity_name:$('#activity_name').val().trim(),
                    activity_start_time:$('#activity_start_time').val().trim(),
                    activity_end_time:$('#activity_end_time').val().trim(),
                    activity_address:$('#activity_address').val().trim(),
                    activity_price:$('#activity_price').val().trim(),
                    contact_name:$('#contact_name').val().trim(),
                    contact_mobile:$('#contact_mobile').val().trim(),
                    contact_email:'',
                    contact_sex:$('#contact_sex').val().trim()
                };

                callback(data);
            },

            data2Dom:function (data) {
                this.$container.prepend(tpl('index',data));
                sed(wrap.eventSelectors);
            },


            render:function () {

                this.getContent(this.data2Dom.bind(this));

            },

            getParams:function () {

                var $contact = $(this.areas[0]);

                var contact_name = $contact.find('.j-name').val().trim();
                var contact_mobile = $contact.find('.j-mobile').val().trim();
                var contact_email = $contact.find('.j-email').val().trim();
                var contact_company = $contact.find('.j-company-name').val().trim();
                var contact_sex = $contact.find('.j-sex[data-checked="1"]').data('sex');

                if(!contact_name){return '请输入姓名';}

                var check = {'mobile':contact_mobile,'email':contact_email};
                for(var k in check){
                    if(validate[k](check[k])){
                        return validate[k](check[k]);
                    }
                }

                //发票
                var $invoice = $('#invoice');

                var is_need_invoice= 0===($invoice.find('[data-invoice="no"]').data('checked')-0)?1:0,
                    invoice_type=1,
                    invoice_title='',
                    invoice_mail_address='',
                    invoice_tax_no='';

                if($invoice.length){
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
                }else{
                    is_need_invoice = 0;
                }





                return {
                    activity_id:this.activity_id,
                    contact_name:contact_name,
                    contact_mobile:contact_mobile,
                    contact_email:contact_email,
                    contact_company:contact_company||'',
                    contact_sex:contact_sex,
                    is_need_invoice:is_need_invoice,
                    invoice_type:invoice_type||1,
                    invoice_title:invoice_title||'',
                    invoice_mail_address:invoice_mail_address||'',
                    invoice_tax_no:invoice_tax_no||''
                }

            },

            bindEvents:function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent,self.areas[1],function(){

                    var params = self.getParams();
                    if('string'===typeof params){
                        wu.topTips(params);
                    }
                    else{
                        window.location.href = '/index.php/index/activity/pageActivityOrderConfirm?'+str.obj2query(params);;
                    }
                });

                $container.on(beatEvent,wrap.areas[0]+' .j-sex',function () {

                    var $this = $(this);
                    if(1===+$this.data('checked')){
                        return false;
                    }
                    var $sibling = $this.siblings('.j-sex');
                    $sibling.data('checked',0);
                    $this.data('checked',1);

                    var $img = $this.find('.j-img');
                    var $siblingImg = $sibling.find('.j-img');
                    var siblingImg= $siblingImg.prop('src');
                    $siblingImg.prop('src',$img.prop('src'));
                    $img.prop('src',siblingImg);

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

    })(Zepto,window.request_g,window.template_g,window.weui_g,window.validate_g,window.safariEventDelegation_g,window.str_g);//声明外部依赖



});