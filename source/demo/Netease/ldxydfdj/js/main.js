$(function () {
    //观看视频地址
    var gkspVideoUrl = 'http://v.ldxy.netease.com/2016/0411/32062331118f28ab45fad1f48d29561cqt.mp4';
    //存放视频地址--从上到下，从左到右
    var smallVideosUrls = [
        [
            'http://v.ldxy.netease.com/2016/0411/32062331118f28ab45fad1f48d29561cqt.mp4',//大视频
            '12',
            'http://v.wh.netease.com/2015/1012/abfa234ef258503563fd394dbc596271qt.mp4',
            '14',
            '15'
        ],//第1页小视频
        [
            'http://v.wh.netease.com/2015/1012/abfa234ef258503563fd394dbc596271qt.mp4',
            '22',
            '23', '24', '25', '26', '27', '28', '29', '210'
        ],//第2页小视频
        [
            'http://v.ldxy.netease.com/2016/0411/32062331118f28ab45fad1f48d29561cqt.mp4',
            '32', '33', '34', '35', '36', '37', '38', '39', '310'
        ],//第3页小视频
        [
            'http://v.wh.netease.com/2015/1012/abfa234ef258503563fd394dbc596271qt.mp4',
            '42', '43', '44', '45', '46', '47', '48', '49', '410'
        ]//第4页小视频
    ];
    //八强对决视频地址-从左到右，从上到下
    var fightVideo = [
        'http://v.ldxy.netease.com/2016/0411/32062331118f28ab45fad1f48d29561cqt.mp4', //1
        'http://v.ldxy.netease.com/2016/0411/32062331118f28ab45fad1f48d29561cqt.mp4', //2
        'http://v.ldxy.netease.com/2016/0411/32062331118f28ab45fad1f48d29561cqt.mp4', //3
        'http://v.ldxy.netease.com/2016/0411/32062331118f28ab45fad1f48d29561cqt.mp4', //4
        'http://v.ldxy.netease.com/2016/0411/32062331118f28ab45fad1f48d29561cqt.mp4', //5
        'http://v.ldxy.netease.com/2016/0411/32062331118f28ab45fad1f48d29561cqt.mp4', //6
        'http://v.ldxy.netease.com/2016/0411/32062331118f28ab45fad1f48d29561cqt.mp4', //7
        'http://v.ldxy.netease.com/2016/0411/32062331118f28ab45fad1f48d29561cqt.mp4' //8
    ];
    var pages = $('.page');
    var pageTxt = $('.pagebtn span');
    var pageTotalNum = pages.length;
    var activePageNum = 1;//初始化
    var leftArr = $('.left-arr');
    var rightArr = $('.right-arr');
    var videoArea = $('#video-area');
    nie.config.copyRight.setWhite();
    var share = null;
    var shareUrl = $("#share_url").html();
    var sharePic = $("#share_pic").attr("data-src");
    var shareTxt = $("#share_desc").html();
    var shareTitle = $("#share_title").html();
    var video = null;
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
        //var videoModule = nie.require("nie.util.videoV2");
        //
        //video = videoModule({
        //    fat : "#video",//放视频的容器
        //    width:"720",//视频宽度
        //    height:"406",//视频高度
        //    //wmode:"direct",//flash wmode值,默认direct
        //    movieUrl:'',//标清视频地址
        //    HDmovieUrl : "",//高清视频地址
        //    SHDmovieUrl : "",//超清视频地址
        //    vtype : ""//默认选用哪种清晰度，分别有d,hd,shd，默认不填则会采用校验网速然后自动匹配
        //    //autoPlay:false,//是否自动播放，默认false
        //    //startImg:null,//开始图片地址，默认false
        //    //loopTimes:0,//循环播放次数，默认0
        //    //maskImg:null,//整个flash顶部遮罩图片地址，默认null
        //    //bufferTime:5//缓冲时间（秒）,默认5
        //});
    });

    $('a').focus(function () {
        $(this).blur()
    });
    function setPageNum(activePageNum, pageTotalNum) {
        var result = activePageNum + '/' + pageTotalNum;
        pageTxt.html(result);
    }

    setPageNum(activePageNum, pageTotalNum);

    leftArr.hide();
    rightArr.click(function () {
        pages.removeClass('active');
        activePageNum++;
        pages.eq(activePageNum - 1).addClass('active');
        setPageNum(activePageNum, pageTotalNum);
        if (activePageNum == pageTotalNum) {
            $(this).hide();
        }
        if (leftArr.is(':hidden')) {
            leftArr.show();
        }

    });

    leftArr.click(function () {
        pages.removeClass('active');
        activePageNum--;
        pages.eq(activePageNum - 1).addClass('active');
        setPageNum(activePageNum, pageTotalNum);
        if (activePageNum == 1) {
            $(this).hide();
        }
        if (rightArr.is(':hidden')) {
            rightArr.show();
        }
    });

    //视频播放
    function playVideo(videoUrl, playBox, myHeight, myWidth) {
        //console.log(videoUrl);
        var videoModule = nie.require("nie.util.videoV2");

        video = videoModule({
            fat: playBox,//放视频的容器
            width: myWidth + '',//视频宽度
            height: myHeight + '',//视频高度
            //wmode:"direct",//flash wmode值,默认direct
            movieUrl: videoUrl,//标清视频地址
            HDmovieUrl: "",//高清视频地址
            SHDmovieUrl: "",//超清视频地址
            vtype: "",//默认选用哪种清晰度，分别有d,hd,shd，默认不填则会采用校验网速然后自动匹配
            autoPlay: true//是否自动播放，默认false
            //startImg:null,//开始图片地址，默认false
            //loopTimes:0,//循环播放次数，默认0
            //maskImg:null,//整个flash顶部遮罩图片地址，默认null
            //bufferTime:5//缓冲时间（秒）,默认5
        });
        if (playBox === '#bigvideo-box') {
            $('#bigvideo-box').fadeIn();
        } else {
            $('#bigvideo-box').fadeOut().empty();
            $('#video-mask').fadeIn();
            $('#video-wrap').fadeIn();
            showInCenter();
        }
    }

    videoArea.on('click', '.videobtn', function (event) {
        var targetVideo = event.target.parentNode;
        var parentSelector = $(targetVideo);
        var videoIndex = parentSelector.index();
        var videoUrl = smallVideosUrls[activePageNum - 1][videoIndex];
        var videoBox = null;
        var myHeight = 373;
        var myWidth = 662;
        if (parentSelector.is('.bigvideo')) {
            videoBox = '#bigvideo-box';
        } else {
            videoBox = '#video';
            myHeight = 406;
            myWidth = 720;
        }
        playVideo(videoUrl, videoBox, myHeight, myWidth);
    });
    $('.jcspbtn-wrap').on('click', '.jcsp', function (e) {
        var jcspIndex = $(e.target).index();
        //console.log(fightVideo[jcspIndex]);
        var videoUrl = fightVideo[jcspIndex];
        playVideo(videoUrl, '#video', '406', '720');
    });
    $('.gksp').click(function () {
        playVideo(gkspVideoUrl, '#video', '406', '720');
    });
    var bigVideoBtn = $('.bigvideo .videobtn');
    bigVideoBtn.mouseover(function () {
        $('.circle').addClass('white');
    });
    bigVideoBtn.mouseout(function () {
        $('.circle').removeClass('white');
    });

    /*albumm 精彩图集*/
    var swiper = new Swiper('.swiper-container', {

        mode: 'horizontal',
        speed: 800,
        //loop:true,
        //autoplay:30000,
        //mousewheelControl: true, // 鼠标滚轮
        simulateTouch: false, // 鼠标拖动
        slidesPerView: 1, // 滚动高度自动，打开，重要
        resizeReInit: true, // 窗口改变初始化
        calculateHeight: true, // 计算高度,打开，重要
        pagination: '.swiper-pagination',
        paginationClickable: true,
        createPagination: true,
        watchActiveIndex: true
        //onSlideChangeEnd : function(swiper){
        //
        //
        //}//触发函数
    });
    //居中
    function showInCenter() {
        var e = $('#video-wrap');
        var bigHeight = $(window).outerHeight();
        var bigWidth = $(window).outerWidth();
        var tcHeight = e.outerHeight();
        var tcWidth = e.outerWidth();
        var halfHeightSpace = (bigHeight - tcHeight) / 2;
        var halfWidthSpace = (bigWidth - tcWidth) / 2;
        e.css("top", halfHeightSpace);
        e.css("left", halfWidthSpace);
    }

    showInCenter();
    $(window).resize(function () {
        showInCenter();
    });
    $('.video-cancel').click(function () {
        $('#video-mask').fadeOut();
        $('#video-wrap').fadeOut();
        $('#video').empty();
    });
});
