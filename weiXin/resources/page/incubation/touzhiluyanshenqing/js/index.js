;$(document).ready(function () {

    !(function($,request,tpl,wu,validate){

        var wrap = {

            $container:$('body'),
            areas:[ '#ways','#Confirm'],
            urls: {'getInformations':'/index.php/index/roadshow/getRoadShowSelectionConfigs','commitIncubation':'/index.php/index/roadshow/commitRoadshow'},

            init:function () {
                this.render();
                this.bindEvents();
            },
            getContent:function (callback) {

                var self = this;
                //1 请求的值
                request({
                    url:self.urls.getInformations,
                    data:self.getParams(),
                    success:function (data) {
                        if(data){
                            callback(data);
                        }else{
                            wu.topTips('自定义消息内容')
                        }
                    },
                    error:function (err) {
                        wu.topTips(err||'自定义消息内容')
                    }
                });

            },
            data2Dom:function (data) {
                this.$container.prepend(tpl('index',data));
            },
            render:function () {
                this.getContent(this.data2Dom.bind(this));

            },
            getParams:function () {
                var project_manager = $('.j-project_manager').val() ;
                var project_name = $('.j-project_name').val() ;
                var contact_mobile = $('.j-contact_mobile').val() ;
                var contact_email = $('.j-contact_email').val() ;
                var financing_amount = $('.j-financing_amount').val() ;
                var financing_type_name = $('#ways').val() ;;
                var project_desc = $('.j-project_desc').val() ;
                var expective_goal = $('.j-expective_goal').val() ;
                var usage_deadline = $('.j-usage_deadline').val() ;
                var shareholdings = $('.j-shareholdings').val() ;
                if(project_manager==null){ return;}
                if(!project_manager){ return '请输入负责人名称';}
                if(!project_name){return '请输入项目名称';}
                if(!contact_mobile){return '请输入联系方式';}
                if(!contact_email){return '请输入联系邮箱';}
                if(!financing_amount){return '请输入融资额度';}
                if(!financing_type_name){return '请选择融资类型';}
                if(!project_desc){return '请输入项目概述';}
                if(!expective_goal){return '请输入预期目标';}
                if(!usage_deadline){return '请输入用途期限';}
                if(!shareholdings){return '请输入股权分配比例';}
                var check = {'mobile':contact_mobile,'email':contact_email};
                for(var k in check){
                    if(validate[k](check[k])){

                        return validate[k](check[k]);
                    }else {
                        $(this).remove(".errorShow");
                    }
                }


                return {
                    project_manager: project_manager,
                    project_name: project_name,
                    contact_mobile:contact_mobile,
                    contact_email:contact_email,
                    financing_amount: financing_amount,
                    financing_type_name: financing_type_name,
                    project_desc:project_desc,
                    expective_goal:expective_goal,
                    usage_deadline:usage_deadline,
                    shareholdings:shareholdings
                };

            },
            bindEvents:function () {
                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent,self.areas[1],function(){
                    var errMsg = '此时无法申请，请稍后再试';
                    var errMsgP = '申请失败，请稍后再试';
                    var queryData =self.getParams();
                    if ('string' === typeof queryData) {
                        wu.topTips(queryData);
                    } else {
                    request({
                        url:self.urls.commitIncubation,
                        data:queryData,
                        type:'post',
                        success:function (data) {
                            if(data){
                                var dataID = data.roadshow_id;
                                if(dataID>0){
                                    wu.toast("申请成功!");
                                    setTimeout(function () {
                                        window.location.replace("/index.php/index/roadshow/pageMemberRoadshowList");
                                    },1200);
                                }else{
                                    wu.topTips(errMsgP);
                                }
                            }else{
                                wu.topTips(errMsg);
                            }
                        },
                        error:function (err) {
                            wu.topTips(err||errMsg);
                        }
                    })}



                });
                //字数递减验证
                var beatEvents = 'keyup';//tap；  在桌面浏览器模拟不出tap
                $container.on(beatEvents,'.j-shareholdings',function(){
                    var num=  $(this).val().length;
                 /*   var maxLengt=$(this).maxlength;*/
                    if(num>=120){
                        $(this).next("span").html("最多为120字");

                    }else{
                        $(this).next("span").html(num+"/120");
                    }

                });
                $container.on(beatEvents,'.j-usage_deadline',function(){
                    var num=  $(this).val().length;
                    /*   var maxLengt=$(this).maxlength;*/
                    if(num>=120){
                        $(this).next("span").html("最多为120字");

                    }else{
                        $(this).next("span").html(num+"/120");
                    }

                });
                $container.on(beatEvents,'.j-expective_goal',function(){
                    var num=  $(this).val().length;
                    /*   var maxLengt=$(this).maxlength;*/
                    if(num>=120){
                        $(this).next("span").html("最多为120字");

                    }else{
                        $(this).next("span").html(num+"/120");
                    }

                });
                $container.on(beatEvents,'.j-project_desc',function(){
                    var num=  $(this).val().length;
                    /*   var maxLengt=$(this).maxlength;*/
                    if(num>=120){
                        $(this).next("span").html("最多为120字");

                    }else{
                        $(this).next("span").html(num+"/120");
                    }

                });


            },

        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g,window.validate_g);//声明外部依赖



});