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
            product: "产品号"
        });
        $('.morebtn').mouseover(function () {
            var uld = $('.NIE-share-more').find('ul');
            uld.css("top", 8);
        });
    });
    //弹窗
    var $mask = $('#mask');
    var $pop = $('#tabs-wrap');
    var $content = $('#tabs-content');
    var $tabBtns = $('#tabs-btn');
    var area = $("#map").find("area");
    var $btn = $('#btn-area').find('.btn');
    area.mouseover(function () {
        var index = $(this).index();
        $btn.eq(index).addClass("active");
    });
    area.mouseout(function () {
        var index = $(this).index();
        $btn.eq(index).removeClass("active");
        $content.animate({scrollTop:0}); // 返回顶部
    });


    area.click(function () {
        var index = $(this).index();
        $mask.show();
        $pop.show();
        $tabBtns.find('li').removeClass('selected').eq(index).addClass('selected');//按钮高亮
        $content.find('li').hide().eq(index).show();
    });
    $(".close").click(function () {
        $content.find('li').hide();
        $mask.hide();
        $pop.hide();
    });
    $tabBtns.on('click','li',function(){
        var index = $(this).index();
        $tabBtns.find('li').removeClass('selected').eq(index).addClass('selected');//按钮高亮
        $content.find('li').hide().eq(index).show();//内容显示
        $content.animate({scrollTop:0}); // 返回顶部
    });
    //nice-scroll
    if ($pop.length >= 1) {
        $content.niceScroll({
            cursorcolor: "#9D8109",
            cursorwidth: "16px",
            scrollspeed: 50,
            background: "#C4B67F",
            cursorborderradius: 0,
            railoffset: {top:-1,left:-1}
        });
    }


    $('a').focus(function () {
        $(this).blur()
    });
    area.mousedown(function(e){
        if(e.which===1){
            $(this).trigger('click');
        }
    });
    area.click(function () {
        $(this).blur()
    });


});