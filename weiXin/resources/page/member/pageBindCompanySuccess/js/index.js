;$(document).ready(function () {

    !(function($,request,tpl,wu){

        var wrap = {

            $container:$('body'),

            areas:[],//id需要唯一



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
                    manager_name:$('#manager_name').val().trim(),
                    manager_mobile:$('#manager_mobile').val().trim()-0,
                }
            },
            getParamsOfGetActivityDetail:function () {
                //传给接口的数据
                return {
                    company_id:this.getHiddenData().company_id,
                    company_name:this.getHiddenData().company_name,
                    company_address:this.getHiddenData().company_address,
                    manager_name:this.getHiddenData().manager_name,
                    manager_mobile:this.getHiddenData().manager_mobile
                }
            },


            render: function () {
                this.$container.prepend(tpl('index'));
                var   company_name=$('#company_name').val().trim();
                var   company_address=$('#company_address').val().trim();
                var   manager_mobile=$('#manager_mobile').val().trim()-0;
                var   manager_name=$('#manager_name').val().trim();
                this.$container.find(".j-company_name").html(company_name);
                $(".j-company_address").html(company_address);
                $(".j-manager_mobile").html(manager_mobile);
                $(".j-manager_name").html(manager_name);
            },

            bindEvents:function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent,' #submitBtn',function(){

                });

            }
        };
        wrap.init();


    })(Zepto,window.request_g,window.template_g,window.weui_g);//声明外部依赖
});
