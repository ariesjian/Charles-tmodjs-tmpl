;$(document).ready(function () {

    !(function ($, request, tpl, wu, str) {

        var wrap = {

            $container: $('body'),

            areas: [],//id需要唯一


            urls: {
                'getOfficeDetail': '/index.php/index/office/getOfficeList',
                'pageFillInForm': '/index.php/index/office/pageFillInForm?'
            },

            init: function () {
                this.render();
                this.bindEvents();
            },

            getContent: function (callback) {

                var self = this;
                request({
                    url: self.urls.getOfficeDetail,
                    data: self.getParamsOfGetActivityDetail(),
                    success: function (data) {
                        if (data) {
                            var datas = $.extend({},wrap.getHiddenData(),{data:data,Date:Date});
                            callback(datas);
                        } else {

                        }
                    },
                    error: function (err) {
                        wu.toast(err || '自定义消息内容')
                    }
                });

            },
            
            listExist:function(){
            	var num = $(".c_station_listdetail_box2_inner2_box").length;
            	if(num==0){
            		$("body").removeClass("background");
            	}else{
            		$("body").addClass("background");

            	}
            },

            data2Dom: function (data) {
                this.$container.prepend(tpl('index', data));
                var space_id = $('#space_id').val().trim() - 0;
                var space_name = $('#space_name').val().trim();
                var space_banner_url = $('#space_banner_url').val().trim();
                var space_address = $('#space_address').val().trim();
                var current_date = $('#current_date').val().trim();
                $(".j-space_name").html(space_name);
                $(".j-space_address").html(space_address);
                $(".j-space_banner_url").attr("src", space_banner_url);
                var s=$(".dd").html();
                if(s==null || s==""){
                    $(".dd").prev(".c_nodata_box3").removeClass("none");
                }
                function showDay(e) {
                    var arrDate = e.split("-");
                    var datas = new Date();
                    datas.setFullYear(arrDate[0]);
                    datas.setMonth(arrDate[1] - 1);
                    datas.setDate(arrDate[2]);
                    var longtime = datas.getTime();
                    longtime = longtime + 24 * 60 * 60 * 1000;//一天后的毫秒数
                    datas = new Date(longtime);
                    var newTime = datas.getFullYear() + "-" + (datas.getMonth() + 1) + "-" + datas.getDate();
                    return newTime;
                }
                
                wrap.listExist();

            },
            getHiddenData: function () {
                //type为hidden的input节点值的object
                return {
                    space_id: $('#space_id').val().trim(),
                    space_name: $('#space_name').val().trim(),
                    space_banner_url: $('#space_banner_url').val().trim(),
                    space_address: $('#space_address').val().trim(),
                    current_date: $('#current_date').val().trim()
                }
            },

            getParamsOfGetActivityDetail: function () {
                //传给接口的数据
                return {
                    space_id: this.getHiddenData().space_id,
                    start_date: this.getHiddenData().current_date,
                    month_length: 1
                }
            },


            getParams: function () {
                var start_date = $("#start_date").val();
                var month_length = 1;
                var space_id = $('#space_id').val().trim() - 0;
                return {
                    start_date: start_date,
                    month_length: month_length,
                    space_id: space_id
                }

            },


            render: function () {
                this.getContent(this.data2Dom.bind(this));
                var slider = mui("#sliders");
                slider.slider({
                    interval: 0
                });
                if($(".dd").html()==null){
                    $(this).prev().removeClass("none");
                }
            },
            slideree: function () {
                var sliders = mui(".mui-slider");
                sliders.slider({
                    interval: 0,
                });
            },

            bindEvents: function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent, ' .j-show', function () {  //查看详情
                    var listIndex = $(this).data('ids') - 0;
                    $(".j-content").each(function () {
                        var detailIndex = $(this).data('detail') - 0;
                        if (detailIndex == listIndex) {
                            if ($(this).hasClass("none")) {
                                $(this).removeClass("none");
                                wrap.slideree();
                            } else {
                                return;
                            }

                    }
                    });
                });

                //关闭详情页面
                $container.on(beatEvent, ' .j-close', function () {  //查看详情
                    var listPrent = $(this).parents(".j-content");
                    listPrent.each(function () {
                        if ($(this).hasClass("none")) {
                            return;
                        } else {
                            $(this).addClass("none");
                        }
                    });
                });

                //页面跳转点击
                $container.on(beatEvent, ' .j-order', function () {  //查看详情
                    var office_id = $(this).parents(".c_station_detailpopup").data('detail');
                    var start_date = $(".j-start_date").val();
                    var month_length = $(".j-month_length").val();
                    window.location.href = wrap.urls.pageFillInForm + str.obj2query({
                            office_id: office_id,
                            start_date: start_date,
                            month_length: month_length,
                            is_continue: 0
                        })
                });


            }
        };
        wrap.init();

    })(Zepto, window.request_g, window.template_g, window.weui_g, window.str_g);//声明外部依赖


});
