/**
 * Created by jack on 2017/6/26.
 */
;$(document).ready(function () {

    !(function($,request,tpl,async,wu){

        var wrap = {

            $container:$('body'),

            areas:['#tongzhi', '#system'],

            urls:{
                getMemberMessages:'/index.php/index/member/getMemberMessages'
            },

            init:function () {
                this.render();
                this.bindEvents();
            },

            getContent:function (type) {

                return request({
                    url:this.urls.getMemberMessages,
                    data:{type:type,page_size:10},
                    useAsync:true,
                    success: function (data) {
                    // data.JSON=JSON;
                    },
                    error: function (err) {
                        wu.topTips(err || '自定义消息内容')
                    }
                })

            },


            render:function () {

                var loadingModal = window.weui.loading('加载中');

                var self = this;

                /*var cbs = [1,2].map(function (v) {
                    return self.getContent(v)
                });*/

                var cbs = {
                    'notify':self.getContent(1),
                    'info':self.getContent(2)
                };

               async.parallel(cbs,function (error, results) {

                   wrap.$container.prepend(tpl('index',{data:results}));//不写在php中，为了开发体验，修改后，通过代理，立即生效

                    //不需要处理error
                   wrap.areas.forEach(function (v,i) {
                         $(v).html(tpl('content',{data:0==i?results.notify:results.info,Date:Date,parseInt:parseInt}))
                    });
                   loadingModal.hide();
                })
            },

            bindEvents:function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent,'#Title  .j-title',function(){
                    $(self.areas.join(',')).hide();
                    $(self.areas[$(this).index()]).show();
                    if (!$(this).hasClass("c_user_messagetab_selected")) {
                        $(".j-title").removeClass("c_user_messagetab_selected");
                        $(this).addClass ("c_user_messagetab_selected");
                        $(self.areas.join(',')).hide();
                        $(self.areas[$(this).index()]).show();
                    }

                  $(".j-title").removeClass("c_user_messagetab_selected");
                    $(this).addClass ("c_user_messagetab_selected");

                });
            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,async,window.weui_g);//声明外部依赖



});
