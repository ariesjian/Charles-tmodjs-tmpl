;$(document).ready(function () {

    !(function($,request,tpl,wu,vld){

        var wrap = {

            $container:$('body'),

            areas:[],//id需要唯一

            urls:{
                'bindStoreManager':'/index.php/index/member/bindStoreManager'
            },

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
                    is_manager:$('#is_manager').val().trim()-0,
                }
            },
            getParamsOfGetActivityDetail:function () {
                //传给接口的数据
                return {
                    store_id:this.getHiddenData().store_id,
                    store_name:this.getHiddenData().store_name,
                    store_address:this.getHiddenData().store_address,
                    is_manager:this.getHiddenData().is_manager
                }
            },


            render: function () {
                this.$container.prepend(tpl('index'));
                var   store_name=$('#store_name').val().trim();
                var   store_address=$('#store_address').val().trim();
                this.$container.find(".j-store_name").html(store_name);
                $(".j-store_address").html(store_address);
            },

            bindEvents:function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent,' #submitBtn',function(){
                    var  store_id=$('#store_id').val().trim()-0;
                    var manager_name=$(".j-manager_name").val().trim();
                    var manager_mobile=$(".j-manager_mobile").val().trim()-0;
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
                        url:self.urls.bindStoreManager,
                        data: {
                            store_id:store_id,
                            manager_mobile:manager_mobile,
                            manager_name:manager_name
                        },
                        type:'post',
                        success:function (data) {
                            var manager_id=data.manager_id;
                            if(manager_id>0){
                                window.location.replace("/index.php/index/member/pageBindStoreManagerSuccess?manager_id="+manager_id);
                            }
                            if(data.errcode==1){
                                wu.topTips(data.errmsg)
                            }
                        },
                        error:function (err) {

                            wu.topTips(err||'自定义消息内容')
                        }
                    });

                });

            }
        };
        wrap.init();


    })(Zepto,window.request_g,window.template_g,window.weui_g,validate_g);//声明外部依赖
});
