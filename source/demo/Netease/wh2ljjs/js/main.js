
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
            type: 6,
            defShow: [23, 22, 2, 1, 4, 3,8],
            title: shareTitle,
            //url:shareUrl,
            img: sharePic,
            content: shareTxt,
            product: "产品号"
        });
        $('.morebtn').mouseover(function () {
            var uld = $('.NIE-share-more').find('ul');
            uld.css("top", -56);
            uld.css("left",-5);
        });
    });
    nie.define(function () {
        var lightbox = nie.require("ui.lightBox");
        $('#bs').find('.lightBox').lightBox();
        $('#hw').find('.lightBox').lightBox();
        $('#dk').find('.lightBox').lightBox();
        $('#ks').find('.lightBox').lightBox();
    });

    var navTop = $('#nav-bar').offset().top;
    if($(window).scrollTop()>=navTop){
        $('#navwrap').addClass('addfixed');
    }
    else $('#navwrap').removeClass('addfixed');
    $(window).scroll(function(){
        if($(window).scrollTop()>=navTop){
            $('#navwrap').addClass('addfixed');
        }
        else $('#navwrap').removeClass('addfixed');
    });
    /*lightBox*/
    var leftArrow = $(".left-arrow");
    var rightArrow =  $(".right-arrow");
    leftArrow.click(function(){
        var parent = $(this).parent();
        var boxs = parent.find('.lightBox');
        var boxLength = boxs.length;
        var showBox = parent.find('.lightBox.show');
        var currentIndex = showBox.index();
        var left =((currentIndex-1)<0?boxLength-1:currentIndex-1)%boxLength;
        showBox.fadeOut();
        showBox.removeClass('show');
        boxs.eq(left).fadeIn();
        boxs.eq(left).addClass('show');
    });
    rightArrow.click(function(){
        var parent = $(this).parent();
        var boxs = parent.find('.lightBox');
        var boxLength = boxs.length;
        var showBox = parent.find('.lightBox.show');
        var currentIndex = showBox.index();
        var right = (currentIndex+1)%boxLength;
        boxs.eq(currentIndex).removeClass('show');
        boxs.eq(currentIndex).fadeOut();
        boxs.eq(right).fadeIn();
        boxs.eq(right).addClass('show');
    });
    leftArrow.mouseover(function(){
        $(this).animate({left:"-75px"});
    });
    leftArrow.mouseout(function(){
        $(this).animate({left:"-72px"});
    });
    rightArrow.mouseover(function(){
        $(this).animate({right:"-75px"});
    });
    rightArrow.mouseout(function(){
        $(this).animate({right:"-72px"});
    });
    $('a').focus(function () {
        $(this).blur()
    });

    var video;

    $('#pop3').click( function(){
        var d_width=900,
            d_height=507;
        $('#video-mask').show();
        $('#video-wrap').width(d_width)
            .height(d_height)
            .css('margin','-'+d_height/2+'px 0 0 -'+d_width/2+'px')
            .fadeIn(200);
        nie.use(["nie.util.videoV2"],function(){
            video = nie.util.video({
                fat : "#video",//放视频的容器
                width:d_width+'',//视频宽度 720
                height:d_height+'',//视频高度
                //wmode:"direct",//flash wmode值,默认direct
                movieUrl:'http://v.wh.netease.com/2015/1012/abfa234ef258503563fd394dbc596271qt.mp4',//标清视频地址
                HDmovieUrl : "",//高清视频地址
                SHDmovieUrl : "",//超清视频地址
                vtype : "",//默认选用哪种清晰度，分别有d,hd,shd，默认不填则会采用校验网速然后自动匹配
                autoPlay:true//是否自动播放，默认false
                //startImg:null,//开始图片地址，默认false
                //loopTimes:0,//循环播放次数，默认0
                //maskImg:null,//整个flash顶部遮罩图片地址，默认null
                //bufferTime:5//缓冲时间（秒）,默认5
            });

            // video.change(movieURL);//改变视频地址
            // video.pause();//暂停视频
            // video.stop();//停止视频
            // video.play();//播放视频
        });
    });
    $('#pop4').click(play =  function(){
        var d_width=900,
            d_height=507;
        $('#video-mask').show();
        $('#video-wrap').width(d_width)
            .height(d_height)
            .css('margin','-'+d_height/2+'px 0 0 -'+d_width/2+'px')
            .fadeIn(200);
        nie.use(["nie.util.videoV2"],function(){
            video = nie.util.video({
                fat : "#video",//放视频的容器
                width:d_width+'',//视频宽度 720
                height:d_height+'',//视频高度
                //wmode:"direct",//flash wmode值,默认direct
                movieUrl:'http://v.wh.netease.com/2015/1012/abfa234ef258503563fd394dbc596271qt.mp4',//标清视频地址
                HDmovieUrl : "",//高清视频地址
                SHDmovieUrl : "",//超清视频地址
                vtype : "",//默认选用哪种清晰度，分别有d,hd,shd，默认不填则会采用校验网速然后自动匹配
                autoPlay:true//是否自动播放，默认false
                //startImg:null,//开始图片地址，默认false
                //loopTimes:0,//循环播放次数，默认0
                //maskImg:null,//整个flash顶部遮罩图片地址，默认null
                //bufferTime:5//缓冲时间（秒）,默认5
            });

            // video.change(movieURL);//改变视频地址
            // video.pause();//暂停视频
            // video.stop();//停止视频
            // video.play();//播放视频
        });
    });
    $('#video-wrap').find('.video-cancel').click(function(){
        nie.use(["nie.util.videoV2"],function(){
            video.stop();
        });
        $('#video-wrap').fadeOut();
        $('#video-mask').hide();
    });
    /*==导航按钮高亮==*/
    var btns = $('#nav-bar').find('a');
    //  btns.click(function(){
    //    btns.removeClass('selected');
    //    $(this).addClass('selected');
    //});
    function navHover() {
        var firstTop = $('#bs').offset().top;
        var secondTop = $('#hw').offset().top;
        var thirdTop = $('#dk').offset().top;
        var fourthTop = $('#ks').offset().top;
        if ($(window).scrollTop() < firstTop) {
            btns.removeClass('selected');
        }
        if ($(window).scrollTop() >= firstTop) {
            btns.removeClass('selected');
            $("[href='#bs']").addClass('selected');
        }
        if ($(window).scrollTop() >= secondTop) {
            btns.removeClass('selected');
            $("[href='#hw']").addClass('selected');
        }
        if ($(window).scrollTop() >= thirdTop) {
            btns.removeClass('selected');
            $("[href='#dk']").addClass('selected');
        }
        if ($(window).scrollTop() >= fourthTop) {
            btns.removeClass('selected');
            $("[href='#ks']").addClass('selected');
        }
    }
    navHover();
    $(window).scroll(function(){
        navHover()
    });

});
