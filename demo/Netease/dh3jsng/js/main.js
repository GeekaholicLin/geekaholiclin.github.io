$(function () {
    //nie.config.copyRight.setWhite();
    var share = null;
    var shareUrl = $("#share_url").html();
    var sharePic = $("#share_pic").attr("data-src");
    var shareTxt = $("#share_desc").html();
    var shareTitle = $("#share_title").html();
    nie.define(function () {
        var share = nie.require("nie.util.shareV5");
        share({
            fat: "#NIE-share",
            type: 6,
            defShow: [23, 22, 2, 1, 3, 8],
            title: shareTitle,
            //url:shareUrl,
            img: sharePic,
            content: shareTxt,
            product: "²úÆ·ºÅ"
        });
        $('.morebtn').mouseover(function () {
            var uld = $('.NIE-share-more').find('ul');
            uld.css("top", -40);
            uld.css("left", -14);
        });
    });
    nie.define(function () {
        var lightbox = nie.require("ui.lightBox");
        $('#tabs-content').find('.lightBox').lightBox();

    });

    var gotoTop = $('#totop');
    if ($(window).scrollTop() > $(window).height()) {
        gotoTop.show();
    } else {
        gotoTop.hide();
    }

    $(window).scroll(function () {
        if ($(window).scrollTop() > $(window).height()) {
            gotoTop.fadeIn();
        } else {
            gotoTop.fadeOut();
        }
    });
    gotoTop.click(function () {
        $('body,html').animate({
            scrollTop: 0
        })
    });
    $('a').focus(function () {
        $(this).blur()
    });

    var area = $("#links").find("area");
    area.mouseover(function(){
        var index = $(this).index();
        $("#btn-area").find("a").eq(index).addClass("selected");
    });
    area.mouseout(function(){
        var index = $(this).index();
        $("#btn-area").find("a").eq(index).removeClass("selected");
    });
    //tabs switch
    var tabSwitch = function(){
        $tabsBtn = $('#tabs-btn');
        $tabsBtn.on('click','li',function(){
            var index = $(this).index();
            $('#tabs-btn').find('li').removeClass('selected');
            $(this).addClass('selected');
            $('#tabs-content').find('li').removeClass('show').eq(index).addClass('show');
        });
        $tabsBtn.find('li').mouseover(function(){
           $(this).addClass('hover');
        });
        $tabsBtn.find('li').mouseout(function(){
            $(this).removeClass('hover');
        });
    };
    tabSwitch();
    //appealTo

    var timer = null;
    $(window).scroll(function(){
        clearTimeout(timer);
        timer = setTimeout(function(){
           var $content = $('#content');
           var e = $('.left');
           if($(window).scrollTop()>$content.offset().top-50){

               var bigHeight = $(window).outerHeight();
               var tcHeight = e.outerHeight();
               var halfHeightSpace = (bigHeight-tcHeight)/2;
               var a = $(window).scrollTop()-$content.offset().top+halfHeightSpace;
               e.stop().animate({'top':a});
           }else{
               e.stop().animate({"top":-2});
           }
       },100);
    });

    $(window).resize(function(){
       $(window).trigger('scroll');
    });

});
