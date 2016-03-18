
/*
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
*/

//THE FIRST FOUR FUNCTIONS TAKE PLACE BEFORE WE SET A COOKIE FOR THIS SCREEN

function getCookie(cname) { //this function can be found here : http://www.w3schools.com/js/js_cookies.asp
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function ajax_call(screen,identifier) { //if identifier is 0 then a screen has been typed in url, else is 1 and that means a screen has selected by the list.
	$.ajax({
		type: "POST",
		url: "update_screen_db.php",
		data : {name:screen,input:identifier}
	})
	 .done(function(server_echo) {
		if (server_echo == "ok") { 
			window.location.replace("redirect.html");
			//redirect to redirect.html because of the cookie
		}else if(server_echo == "redirect") {
			window.location.replace("display.php");
		} else if(server_echo == "redirect_to_login") {
			window.location.replace("login_page.php");
		} else {
			alert(server_echo);
		}
		//console.log(server_echo);
	});
} 

function provided_screen() {
	var url = window.location.href; //get url, the url must be in pattern like display.php?screen=something
	var regex = /display\.php\?name=(.*)/; //regular expression to get screen name 
	var screen = regex.exec(url);
	
	if (screen != null) { //if a screen has been typed
		ajax_call(screen[1],0);
	}
}


$(document).on('click','button',function() { //when install button clicked.
	var screen = $("#screen").val();
	if (screen != null){
		ajax_call(screen,1);
	}
	
});

$(document).on('change','#screen',function() { //when a screen change
	//console.log($(this).prop("selectedIndex"));
	var index = $(this).prop("selectedIndex");
	
	$("#pdm_choose_screen > p").css("display","none");
	$("#pdm_choose_screen > p:eq("+index+")").css("display","block");
	
});


$(function() {
	$("#screen").trigger("change");
	if (getCookie("dev_id") == "") {
		provided_screen();
	} else { //connect to server to get new data.
		$("body").css("margin",0);
		if(typeof(EventSource) !== "undefined") {
			var source = new EventSource("update_screen.php");		
			source.onmessage = function(event) {
				var data = JSON.parse(event.data);
				console.log(data);
				if (data == null) { //if no content is defined
					$("body").empty();
				} else if (data.html == "NOMOREDATA") { //close the connection when cookie expires
					source.close();
				} else if (data != "0") { //every X sec (X is the time we receive new data) an 0 is sent from the server to close the inactive connections. the client should not accept it.
					$("body").empty();

					if (data.bg_opt == "stretched") { //set the background image to stretched or tilled
						$("body").css('background-repeat','no-repeat');
						$("body").css('background-size','100% 100%')
					} else if (data.bg_opt == "tilled") {
						$("body").css('background-repeat','repeat');
						$("body").css('background-size','auto auto');
					}		
					$("body").css('background-image',data.bg_img); //set background image
					$("body").css('background-color',data.bg_color); //set background color

					$("body").append(data.html);
					//console.log(event.data);
					
					var qr_id = data.qr;
					
					
					div_properties(qr_id);
					rss_update();
					/*
					$(".qrcode_layout").each(function(){ //hide the container div of a qrcode
						$(this).parent().css({"visibility":"hidden"});
						$(this).css({"visibility":"visible"});
						init_qrcode(qr_id);
					});
					
					$(".qrcode_link").each(function(){ //hide the container div of a qrcode
						$(this).parent().css({"visibility":"hidden"});
						$(this).css({"visibility":"visible"});
					});
					
					$(".weather_script").each(function(){ //hide the container div of a weather script
						$(this).parent().css({"visibility":"hidden"});
						$(this).css({"visibility":"visible"});
					});
					
					//div_visibility();
					
					
					
					
					$(".slideshow").each(function(){
						var elem = $(this);
						elem.find("img").css({"width":"100%","height":"100%","display":"inline"});
						elem.find("img").hide();
						var  index = 0;
						image_rotation(elem,index++ % elem.children("img").length);
						setInterval(function() {image_rotation(elem,index++ % elem.children("img").length)},elem.attr("data-pduowm-time-rotation")*1000); //call image_rotation every X sec
					});
					
					$(".countdown_visibility").each(function(){ //create a countdown clock and hide parent div
						var userDate = new Date($(this).attr("data-pduowm-ct-date"));
						var currentDate = new Date();
						var diff = userDate.getTime() / 1000 - currentDate.getTime() / 1000;
						//console.log($(this).attr("data-pduowm-ct-date"));
						$(this).parent().css({"visibility":"hidden"});
						$(this).css({"visibility":"visible"});
						$(this).FlipClock(diff,{
							clockFace: 'DailyCounter',
							countdown: true
						});
					});
					
					$(".clock_visibility").each(function(){ //create clock and hide parent div
						$(this).parent().css({"visibility":"hidden"});
						$(this).css({"visibility":"visible"});
						$(".clock_visibility").FlipClock({
							clockFace: 'TwentyFourHourClock',
							showSeconds: false
						});
					});
					
					$(".video_div").each(function(){
						$(this).css("overflow","visible");
						if ($(this).has("p").length) {
							var $this = $(this);
							var links = [];
							$this.children("p").each(function(ind){
								links[ind] = $(this).text().match(/=(.*)?/).pop();//get youtube video id
							});
							//console.log(links);
							var src_string = 'https://www.youtube.com/embed/'+links[0]+'?enablejsapi=1&controls=0&autoplay=1&loop=1&playlist=';
							
							if (links.length > 1) {
								for (var links_id = 1 ; links_id < links.length ; links_id = links_id + 1) {
									src_string = src_string+links[links_id]+',';
								}
								src_string = src_string.substring(0,src_string.length-1); //remove the last comma (,)
							} else if (links.length == 1) {
								src_string = src_string+links[0];
							}
							$this.empty();
							var parent_height = $this.parent().css("height");
							var parent_width = $this.parent().css("width");
							$this.append("<iframe width='100%' height='100%' src='"+src_string+"' frameborder='0'></iframe>");
							
							
							var myvideo=$(this);
							var player = new YT.Player($(' > iframe',this).get(0),{
								events:{
									'onReady':function(event) {
										if (myvideo.attr("data-pduowm-video-delay")!=null){
											event.target.pauseVideo(); //pause video at start;
											setTimeout(function(){event.target.playVideo();},myvideo.attr("data-pduowm-video-delay")*1000);//start it X*1000 (must be converted to millisec)
										}
									}
								}
							});
						} else {
							var video_div =$(this);
							var videos = $(this).text().split('\n')
							//console.log(videos);
							
							video_div.empty(); //delete videos
							video_div.append("<video preload='auto' tabindex='0' controls=''><source></source></video>"); //append a html5 video tag
							//playlist(video_div,videos,"video");
							setTimeout(playlist,video_div.attr("data-pduowm-video-delay")*1000,video_div,videos,"video");
						}
					});
					
					$(".audio_div").each(function(){
						if ($(this).hasClass("hidden_player")) {
							$(this).parent().css({"visibility":"hidden"});
						}
						
						var music_div = $(this);
						var songs = ($(this).text().split('\n')); //get songs
						//console.log(songs);
						music_div.empty(); //delete songs
						music_div.append("<audio preload='auto' tabindex='0' controls=''><source></source></audio>"); //append a html5 audio tag
						//playlist(music_div,songs,"audio");
						setTimeout(playlist,music_div.attr("data-pduowm-audio-delay")*1000,music_div,songs,"audio");
					});
					*/
				}
				div_visibility();
			}
		} else {
			document.getElementById("result").innerHTML = "Sorry, your browser does not support server-sent events...";
		}
		
	}
	//
	//setInterval(div_visibility,3000);
	//setInterval(image_rotation,4000);
	//setInterval(rss_update,100000);
	//window.onload = div_visibility;
});

window.onYouTubePlayerAPIReady = function(){
	
}
