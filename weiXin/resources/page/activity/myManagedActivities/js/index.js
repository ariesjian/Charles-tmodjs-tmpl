;$(document).ready(function () {

    !(function($,request,tpl,wu,vld){

        var wrap = {

            $container:$('body'),

            urls:{
                'getManagedActivities':'/index.php/index/activity/getManagedActivities'
            },

            init:function () {
                this.render();
                this.bindEvent();
            },

            getContent:function (callback) {

                var errMsg = '无法加载页面，请稍后再试';
                request({
                    url:wrap.urls.getManagedActivities,
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


            render:function () {

                this.getContent(this.data2Dom.bind(this));

            },

            bindEvent:function () {
                var $container = wrap.$container;
                $container.on('click','.j-item',function () {
                    window.location.href='/index.php/index/activity/pageActivityDetail?activity_id='+$(this).data('id');
                })
            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g,window.validate_g);//声明外部依赖



});