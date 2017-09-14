;$(document).ready(function () {

    !(function ($, request, tpl, wu) {

        var wrap = {

            $container: $('body'),

            areas: ['#Questions'],//id需要唯一

            urls: {
                'getActivityOrderQuestions': '/index.php/index/activity/getActivityOrderQuestions',
                'answerActivityOrderQuestions': '/index.php/index/activity/answerActivityOrderQuestions'
            },

            init: function () {
                this.render();
                this.bindEvents();
            },

            getContent: function (callback) {

                var self = this;
                //1
                var errMsg = '获取问题列表时出错了';
                request({
                    url: self.urls.getActivityOrderQuestions,
                    data: wrap.getParamsOfGetActivityOrderQuestions(),
                    success: function (data) {
                        if (data) {
                            callback(data);
                        } else {
                            wu.topTips(errMsg);
                        }
                    },
                    error: function (err) {
                        wu.topTips(err || errMsg)
                    }
                });

            },

            data2Dom: function (data) {
                this.$container.prepend(tpl('index', data));
            },

            getHiddenData: function () {
                //type为hidden的input节点值的object
                return {

                    order_id: $('#order_id').val().trim()
                }
            },

            getParamsOfGetActivityOrderQuestions: function () {
                //传给接口的数据
                return this.getHiddenData();
            },

            getParamsOfAnswerActivityOrderQuestions: function () {

                var $Questions = $(wrap.areas[0]);

                var answers = [];
                var $type1 = $Questions.find('.j-name-1');
                var $type2 = $Questions.find('.j-name-2');
                var $type3 = $Questions.find('.j-name-3');
                $type1.each(function (i, v) {
                    var t1 = {
                        type: 1,
                        name: $(v).data('name'),
                        details: []
                    };
                    var $options = $Questions.find('.j-type-1').eq(i);

                    $options.find('.j-single-option').each(function (index, value) {
                        t1.details.push({
                            title: $(value).find('.j-text').text().trim(),
                            selected: $(value).find('.c-show').data('img')
                        })
                    });

                    answers.push(t1);

                });

                $type2.each(function (i, v) {
                    var t2 = {
                        type: 2,
                        name: $(v).data('name'),
                        details: []
                    };
                    var $options = $Questions.find('.j-type-2').eq(i);

                    $options.find('.j-multi-option').each(function (index, value) {
                        t2.details.push({
                            title: $(value).text().trim(),
                            selected: $(value).hasClass('c-selected') ? 1 : 0
                        })
                    });

                    answers.push(t2);

                });

                $type3.each(function (i, v) {
                    var t3 = {
                        type: 3,
                        name: $(v).data('name'),
                        details: ''
                    };
                    var $options = $Questions.find('.j-type-3').eq(i);

                    $options.find('.j-text-3').each(function (index, value) {
                        t3.details = $(value).val().trim();
                    });

                    answers.push(t3);

                });

                return {
                    order_id: wrap.getHiddenData().order_id,
                    answers: answers
                }

            },

            render: function () {

                this.getContent(this.data2Dom.bind(this));

            },

            onSubmit: function (e) {

                var params = wrap.getParamsOfAnswerActivityOrderQuestions();
                var answers = params.answers||[];
                for(var i=0;i<answers.length;i++){
                    var v = answers[i];
                    var type = v.type;
                    var details = v.details;
                    if (2 == type) {
                        if (-1 === details.findIndex(function (value, index) {
                                return 1==value.selected
                            })) {
                            return wu.topTips('请回答第' + (i + 1) + '题');
                        }
                    } else if (3 == type) {
                        if (!details) {
                            return wu.topTips('请回答第' + (i + 1) + '题');
                        }
                    }
                }

                var errMsg = '无法提交，请稍后再试';

                request({
                    url: wrap.urls.answerActivityOrderQuestions,
                    type: 'post',
                    data: params,
                    success: function (data) {
                        if (data && data.gain_score) {
                            wu.toast('恭喜获得' + data.gain_score + '积分。即将跳转');
                        } else {
                            wu.toast('提交成功，请稍后查询积分。即将跳转');
                        }
                        setTimeout(function () {
                            window.location.replace('/index.php/index/activity/pageMemberActivityOrderDetail?order_id=' + wrap.getHiddenData().order_id);
                        }, 1500);
                    },
                    error: function (err) {
                        wu.topTips(err || errMsg);
                    }

                });


            },

            bindEvents: function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent, wrap.areas[0] + ' .j-single-option', function () {
                    var $this = $(this);
                    var $siblings = $this.siblings('.j-single-option');
                    if (!$this.hasClass('c-show')) {
                        $this.find('[data-img="0"]').removeClass('c-show');
                        $this.find('[data-img="1"]').addClass('c-show');
                        $siblings.find('[data-img="0"]').addClass('c-show');
                        $siblings.find('[data-img="1"]').removeClass('c-show');
                    }
                });

                $container.on(beatEvent, wrap.areas[0] + ' .j-multi-option', function () {
                    var $this = $(this);
                    $this.toggleClass('c-selected');
                });

                $container.on(beatEvent, wrap.areas[0] + ' .j-submit', wrap.onSubmit);
            }
        };

        wrap.init();

    })(Zepto, window.request_g, window.template_g, window.weui_g);//声明外部依赖


});