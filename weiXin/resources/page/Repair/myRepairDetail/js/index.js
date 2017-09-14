;$(document).ready(function () {

    !(function ($, request, tpl, wu) {

        var wrap = {

            $container: $('body'),

            areas: ["#submitBtn"],

            urls: {
                'getMemberRepairDetail': '/index.php/index/convenient/getMemberRepairDetail',
                'commitRepairScore':'/index.php/index/convenient/commitRepairScore'
            },

            init: function () {
                this.render();
                this.bindEvents();
            },

            getContent: function (callback) {

                var self = this;
                request({
                    url: self.urls.getMemberRepairDetail,
                    data: self.getParamsOfGetActivityDetail(),
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

            adjustSize:function(){
            	$(".c_repaire_detailytop_img img").each(function(){
            		var H = $(this).height();
					var W = $(this).width();
					var scale = W / H;
//					alert(H+" "+W);
					//			var scale1 = 586/360;
					if(scale > 1) {
						$(this).css({
							"height": "100%",
							"width": "auto",
							"margin-left": (78 - 78 * scale) / 2
						})
					} else {
						$(this).css({
							"width": "100%",
							"height": "auto",
							"margin-top": (78 - 78 / scale) / 2
						})
					}
            	})
            },

            adjustImg:function(){
            	//缩略图预览
                wrap.$container.on('click',wrap.areas[1],function (e) {
                    var $target = $(e.target).closest('.c_repaire_detailytop_img');
                    if(0===$target.length){
                        return;
                    }
                    var url = $target.children().attr('src') || '';
                    var id = $target.index();
//                  alert(id);

//                  if (url) {
//                      url = url.match(/url\((.*?)\)/)[1].replace(/"/g, '');
//                  }

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
            },

            data2Dom: function (data) {
                this.$container.prepend(tpl('index', data));
                var that = this;
                setTimeout(function(){that.adjustSize()}, 100);
                wrap.adjustImg();
            },

            getHiddenData:function () {
                //type为hidden的input节点值的object
                return {
                    repair_id:$('#repair_id').val().trim(),
                }
            },
            getParamsOfGetActivityDetail:function () {
                //传给接口的数据
                return {
                    repair_id:this.getHiddenData().repair_id
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
                
                $container.on(beatEvent,' #submitBtn', function () {
        /*            alert("");
                   var score= $('.j-score[data-checked="1"]').data('score');*/
                   var score=0;
                    $('.j-score').each(function(){
                        var s=$(this).find(".j-img").attr("src");
                        if(s=="/static/resources/images/star1.png"){
                            score=score+1;
                        }
                    });
                    var repair_id=$("#repair_id").val()-0;
                    request({
                        url:self.urls.commitRepairScore,
                        data:{score:score,repair_id:repair_id},
                        type:'get',
                        success:function (data) {
                            wu.toast("打分成功");
                                window.location.reload("/index.php/index/convenient/pageMemberRepairs");
                           var items= $(".c_repaire_commentscore_left2").find("b");
                           items.each(function () {
                                 if($(this).hasClass(".j-score")){

                                 }
                            })
                        },
                        error:function (err) {
                            wu.topTips(err||"");
                        }
                    })
                });
                $container.on(beatEvent,' .j-score',function () {
                    var $content = $(this);
                    var $img = $content.find('.j-img');
                    var srcImg= $img.attr('src');
                    var slwected="/static/resources/images/star1.png";
                    var unselected="/static/resources/images/star2.png";
                    var score=$content.data('score')-0;
                    //这是对图片的更换
                    if(srcImg==slwected){
                        $img.attr('src',slwected);
                            $(".j-score").each(function(){
                              var ss= $(this).data('score')-0;
                              if(ss>score){
                                  $(this).find(".j-img").attr("src",unselected);
                              }
                            });
                    }else{
                        $img.attr('src',slwected);
                        $(".j-score").each(function(){
                            var ss= $(this).data('score')-0;
                            if(ss<score){
                                $(this).find(".j-img").attr("src",slwected);
                            }
                        });
                    }
                });
            }
        };

        wrap.init();

    })(Zepto, window.request_g, window.template_g, window.weui_g);//声明外部依赖


});