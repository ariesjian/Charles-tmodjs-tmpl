;$(document).ready(function () {

    !(function($,request,tpl,wu){

        var wrap = {

            $container:$('body'),

            urls:{
            },

            init:function () {
                this.render();
            },

            getContent:function (callback) {

                callback(this.getHiddenData());
            },

            data2Dom:function (data) {
                this.$container.prepend(tpl('index',data));
            },

            getHiddenData:function () {
                //type为hidden的input节点值的object
                return {
                    order_id:$('#order_id').val().trim(),
                    activity_id:$('#activity_id').val().trim(),
                    activity_name:$('#activity_name').val().trim()||'',
                    enroll_gain_score:$('#enroll_gain_score').val().trim()||0
                }
            },

            getParams:function () {
                //传给接口的数据
                return this.getHiddenData();
            },


            render:function () {

                this.getContent(this.data2Dom.bind(this));

            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g);//声明外部依赖



});