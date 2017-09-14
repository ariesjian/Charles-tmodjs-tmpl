;$(document).ready(function () {

    !(function ($, request, tpl, wu, vld, str) {
        var issubmit = true;

        var wrap = {

            $container: $('body'),

            areas: [],//id需要唯一

            urls: {
                'checkOfficeAvailable': '/index.php/index/office/checkOfficeAvailable',
                'pageOrderConfirm': '/index.php/index/office/pageOrderConfirm?'
            },

            init: function () {
                this.render();
                this.bindEvents();
            },

            getContent: function (callback) {

                callback($.extend({}, wrap.getHiddenData(), {Date: Date}));
            },


            submit: function () {
                var queryData = wrap.getQueryDataOfSubmit();
                if ('string' === typeof queryData) {
                    wu.topTips(queryData);
                } else {
                    request({
                        url: wrap.urls.checkOfficeAvailable,
                        data: wrap.getParamsOfGetOfficeAvailableCount(),
                        type: 'get',
                        success: function (data) {
                            if (data) {
                                window.location.replace(wrap.urls.pageOrderConfirm + str.obj2query(queryData));
                                issubmit = false;
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

            loadTotalPrice: function () {
                var office_price = $("#office_price").val().trim() - 0;
                var month_length = $("#monthLength").val().trim() - 0;
                /*       var price = wrap.getHiddenData().office_price * ($('#month_length').val().trim() - 0);*/
                var price = office_price * month_length;
                $('#totalPrice').html(price);
            },

            data2Dom: function (data) {
                wrap.$container.prepend(tpl('index', data));
            },


            getHiddenData: function () {
                //type为hidden的input节点值的object
                var start_date = $('#start_date').val().trim();

                return {
                    office_id: $('#office_id').val().trim(),
                    office_name: $('#office_name').val().trim(),
                    office_price: $('#office_price').val().trim(),
                    office_list_img_url: $('#office_list_img_url').val().trim(),
                    start_date: $('#start_date').val().trim(),
                    month_length: $('#month_length').val().trim(),
                    is_continue: $('#is_continue').val().trim(),
                    current_date: $('#current_date').val().trim(),
                    contact_name: $('#contact_name').val().trim(),
                    contact_mobile: $('#contact_mobile').val().trim()


                }
            },

            getParamsOfGetOfficeAvailableCount: function () {
                return {
                    office_id: wrap.getHiddenData().office_id,
                    start_date: (wrap.getHiddenData().is_continue != 1) ? $('#startDate').val().trim() : $('#startDateContinue').text().trim(),
                    month_length: $('#monthLength').val().trim()
                }
            },

            getQueryDataOfSubmit: function () {
                var office_id = wrap.getHiddenData().office_id;
                var startDate = (wrap.getHiddenData().is_continue != 1) ? $('#startDate').val().trim() : $('#startDateContinue').text().trim();
                var monthLength = $('#monthLength').val().trim();
                var contactName = $('#contactName').val().trim();
                var contactMobile = $('#contactMobile').val().trim();
                var is_need_invoice =$('.j-is_need_invoice[data-checked="4"]').data('datas');
                var invoice_type = $(".j-invoice_type").val();
                var invoice_title = $(".j-invoice_title").val();
                var invoice_mail_address = $(".j-invoice_mail_address").val();
                var invoice_tax_no = $(".j-invoice_tax_no").val();

                if (!contactName) {
                    return '请输入联系人姓名';
                }
                if (!contactMobile) {
                    return '请输入联系方式';
                }
                if (vld.mobile(contactMobile)) {
                    return vld.mobile(contactMobile);
                }
                if (is_need_invoice == 1) {
                    if (!invoice_title) {
                        return '请填写发票抬头栏';
                    }
                    if (!invoice_mail_address) {
                        return '请填写发票地址';
                    }
                    if (invoice_type == 2) {
                        if (!invoice_tax_no) {
                            return "请填写发票税号";
                        }
                    }
                }
                if (is_need_invoice == 0) {
                    return {
                        office_id: office_id,
                        start_date: startDate,
                        month_length: monthLength,
                        contact_name: contactName,
                        contact_mobile: contactMobile,
                        is_need_invoice: is_need_invoice,
                        invoice_type: invoice_type

                    }
                }
                if (is_need_invoice == 1) {
                    return {
                        office_id: office_id,
                        start_date: startDate,
                        month_length: monthLength,
                        contact_name: contactName,
                        contact_mobile: contactMobile,
                        is_need_invoice: is_need_invoice,
                        invoice_type: invoice_type,
                        invoice_title: invoice_title,
                        invoice_mail_address: invoice_mail_address,
                        invoice_tax_no: invoice_tax_no
                    }
                }

            },


            render: function () {

                this.getContent(this.data2Dom.bind(this));

            },

            bindEvents: function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;

                $container.on('change', '#monthLength', function (e) {
                    wrap.loadTotalPrice();
                });

                $container.on(beatEvent, '#submit', function (e) {
                    if (!issubmit) {
                        return;
                    } else {
                        wrap.submit();
                    }

                });
                //是否开发票
                $container.on(beatEvent, ' .j-is_need_invoice', function () {
                    var clickImg = $(this).find(".j-img").find(".imgs").attr("src");
                    var data = $(this).data("datas") - 0;
                    var checkedImg = "/static/resources/images/select4.png";
                    var uncheckedImg = "/static/resources/images/select1.png";
                    if (clickImg == checkedImg) {
                        if (data == 0) {
                            $(".j-detail").addClass("none");
                            $(this).attr("data-checked", "4");
                            $(this).next().find(".j-img").find(".imgs").attr("src", uncheckedImg);
                            $(this).next().attr("data-checked", "2");
                            return;
                        } else {
                            $(".j-detail").removeClass("none");
                            $(this).attr("data-checked", "4");
                            $(this).prev().find(".j-img").find(".imgs").attr("src", uncheckedImg);
                            $(this).prev().attr("data-checked", "2");
                            return;
                        }

                    }
                    else {
                        if (data == 0) {
                            $(this).find(".imgs").attr("src", checkedImg);
                            $(".j-detail").addClass("none");
                            $(this).attr("data-checked", "4");
                            $(this).next().find(".j-img").find("img").attr("src", uncheckedImg);
                            $(this).next().attr("data-checked", "2");
                            return;
                        } else {
                            $(this).find(".imgs").attr("src", checkedImg);
                            $(".j-detail").removeClass("none");
                            $(this).attr("data-checked", "4");
                            $(this).prev().find(".j-img").find(".imgs").attr("src", uncheckedImg);
                            $(this).prev().attr("data-checked", "2");
                            return;
                        }
                    }

                });

                //显示企业账号
                $container.on('change','.j-invoice_type',function () {
                    var isPerson = $('.j-invoice_type').val()-0;
                   if(isPerson==1){
                       if($(".j-q").hasClass("none")){
                           return;
                       }else{
                           $(".j-q").addClass("none");
                       }

                   }else {
                       $(".j-q").removeClass("none");
                   }
                })


            }
        };

        wrap.init();

    })(Zepto, window.request_g, window.template_g, window.weui_g, window.validate_g, window.str_g);//声明外部依赖


});