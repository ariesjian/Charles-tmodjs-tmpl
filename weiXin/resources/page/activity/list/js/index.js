/**
 * Created by jack on 2017/6/26.
 */
;$(document).ready(function () {

    !(function($,request,tpl,async,wu){

        var wrap = {

            $container:$('body'),

            areas:['#Enrolling', '#EnrollEnd', '#Underway', '#Over'],

            urls:{
                getActivities:'/index.php/index/activity/getActivities',
                collectActivity:'/index.php/index/activity/collectActivity'
            },

            init:function () {
                this.render();
                this.bindEvents();
            },

            getContent:function (type) {

                return request({
                    url:this.urls.getActivities,
                    data:{type:type,page_size:10000},
                    useAsync:true
                })

            },


            render:function () {

                var loadingModal = window.weui.loading('加载中');

                this.$container.prepend(tpl('index'));//不写在php中，为了开发体验，修改后，通过代理，立即生效

                var self = this;

                var cbs = [1,2,3,4].map(function (v) {
                    return self.getContent(v)
                });


                async.parallel(cbs,function (error, results) {
                    //不需要处理error
                    self.areas.forEach(function (v,i) {
                        $(v).html(tpl('content',{data:results[i]}))
                    });

                    loadingModal.hide();
                })
            },

            bindEvents:function () {

                //所有事件必须绑定在$container上

                var self = this;
                var $container = this.$container;


                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap

                $container.on(beatEvent,'#Title .j-title',function(){

                    $(self.areas.join(',')).hide();
                    $(self.areas[$(this).index()]).show();

                    //zepto不支持end
                    $(this).siblings().removeClass("c_activity_tabselected");
                    $(this).addClass ("c_activity_tabselected");
                });

                $container.on(beatEvent,'.j-collect',function () {

                    //todo 连续快速点击；非纯函数会出bug

                    var $this = $(this);
                    var activityId = $this.data('activity_id');
                    var willCollect = 0===+$this.data('collected');//关注
                    var $sibling = $this.siblings('.j-collect');

                    request({
                        url:self.urls.collectActivity,
                        data:{
                            activity_id:activityId,
                            type:willCollect?1:2
                        },
                        success:function (data) {

                            $this.addClass('none');
                            $sibling.removeClass('none');
                            var collection_count = (data&&data.collection_count)?data.collection_count:0;
                            !willCollect && $sibling.find('.j-collectedTotal').text(collection_count);

                        },
                        error:function (err) {
                            wu.topTips(err||'操作失败');
                        }
                    })

                });

            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,async,window.weui_g);//声明外部依赖



});
