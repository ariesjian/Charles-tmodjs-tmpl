;$(document).ready(function () {

    !(function($,request,tpl,wu,str){

        var wrap = {

            $container:$('body'),

            areas:['#startDate','#monthLength','#detailPopup','#closePopup','#workplaceList'],//id需要唯一

            urls:{
                'getWorkplaceList':'/index.php/index/workplace/getWorkplaceList',
                'pageFillInForm':'/index.php/index/workplace/pageFillInForm?'
            },

            init:function () {
                this.render();
                this.bindEvents();
            },

            selectedStationInfo:'',

            getContent:function (callback) {

                var data = $.extend({},wrap.getHiddenData(),{Date:Date});
                callback(data);
            },

            loadList:function () {
                var errMsg = '无法加载页面，请稍后再试';
                request({
                    url: wrap.urls.getWorkplaceList,
                    data: wrap.getParams(),
                    success: function (data) {
                        if (data) {
                            $(wrap.areas[4]).html(tpl('workplaceList',$.extend(data,{JSON:JSON})));

                        } else {
                            wu.topTips(errMsg);
                        }
                    },
                    error: function (err) {
                        wu.topTips(err || errMsg)
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

            data2Dom:function (data) {
                this.$container.prepend(tpl('index',data));

                wrap.loadList();
                wrap.listExist();

            },

            getHiddenData:function () {
                //type为hidden的input节点值的object
                return {
                    space_id:$('#space_id').val().trim(),
                    space_name:$('#space_name').val().trim(),
                    space_banner_url:$('#space_banner_url').val().trim(),
                    space_address:$('#space_address').val().trim(),
                    current_date:$('#current_date').val().trim()
                }
            },

            getParams:function () {
                //传给接口的数据
                // var $startDate = $(wrap.areas[0]);
                // var start_date = ($startDate&&$startDate.length)?$startDate.val().trim():wrap.getHiddenData().current_date;
                // var startDate = $(wrap.areas[0]).val().trim();

                // var $monthLength = $(wrap.areas[1]);
                // var month_length = ($monthLength&&$monthLength.length)?$monthLength.val().trim():1;
                // var monthLength = $(wrap.areas[1]).val().trim();

                return {
                    space_id:wrap.getHiddenData().space_id,
                    start_date:$(wrap.areas[0]).val().trim(),
                    month_length:$(wrap.areas[1]).val().trim()
                }
            },


            render:function () {

                this.getContent(this.data2Dom.bind(this));

            },
            slider: function () {
                var slider = mui("#slider");
                slider.slider({
                    interval: 0
                });
            },

            bindEvents:function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent,'.j-item',function(){

                    var info = null;
                    var $this = $(this);
                    var $popup = $(wrap.areas[2]);
                    var isPopupHide = $popup.hasClass('none');
                    var dataInfo = $this.data('info');
                    try{
                        info = 'string'===dataInfo?JSON.parse(dataInfo):dataInfo;
                        wrap.selectedStationInfo = info;
                    }catch (e)
                    {
                        info = null;
                    }
                    if(info && isPopupHide){
                        $popup
                            .html(tpl('popup',info))
                            .removeClass('none');
                        wrap.slider();
                    }else{
                        wu.topTips('无法加载页面，请稍后再试');
                    }

                });

                $container.on(beatEvent,wrap.areas[3],function () {
                    $(wrap.areas[2]).addClass('none');
                });

                $container.on('change',wrap.areas[0]+','+wrap.areas[1],function () {
                    wrap.loadList();
                });

                $container.on(beatEvent,'#order',function () {
                    window.location.href = wrap.urls.pageFillInForm+str.obj2query({
                        workplace_id:wrap.selectedStationInfo.id,
                        start_date:$(wrap.areas[0]).val().trim(),
                        month_length:$(wrap.areas[1]).val().trim(),
                        is_continue:0
                    })
                });
            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g,window.str_g);//声明外部依赖



});