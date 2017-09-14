;$(document).ready(function () {

    !(function($,request,tpl,wu,validate){

        var wrap = {

            $container:$('body'),

            areas:['#Shell'],//id需要唯一

            urls:{
                'getActivityDetail':'/index.php/index/activity/getActivityDetail',
                'bindActivityManager':'/index.php/index/activity/bindActivityManager'
            },

            init:function () {
                this.render();
                this.bindEvents();
            },

            getContent:function (callback) {

                var self = this;
                //1
                var errMsg = '获取数据时失败了';
                request({
                    url:self.urls.getActivityDetail,
                    data:wrap.getParamsOfGetActivityDetail(),
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
                // $(this.areas[0]).html(tpl('模板名',data))
            },

            getHiddenData:function () {
                //type为hidden的input节点值的object
                return {
                    activity_id:$('#activity_id').val().trim(),
                    is_manager:$('#is_manager').val().trim()
                }
            },

            getParamsOfGetActivityDetail:function () {
                //传给接口的数据
                return {
                    activity_id:this.getHiddenData().activity_id
                }
            },

            getParamsOfBindActivityManager:function () {
                return {
                    activity_id:this.getHiddenData().activity_id,
                    manager_name:$(wrap.areas[0]+' .j-name').val().trim(),
                    manager_mobile:$(wrap.areas[0]+' .j-mobile').val().trim()
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
                $container.on(beatEvent,wrap.areas[0]+' .j-bind-manager',function(){
                    var params = wrap.getParamsOfBindActivityManager();
                    if(!params.manager_name){
                        wu.topTips('请输入负责人姓名');
                        return;
                    }
                    if(validate.mobile(params.manager_mobile)){
                        wu.topTips(validate.mobile(params.manager_mobile));
                        return;
                    }
                    var errMsg = '绑定失败';
                    request({
                        url:wrap.urls.bindActivityManager,
                        type:'post',
                        data:params,
                        success:function (data) {
                            wu.toast('绑定成功。即将跳转');
                            setTimeout(function () {
                                var url ="/index.php/index/activity/pageBindActivityManagerSuccess?manager_id="+data.manager_id;
                                window.location.replace(url);
                            },1500);
                        },
                        error:function (err) {
                            wu.topTips(err||errMsg);
                        }
                    })
                });
            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g,window.validate_g);//声明外部依赖



});