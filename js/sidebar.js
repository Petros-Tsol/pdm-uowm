$(document).ready(function(){
	$(".menu_button").click(function(){
		if ($(this).nextUntil("br").css("display") == "block") {
			$(this).nextUntil("br").css("display","none");
		} else {
			$(this).nextUntil("br").css("display","block");
		}
	});
	
	$("#cpside > button").on({
		mouseenter: function(){
			var index_of_button = $(this).index("button");
			$(".explain:eq("+index_of_button+")").css("display","block");
		},
		
		mouseleave: function(){
			$(".explain").css("display","none");
		}
	});

});

