;$(document).ready(function () {

    !(function ($, request, tpl, wu,vld) {

        var wrap = {

            $container: $('body'),

            areas: [],//id需要唯一

            urls: {
                'bookLookReemData': '/index.php/index/office/appointOffice'
            },

            init: function () {
                this.render();
                this.bindEvents();
            },


            data2Dom: function () {
                this.$container.prepend(tpl('index'));
                var office_id = $('#office_id').val().trim() - 0;
                var office_name = $('#office_name').val();
                var office_price = $('#office_price').val();
                var office_list_img_url = $('#office_list_img_url').val();
                 $(".j-office_list_img_url").attr("src",office_list_img_url);
                 $(".j-office_name").html(office_name);
                $(".j-office_price").html("价钱: &yen;"+office_price+"/月");

            },
            getHiddenData: function () {
                //type为hidden的input节点值的object
                return {
                    office_id: $('#office_id').val().trim() - 0,
                    office_name: $('#office_name').val(),
                    office_price: $('#office_price').val(),
                    office_list_img_url: $('#office_list_img_url').val()

                }
            },

            getParamsOfGetActivityDetail: function () {
                //传给接口的数据
                return {
                    office_id: this.getHiddenData().office_id,
                    office_name: this.getHiddenData().office_name,
                    office_price: this.getHiddenData().office_price,
                    office_list_img_url: this.getHiddenData().office_list_img_url
                }
            },
            getParams: function () {
                var office_id = $('#office_id').val().trim() - 0;
                var contact_name = $(".j-contact_name").val();
                var contact_mobile = $('.j-contact_mobile').val();

                return {
                    office_id: office_id,
                    contact_name: contact_name,
                    contact_mobile: contact_mobile
                }

            },

            render: function () {
                this.$container.prepend(tpl('index'));
                var office_id = $('#office_id').val().trim() - 0;
                var office_name = $('#office_name').val();
                var office_price = $('#office_price').val();
                var office_list_img_url = $('#office_list_img_url').val();
                $(".j-office_list_img_url").attr("src",office_list_img_url);
                $(".j-office_name").html(office_name);
                $(".j-office_price").html("价钱:  &yen;"+office_price+"/月");

            },

            bindEvents: function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                var issubmit=true;
                $container.on(beatEvent, '.j-confirm', function () {  //查看详情
                 var office_id = $('#office_id').val().trim() - 0;
                    var contact_name = $(".j-contact_name").val();
                    var contact_mobile = $('.j-contact_mobile').val();
                    if(!issubmit){
                        wu.topTips("您今天已经预约过了!");
                        return;
                    }else{
                    if (!contact_name) {
                        wu.topTips("请输入联系人姓名!");
                        return '请输入联系人姓名!';
                    }
                        if (!contact_mobile) {
                            wu.topTips("请输入联系方式!");
                            return '请输入联系方式!';
                        }
                    if (vld.mobile(contact_mobile)) {
                        wu.topTips("请输入合理的手机号!");
                        return vld.mobile(contact_mobile);
                    }

                    request({
                        url:self.urls.bookLookReemData,
                        data:self.getParams(),
                        type:'post',
                        success:function (data) {
                                wu.toast('预约成功!');
                            issubmit=false;
                        },
                        error:function (err) {
                            wu.topTips("预约失败!");

                        }
                    });}
                });


            }
        };

        wrap.init();

    })(Zepto, window.request_g, window.template_g, window.weui_g,window.validate_g);//声明外部依赖


});