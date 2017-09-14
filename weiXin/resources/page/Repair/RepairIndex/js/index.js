;$(document).ready(function () {

    !(function($,request,tpl,wu,weui,vld){

        var wrap = {

            $container:$('body'),

            areas:["#submitBtn",'#uploaderFiles','#uploader'],

            urls:{
                'getPropertySelections':'/index.php/index/convenient/getPropertySelections',
                "commitRepair":"/index.php/index/convenient/commitRepair",
                'uploadWithCrop':'/index.php/index/upload/uploadWithCrop?filename=fileInput'
            },

            uploadedImages:[],

            init:function () {
                this.render();
            },

            getContent:function (data2domCallback,afterRenderCallback) {

                var self = this;
                request({
                    url:self.urls.getPropertySelections,
                    data:self.getParams(),
                    success:function (data) {
                        if(data){
                            data2domCallback(data);
                            afterRenderCallback();
                        }else{

                        }
                    },
                    error:function (err) {
                        wu.topTips(err||'自定义消息内容')
                    }
                });
            },

            data2Dom:function (data) {

                wrap.$container.prepend(tpl('index',data));

            },
            getParams:function () {

              /*  var imgs =JSON.stringify(wrap.uploadedImages);*/
              var imgsarr=wrap.uploadedImages;
              var newArrImgs=[];
                $.each(imgsarr, function(key, val) {
                    newArrImgs.push( val.url);
                });
                var imgs=newArrImgs;
                var property_company_id = $('#j-property_company_id').val() ;
                var address = $('.j-address').val() ;
                var contact_name = $('.j-contact_name').val() ;
                var contact_mobile = $('.j-contact_mobile').val() ;
                var repair_detail = $('.j-repair_detail').val() ;

                if(!imgs.length){return '请上传图片';}
                if(!property_company_id){return '请选择所属物业';}
                if(!address){return '请填写地址';}
                if(!contact_name){return '请输入联系人';}
                if(!contact_mobile){return '请输入联系方式';}
                if(!repair_detail){return '请填写报修详情';}
                if (vld.mobile(contact_mobile)) {

                    return vld.mobile(contact_mobile);
                }
                return {
                    imgs: imgs,
                    property_company_id: property_company_id,
                    address: address,
                    contact_name: contact_name,
                    contact_mobile:contact_mobile,
                    repair_detail:repair_detail
                };

            },


            render:function () {

                this.getContent(this.data2Dom,this.afterRender);

            },

            afterRender:function () {
                wrap.bindEvents();
                wrap.uploadInit();
            },

            bindEvents:function () {

                //所有事件必须绑定在$container上
                var self = this;
                var beatEvent = 'click';//tap；  在桌面浏览器模拟不出tap
                var $container = this.$container;
                $container.on(beatEvent,self.areas[0],function(){
                    var errMsg = '此时无法提交，请稍后再试';
                    var errMsgP = '提交失败，请稍后再试';
                    var queryData =self.getParams();
                    if ('string' === typeof queryData) {
                        wu.topTips(queryData);
                    } else {
                    request({
                        url:self.urls.commitRepair,
                        data:queryData,
                        type:'post',
                        success:function (data) {
                            if(data){
                                var dataID = data.repair_id;
                                if(dataID>0){
                                    wu.toast("提交成功!");
                                    setTimeout(function () {
                                        window.location.replace("/index.php/index/convenient/pageMemberRepairs");
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
                $container.on('keyup','.j-repair_detail',function(){
                    var num=  $(this).val().length;
                    /*   var maxLengt=$(this).maxlength;*/
                    if(num>=120){
                        $(this).next("span").html("最多为120字");

                    }else{
                        $(this).next("span").html(num+"/120");
                    }

                });

            },

            uploadInit:function () {
                /* 图片自动上传 */
                var maxNum = 10;
                weui.uploader(wrap.areas[2], {
                    url: wrap.urls.uploadWithCrop,
                    auto: true,
                    type: 'file',
                    fileVal: 'fileInput',
                    compress: {
                        width: 1600,
                        height: 1600,
                        quality: .8
                    },
                    onBeforeQueued: function(files) {
                        if (["image/jpg", "image/jpeg", "image/png", "image/gif"].indexOf(this.type) < 0) {
                            weui.alert('请上传图片（格式：jpg/jpeg/png/gif）');
                            return false;
                        }
                        if (this.size > 5 * 1024 * 1024) {
                            weui.alert('请上传不超过5M的图片');
                            return false;
                        }
                        if (files.length > maxNum) {
                            weui.alert('最多只能上传'+maxNum+'张图片，请重新选择');
                            return false;
                        }
                        if (wrap.uploadedImages.length >= maxNum) {
                            weui.alert('最多只能上传'+maxNum+'张图片');
                            return false;
                        }
                    },
                    onSuccess: function(ret) {
                        wrap.uploadedImages.push({
                            id:this.id,
                            url:ret.data.url
                        })
                    },
                    onError: function(err) {
                        wu.toast('string'===typeof err?err:'上传图片时出错了');
                    }
                });

                //缩略图预览
                wrap.$container.on('click',wrap.areas[1],function (e) {
                    var $target = $(e.target).closest('.weui-uploader__file');
                    if(0===$target.length){
                        return;
                    }
                    var url = $target.attr('style') || '';
                    var id = $target.data('id');

                    if (url) {
                        url = url.match(/url\((.*?)\)/)[1].replace(/"/g, '');
                    }

                    var gallery = weui.gallery(url, {
                        onDelete: function() {
                            weui.confirm('确定删除该图片？', function () {
                                for (var i = 0, len = wrap.uploadedImages.length; i < len; ++i) {
                                    var img = wrap.uploadedImages[i];
                                    if (img.id == id) {
                                        wrap.uploadedImages.splice(i,1);
                                        break;
                                    }
                                }
                                $target.remove();
                                gallery.hide();
                            });
                        }
                    })
                })
            }
        };

        wrap.init();

    })(Zepto,window.request_g,window.template_g,window.weui_g,window.weui,window.validate_g);//声明外部依赖



});