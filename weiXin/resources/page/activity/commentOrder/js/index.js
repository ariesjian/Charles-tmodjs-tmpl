;$(document).ready(function () {

    !(function($,request,tpl,wu,sed){

        var wrap = {

            $container:$('body'),

            areas:['#Comment'],//id需要唯一

            urls:{
                'commentActivityOrder':'/index.php/index/activity/commentActivityOrder'
            },

            eventSelectors:['#Comment .j-star','#Comment .j-submit'],

            init:function () {
                this.render();
                this.bindEvents();
            },

            getContent:function (callback) {

                callback(this.getHiddenData());
            },

            data2Dom:function (data) {
                this.$container.prepend(tpl('index',data));
                sed(wrap.eventSelectors);
            },

            getHiddenData:function () {
                //type为hidden的input节点值的object
                return {
                    order_id:$('#order_id').val().trim(),
                    activity_id:$('#activity_id').val().trim(),
                    activity_name:$('#activity_name').val().trim(),
                    activity_address:$('#activity_address').val().trim(),
                    banner_url:$('#banner_url').val().trim(),
                    activity_start_time:$('#activity_start_time').val().trim(),
                    activity_end_time:$('#activity_end_time').val().trim()
                }
            },

            getParams:function () {
                //传给接口的数据
                return {
                    order_id:wrap.getHiddenData().order_id,
                    score:$(wrap.areas[0]+' .c-show[data-star="1"]').length,
                    content:$(wrap.areas[0]+' .j-content').val().trim()
                };
            },


            render:function () {

                this.getContent(this.data2Dom.bind(this));

            },

            bindEvents:function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent,wrap.areas[0]+' .j-star',function(){

                    var $this = $(this);

                    var index = parseInt($this.index()/2,10)*2+1;

                    $(wrap.areas[0]+' .j-star').each(function (i, v) {
                        if(i<=index){
                            $(v)[1==$(v).data('star')?'addClass':'removeClass']('c-show');
                        }else{
                            $(v)[1==$(v).data('star')?'removeClass':'addClass']('c-show');
                        }
                    })
                });

                $container.on(beatEvent,self.areas[0]+' .j-submit',function () {

                    if(!(wrap.getParams().content)){
                        wu.topTips('请填写评论');
                    }else{
                        var errMsg = '提交失败了';
                        request({
                            url:wrap.urls.commentActivityOrder,
                            type:'post',
                            data:wrap.getParams(),
                            success:function (data) {
                                if(data && data.gain_score){
                                    wu.toast('提交成功,获得'+data.gain_score+'积分。即将跳转');
                                }else{
                                    wu.toast('提交成功，请稍后查询积分。即将跳转');
                                }
                                setTimeout(function () {
                                    window.location.replace('/index.php/index/activity/pageMemberActivityOrderDetail?order_id='+wrap.getHiddenData().order_id);
                                },1500);
                            },
                            error:function (err) {
                                wu.topTips(err||errMsg);
                            }
                        })
                    }

                })
            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g,window.safariEventDelegation_g);//声明外部依赖



});