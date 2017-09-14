;$(document).ready(function () {

    !(function($,request,tpl,wu){

        var wrap = {

            $container:$('body'),

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
                    activity_id:$('#activity_id').val().trim(),
                    activity_name:$('#activity_name').val().trim()||'',
                    activity_address:$('#activity_address').val().trim()||'',
                    activity_start_time:$('#activity_start_time').val().trim()||'',
                    activity_end_time:$('#activity_end_time').val().trim()||'',
                    manager_id:$('#manager_id').val().trim(),
                    manager_name:$('#manager_name').val().trim()||'',
                    manager_mobile:$('#manager_mobile').val().trim()||''
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