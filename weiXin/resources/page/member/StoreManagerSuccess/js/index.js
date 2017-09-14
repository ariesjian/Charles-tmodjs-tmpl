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
                    store_id:$('#store_id').val().trim()-0,
                    store_name:$('#store_name').val().trim(),
                    store_address:$('#store_address').val().trim(),
                    manager_id:$('#manager_id').val().trim()-0,
                    manager_name:$('#manager_name').val().trim(),
                    manager_mobile:$('#manager_mobile').val().trim()-0,
                }
            },
            getParamsOfGetActivityDetail:function () {
                //传给接口的数据
                return {
                    store_id:this.getHiddenData().store_id,
                    store_name:this.getHiddenData().store_name,
                    store_address:this.getHiddenData().store_address,
                    is_mmanager_idanager:this.getHiddenData().manager_id,
                    manager_name:this.getHiddenData().manager_name,
                    manager_mobile:this.getHiddenData().manager_mobile
                }
            },


            render: function () {
                this.$container.prepend(tpl('index'));
                var   store_name=$('#store_name').val().trim();
                var   store_address=$('#store_address').val().trim();
                var   manager_mobile=$('#manager_mobile').val().trim()-0;
                var   manager_name=$('#manager_name').val().trim();
                this.$container.find(".j-store_name").html(store_name);
                $(".j-store_address").html(store_address);
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
