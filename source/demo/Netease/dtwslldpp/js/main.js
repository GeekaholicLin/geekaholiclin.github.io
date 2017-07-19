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

    $('a').focus(function () {
        $(this).blur()
    });

    $('.close').click(function(){
       $('#pop-mask').hide();
        $('#pop-background').hide();
        $('#pop').find('li').hide();
    });
    //$(".article-body").mCustomScrollbar({
    //    scrollButtons:{
    //        enable:false
    //    },
    //    mouseWheelPixels:300
    //});

    $(window).resize(function(){
        var e = $('#pop-content');
        var bigHeight = $(window).outerHeight();
        var bigWidth = $(window).outerWidth();
        var tcHeight = e.outerHeight();
        var tcWidth = -100;
        var halfHeightSpace = (bigHeight-tcHeight)/2;
        var halfWidthSpace = (bigWidth-tcWidth)/2;
        e.css("top",halfHeightSpace);
        e.css("left",halfWidthSpace);
    });
    var $mapArea = $('#links').find('area');
    var $btnArea = $('#btn-area');
   $mapArea.mouseover(function(){
       var index = $(this).index();
       $btnArea.find('.btn').eq(index).addClass('hover');
   });
    $mapArea.mouseout(function(){
        var index = $(this).index();
        $btnArea.find('.btn').eq(index).removeClass('hover');
    });
});
