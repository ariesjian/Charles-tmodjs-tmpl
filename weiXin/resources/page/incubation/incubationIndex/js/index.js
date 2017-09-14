;$(document).ready(function () {

    !(function($,request,tpl,wu,vld){

        var wrap = {

            $container:$('body'),
            areas:[ '#nature','#technique','#Confirm'],
            urls: {'getInformations':'/index.php/index/incubation/getIncubationSelectionConfigs','commitIncubation':'/index.php/index/incubation/commitIncubation'},

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
                            wu.toast('自定义消息内容')
                        }
                    },
                    error:function (err) {
                        wu.toast(err||'自定义消息内容')
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
               var company_name = $('.j-company_name').val() ;
                var project_name = $('.j-project_name').val() ;
                var company_register_date = $('.j-company_register_date').val() ;
                var company_register_address = $('.j-company_register_address').val() ;
                var office_address = $('.j-office_address').val() ;
               var company_nature_name = $('#nature').val() ;
               var technique_field_name = $('#technique').val() ;
                var register_capital = $('.j-register_capital').val() ;
                var employee_count = $('.j-employee_count').val() ;
                var business_licence = $('.j-business_licence').val() ;
                var contact_name = $('.j-contact_name').val() ;
                var contact_mobile = $('.j-contact_mobile').val() ;
                var contact_email = $('.j-contact_email').val() ;
                var company_business_scope = $('.j-company_business_scope').val() ;
                var company_desc = $('.j-company_desc').val() ;
                if(company_name == null){return ;}
                if(!company_name){ return '请输入公司名称';}
                if(!project_name){ return '请输入项目名称';}
                if(!company_register_date){ return '请输入企业注册时间';}
                if(!company_register_address){ return '请输入注册地址';}
                if(!office_address){ return '请输入办公地址';}
              if(!company_nature_name){ return '请选择企业性质';}
              if(!technique_field_name){ return '请选择技术领域';}
                if(!register_capital){ return '请输入注册资本';}  //TODO 正则验证整数,单位万
                if(!employee_count){return '请输入员工人数';}  //TODO   正则验证整数,单位人
                if(!contact_name){ return '请输入联系人姓名';}
                if(!contact_mobile){ return '请输入联系方式';}
                if(!contact_email){ return '请输入联系邮箱';}
                if(!company_business_scope){ return '请输入企业经营范围';}
                if(!company_desc){ return '请输入公司介绍';}
                if(vld.name(company_name)){
                    return vld.name(company_name);
                }
                if(vld.mobile(contact_mobile)){
                    return vld.mobile(contact_mobile);
                }
                if(vld.email(contact_email)){
                    return vld.email(contact_email);
                }
                if(vld.dateTime(company_register_date)){
                    return vld.dateTime(company_register_date);
                }
               return {
                    company_name: company_name,
                    project_name: project_name,
                    company_register_date: company_register_date,
                    company_register_address: company_register_address,
                    office_address: office_address,
                    company_nature_name:company_nature_name,
                     technique_field_name:technique_field_name,
                      register_capital:register_capital,
                     employee_count:employee_count,
                     business_licence:business_licence ||'',
                     contact_name:contact_name,
                     contact_mobile:contact_mobile,
                     contact_email:contact_email,
                     company_business_scope:company_business_scope,
                     company_desc:company_desc
               };

            },
            bindEvents:function () {
                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent,self.areas[2],function(){
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
                                var dataID = data.incubation_id;
                                if(dataID>0){
                                    wu.toast("申请成功!");

                                    setTimeout(function () {
                                        window.location.replace("/index.php/index/incubation/pageMemberIncubationList");
                                    },1500);

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
                $container.on(beatEvents,'.j-company_business_scope',function(){
                    var num=  $(this).val().length;
                    /*   var maxLengt=$(this).maxlength;*/
                    if(num>=120){
                        $(this).next("span").html("最多为120字");

                    }else{
                        $(this).next("span").html(num+"/120");
                    }

                });
                $container.on(beatEvents,'.j-company_desc',function(){
                    var num=  $(this).val().length;
                    /*   var maxLengt=$(this).maxlength;*/
                    if(num>=120){
                        $(this).next("span").html("最多为120字");

                    }else{
                        $(this).next("span").html(num+"/120");
                    }

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

    })(Zepto,window.request_g,window.template_g,window.weui_g,window.validate_g);//声明外部依赖



});