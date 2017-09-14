/**
 * Created by jack on 2017/6/26.
 */
;$(document).ready(function () {

    !(function ($, request, tpl, wu, vld) {

        var wrap = {

            $container: $('body'),
            picList: [],

            init: function () {
                this.render();
                this.slider();
                this.bindEvents();
            },
            urls: {
                'getIndexBanners': '/index.php/index/index/getIndexBanners'
            },
            render: function () {
                this.$container.prepend(tpl('index'));
            },

            slider: function () {
                var a = 18 / 33;
                var width = window.screen.width;
                $(".iSlider-effect").height(a * width);
                var picLists = [];
                request({
                    url: this.urls.getIndexBanners,
                    useLoading: 0,
                    success: function (data) {
                        /*    console.log(JSON.stringify(data));*/
                        var datas = data.banners;
                        for (var i = 0; i < datas.length; i++) {
                            var d = datas[i];
                            var id = d.id;
                            var content = d.banner_url;
                            var link = d.link;
                            var obj = {id: id, content: content, link: link, width: 150, height: 207};
                            picLists.push(obj);
                        }
                        var islider1 = new iSlider({
                            data: picLists,
                            dom: document.getElementById("animation-effect"),
                            duration: 3000,
                            animateType: 'depth',
                            isAutoplay: true,
                            isLooping: true
                            // isVertical: true, 是否垂直滚动
                        });
                        islider1.bindMouse();
                    },
                    error: function () {

                    }
                });
            },
            bindEvents: function () {

                //所有事件必须绑定在$container上
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent, '#animation-effect ul li ', function () {
                 var thisImg =$(this).find("img").attr("src");
                    request({
                        url:'/index.php/index/index/getIndexBanners',
                        useLoading: 0,
                        success: function (data) {
                            var datas = data.banners;
                            for (var i = 0; i < datas.length; i++) {
                                var d = datas[i];
                                var link = d.link;
                                var img=d.banner_url;
                                if(thisImg==img){
                                if (!link || link == "") {
                                    return;
                                }else{
                                    window.location.href=link;
                                    return;
                                }
                                }
                            }
                        }
                    })
                });
            }
        };
        wrap.init();

    })(Zepto, window.request_g, window.template_g, window.weui_g, window.validate_g);//声明外部依赖

});
