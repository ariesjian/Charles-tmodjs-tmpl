/**
 * Created by jack on 2017/6/27.
 */
;$(document).ready(function () {

    !(function($,request,tpl,wu,sed){

        var wrap = {

            $container:$('body'),

            areas:['#Activity','#Enroll','#CommentsDescDec','#Footer','#ReplyModal'],//有id属性的元素

            urls:{
                getActivityDetail:'/index.php/index/activity/getActivityDetail',
                collectActivity:'/index.php/index/activity/collectActivity',
                replyComment:'/index.php/index/activity/replyComment'
            },

            eventSelectors:['#Activity .j-collect','#CommentsDescDec .j-title',
                '#CommentsDescDec .j-reply', '#ReplyModal .j-cancel',
                '#ReplyModal .j-submit'],

            activity_id:$('#activity_id').val().trim(),

            init:function () {
                this.render();
                wrap.bindEvents();

            },

            getContent:function (callback) {
                var errMsg = '无法加载页面，请稍后再试';
                request({
                    url:wrap.urls.getActivityDetail,
                    data:{activity_id:wrap.activity_id},
                    success:function (data) {
                        if(data&&data.activity){
                            callback(data)
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
                if(data.errMsg){
                    this.$container.prepend(tpl('errMsg',data));
                }else{
                    this.$container.prepend(tpl('replyModal'));
                    this.$container.prepend(tpl('index',{data:data}));
                    $(this.areas[2]).html(tpl('commentsDescDec',{data:data}));
                    sed(wrap.eventSelectors);

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

                $container.on(beatEvent,self.areas[0]+' .j-collect',function(){

                    //todo 连续快速点击；非纯函数会出bug

                    var $this = $(this);
                    var willCollect = 0===+$this.data('collected');
                    var $sibling = $this.siblings('.j-collect');

                    request({
                        url:self.urls.collectActivity,
                        data:{
                            activity_id:self.activity_id,
                            type:willCollect?1:2
                        },
                        success:function () {
                            $this.addClass('none');
                            $sibling.removeClass('none');
                        },
                        error:function (err) {
                            wu.topTips(err||'操作失败');
                        }
                    })

                });

                $container.on(beatEvent,self.areas[2]+' .j-title',function(){

                    var $this = $(this);

                    if($this.hasClass('c_activity_tabselected')){
                        return false;
                    }

                    $(this).siblings().removeClass("c_activity_tabselected");
                    $(this).addClass ("c_activity_tabselected");

                    $(self.areas[2]+' .j-content')
                        .addClass('none')
                        .eq($this.index())
                        .removeClass('none');

                });

                //业务一致的事件放到一个闭包里
                (function reply(){


                    var commentId;

                    $container.on(beatEvent,self.areas[2]+' .j-reply',function () {
                        var $modal = $(self.areas[4]);
                        var $textarea = $modal.find('.j-textarea');
                        commentId = $(this).closest('.j-comment').data('comment_id');
                        $textarea.val('');
                        $modal.show();
                        $textarea.focus();
                    });

                    $container.on(beatEvent,self.areas[4]+' .j-cancel',function () {
                        $(self.areas[4]).hide();
                    });

                    $container.on(beatEvent,self.areas[4]+' .j-submit',function () {
                        var $modal = $(self.areas[4]);
                        var $textarea = $modal.find('.j-textarea');
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
                                        var $curComment = $(self.areas[2]).find('.j-comment[data-comment_id="'+commentId+'"]');
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

    })(Zepto,window.request_g,window.template_g,window.weui_g,window.safariEventDelegation_g);//声明外部依赖



});