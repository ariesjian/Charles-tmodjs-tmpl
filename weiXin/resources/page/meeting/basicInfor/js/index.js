;$(document).ready(function () {

    !(function($,request,tpl,wu){

        var wrap = {

            $container:$('body'),

            areas:['#id名'],//id需要唯一

            urls:{
                'getMeetingRoomBasicInfor':'/index.php/index/meeting/getMeetingRoomBasicInfor'
            },

            init:function () {
                this.render();
            },

            getContent:function (callback) {

                var self = this;
                //1
                var errMsg = '无法加载页面，请稍后再试';
                request({
                    url:self.urls.getMeetingRoomBasicInfor,
                    data:{meeting_room_id:wrap.getHiddenData().meeting_room_id},
                    success:function (data) {
                        if(data&&data.meeting_room){
                            data.is_company_manager = wrap.getHiddenData().is_company_manager;
                            callback(data);
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
                    meeting_room_id:$('#meeting_room_id').val().trim(),
                    is_company_manager:$('#is_company_manager').val().trim()
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