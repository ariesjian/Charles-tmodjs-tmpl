;$(document).ready(function () {

    !(function($,request,tpl,wu,vld){

        var wrap = {

            $container:$('body'),

            areas:['#id名'],//id需要唯一

            urls:{
                'getOrderDetail':'/index.php/index/workplace/getOrderDetail'
            },

            init:function () {
                this.render();
                this.bindEvents();
            },

            getContent:function (callback) {

                //1
                var errMsg = '无法加载页面，请稍后再试';
                request({
                    url:wrap.urls.getOrderDetail,
                    data:wrap.getParams(),
                    success:function (data) {
                        if(data&&data.order){
                            callback(data.order);
                        }else{
                            callback({errMsg:errMsg})
                        }
                    },
                    error:function (err) {
                        callback({errMsg:errMsg})
                    }
                });

            },

            data2Dom:function (data) {
                this.$container.prepend(tpl('index',data));
            },

            getHiddenData:function () {
                //type为hidden的input节点值的object
                return {
                    order_id:$('#order_id').val().trim()
                }
            },

            getParams:function () {
                //传给接口的数据
                return this.getHiddenData();
            },


            render:function () {

                this.getContent(this.data2Dom.bind(this));

            },

            bindEvents:function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent,'',function(){


                });
            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g,window.validate_g);//声明外部依赖



});