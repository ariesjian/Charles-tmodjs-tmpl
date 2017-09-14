;$(document).ready(function () {

    !(function($,request,tpl,wu,vld){

        var wrap = {

            $container:$('body'),

            areas:['#id名'],//id需要唯一

            urls:{
                'getMemberAwardRecord':'/index.php/index/game/getMemberAwardRecord'
            },

            init:function () {
                this.render();
                this.bindEvents();
            },

            getContent:function (callback) {

                var errMsg = '还没有抽奖,快去抽奖吧';
                request({
                    url:wrap.urls.getMemberAwardRecord,
                    success:function (data) {
                        if(data && data.records&&data.records.length){
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

            data2Dom:function (data) {
                this.$container.prepend(tpl('index',data));
            },

            getHiddenData:function () {
                //type为hidden的input节点值的object
                return {

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

                // //所有事件必须绑定在$container上
                // var self = this;
                // var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                // var $container = this.$container;
                // $container.on(beatEvent,'',function(){
                //
                //
                // });
            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g,window.validate_g);//声明外部依赖



});