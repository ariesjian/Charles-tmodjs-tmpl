;$(document).ready(function () {

    !(function ($, request, tpl, wu, vld) {

        var wrap = {

            $container: $('body'),

            areas: ["#modify"],

            urls: {
                'getMemberDetail': '/index.php/index/member/getMemberDetail',
                'updateMemberBasicInfo': '/index.php/index/member/updateMemberBasicInfo'
            },

            init: function () {
                this.render();
                this.bindEvents();
                //this.focusName();
            },

            getContent: function (callback) {

                var self = this;
                request({
                    url: self.urls.getMemberDetail,
                    // data: {},
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
            render: function () {
                this.getContent(this.data2Dom.bind(this));

            },
            getParams: function () {
                var $content = $(this.areas[0]);
                var true_name = $content.find('.j-true_name').val();
                var birthday = $content.find('.j-birthday').val();
                var sex = $content.find('.j-sex[data-checked="1"]').data('sex');
                if (!true_name) {
                    return '请输入姓名';
                }
                if (!sex) {
                    return '请选择性别';
                }
                if (!birthday) {
                    return '请填写生日';
                }
                /*      var reg=/^((?:19|20)\\d\\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
                 if (!reg.test(birthday)) {
                 return "请输入正确的时间格式yyyy-mm-dd";
                 }*/
                if (vld.dateTime(birthday)) {
                    return vld.dateTime(birthday);
                }
                return {
                    true_name: true_name,
                    sex: sex,
                    birthday: birthday

                }

            },

            bindEvents: function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent, '.c_user_bindpho_btn', function () {
                    var errMsg = '此时无法修改，请稍后再试';
                    var queryData = self.getParams();
                    if ('string' === typeof queryData) {
                        wu.topTips(queryData);
                    } else {
                        request({
                            url: self.urls.updateMemberBasicInfo,
                            data: queryData,
                            type: 'post',
                            success: function (data) {
                                wu.toast("保存成功");
                                setTimeout(function () {
                                    window.location.replace("/index.php/index/member/pageMemberIndex");
                                },1200);

                            },
                            error: function (err) {
                                wu.topTips(err || errMsg);
                            }
                        })
                    }
                });
                $container.on(beatEvent, ' .j-sex', function () {
                    var $content = $(this);
                    if (1 === +$content.data('checked')) {
                        return false;
                    }
                    var $sibling = $content.siblings('.j-sex');
                    $sibling.data('checked', 0);
                    $content.data('checked', 1);

                    var $img = $content.find('.j-img');
                    var $siblingImg = $sibling.find('.j-img');
                    var siblingImg = $siblingImg.prop('src');
                    $siblingImg.prop('src', $img.prop('src'));
                    $img.prop('src', siblingImg);

                });
                $container.on(beatEvent, '#showDatePicker', function () {
                    weui.datePicker({
                        start: 1990,
                        end: new Date().getFullYear(),
                        onChange: function (result) {
                            console.log(JSON.stringify(result));
                        },
                        onConfirm: function (result) {
                            console.log(JSON.stringify(result));
                            var y = result[0].value;
                            var m = result[1].value;
                            var d = result[2].value;
                            console.log("y:" + y + ",m:" + m + ",d:" + d);
                            $("#showDatePicker").val(y + "-" + m + "-" + d);
                        }
                    })
                });
            }
        };

        wrap.init();

    })(Zepto, window.request_g, window.template_g, window.weui_g, window.validate_g);//声明外部依赖


});