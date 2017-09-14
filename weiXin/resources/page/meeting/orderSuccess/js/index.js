;$(document).ready(function () {

    !(function($,request,tpl,wu){

        var wrap = {

            $container:$('body'),

            areas:['#id名'],//id需要唯一

            urls:{
                'getMeetingRoomOrderDetail':'/index.php/index/meeting/getMeetingRoomOrderDetail'
            },

            init:function () {
                this.render();
            },

            getContent:function (callback) {

                var errMsg = '无法加载页面，请稍后再试';
                request({
                    url:wrap.urls.getMeetingRoomOrderDetail,
                    data:wrap.getParams(),
                    success:function (data) {
                        if(data&&data.order){
                            callback(data);
                        }else{
                            callback({errMsg:errMsg});
                        }
                    },
                    error:function (err) {
                        callback({errMsg:errMsg});
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

            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g);//声明外部依赖



});