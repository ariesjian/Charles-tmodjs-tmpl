;$(document).ready(function () {

    !(function ($, request, tpl, async, wu) {

        var wrap = {

            $container: $('body'),

            areas: ["#content", "#list"],//id需要唯一

            urls: {
                'getServiceSecondCategoryList': '/index.php/index/service_system/getServiceMerchantList',
                'getAllServiceCategories': '/index.php/index/service_system/getAllServiceCategories'
            },
            init: function () {
                this.render();
                this.bindEvents();
            },

            getContent: function () {

                var self = this;
                return request({
                    url: self.urls.getServiceSecondCategoryList,
                    data: self.getParamsOfGetActivityDetail(),
                    useAsync: true

                });
            },
            getContentList: function () {

                var self = this;
                return request({
                    url: self.urls.getAllServiceCategories,
                    useAsync: true
                });
            },
            getHiddenData: function () {
                //type为hidden的input节点值的object
                return {
                    second_category_id: $('#second_category_id').val().trim(),
                    first_category_id: $('#first_category_id').val()
                }
            },
            getParamsOfGetActivityDetail: function () {
                //传给接口的数据
                return {
                    second_category_id: $('#second_category_id').val(),
                    first_category_id:$('#first_category_id').val()
                }
            },
            render: function () {
                var self = this;
                var cbs = {
                    'cont': self.getContent(),
                    'lists': self.getContentList()
                };
                async.parallel(cbs, function (error, results) {
                    wrap.$container.prepend(tpl('index'));//不写在php中，为了开发体验，修改后，通过代理，立即生效
                    $("#content").html(tpl('content', {data: results}));
                    $("#list").html(tpl('list', {data: results}));
                    var first_category_id = wrap.getHiddenData().first_category_id;
                    var firstClck=$(".c_service_selectlist_left_option[ data-id_first='" + first_category_id + "']");
                    firstClck.click();
                   var indexFirst =firstClck.index();
                    $(".c_service_selectlist_right_option[ data-id='0']").eq(indexFirst).click();
                });

            },
            bindEvents: function () {
                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent, ' #items', function () {

                    $("#list").parent(".c_service_selectlist ").toggleClass("none");
                });
                $container.on(beatEvent, ' .c_service_selectlist_left_option', function () {
                    var indexs = $(this).index();
                    if ($(this).hasClass("c_service_selectlist_left_option_selected")) {
                        return;
                    } else {
                        $(".c_service_selectlist_left_option").removeClass("c_service_selectlist_left_option_selected");
                        $(this).addClass("c_service_selectlist_left_option_selected");
                        $(".j-levelTwo").addClass("none").eq(indexs).removeClass("none");
                   /*     var server_name=$(this).data("server_name").trim();
                        $("#navText").text(server_name);*/

                    }
                });
                $container.on(beatEvent, ' .c_service_selectlist_right_option', function () {
                    if ($(this).hasClass("c_service_selectlist_right_option_selected")) {
                        var first_category_id =$(".c_service_selectlist_left_option_selected").data("id_first");
                        //点击二级菜单改变导航栏内容
                        var server_name= $(".c_service_selectlist_left_option[ data-id_first='" + first_category_id + "']").data("server_name");
                        $("#navText").text(server_name);
                        return;
                    } else {
                        $("#list").parent(".c_service_selectlist ").addClass("none");
                        $(".c_service_selectlist_right_option").removeClass("c_service_selectlist_right_option_selected");
                        $(this).addClass("c_service_selectlist_right_option_selected");
                        var secondId = $(this).data("id") - 0;
                        var first_category_id =$(".c_service_selectlist_left_option_selected").data("id_first");
                        //点击二级菜单改变导航栏内容
                        var server_name= $(".c_service_selectlist_left_option[ data-id_first='" + first_category_id + "']").data("server_name");
                        $("#navText").text(server_name);
                        request({
                            url: wrap.urls.getServiceSecondCategoryList,
                            data: {second_category_id: secondId, first_category_id: first_category_id},
                            success: function (data) {
                                if (data) {
                                    $("#content").html(tpl('content', {data: {cont: data}}));
                                    $("#list").parent(".c_service_selectlist ").addClass("none");
                                } else {
                                }
                            },
                            error: function (err) {
                                wu.topTips(err || '自定义消息内容')
                            }
                        });

                    }
                });
            }
        };

        wrap.init();

    })(Zepto, window.request_g, window.template_g, async, window.weui_g);//声明外部依赖


});