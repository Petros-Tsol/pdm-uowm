$(document).ready(function(){
	$(".menu_button").click(function(){
		$(this).nextUntil("br").fadeToggle(100);
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

