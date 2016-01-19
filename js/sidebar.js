$(document).ready(function(){
	$(".menu_button").click(function(){
		$(this).next().fadeToggle(100);
		$(this).next().next().fadeToggle(100);
	});
});
