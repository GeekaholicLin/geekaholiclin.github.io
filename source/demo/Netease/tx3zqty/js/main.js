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
            type: 6,
            defShow: [23, 22, 2, 1, 4, 3],
            title: shareTitle,
            //url:shareUrl,
            img: sharePic,
            content: shareTxt,
            product: "产品号"
        });
        $('.morebtn').mouseover(function () {
            var uld = $('.NIE-share-more').find('ul');
            uld.css("top",-51);
            uld.css("left",-22);
        });

        $('#player').click(function () {
            var d_width = 780,
                d_height = 540;
            $('#video-mask').show();
            $('#video-wrap').width(d_width)
                .height(d_height)
                .css('margin', '-' + d_height / 2 + 'px 0 0 -' + d_width / 2 + 'px')
                .fadeIn(200);
            nie.use(["nie.util.videoV2"], function () {
                video = nie.util.video({
                    fat: "#video",//放视频的容器
                    width: d_width + '',//视频宽度 720
                    height: d_height + '',//视频高度
                    //wmode:"direct",//flash wmode值,默认direct
                    movieUrl: 'http://v.wh.netease.com/2015/1012/abfa234ef258503563fd394dbc596271qt.mp4',//标清视频地址
                    HDmovieUrl: "",//高清视频地址
                    SHDmovieUrl: "",//超清视频地址
                    vtype: "",//默认选用哪种清晰度，分别有d,hd,shd，默认不填则会采用校验网速然后自动匹配
                    autoPlay: true//是否自动播放，默认false
                });
            });
        });


    });



    $('a').focus(function () {
        $(this).blur()
    });
    //按钮交互
    var $area = $("#links").find("area");
    var $mapBtn = $("#mapbtn");
    var $tc = $('#pop').find('li');
    var _index = -1;
    $area.mouseover(function(){
        var index = $(this).index();
        $mapBtn.find(".btn").eq(index).addClass("selected");
    });
    $area.mouseout(function(){
        $mapBtn.find(".btn").removeClass("selected");
    });
    //关闭按钮
    $('.close').click(function(){
        $('#video-wrap').hide();
        $('#pop-wrap').hide();
        //$('#pop').hide();
        $tc.hide();
        $('#video-mask').hide();
        $('#video').empty();
    });

    //弹窗左右箭头
    $area.click(function(){
       _index = $(this).index();
        $('#video-mask').show();
        $('#pop-wrap').show();
        $('#pop').find('li').eq(_index).show();
    });
    var $leftArr = $('.left-arr');
    var $rightArr = $('.right-arr');
    var PIX = '10px';
    $leftArr.mouseover(function(){
        $(this).animate({
            'left':'-='+PIX
        });
    });
    $leftArr.mouseout(function(){
       $(this).animate({
          'left':'+='+PIX
       });
    });
    $rightArr.mouseover(function(){
        $(this).animate({
           'right':'-='+PIX
        });
    });
    $rightArr.mouseout(function(){
       $(this).animate({
          'right':'+='+PIX
       });
    });

    //弹窗切换

    var tcLength= $tc.length;
    $leftArr.click(function(){
        var left =((_index-1)<0?tcLength-1:_index-1)%tcLength;
        $tc.hide();
        $tc.eq(left).show();
        _index = left;
    });
    $rightArr.click(function(){
        var right = (_index+1)%tcLength;
        $tc.hide();
        $tc.eq(right).show();
        _index = right;
    });

    $(".content-wrap").niceScroll({

        cursorcolor:"#B47B5B",
        cursorwidth: "15px",
        scrollspeed: 50,
        cursorborderradius:"0",
        background:"#D5AA96"
        //autohidemode: false//always shows
    });
});
