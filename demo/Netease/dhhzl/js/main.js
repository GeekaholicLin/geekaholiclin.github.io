var flag_tab = true;
var phoneType = 0;
var Page = (function () {
    //功能： 手机号码验证
    function checkPhoneNum(phoneNum) {
        return /^(13|14|15|17|18)\d{9}$/.test(phoneNum) ? !0 : !1
    }

    var fn = {
        setCopyrightColor: function (color) {
            if (color == 'black') {
                nie.config.copyRight.setNormal();
            } else {
                nie.config.copyRight.setWhite();
            }
        },

        setShare: function () {
            var share = null;
            var $mapArea = $('#map').find('area');
            var $btnArea = $('#btn-area');
            var shareUrl = $("#share_url").html();
            var sharePic = $("#share_pic").attr("data-src");
            var shareTxt = $("#share_desc").html();
            var shareTitle = $("#share_title").html();
            nie.define(function () {
                    var share = nie.require("nie.util.shareV5");
                    share({
                        fat: "#NIE-share",
                        type: 6,
                        defShow: [23, 22, 2, 1, 4, 3],
                        title: shareTitle,
                        //url:shareUrl,
                        img: sharePic,
                        content: shareTxt,
                        product: "产品号"
                    });
                $('.morebtn').mouseover(function(){
                    var uld = $('.NIE-share-more').find('ul');
                    uld.css("top",-51);
                    uld.css("left",-22);
                });
            });
        },

        setDown: function () {
            nie.define("download", function () {
                var niedownload = nie.require("nie.util.niedownload");

                NieDownload.create({//安卓下载开放，IOS下载未开放，在IOS下载按钮上绑定点击事件disableClick
                    wrapper: $("#nie-download"),
                    enableAndroid: true,
                    enableIos: true,
                    disableClick: function () {
                        alert("App Store暂未开放，敬请期待");
                    }
                });
            })
        } ,

        setVideoPlayer: function (opt) { //加载视频
           var movieUrl = opt.url;
            nie.define(function () {
                nie.use(["nie.util.videoV2"], function () {
                    video = nie.util.video({
                        fat: "#videoBox",//放视频的容器
                        width: 620 + '',//视频宽度 720
                        height: 350 + '',//视频高度
                        //wmode:"direct",//flash wmode值,默认direct
                        movieUrl: movieUrl,//标清视频地址
                        HDmovieUrl: "",//高清视频地址
                        SHDmovieUrl: "",//超清视频地址
                        vtype: "",//默认选用哪种清晰度，分别有d,hd,shd，默认不填则会采用校验网速然后自动匹配
                        autoPlay: true//是否自动播放，默认false

                    });
                });
            });
            //nie.use(['nie.util.video', 'util.swfobject'], function () {
            //    nie.util.video($('#videoBox'), {
            //        movieUrl: opt.url,
            //        mp4_movieUrl: opt.url.replace(/\.(flv|f4v)/, '.mp4'),
            //        width: 620,
            //        height: 350,
            //        bufferTime: 5,
            //        loopTimes: 0,
            //        wmode: 'opaque',
            //        volume: 0.3,
            //        startImg: opt.img,
            //        autoPlay: true
            //    });
            //});

        },

        setVideoDialog: function (ele) {
            var btn = $(ele);
            btn.on('click', function () {
                var _thisObj = $(this);
                fn.setVideoPlayer({
                    url: _thisObj.data('f4v'),
                    img: _thisObj.data('img')
                });
                fn.popWindow('dialog-video');
            });
        },

        popWindow: function (popID) { //打开弹层
            $('.dialog').fadeOut().removeClass('curr');
            var obj = $("#" + popID);
            var width = obj.width();
            var height = obj.height();
            var popTop = obj.height() / 2;
            var popLeft = obj.width() / 2;
            obj.css({"margin-top": -popTop, "margin-left": -popLeft}).fadeIn();
            //if ($("#fade").length < 1) $('body').append('<div id="fade"></div>');
            $('#fade').fadeIn();
        },

        popClose: function (popID) { //关闭弹层
            $('#fade ,.dialog ,#' + popID).fadeOut();
            $('.dialog input').val('');
            $('#videoBox').empty();
        },

        setEvent: function () {

            // 游戏特色
            var $tabImg = $('.about');
            var end =  $tabImg.find('li').length-1;
            var interval = setTimeout(intervalFn,2500);
            var index = 0;
            $('.about li').bind('mouseenter', function(){
                index = $(this).index();
                function slide(){
                    var currLi = $('.about li').eq(index),
                        animateSpeed = 300;
                    currLi.animate({'width':'730px'},animateSpeed).find('a').fadeOut(animateSpeed);
                    currLi.siblings().animate({'width':'143px'},animateSpeed).find('a').fadeIn(animateSpeed);
                }
                slide();
            });

            //自动播放


            function intervalFn(){
                if(index>end){
                    index = 0;
                }
                $tabImg.find('li').eq(index).trigger("mouseenter");
                index++;
                interval = setTimeout(intervalFn,2500);
                //console.log(indexSlide);
            }


            $tabImg.bind("mouseover",function(){
                clearTimeout(interval);
            });
            $tabImg.bind("mouseout",function(){
                interval = setTimeout(intervalFn,1500);
            });
            /*预约弹窗事件触发*/
            $("#yue").on("click", function () {
                $("#dialog-app").show();
                //if ($("#fade").length < 1) $('body').append('<div id="fade"></div>');
                $('#fade').fadeIn();
            });


            $("#dialog-app").find(".dialog-close").on("click", function () {
                $(".dialog").hide();
                $("#fade").fadeOut();
            });

            // 点击切换预约系统
            $(".chotype").on("click", function () {
                var pid = $(this).attr("pid");
                if (pid == 0) {
                    phoneType = 0;
                    $(this).children(".btn").addClass("ios_hov");
                    $(this).siblings().children(".btn").removeClass("android_hov");
                } else if (pid == 1) {
                    phoneType = 1;
                    $(this).children(".btn").addClass("android_hov");
                    $(this).siblings().children(".btn").removeClass("ios_hov");
                }
                $(this).siblings().children(".ptype").removeClass("p2");
                $(this).children(".ptype").addClass("p2");
                $(this).siblings().children(".ff").removeClass("ffy");
                $(this).children(".ff").addClass("ffy");

            });

            var urlindex = "http://dora.webcgi.163.com/api/85_283_2016_07_07/appoint?";
            $("#YuYue_Btn").click(function () {
                var phone = $("#phone").val();
                var type = "ios";
                if (phoneType == 0) {
                    type = "ios";
                } else if (phoneType == 1) {
                    type = "android";
                }

                if (phone === "") {
                    alert("请输入手机号码");
                } else if (!checkPhoneNum(phone)) {
                    alert('您输入的手机号码有误');
                } else {
                    $.ajax({
                        type: 'GET',
                        url: urlindex + 'mobile=' + phone + '&os=' + type,
                        dataType: 'jsonp',
                        success: function (res) {
                            if (res.status == false) {
                                /*alert(res.msg);*/
                                $(".error .val").html(res.msg);
                                $("#dialog-app").hide();
                                $("#dialog-result").show();
                                $("#dialog-result .error").show();
                            } else if (res.status == 103) {
                                /*alert('参数格式不正确');*/
                                $(".error .val").html("参数格式不正确");
                                $("#dialog-app").hide();
                                $("#dialog-result").show();
                                $("#dialog-result").find(".error").show();
                            } else if (res.status == 201) {
                                /*alert("已经预约，请勿重复预约");*/
                                $(".error .val").html("已经预约，请勿重复预约");
                                $("#dialog-app").hide();
                                $("#dialog-result").show();
                                $("#dialog-result").find(".error").show();
                            } else {
                                /*alert('预约成功！');*/
                                $("#dialog-app").hide();
                                $("#dialog-result").show();
                                $("#dialog-result").find(".success").show();
                                $("#phone").val("");
                            }
                        }
                    });
                }
            });
            $("#dialog-result").find(".dialog-close").on("click", function () {
                $(".dialog").hide();
                $("#fade").fadeOut();
                $("#dialog-result .success,#dialog-result .error").hide();
            });

            //奖励弹窗

            $(".gc").on("click", "li",function (e) {
                var index = $(this).index();
                //if ($("#fade").length < 1) $('body').append('<div id="fade"></div>');
                $('#fade').fadeIn();
                $("#dialog-prize").show();
                $("#pop").find('li').eq(index).addClass('active');

            });
            $("#dialog-prize").find(".dialog-close").on("click", function () {
                $(".dialog").hide();
                $("#fade").fadeOut();
                $('#pop').find('li').removeClass('active');
            });
            $(".content-txt").niceScroll({
                cursorcolor:"#C1903E",
                cursorwidth: "5px",
                scrollspeed: 50
            });

        }
    };
    init = function () {
        fn.setShare();
        fn.setCopyrightColor("white");
        fn.setDown();
        fn.setVideoDialog('.videoBtn');
        fn.setEvent();
    };
    return {
        fn: fn,
        init: init
    }
})();

$(function () {
    Page.init();
});
