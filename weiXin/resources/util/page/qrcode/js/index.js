(function (request,tpl) {

    var wrap = {
        $container:$('body'),
        areas:['#QRCodeView'],
        urls:{
            'checkActivityOrderIfEnrolled':'/index.php/index/activity/checkActivityOrderIfEnrolled'
        },
        listenRecodeTimerId:null,
        init:function () {

            wrap.bindEvents();

            var $container = wrap.$container;

            window.util_page_qrcode_onShow_g = function (data) {

                /*
                activity_name
                enroll_qrcode_url
                order_id
                */

                0===$(wrap.areas[0]).length ? $container.prepend(tpl('qrcode_util',{
                    activity_name:data.activity_name,
                    enroll_qrcode_url:data.enroll_qrcode_url
                })):$(wrap.areas[0]).show();


                wrap.listenRecodeTimerId = setTimeout(listenRecord,1000);

                function listenRecord() {
                    //
                    var order_id = data.order_id;

                    request({
                        url:wrap.urls.checkActivityOrderIfEnrolled,
                        data:{order_id:order_id},
                        useLoading:0,
                        success:function (data) {
                            if(data){
                                if(1===+data.is_enrolled){
                                    var url = '/index.php/index/activity/pageMemberActivityOrderEnrollSuccess?order_id='+order_id;
                                    window.location.replace(url);
                                }else{
                                    wrap.listenRecodeTimerId = setTimeout(listenRecord,1000);
                                }
                            }else{
                                wrap.listenRecodeTimerId = setTimeout(listenRecord,1000);
                            }
                        },
                        error:function () {

                            wrap.listenRecodeTimerId = setTimeout(listenRecord,1000);
                        }
                    })
                }
            }
        },
        bindEvents:function () {
            var beatEvent = 'click';
            var self = this;
            wrap.$container.on(beatEvent,self.areas[0]+' .j-close',function () {
                $(self.areas[0]).hide();
                clearTimeout(wrap.listenRecodeTimerId);
                wrap.listenRecodeTimerId=null;
            });
        }
    };

    wrap.init();
})(window.request_g,window.template_g);