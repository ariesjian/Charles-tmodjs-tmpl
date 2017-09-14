/**
 * Created by jack on 2017/6/26.
 */
;$(document).ready(function () {

    !(function($,request,tpl,async,wu){

        var wrap = {

            $container:$('body'),

            areas:['#mechanisms', '#experts', '#tutors'],

            urls:{
                getTeachers:'/index.php/index/zone/getProjectTutorList'
            },

            init:function () {
                this.render();
                this.bindEvents();
            },

            getContent:function (type) {

                return request({
                    url:this.urls.getTeachers,
                    data:{type:type,page_size:10000},
                    useAsync:true
                })

            },


            render:function () {
                var loadingModal = window.weui.loading('加载中');

                this.$container.prepend(tpl('index'));//不写在php中，为了开发体验，修改后，通过代理，立即生效

                var self = this;

                var cbs = [1,2,3].map(function (v) {
                    return self.getContent(v)
                });

               async.parallel(cbs,function (error, results) {
                    //不需要处理error
                    wrap.areas.forEach(function (v,i) {
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
                    if($(this).hasClass("c_zone_teachertab_selected")){
                        $(self.areas.join(',')).hide();
                        $(self.areas[$(this).index()]).show();
                    }
                    $(this).addClass ("c_zone_teachertab_selected");
                    $(this).parent().find(".c_zone_teachertab_selected").not(this).removeClass("c_zone_teachertab_selected");
                });
            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,async,window.weui_g);//声明外部依赖



});
