;$(document).ready(function () {

    !(function ($,request,tpl,wu,vld) {

        var wrap = {

            $container: $('body'),

            areas: ["#submitBtn"],

            urls: {
                'commitAdvice': '/index.php/index/convenient/commitAdvice'
            },

            init: function () {
                this.render();
                this.bindEvents();
            },

            data2Dom:function () {
                this.$container.prepend(tpl('index'));
            },
            getParams: function () {
                var contact_name = $('.j-contact_name').val() ;
                var contact_mobile = $('.j-contact_mobile').val() ;
                var advice_detail = $('.j-advice_detail').val() ;
                var company_name = $('.j-company_name').val() ;
                if(!company_name){return '公司名称不可以为空';}
                if (!contact_name) {

                    return '请输入联系人姓名';
                }
                if (!contact_mobile) {

                    return '请输入联系方式';
                }
                if (vld.mobile(contact_mobile)) {

                    return vld.mobile(contact_mobile);
                }
                if(!advice_detail){return '请填写意见';}


                return {
                    contact_name: contact_name,
                    contact_mobile: contact_mobile,
                    advice_detail:advice_detail,
                    company_name:company_name
                };

            },
            render: function () {
                this.$container.prepend(tpl('index'));

            },
            bindEvents: function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                var isSubmit=true;
                $container.on(beatEvent, self.areas[0], function () {
                    var errMsg = '此时无法提交，请稍后再试';
                    var errMsgP = '提交失败，请稍后再试';
                    var queryData =self.getParams();
                    if ('string' === typeof queryData) {
                        wu.topTips(queryData);
                    } else {
                        if(!isSubmit){
                            wu.topTips("您已经提交过，不可再提交！");
                            setTimeout(function () {
                                window.location.replace("/index.php/index/index/pageIndex");
                            },1200);
                            return;

                        }else{
                    request({
                        url:self.urls.commitAdvice,
                        data:queryData,
                        type:'post',
                        success:function (data) {
                            if(data){
                                var dataID = data.advice_id;
                                if(dataID>0){
                                    isSubmit=false;
                                    wu.alert('提交成功','您的意见在采纳后将会获取相应的积分!',function () {
                                        window.location.replace("/index.php/index/index/pageIndex");
                                    });

                                }else{
                                    wu.topTips(errMsgP);
                                }
                            }else{
                                wu.topTips(errMsg);
                            }
                        },
                        error:function (err) {
                            wu.topTips(err);
                        }
                    })}}


                });
                //字数递减验证
                var beatEvents = 'keyup';//tap；  在桌面浏览器模拟不出tap
                $container.on(beatEvents,'.j-advice_detail',function(){
                    var num=  $(this).val().length;
                    /*   var maxLengt=$(this).maxlength;*/
                    if(num>=120){
                        $(this).next("span").html("最多为120字");

                    }else{
                        $(this).next("span").html(num+"/120");
                    }

                });
            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g, window.validate_g);//声明外部依赖


});