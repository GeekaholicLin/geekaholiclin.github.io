$(function () {
    nie.config.copyRight.setWhite();
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
            product: "²úÆ·ºÅ"
        });
        $('.morebtn').mouseover(function () {
            var uld = $('.NIE-share-more').find('ul');
            uld.css("top", 8);
        });
    });
    nie.define(function () {
        var lightbox = nie.require("ui.lightBox");
        $('.lightbox').lightBox();
    });



    $('a').focus(function () {
        $(this).blur()
    });

    //slide

        var indexSlide = 0;
        var $tabImg = $('#tab-img');
        var $sec = $('.sec4');
        var _tabImg = function () {
            $tabImg.find('li').mouseenter(function() {
                indexSlide = $(this).index();
                $(this).stop().animate({
                    width: '600px'
                }).siblings().stop().animate({
                    width: '130px'
                });

                $(this).find('.img1').stop().animate({
                    opacity: 0
                    //width: '0'
                });

                $(this).siblings().find(".img1").stop().animate({
                    opacity: 1
                });
                $(this).find(".img2").stop().animate({
                    left:0,
                    opacity:1
                });
                $(this).siblings().find(".img2").stop().animate({
                    opacity: 0
                });

            });

            // init
            $tabImg.find('li').eq(2).trigger('mouseenter');
        };
        _tabImg();

        var end =  $tabImg.find('li').length-1;
        var interval = setTimeout(intervalFn,1500);
        function intervalFn(){
            if(indexSlide>end){
                indexSlide = 0;
            }
           $tabImg.find('li').eq(indexSlide).trigger("mouseenter");
            indexSlide++;
            interval = setTimeout(intervalFn,1500);
            //console.log(indexSlide);
        }


    $tabImg.bind("mouseover",function(){
        clearTimeout(interval);
    });
    $tabImg.bind("mouseout",function(){
        interval = setTimeout(intervalFn,1500);
    });


});

