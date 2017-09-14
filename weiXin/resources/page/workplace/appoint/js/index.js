;$(document).ready(function () {

    !(function($,request,tpl,wu,vld){

        var wrap = {

            $container:$('body'),

            areas:['#contactName','#contactMobile','#submit'],//id需要唯一

            urls:{
                'appointWorkplace':'/index.php/index/workplace/appointWorkplace'
            },

            init:function () {
                this.render();
                this.bindEvents();
            },

            getContent:function (callback) {

                //2
                callback(this.getHiddenData());
            },

            data2Dom:function (data) {
                this.$container.prepend(tpl('index',data));
            },

            getHiddenData:function () {
                //type为hidden的input节点值的object
                return {
                    workplace_id:$('#workplace_id').val().trim(),
                    workplace_name:$('#workplace_name').val().trim(),
                    workplace_price:$('#workplace_price').val().trim(),
                    workplace_list_img_url:$('#workplace_list_img_url').val().trim()
                }
            },

            getParams:function () {
                return {
                    workplace_id:wrap.getHiddenData().workplace_id,
                    contact_name:$(wrap.areas[0]).val().trim(),
                    contact_mobile:$(wrap.areas[1]).val().trim()
                }
            },

            isInvalid:function () {
                var contactName = wrap.getParams().contact_name;
                var contactMobile = wrap.getParams().contact_mobile;
                if(!contactName){
                    return '请输入姓名';
                }
                if(vld.mobile(contactMobile)){
                    return vld.mobile(contactMobile)
                }
                return '';

            },


            render:function () {

                this.getContent(this.data2Dom.bind(this));

            },

            bindEvents:function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent,wrap.areas[2],function(){

                    if(wrap.isInvalid()){
                        wu.topTips(wrap.isInvalid())
                    }else{
                        var errMsg = '预约失败，请稍后再试';
                        request({
                            url: wrap.urls.appointWorkplace,
                            type:'post',
                            data: wrap.getParams(),
                            success: function (data) {
                                wu.toast('预约成功');
                            },
                            error: function (err) {
                                wu.topTips(err || errMsg)
                            }
                        });
                    }

                });
            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g,window.validate_g);//声明外部依赖



});