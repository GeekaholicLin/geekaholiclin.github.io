$(function(){
	/*warp2,wsiper*/
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
})

