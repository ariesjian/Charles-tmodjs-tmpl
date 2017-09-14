;$(document).ready(function () {

    !(function ($, request, tpl, wu) {

        var wrap = {

            $container: $('body'),

            areas: [],//id需要唯一

            urls: {
                'createOrder': '/index.php/index/office/createOrder'
            },

            init: function () {
                this.render();
                this.bindEvents();
            },

            data2Dom: function () {
                this.$container.prepend(tpl('index'));
            },
            getHiddenData: function () {
                return {
                    office_id: $('#office_id').val().trim() - 0,
                    office_name: $('#office_name').val().trim(),
                    office_list_img_url: $('#office_list_img_url').val().trim(),
                    office_price: $('#office_price').val().trim(),
                    start_date: $('#start_date').val().trim(),
                    end_date: $('#end_date').val().trim(),
                    month_length: $('#month_length').val().trim() - 0,
                    contact_name: $('#contact_name').val().trim(),
                    total_price: $('#total_price').val().trim(),
                    contact_mobile: $('#contact_mobile').val().trim(),
                    is_need_invoice: $('#is_need_invoice').val().trim() - 0,
                    invoice_type: $('#invoice_type').val().trim() - 0,
                    invoice_mail_address: $('#invoice_mail_address').val().trim(),
                    invoice_title: $('#invoice_title').val().trim(),
                    invoice_tax_no: $('#invoice_tax_no').val().trim()

                }
            },
            render: function () {
                this.data2Dom.bind(this);
                this.$container.prepend(tpl('index'));
                var office_id = $('#office_id').val().trim() - 0;
                var office_name = $('#office_name').val().trim();
                var office_list_img_url = $('#office_list_img_url').val().trim();
                var office_price = $('#office_price').val().trim();
                var start_date = $('#start_date').val().trim();
                var end_date = $('#end_date').val().trim();
                var month_length = $('#month_length').val().trim() - 0;
                var contact_name = $('#contact_name').val().trim();
                var total_price = $('#total_price').val().trim();
                var contact_mobile = $('#contact_mobile').val().trim();
                var is_need_invoice = $('#is_need_invoice').val().trim() - 0;
                var invoice_type = $('#invoice_type').val().trim() - 0;
                var invoice_mail_address = $('#invoice_mail_address').val().trim();
                var invoice_title = $('#invoice_title').val().trim();
                var invoice_tax_no = $('#invoice_tax_no').val().trim();

                $(".j-office_name").html(office_name);
                $(".j-office_list_img_url").attr("src", office_list_img_url);
                $(".j-office_price").html("单价:  &yen; " + office_price + "/月");
                $(".j-start_date").html(start_date.replace(/-/g, "/"));
                $(".j-end_date").html(end_date.replace(/-/g, "/"));
                $(".j-contact_name").html(contact_name);
                $(".j-contact_mobile").html(contact_mobile);
                $(".j-total_price").html("&yen;  " + total_price);
                if(is_need_invoice==0){
                 $(".j-piao").addClass("none");
                }
                if(is_need_invoice==1){
                    $(".j-piao").removeClass("none");
                    if(invoice_type==1){
                        $(".j-invoice_type").html("个人");
                        $(".j-invoice_title").html(invoice_title);
                        $(".j-invoice_mail_address").html(invoice_mail_address);
                    }
                    if(invoice_type==2){
                        $(".j-invoice_type").html("企业");
                        $(".j-invoice_title").html(invoice_title);
                        $(".j-invoice_mail_address").html(invoice_mail_address);
                        $(".j-invoice_tax_no").html(invoice_tax_no);
                    }
                }

            },

            bindEvents: function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;

                var issubmit = true;
                $container.on(beatEvent, '.confirmBtn', function () {  //查看详情
                    if (!issubmit) {
                        wu.topTips("不可重复提交!");
                        return;
                    } else {
                        var office_id = $('#office_id').val().trim() - 0;
                        var start_date = $('#start_date').val().trim();
                        var end_date = $('#end_date').val().trim();

                        var is_need_invoice = $('#is_need_invoice').val().trim() - 0;
                        var invoice_type = $('#invoice_type').val().trim() - 0;
                        var invoice_mail_address = $('#invoice_mail_address').val().trim();
                        var invoice_title = $('#invoice_title').val().trim();
                        var invoice_tax_no = $('#invoice_tax_no').val().trim();
                        //求相差几个月
                        var startDate = new Date(start_date.replace("-", "/").replace("-", "/"));
                        var endDate = new Date(end_date.replace("-", "/").replace("-", "/"));
                        var number = 0;
                        var yearToMonth = (endDate.getFullYear() - startDate.getFullYear()) * 12;
                        number += yearToMonth;
                        monthToMonth = endDate.getMonth() - startDate.getMonth();
                        number += monthToMonth;
                        var month_length = number;

                        var contact_name = $('#contact_name').val().trim();
                        var total_price = $('#total_price').val().trim();
                        var contact_mobile = $('#contact_mobile').val().trim();
                        var noSelectPicture = "/static/resources/images/station_pay_icon2.png";
                        var pic = $(".picSelected").attr("src");
                        if (pic == noSelectPicture) {
                            wu.topTips('请勾选协议');
                            return;
                        } else {
                            request({
                                url: self.urls.createOrder,
                                data: {
                                    office_id: office_id,
                                    start_date: start_date,
                                    month_length: month_length,
                                    contact_name: contact_name,
                                    contact_mobile: contact_mobile,
                                    is_need_invoice:is_need_invoice,
                                    invoice_type:invoice_type,
                                    invoice_title:invoice_title,
                                    invoice_mail_address:invoice_mail_address,
                                    invoice_tax_no:invoice_tax_no
                                },
                                type: 'post',
                                success: function (data) {
                                    if (data.order_id > 0) {
                                        window.location.replace("/index.php/index/wx_pay/pageWxPay?order_id=" + data.order_id + "&order_type=office");
                                    } else {
                                        if (data.errcode == 1) {
                                            wu.topTips(data.errmsg);
                                        }
                                        if (data.errcode == 2) {
                                            wu.topTips(data.errmsg);
                                        }
                                    }
                                },
                                error: function (err) {
                                    wu.topTips(err);
                                }
                            })
                        }
                    }
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

            }
        };

        wrap.init();

    })(Zepto, window.request_g, window.template_g, window.weui_g);//声明外部依赖


});