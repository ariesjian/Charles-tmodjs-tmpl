;$(document).ready(function () {

    !(function($,request,tpl,wu){

        var wrap = {

            $container:$('body'),

            areas:['#id名'],//id需要唯一

            urls:{
                'getActivityEnrollList':'/index.php/index/activity/getActivityEnrollList'
            },

            init:function () {
                this.render();
            },

            getContent:function (callback) {

                var self = this;
                //1
                var errMsg = '获取数据时出错了';
                request({
                    url:self.urls.getActivityEnrollList,
                    data:wrap.getParams(),
                    success:function (data) {
                        if(data){
                            callback(data);
                        }else{
                            wu.topTips(errMsg);
                        }
                    },
                    error:function (err) {
                        wu.topTips(err||errMsg)
                    }
                });
            },

            data2Dom:function (data) {
                this.$container.prepend(tpl('index',data));
            },

            getHiddenData:function () {
                return {
                    activity_id:$('#activity_id').val().trim()
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