;$(document).ready(function () {

    !(function($,request,tpl,wu){

        var wrap = {

            $container:$('body'),

            areas:['#Comments','#ReplyModal'],//id需要唯一

            urls:{
                'getActivityComments':'/index.php/index/activity/getActivityComments',
                'replyComment':'/index.php/index/activity/replyComment'
            },

            is_manager:$('#is_manager').val().trim(),

            init:function () {
                this.render();
                this.bindEvents();
            },

            getContent:function (callback) {

                var self = this;
                var errMsg = '获取评论时出错了';

                request({
                    url: self.urls.getActivityComments,
                    data: self.getParams(),
                    success: function (data) {
                       if(data){
                           data.is_manager = self.is_manager;
                           callback(data);
                       }else {
                           wu.topTips(errMsg);
                       }
                    },
                    error: function (err) {
                        wu.topTips(err || errMsg)
                    }
                });

            },

            data2Dom:function (data) {
                this.$container.prepend(tpl('index',data));
            },

            getHiddenData:function () {
                //type为hidden的input节点值的object
                return {
                    activity_id:$('#activity_id').val().trim(),
                    is_manager:$('#is_manager').val().trim()
                }
            },

            getParams:function () {
                //传给接口的数据
                return {
                    activity_id:this.getHiddenData().activity_id,
                    page_size:10000 //todo 分页
                };
            },


            render:function () {
                this.$container.prepend(tpl('replyModal'));
                this.getContent(this.data2Dom.bind(this));

            },

            bindEvents:function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;

                (function reply(){

                    var $modal = $(self.areas[1]);
                    var $textarea = $modal.find('.j-textarea');
                    var commentId;

                    $container.on(beatEvent,self.areas[0]+' .j-reply',function () {
                        commentId = $(this).closest('.j-comment').data('comment_id');
                        $textarea.val('');
                        $modal.show();
                        $textarea.focus();
                    });

                    $container.on(beatEvent,self.areas[1]+' .j-cancel',function () {
                        $modal.hide();
                    });

                    $container.on(beatEvent,self.areas[1]+' .j-submit',function () {

                        var replyContent = $textarea.val().trim();
                        if(!replyContent){
                            wu.topTips('请输入内容后再提交');
                        }else{
                            request({
                                url:self.urls.replyComment,
                                type:'post',
                                data:{
                                    comment_id:commentId,
                                    reply_content:replyContent
                                },
                                success:function (data) {
                                    if(data){
                                        var replyViewStr = tpl('replyView',data);
                                        var $curComment = $(self.areas[0]).find('.j-comment[data-comment_id="'+commentId+'"]');
                                        $curComment.find('.j-right').append(replyViewStr);
                                        $curComment.find('.j-reply').hide();
                                        $modal.hide();
                                    }else{
                                        wu.topTips('网络异常，请稍后刷新页面查看');
                                    }
                                },
                                error:function (err) {
                                    wu.topTips(err||'提交失败了');
                                }
                            });
                        }

                    });

                })();
            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g);//声明外部依赖



});