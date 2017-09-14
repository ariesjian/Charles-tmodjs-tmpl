;$(document).ready(function () {

    !(function($,request,tpl,wu){

        var wrap = {

            $container:$('body'),

            areas:[''],//id需要唯一

            urls:{
                'getInformations':'/index.php/index/zone/getInformationList',
                'numUrl':'/index.php/index/zone/addInforReadCount'
            },

            init:function () {
                this.render();
                this.bindEvents();
            },

            getContent:function (callback) {

                var self = this;
                //1
                request({
                    url:self.urls.getInformations,
                    data:self.getParams(),
                 success:function (data) {
                     if(data){
                     	callback(data);
                     }else{

                     }
                 },
                 error:function (err) {
                     wu.topTips(err||'自定义消息内容')
                 }
                });

                //2
                // callback(this.getHiddenData());
            },

            data2Dom:function (data) {
                this.$container.prepend(tpl('index',data));
            },

            getParams:function () {
                //传给接口的数据
                return {
                /*	 information_id:this.getHiddenData().information_id,*/
                    page_size:10000 //todo 分页
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
                $container.on(beatEvent,'.j-num',function(){
                    var informationid =$(this).find(".zixunId").val().trim()-0;
                    request({
                        url:self.urls.numUrl,
                        useLoading:0,
                        data:{
                            information_id:informationid
                        },
                        success:function (data) {
                         return  errcode=0;
                        },
                        error:function (err) {
                        }
                    })

                });
            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g);//声明外部依赖



});