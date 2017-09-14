
;$(document).ready(function () {

    !(function($,request,tpl,wu){

        var wrap = {

            $container:$('body'),

            areas: ['#details', '#services'],//id需要唯一

            urls:{
                'teacherDetails':'/index.php/index/zone/getProjectTutorDetail'
            },
            init:function () {
                this.render();
                this.bindEvents();
            },

            getContent:function (callback) {

                var self = this;
                //1
                request({
                    url:self.urls.teacherDetails,
                    data:self.getParamsOfGetActivityDetail(),
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

            },

            data2Dom:function (data) {
                this.$container.prepend(tpl('index',data));
            },

            getHiddenData:function () {
                //type为hidden的input节点值的object
                return {
                    tutor_id:$('#tutor_id').val().trim(),
                }
            },

            getParamsOfGetActivityDetail:function () {
                //传给接口的数据
                return {
                    tutor_id:this.getHiddenData().tutor_id
                }
            },
    /*        getParams:function () {
                //传给接口的数据
                return {
                    page_size:10000 //todo 分页
                };
            },*/


            render:function () {
                this.getContent(this.data2Dom.bind(this));

            },

            bindEvents:function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
               $container.on(beatEvent,'#Title  .j-title',function(){
                    $(self.areas.join(',')).hide();
                    $(self.areas[$(this).index()]).show();
                    if (!$(this).hasClass("c_zone_teachertab_selected")) {

                        $(this).addClass("c_zone_teachertab_selected");
                        $(this).siblings().removeClass("c_zone_teachertab_selected").end();
                        $(self.areas.join(',')).hide();
                        $(self.areas[$(this).index()]).show();
                    }

                   $(this).siblings().removeClass("c_zone_teachertab_selected").end().addClass ("c_zone_teachertab_selected");

                });
            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g);//声明外部依赖



});