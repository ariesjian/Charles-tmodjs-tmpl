;$(document).ready(function () {

    !(function ($, request, tpl, wu) {

        var wrap = {

            $container: $('body'),

            areas: ["#submitBtn"],

            urls: {
                'getMemberRepairs': '/index.php/index/convenient/getMemberRepairs'
            },

            init: function () {
                this.render();
                this.bindEvents();
            },

            getContent: function (callback) {

                var self = this;
                request({
                    url: self.urls.getMemberRepairs,
                    data: self.getParams(),
                    success: function (data) {
                        if (data) {
                            callback(data);
                        } else {

                        }
                    },
                    error: function (err) {
                        wu.topTips(err || '自定义消息内容')
                    }
                });
            },

            data2Dom: function (data) {
                this.$container.prepend(tpl('index', data));
            },


            getParams: function () {

            },


            render: function () {
                this.getContent(this.data2Dom.bind(this));

            },

            bindEvents: function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent, self.areas[0], function () {


                });
            }
        };

        wrap.init();

    })(Zepto, window.request_g, window.template_g, window.weui_g);//声明外部依赖


});