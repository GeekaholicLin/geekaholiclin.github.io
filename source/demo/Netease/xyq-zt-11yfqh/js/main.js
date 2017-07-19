$(function () {
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
            product: "��Ʒ��"
        });
        $('.morebtn').mouseover(function () {
            var uld = $('.NIE-share-more').find('ul');
            uld.css("top", 8);
        });
    });
    if($('.mLightBox').length>0){
        lightbox.option({
            'resizeDuration': 200,
            'fitImagesInViewport':false,
            'wrapAround': true,
            'positionFromTop': ($(window).outerHeight() - $("#lightbox").outerHeight()) / 4
        });
    }

    var gotoTop = $('#totop');
   if(gotoTop.length>=1){
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
   }
    $('a').focus(function () {
        $(this).blur()
    });
    if($('#content').length>0){
        var timer = null;
        $(window).scroll(function () {
            clearTimeout(timer);
            timer = setTimeout(function () {
                var $content = $('#content');
                var e = $('#navBar');
                if ($(window).scrollTop() > $content.offset().top + 100) {

                    var bigHeight = $(window).outerHeight();
                    var tcHeight = e.outerHeight();
                    var halfHeightSpace = (bigHeight - tcHeight) / 2;
                    var eleHeight = e.outerHeight();
                    var a=0;
                    if($(window).height()>=$('#navBar').outerHeight()){
                        a = $(window).scrollTop() - $content.offset().top + halfHeightSpace;
                    }else{
                        a = $(window).scrollTop() - $content.offset().top-(eleHeight-bigHeight)-20;
                    }
                    e.stop().animate({'top': a});
                } else {
                    e.stop().animate({"top": 0});
                }
            }, 100);
        });
    }

    gotoTop.mouseover(function (e) {
        var $this = $(this),
            RIGHTPX = '+=10px';

        if(!$this.hasClass('selected')){
            if (!$this.is(':animated')) {
                $this.data('mouseOver', true);
                $this.animate({
                    'bottom': RIGHTPX
                });
            }
        }

    });
    gotoTop.mouseout(function (e) {
        var $this = $(this),
            LEFTPX = '-=10px';
        if(!$this.hasClass('selected')){
            if ($this.data('mouseOver') === true) {
                $this.data('mouseOver', false);
                $this.animate({
                    'bottom': LEFTPX
                })
            }
        }


    });
});