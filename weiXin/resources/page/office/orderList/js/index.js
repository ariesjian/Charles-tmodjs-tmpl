;$(document).ready(function () {

    !(function ($, request, tpl, wu) {
        var wrap = {
            $container: $('body'),
            areas: [],//id需要唯一
            urls: {
                'myOfficeList': '/index.php/index/office/getOfficeOrderList'/*,
                'checkIfOrderCanContinue': '/index.php/index/office/checkIfOrderCanContinue'*/
            },
            init: function () {
                this.render();
                this.bindEvents();
            },
            getContent: function (callback) {
                var self = this;
                request({
                    url: self.urls.myOfficeList,
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
              /*  $container.on(beatEvent, '.xuzu', function () {  //查看详情
                    var order_id = $(this).next(".orderId").val().trim() - 0;
                    var office_id = $(this).next().next(".office_id").val().trim() - 0;
                    var start_date = $(this).next().next().next(".start_date").val().trim();
                    var end_date = $(this).next().next().next().next(".end_date").val();
                    var contact_name = $(this).next().next().next().next().next(".contact_name").val();
                    var contact_mobile = $(this).next().next().next().next().next().next(".contact_mobile").val();
                  //获取一天后的时间
                    var arrDate=end_date.split("-");
                    var datas=new Date();
                    datas.setFullYear(arrDate[0]);
                    datas.setMonth(arrDate[1]);
                    datas.setDate(arrDate[2]);
                    var longtime=datas.getTime();
                    longtime=longtime+24*60*60*1000;//1天后的毫秒数
                    datas=new Date(longtime);
                    var newTime=datas.getFullYear()+"-"+(datas.getMonth())+"-"+datas.getDate();

                    var start = Date.parse(new Date(start_date));
                    var end = Date.parse(new Date(end_date));
                    var month_length= Math.abs(parseInt((end - start)/1000/3600/24/30));
                    request({
                        url: self.urls.checkIfOrderCanContinue,
                        data: {
                            order_id: order_id
                        },
                        type: 'get',
                        success: function (data) {
 window.location.href = "/index.php/index/office/pageFillInForm?office_id="+office_id+"&start_date="+newTime+"&month_length="+month_length+"&is_continue=1&contact_name="+contact_name+"&contact_mobile="+contact_mobile;
                        },
                        error: function (err) {
                            wu.toast(err);
                        }
                    })
                });*/
            }
        };
        wrap.init();
    })(Zepto, window.request_g, window.template_g, window.weui_g);//声明外部依赖
});