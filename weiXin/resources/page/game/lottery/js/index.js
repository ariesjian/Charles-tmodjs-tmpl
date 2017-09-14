;$(document).ready(function () {

    !(function ($, request, tpl, wu, vld) {

        var wrap = {

            $container: $('body'),

            areas: ['#id名'],//id需要唯一

            urls: {
                'getAwardsCfg': '/index.php/index/game/getAwardsCfg',
                'getAward': '/index.php/index/game/getAward'
            },


            turnplate: {
                awards:[],
                awardNames: [],				//大转盘奖品名称
                colors: ["#FFFFFF", "#5fcbd5", "#FFFFFF", "#5fcbd5", "#FFFFFF", "#5fcbd5", "#FFFFFF", "#5fcbd5"],//大转盘奖品区块对应背景颜色
                outsideRadius: 192,			//大转盘外圆的半径
                textRadius: 155,				//大转盘奖品位置距离圆心的距离
                insideRadius: 68,			//大转盘内圆的半径
                startAngle: 0,				//开始角度
                bRotate: false				//false:停止;ture:旋转
            },

            init: function () {


                this.render();


            },

            drawRouletteWheel: function () {
                var turnplate = wrap.turnplate;
                var canvas = document.getElementById("wheelcanvas");
                if (canvas.getContext) {
                    //根据奖品个数计算圆周角度
                    var arc = Math.PI / (turnplate.awardNames.length / 2);
                    var ctx = canvas.getContext("2d");
                    //在给定矩形内清空一个矩形
                    ctx.clearRect(0, 0, 422, 422);
                    //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
                    ctx.strokeStyle = "#FFBE04";
                    //font 属性设置或返回画布上文本内容的当前字体属性
                    ctx.font = 'bold 14px Microsoft YaHei';
                    for (var i = 0; i < turnplate.awardNames.length; i++) {

                        var angle = turnplate.startAngle + i * arc;
                        ctx.fillStyle = turnplate.colors[i];
                        ctx.beginPath();
                        //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
                        ctx.arc(211, 211, turnplate.outsideRadius, angle, angle + arc, false);
                        ctx.arc(211, 211, turnplate.insideRadius, angle + arc, angle, true);
                        ctx.stroke();
                        ctx.fill();
                        //锁画布(为了保存之前的画布状态)
                        ctx.save();

                        //改变画布文字颜色
                        var b = i + 2;
                        if (b % 2) {
                            ctx.fillStyle = "#FFFFFF";
                        } else {
                            ctx.fillStyle = "#E5302F";
                        }

                        //----绘制奖品开始----
                        var text = turnplate.awardNames[i];
                        var line_height = 17;
                        //translate方法重新映射画布上的 (0,0) 位置
                        ctx.translate(211 + Math.cos(angle + arc / 2) * turnplate.textRadius, 211 + Math.sin(angle + arc / 2) * turnplate.textRadius);

                        //rotate方法旋转当前的绘图
                        ctx.rotate(angle + arc / 2 + Math.PI / 2);

                        /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
                        if (text.indexOf("盘")-0 > 0) {//判断字符进行换行
                            var texts = text.split("盘");
                            for (var j = 0; j < texts.length; j++) {
                                ctx.font = j == 0 ? 'bold 16px Microsoft YaHei' : 'bold 14px Microsoft YaHei';
                                if (j == 0) {
                                    ctx.fillText(texts[j] + "盘", -ctx.measureText(texts[j] + "盘").width / 2, j * line_height);
                                } else {
                                    ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height * 1.2); //调整行间距
                                }
                            }
                        } else if (text.indexOf("盘") == -1 && text.length > 8) {//奖品名称长度超过一定范围
                            text = text.substring(0, 8) + "||" + text.substring(8);
                            var texts = text.split("||");
                            for (var j = 0; j < texts.length; j++) {
                                ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
                            }
                        } else {

                            //在画布上绘制填色的文本。文本的默认颜色是黑色

                            //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
                            ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
                        }

                        //添加对应图标
                        var dxdyMap = [
                            {dx: -35, dy: 20},
                            {dx: -35, dy: 20},
                            {dx: -25, dy: 35},
                            {dx: -35, dy: 20},
                            {dx: -30, dy: 20},
                            {dx: -35, dy: 20},
                            {dx: -30, dy: 20},
                            {dx: -35, dy: 20}
                        ];

                        for (var index = 0; index < turnplate.awardNames.length; index++) {

                            if (text.indexOf(turnplate.awardNames[index]) >= 0) {
                                // alert(index)

                                var $img = $("#img" + index);
                                var img = $img[0];
                                var src = $img.prop('src').toLowerCase();
                                if(src.indexOf('.png')!==-1 || src.indexOf('.jpg')!==-1||src.indexOf('.jpeg')!==-1){
                                    img.onload = function () {
                                        ctx.drawImage(img, dxdyMap[index].dx, dxdyMap[index].dy,50,50);
                                    };
                                    ctx.drawImage(img, dxdyMap[index].dx, dxdyMap[index].dy,50,50);
                                }

                            }

                        }

                        //把当前画布返回（调整）到上一个save()状态之前
                        ctx.restore();
                        //----绘制奖品结束----


                    }
                }
            },

            getContent: function (callback) {

                var errMsg = '还没有抽奖，快去抽奖吧';
                request({
                    url: wrap.urls.getAwardsCfg,
                    async: 0,
                    success: function (data) {
                        if (data && data.awards && data.awards.length) {
                            wrap.turnplate.awardNames = data.awards.map(function (v) {
                                return v.name
                            });
                            wrap.turnplate.awards = data.awards;
                            callback(data);
                        } else {
                            callback({errMsg: errMsg});
                        }
                    },
                    error: function (err) {
                        callback({errMsg: err || errMsg});
                    }
                });


            },

            data2Dom: function (data) {


                wrap.$container.prepend(tpl('index', data));

                if (!(data.errMsg)) {
                    //页面所有元素加载完毕后执行drawRouletteWheel()方法对转盘进行渲染
                    window.onload = function () {

                        wrap.drawRouletteWheel();

                    };

                    wrap.bindEvents();
                }


            },

            render: function () {

                this.getContent(this.data2Dom.bind(this));

            },

            bindEvents: function () {

                var turnplate = wrap.turnplate;


                //动态添加大转盘的奖品与奖品区域背景颜色
                // turnplate.awardNames = ["碧根果一袋", "年货红包", "水果拼盘300元月卡", "2元现金红包", "夏威夷果一袋", "3元现金红包", "松子一袋 ", "5元现金红包"];


                var rotateTimeOut = function () {
                    $('#wheelcanvas').rotate({
                        angle: 0,
                        animateTo: 2160,
                        duration: 8000,
                        callback: function () {
                            wu.topTips('网络超时，请检查您的网络设置！');
                        }
                    });
                };

                //旋转转盘 item:奖品位置; txt：提示语;
                var rotateFn = function (item, txt,prizeId) {
                    var angles = item * (360 / turnplate.awardNames.length) - (360 / (turnplate.awardNames.length * 2));
                    if (angles < 270) {
                        angles = 270 - angles;
                    } else {
                        angles = 360 - angles + 270;
                    }
                    $('#wheelcanvas').stopRotate();
                    $('#wheelcanvas').rotate({
                        angle: 0,
                        animateTo: angles + 1800,
                        duration: 8000,
                        callback: function () {	//回调
                            if(0==prizeId){
                                wu.toast('谢谢参与');
                            }else{
                                wu.toast('恭喜中奖：'+txt);
                            }
                            turnplate.bRotate = false;

                        }
                    });
                };

                $('#pointer').click(function () {

                    if (turnplate.bRotate) return;
                    turnplate.bRotate = true;

                    var errMsg = '无法抽奖，请稍后再试';
                    request({
                        url: wrap.urls.getAward,
                        useLoading:0,
                        success: function (data) {
                            var prizeId = data||0;
                            var item = wrap.turnplate.awards.findIndex(function (v, i) {
                                return v.id == prizeId;
                            });
                            if(-1 === item){
                                wu.topTips(errMsg)
                            }else{
                                rotateFn(item+1, turnplate.awardNames[item],prizeId);
                            }
                        },
                        error: function (err) {
                            wu.topTips(err || errMsg);
                            turnplate.bRotate = false;
                        }
                    });
                });
            }
        };

        wrap.init();


    })(jQuery, window.request_g, window.template_g, window.weui_g, window.validate_g);//声明外部依赖


});