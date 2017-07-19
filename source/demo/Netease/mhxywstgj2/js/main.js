var PAGE = (function () {
    var fn = {
            //分享
            setShare: function () {
                var share = null;
                var shareUrl = $("#share_url").html();
                var sharePic = $("#share_pic").attr("data-src");
                var shareTxt = $("#share_desc").html();
                var shareTitle = $("#share_title").html();
                nie.define(function () {
                    var share = nie.require("nie.util.shareV5");
                    share({
                        fat: "#NIE-share",
                        type: 1,
                        defShow: [23, 22, 2, 1, 4, 3],
                        title: shareTitle,
                        //url:shareUrl,
                        img: sharePic,
                        content: shareTxt,
                        product: "产品号"
                    });
                    $('.morebtn').mouseover(function(){
                        var uld = $('.NIE-share-more').find('ul');
                        uld.css("top",8);
                    });
                });
            },
            //设置版权图标颜色
            setCopyrightColor : function(color) {
                if(color == 'white') {
                    nie.config.copyRight.setWhite();
                } else {
                    nie.config.copyRight.setNormal();
                }
            },
            tabMove : function(){
                var $tabBtn=$(".tab-btn-wrap>li"),
                    $LeftItem=$(".left-item>li"),
                    $textItem=$(".text-item>li");
                $LeftItem.hide().eq(0).show();
                $textItem.hide().eq(0).show();
                $tabBtn.on("click",function(){
                    var _this=$(this),
                        _index=_this.index();
                    $tabBtn.removeClass("active").eq(_index).addClass("active");
                    $LeftItem.hide().eq(_index).show();
                    $textItem.hide().eq(_index).show();
                });
            },
            swiper : function(){
                /*warp3,wsiper*/
                var mySwiper = new Swiper('#banner-swiper',{
                    loop:true,
                    paginationClickable: true,
                    simulateTouch : false
                });
                $('.arrow-left').on('click', function(e){
                    e.preventDefault()
                    mySwiper.swipePrev()
                });
                $('.arrow-right').on('click', function(e){
                    e.preventDefault()
                    mySwiper.swipeNext()
                });
            },
            showVideo : function (){
                var video = '';

                // 弹出视频弹层
                $('.text-item>li>.video-btn').on('click', function() {
                    videoLink = $(this).data('url');

                    if(videoLink != null) {
                        // 公用视频组件(V2)
                        nie.define('video',function(){
                            var videoModule = nie.require("nie.util.videoV2");
                            video = videoModule({
                                fat : '.player-video',
                                width : '600',
                                height : '450',
                                movieUrl : videoLink, //标清视频地址
                                HDmovieUrl : '', //高清视频地址
                                SHDmovieUrl : '', //超清视频地址
                                autoPlay : true
                            });
                            $('#popVideoPlayer').fadeIn();
                        });

                    }

                    $(".player-bg").fadeIn();
                });

                // 关闭视频弹层
                $('.player-close').on('click', function() {
                    $(".player-bg").fadeOut();
                    video.destroy();
                });
            },
            scrollTo : function(){
                var btn=$("#returnGd");
                btn.bind("click",function(){
                    var scrTopHeight=$(window).scrollTop();
                    if(scrTopHeight>0){
                        $("html,body").animate({scrollTop:0})
                    }
                });
            },
            tabSwitch : function(){
                var $tabSwitch = $('.tab-switch-btn');
                $tabSwitch.click(function(){
                    $tabSwitch.removeClass('active');
                    $(this).addClass('active');
                    var _index = $(this).index();
                    $('.relevant-item').find('li').removeClass('active').eq(_index).addClass('active');
                });
            }
        },

        init = function () {
            fn.setShare();
            fn.setCopyrightColor("white");
            fn.tabMove();
            fn.swiper();
            fn.showVideo();
            fn.scrollTo();
            fn.tabSwitch();
        };
    return {
        fn: fn,
        init: init
    }
})();

$(function () {
    PAGE.init();
});