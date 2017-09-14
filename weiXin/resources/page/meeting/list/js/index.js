;$(document).ready(function () {

    !(function($,request,tpl,wu){

        var wrap = {

            $container:$('body'),

            areas:['#id名'],//id需要唯一

            urls:{
                'getMeetingSpaceList':'/index.php/index/meeting/getMeetingSpaceList',
                'getSpaceListBySpaceId':'/index.php/index/meeting/getSpaceListBySpaceId'
            },

            space_id:0,
            currentTabIndex:0,
            tabLoadEnd:[],
            page:[],

            init:function () {
                this.render();
                this.bindEvents();
            },

            getContent:function (callback) {

                var self = this;
                //1
                var errMsg = '无法加载页面，请稍后再试';
                request({
                    url:self.urls.getMeetingSpaceList,
                    success:function (data) {
                        if(data && data.space_list){
                            var space_id = wrap.getHiddenData().space_id;
                            if(+space_id>0){
                                wrap.space_id = space_id;
                                if(data.space_list&&data.space_list.length){
                                    wrap.currentTabIndex = data.space_list.findIndex(function (v) {
                                        return v.id == space_id;
                                    });
                                }
                            }else{
                                wrap.space_id = data.space_list&&data.space_list[0]&&data.space_list[0].id;
                                wrap.currentTabIndex = 0;
                            }



                            data.space_id  = wrap.space_id;

                            callback(data);
                        }else{
                            callback({errMsg:errMsg});
                        }
                    },
                    error:function (err) {
                        callback({errMsg:errMsg});
                    }
                });

            },

            adjustTab:function () {
                var sumWidth = 0;
                var num = $('.j-tab').length;
                $('.j-tab').each(function() {
                    if(num <= 3){
                        sumWidth = $(window).width();
                        $(this).width(sumWidth/num);
                    }else{
                        sumWidth += $(this).width();
                    }
                });
                $('#tabWrap').width(sumWidth);
            },

            data2Dom:function (data) {

                if(data.errMsg){
                    this.$container.prepend(tpl('errMsg',data));

                }else{
                    this.$container.prepend(tpl('index',data));

                    wrap.adjustTab();

                    for(var i=0;i<data.space_list.length;i++){
                        wrap.page.push(0);
                    }

                    wrap.dropload();

                }


            },

            getHiddenData:function () {
                //type为hidden的input节点值的object
                return {
                    space_id:$('#space_id').val().trim()
                }
            },

            getParams:function () {
                //传给接口的数据
                return this.getHiddenData();
            },


            render:function () {

                this.getContent(this.data2Dom.bind(this));

            },

            bindEvents:function () {

                //所有事件必须绑定在$container上
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent,'.j-tab',function(){
                    var $this = $(this);
                    var index = $this.index();
                    if(!$this.hasClass('c_room_tabselected')){
                        $('.j-list')
                            .hide()
                            .eq(index).show();
                        $this
                            .addClass('c_room_tabselected')
                            .siblings('.j-tab').removeClass('c_room_tabselected');
                        wrap.space_id = $this.data('space_id');
                        wrap.currentTabIndex = index;

                        if(!wrap.tabLoadEnd[index]){
                            // 解锁
                            wrap.dl.unlock();
                            wrap.dl.noData(false);
                        }else{
                            // 锁定
                            wrap.dl.lock('down');
                            wrap.dl.noData();
                        }
                        wrap.dl.resetload();

                    }
                });
            },

            dropload:function () {
                var pageSize = 10;
                wrap.dl = $('.j-content').dropload({
                    scrollArea : window,
                    loadDownFn : function(me){
                            wrap.page[wrap.currentTabIndex]++;

                            request({
                                url: wrap.urls.getSpaceListBySpaceId,
                                data: {
                                    space_id: wrap.space_id,
                                    page_index:wrap.page[wrap.currentTabIndex],
                                    page_size:pageSize
                                },
                                success: function (data) {
                                    if (data&&data.meeting_room_list&&data.meeting_room_list.length) {
                                        $('.j-list').eq(wrap.currentTabIndex).append(tpl('content', data));

                                        if(data.meeting_room_list.length<pageSize){
                                            me.lock();
                                            me.noData();
                                        }

                                    } else {
                                        wrap.tabLoadEnd[wrap.currentTabIndex]=true;
                                        // 锁定
                                        me.lock();
                                        // 无数据
                                        me.noData();
                                    }
                                    me.resetload();

                                },
                                error: function (err) {
                                    me.resetload();
                                }
                            });
                        }


                })
            }


        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g);//声明外部依赖



});