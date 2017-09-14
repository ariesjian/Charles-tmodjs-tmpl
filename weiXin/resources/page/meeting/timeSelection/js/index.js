;$(document).ready(function () {

    !(function ($, request, tpl, wu,time) {

        var wrap = {

            $container: $('body'),

            urls: {
                'getMeetingRoomOrdersByDate': '/index.php/index/meeting/getMeetingRoomOrdersByDate',
                'checkMeetingRoomAvailable': '/index.php/index/meeting/checkMeetingRoomAvailable'
            },

            status: {
                can: 'c_room_option_select_status1',
                forbid: 'c_room_option_select_status2',
                selected: 'c_room_option_select_status3'
            },

            selectedIndexs: [],

            init: function () {
                this.render();
                this.bindEvents();
            },

            getContent: function (callback) {

                var self = this;
                var errMsg = '无法加载页面，请稍后再试';
                request({
                    url: self.urls.getMeetingRoomOrdersByDate,
                    data: wrap.getParamsOfGetMeetingRoomOrdersByDate(),
                    success: function (data) {
                        if(!data || !data.orders){
                            data = {orders:[]}
                        }
                        data.meeting_room_name = wrap.getHiddenData().meeting_room_name;
                        data.sevenDays = wrap.generateDataOf7Days();

                        callback(data);

                        wrap.renderTimeSelectOptions(data.orders,wrap.getHiddenData().current_time,wrap.getHiddenData().current_time);

                    },
                    error: function (err) {
                        callback({errMsg:errMsg})
                    }
                });

            },

            renderWhenSelectDate:function (date) {
                var self = this;
                var errMsg = '无法加载页面，请稍后再试';
                request({
                    url: self.urls.getMeetingRoomOrdersByDate,
                    data: wrap.getParamsOfGetMeetingRoomOrdersByDate(date),
                    success: function (data) {
                        if(!data || !data.orders){
                            data = {orders:[]}
                        }
                        wrap.renderTimeSelectOptions(data.orders, wrap.getHiddenData().current_time,date);
                    },
                    error: function (err) {
                        wu.topTips(err || errMsg);
                    }
                });
            },

            data2Dom: function (data) {
                this.$container.prepend(tpl('index', data));
            },

            getHiddenData: function () {
                //type为hidden的input节点值的object
                return {
                    meeting_room_id: $('#meeting_room_id').val().trim(),
                    meeting_room_name: $('#meeting_room_name').val().trim(),
                    current_time: $('#current_time').val().trim()
                }
            },

            getParamsOfGetMeetingRoomOrdersByDate: function (date) {
                //传给接口的数据
                return {
                    meeting_room_id: wrap.getHiddenData().meeting_room_id,
                    reserve_date: date||time.fullDate()
                }
            },

            getParamsOfCheckMeetingRoomAvailable: function () {

                try{

                    var selectedIndexs = wrap.selectedIndexs;
                    var len = selectedIndexs.length;
                    if(0 === len){
                        return '请先选择时间';
                    }else{
                        var date = $('.j-nav.c_room_tabselected').data('date');
                        var start_time = $('.j-time-option').eq(selectedIndexs[0]).text().split('-')[0];
                        var end_time = $('.j-time-option').eq(selectedIndexs[len-1]).text().split('-')[1];
                        var reserve_start_time = [date,start_time].join(' ').replace(/-/g,'/');
                        var reserve_end_time = [date,end_time].join(' ').replace(/-/g,'/');
                    }

                }catch(e){
                    return '提交失败，请稍后再试';
                }

                return {
                    meeting_room_id: wrap.getHiddenData().meeting_room_id,
                    reserve_start_time:reserve_start_time ,
                    reserve_end_time:reserve_end_time
                }

            },

            render: function () {

                this.getContent(this.data2Dom.bind(this));

            },

            bindEvents: function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent, '.j-submit', function () {

                    var params = wrap.getParamsOfCheckMeetingRoomAvailable();
                    if('string'===typeof params){
                        wu.topTips(params);
                    }else{
                        request({
                            url:wrap.urls.checkMeetingRoomAvailable,
                            data:params,
                            success:function (data) {
                                window.location.href = '/index.php/index/meeting/pageMeetingRoomPreOrder?' +
                                    'meeting_room_id='+wrap.getHiddenData().meeting_room_id+
                                '&meeting_room_name='+wrap.getHiddenData().meeting_room_name+
                                '&reserve_start_time='+params.reserve_start_time+
                                '&reserve_end_time='+params.reserve_end_time;
                            },
                            error:function (err) {
                                wu.topTips(err||'提交失败，请稍后再试');
                            }
                        })
                    }

                });

                $container.on(beatEvent, '.j-time-option', function () {
                    var $this = $(this);
                    var index = $this.data('index');
                    if ($this.hasClass(wrap.status.forbid)) {
                        return false;
                    } else if ($this.hasClass(wrap.status.selected)) {

                        if (index == wrap.selectedIndexs[0]) {
                            wrap.selectedIndexs.shift(index);
                            $this.removeClass(wrap.status.selected).addClass(wrap.status.can);
                        } else if (index == wrap.selectedIndexs[wrap.selectedIndexs.length - 1]) {
                            wrap.selectedIndexs.pop(index);
                            $this.removeClass(wrap.status.selected).addClass(wrap.status.can);

                        } else {
                            wu.topTips('时间需连续',1000);
                        }
                    } else {
                        if (0 === wrap.selectedIndexs.length) {
                            wrap.selectedIndexs.push(index);
                            $this.addClass(wrap.status.selected).removeClass(wrap.status.can);
                        } else if (index == wrap.selectedIndexs[0] - 1) {
                            wrap.selectedIndexs.unshift(index);
                            $this.addClass(wrap.status.selected).removeClass(wrap.status.can);
                        } else if (index == wrap.selectedIndexs[wrap.selectedIndexs.length - 1] + 1) {
                            wrap.selectedIndexs.push(index);
                            $this.addClass(wrap.status.selected).removeClass(wrap.status.can);
                        } else {
                            wu.topTips('时间需连续',1000);
                        }

                    }

                    wrap.selectedIndexs.sort(function (a, b) {
                        return a - b;
                    });

                    // window.abc = wrap.selectedIndexs;


                });

                $container.on(beatEvent,'.j-nav',function () {
                    var $this = $(this);
                    if(!$this.hasClass('c_room_tabselected')){
                        $this
                            .addClass('c_room_tabselected')
                            .siblings('.c_room_tabselected').removeClass('c_room_tabselected');
                        wrap.renderWhenSelectDate($this.data('date'));
                    }
                });
            },
            generateDataOf7Days:function () {
                var current_time = new Date();
                var weekMap=['周日','周一','周二','周三','周四','周五','周六'];
                return [0,1,2,3,4,5,6].map(function(v,i){
                    var time = new Date((+current_time)+(v*24*60*60*1000));
                    var week = weekMap[time.getDay()];
                    var month = time.getMonth()+1+'';
                    month = 1===month.length?'0'+month:month;
                    var day = time.getDate()+'';
                    day = 1===day.length?'0'+day:day;
                    var monthDay = month+'月'+day+'日';
                    return {
                        week:week,
                        monthDay:monthDay,
                        fullDate:time.getFullYear()+'-'+month+'-'+day
                    }
                })
            },
            renderTimeSelectOptions: function (orders, current_time,selectedDate) {

                function time2digit(time) {
                    var h = +(new Date(time).getHours());
                    var m = +(new Date(time).getMinutes());

                    return h + ((m >= 30) ? 0.5 : 0);
                }

                function getOrderedIndexs(orders) {
                    //已经预定了的索引集合
                    var orderedIndexs = [];

                    if (Array.isArray(orders)) {
                        orders.forEach(function (v, i) {
                            var reserve_start_time = v.reserve_start_time;
                            var reserve_end_time = v.reserve_end_time;
                            var startIndex = (time2digit(reserve_start_time) - start) / gap; //包含
                            var endIndex = (time2digit(reserve_end_time) - start) / gap - 1; //包含
                            for (var j = startIndex; j <= endIndex; j++) {
                                orderedIndexs.push(j);
                            }
                        })
                    }
                    return orderedIndexs;
                }

                function getOverTimeIndexs(current_time,selectedDate) {
                    //当天超过预定时间的索引集合
                    var overtimeIndexs = [];

                    current_time = new Date(current_time.replace(/-/g,'/'));
                    selectedDate = new Date(selectedDate.replace(/-/g,'/'));


                    if (selectedDate.getFullYear() === current_time.getFullYear() && selectedDate.getMonth() === current_time.getMonth() && selectedDate.getDate() === current_time.getDate()) {

                        //预定当天的会议室时才处理
                        var cur_hour = current_time.getHours();
                        var cur_minute = current_time.getMinutes();
                        var endIndex;

                        if (end - cur_hour <= minDuration) {
                            //当天都不能预定了
                            overtimeIndexs = allIndexs;
                        } else {
                            if (cur_minute < 30) {
                                endIndex = ((cur_hour + minDuration) - start) / gap
                            } else {
                                endIndex = ((cur_hour + minDuration + gap) - start) / gap
                            }
                            for (i = 0; i <= endIndex; i++) {
                                overtimeIndexs.push(i);
                            }
                        }

                    } else {
                        overtimeIndexs = [];
                    }

                    return overtimeIndexs;

                }

                var start = 8;//早8点
                var end = 20;//晚8点
                var gap = 0.5;
                var minDuration = 2; //提前至少2小时预定
                var allIndexs = [];//所有时间段的索引
                var i, j;
                for (i = 0; i < (end - start) / gap; i++) {
                    allIndexs.push(i);
                }

                var overTimeIndexs = getOverTimeIndexs(current_time,selectedDate);
                var orderedIndexs = getOrderedIndexs(orders);

                var canNotOrderIndexs = [];
                for (i = 0; i < overTimeIndexs.length; i++) {
                    canNotOrderIndexs.push(overTimeIndexs[i]);
                }
                for (i = 0; i < orderedIndexs.length; i++) {
                    canNotOrderIndexs.push(orderedIndexs[i]);
                }

                var $timeOption = $('.j-time-option');
                $timeOption
                    .removeClass(wrap.status.selected)
                    .removeClass(wrap.status.forbid)
                    .removeClass(wrap.status.can);
                for (i = 0; i < canNotOrderIndexs.length; i++) {
                    var v = canNotOrderIndexs[i];
                    if (!$timeOption.eq(v).hasClass(wrap.status.forbid)) {
                        $timeOption.eq(v).addClass(wrap.status.forbid);
                    }
                }
                $timeOption.not('.' + wrap.status.forbid).addClass(wrap.status.can);

                wrap.selectedIndexs = [];


            }
        };

        wrap.init();

    })(Zepto, window.request_g, window.template_g, window.weui_g,window.time_g);//声明外部依赖


});