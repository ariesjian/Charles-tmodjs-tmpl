;$(document).ready(function () {

    !(function($,request,tpl,wu){

        var wrap = {

            $container:$('body'),

            areas:['#Submit'],//id需要唯一

            urls:{
                'getMemberActivityOrderDetail':'/index.php/index/activity/getMemberActivityOrderDetail',
                'activityCommitEnroll':'/index.php/index/activity/activityCommitEnroll'
            },

            init:function () {
                this.render();
                this.bindEvents();
            },

            getContent:function (callback) {

                var self = this;
                //1
                var errMsg = '无法加载页面，请稍后再试';
                request({
                    url: self.urls.getMemberActivityOrderDetail,
                    data: wrap.getParamsOfGetMemberActivityOrderDetail(),
                    success: function (data) {
                        if (data) {
                            callback(data);
                        } else {
                            wu.topTips(errMsg);
                        }
                    },
                    error: function (err) {
                        wu.topTips(err || errMsg)
                    }
                });

            },

            data2Dom:function (data) {
                var is_manager = +wrap.getHiddenData().is_manager;
                var order_status = +wrap.getHiddenData().order_status;
                if(1===is_manager && 1===order_status){
                    this.$container.prepend(tpl('index',data));
                }else if(1 === is_manager && 2 ===order_status){
                    this.$container.prepend(tpl('index',{errMsg:'该用户已签到，请勿重复签到'}));
                }
                else if(0 === is_manager){
                    this.$container.prepend(tpl('index',{errMsg:'您不是该活动的负责人，请先绑定'}));
                }else{
                    this.$container.prepend(tpl('index',{errMsg:'无法签到，请稍后再试'}));
                }
            },

            getHiddenData:function () {
                //type为hidden的input节点值的object
                return {
                    order_id:$('#order_id').val().trim(),
                    is_manager:$('#is_manager').val().trim(),
                    order_status:$('#order_status').val().trim()
                }
            },

            getParamsOfGetMemberActivityOrderDetail:function () {
                //传给接口的数据
                return {
                    order_id:wrap.getHiddenData().order_id
                }
            },

            getParamsOfActivityCommitEnroll:function () {
                return {
                    order_id:wrap.getHiddenData().order_id
                }
            },


            render:function () {

                this.getContent(this.data2Dom.bind(this));

            },

            bindEvents:function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent,wrap.areas[0],function(){

                    var errMsg = '签到失败';
                    request({
                        url:wrap.urls.activityCommitEnroll,
                        data:wrap.getParamsOfActivityCommitEnroll(),
                        success:function (data) {
                            if(data && data.activity_id){
                                var url ='/index.php/index/activity/pageActivityDetail?activity_id='+data.activity_id;
                                window.location.replace(url);
                            }else{
                                wu.toast('签到成功');
                            }
                        },
                        error:function (err) {
                            wu.topTips(err||errMsg);
                        }
                    })

                });
            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g);//声明外部依赖



});