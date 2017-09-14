;$(document).ready(function () {

    !(function($,request,tpl,wu,vld){

        var wrap = {

            $container:$('body'),

            areas:[],//id需要唯一

            urls:{
                'bindCompanyManager':'/index.php/index/member/bindCompanyManager'
            },

            init:function () {
                this.render();
                this.bindEvents();
            },

            getHiddenData:function () {
                //type为hidden的input节点值的object
                return {
                    company_id:$('#company_id').val().trim()-0,
                    company_name:$('#company_name').val().trim(),
                    company_address:$('#company_address').val().trim(),
                    is_can_bind:$('#is_can_bind').val().trim()-0,
                    random_key:$("#random_key").val().trim()
                }
            },
            getParamsOfGetActivityDetail:function () {
                //传给接口的数据
                return {
                    company_id:this.getHiddenData().company_id,
                    company_name:this.getHiddenData().company_name,
                    company_address:this.getHiddenData().company_address,
                    is_can_bind:this.getHiddenData().is_can_bind,
                    random_key:this.getHiddenData().random_key
                }
            },


            render: function () {
                this.$container.prepend(tpl('index'));
                var   company_name=$('#company_name').val().trim();
                var   company_address=$('#company_address').val().trim();
                this.$container.find(".j-company_name").html(company_name);
                $(".j-company_address").html(company_address);
            },

            bindEvents:function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent,' #submitBtn',function(){
                    var  company_id=$('#company_id').val().trim()-0;
                    var manager_name=$(".j-manager_name").val().trim();
                    var manager_mobile=$(".j-manager_mobile").val().trim();
                    var random_key=$("#random_key").val().trim();
                    if(!manager_name){
                        wu.topTips("请输入姓名");
                        return;
                    }
                    if(!manager_mobile){
                        wu.topTips("请输入手机号码");
                        return;
                    }
                    if(vld.mobile(manager_mobile)){
                        wu.topTips (vld.mobile(manager_mobile));
                        return;
                    }
                    request({
                        url:self.urls.bindCompanyManager,
                        data: {
                            company_id:company_id,
                            manager_mobile:manager_mobile,
                            manager_name:manager_name,
                            random_key:random_key
                        },
                        type:'post',
                        success:function (data) {
                                window.location.replace("/index.php/index/member/pageBindCompanySuccess?company_id="+company_id);
                        },
                        error:function (err) {

                            wu.topTips(err||'绑定失败')
                        }
                    });

                });

            }
        };
        wrap.init();


    })(Zepto,window.request_g,window.template_g,window.weui_g,validate_g);//声明外部依赖
});
