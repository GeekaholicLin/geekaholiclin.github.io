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
        $('a.lightBox').lightBox();
    });

    var gotoTop = $('#totop');
    if ($(window).scrollTop() > $(window).height()) {
        gotoTop.show();
    } else {
        gotoTop.hide();
    }

    $(window).scroll(function () {
        if ($(window).scrollTop() > $(window).height()) {
            gotoTop.show();
        } else {
            gotoTop.hide();
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

});
