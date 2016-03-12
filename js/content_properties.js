var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


function image_rotation(object,ind) { //rotate images
	$(object).find("img").hide();
	$(object).find("img:eq("+ind+")").show();
}

function rss_update(){ //load rss link
	$(".rss_feed").each(function(){
		//console.log($(this).attr("data-pduowm-rss-items"));
		$(" > p",this).remove();
		$(this).css("overflow","hidden");
		$(this).load("rss_update.php",{url:$(this).attr("data-pduowm-rss"),items:$(this).attr("data-pduowm-rss-items")});
	});
}

function get_date(attr_date,hour,minute,second){ //get a date object
	var date = attr_date.split("/");
	var day = date[0]; //day
	var month = date[1]; //month
	var year = date[2]; //year
	
	var day_obj = new Date(); //day and time
	day_obj.setDate(day);
	day_obj.setMonth(month-1);
	day_obj.setFullYear(year);
	day_obj.setHours(hour);
	day_obj.setMinutes(minute);
	day_obj.setSeconds(second);
	
	return day_obj;
}

function get_time(attr_time){ //get time splitted in hour and minute
	var time = attr_time.split(":");
	return time; //time[0]->hour, time[1]->minute
}


function show_hid_div(div_obj,true_string,false_string){ //manage the appearence or disapperance of divs

	var end_day, start_day;
	if ( $(div_obj).attr("data-pduowm-end-date") == "") {

	}
	
	
	if ($(div_obj).attr("data-pduowm-end-date") != "") {
		var end_day = get_date($(div_obj).attr("data-pduowm-end-date"),23,59,59); //ending day
	}
	
	if ($(div_obj).attr("data-pduowm-start-date") != "") {
		var start_day = get_date($(div_obj).attr("data-pduowm-start-date"),00,00,00); //staring day
	}
	
	//var start_day = get_date($(div_obj).attr("data-pduowm-start-date"),00,00,00); //staring day
	//var end_day = get_date($(div_obj).attr("data-pduowm-end-date"),23,59,59); //ending day
	
	var now = new Date();

	var weekday = new Array(7);
	weekday[0]=  "sun";
	weekday[1] = "mon";
	weekday[2] = "tue";
	weekday[3] = "wed";
	weekday[4] = "thu";
	weekday[5] = "fri";
	weekday[6] = "sat";	
	var day_of_week = weekday[now.getDay()];
	
	
	if ((now >= start_day && now <= end_day) || (now >= start_day && typeof end_day == "undefined") || (now <= end_day && typeof start_day == "undefined")) {
		if ($(div_obj).attr("data-pduowm-week-days").indexOf(day_of_week) != -1 ) {
			
			var start_time = $(div_obj).attr("data-pduowm-start-time");
			var end_time = $(div_obj).attr("data-pduowm-end-time");
			
			var hour = (now.getHours() <= 9) ? '0'+now.getHours() : now.getHours(); //add leading zero if needed
			var minute = (now.getMinutes() <= 9) ? '0'+now.getMinutes() : now.getMinutes(); //add leading zero if needed.
			var now_time = hour+":"+minute;
			//console.log(start_time,now_time,end_time);
			if ((now_time >= start_time && now_time <= end_time) || (now_time >= start_time && typeof end_time == "undefined") || (now_time <= end_time && typeof(start_day) == "undefined")) {
				$(div_obj).css("visibility",true_string);
			} else if (now_time < start_time || now_time > end_time) {
				$(div_obj).css("visibility",false_string);
			}
		} else {
			$(div_obj).css("visibility",false_string);
		}
	} else if (now < start_day || now > end_day) {
		$(div_obj).css("visibility",false_string);
	}
	//return div_obj;
	//console.log(start);
	//console.log(end);
}

function div_visibility(){
	$("body > div").each(function(ind) {
		if ($(this).attr("data-pduowm-div-visib") == "show" ){
			show_hid_div($(this),"visible","hidden");
		}
		
		if ($(this).attr("data-pduowm-div-visib") == "hide" ){
			show_hid_div($(this),"hidden","visible");
		}
	});
}

function init_qrcode(qr_un_id){ //set a qrcode to change layout
	$(".qrcode_layout").attr("id","qrcode");
	$(".qrcode_layout").empty();
	var qrcode = new QRCode(document.getElementById("qrcode"), {
		text : window.location.protocol+'//'+window.location.host+"/pd_uowm/select_layout.php?qr="+qr_un_id,
		width : 100,
		height : 100,
		correctLevel : QRCode.CorrectLevel.H
	});
}

function playlist(elem,list,type) { //elem : a div with class .audio_div, list:songs
	var current = 0;
	//console.log(elem+" "+list+" "+type);
	
	if (type == "audio") {
		$(" > audio",elem)[0].volume = 1; //max sound
		
		current  = playsong(current,list,elem,type);
		
		$(" > audio",elem)[0].addEventListener('ended',function(e){ //if a song has ended
			if (current == list.length - 1) { // start from the beginning if current reached track length.
				current = 0;
			}
			current = playsong(current,list,elem,type);
		});
	} else if (type == "video") {
		$(" > video",elem)[0].volume = 1; //max sound
		
		current  = playsong(current,list,elem,type);
		
		$(" > video",elem)[0].addEventListener('ended',function(e){ //if a video has ended
			if (current == list.length - 1) { // start from the beginning if current reached track length.
				current = 0;
			}
			current = playsong(current,list,elem,type);
		});
	}
}

function playsong(current,list,elem,type) { //current: current index of songs. list:list of songs. elem: a div with class .audio_div
	if (type == "audio") {	
		do {
			var file_type = list[current].slice(-3); //get the last three characters
			current++; //go to the next entry
		} while (file_type != "mp3" && file_type != "ogg" && file_type != "wav" && current == list.length);
		
		$(" > audio",elem)[0].src = list[current - 1]; // current has been already increased, we need the previous index
		$(" > audio",elem)[0].play();
		return current;
	} else if (type == "video") {
		do {
			var file_type = list[current].slice(list[current].lastIndexOf(".")+1); //get file type
			current++; //go to the next entry
		} while (file_type != "mp4" && file_type != "ogg" && file_type != "webm" && current == list.length);
		
		$(" > video",elem)[0].src = list[current - 1]; // current has been already increased, we need the previous index
		$(" > video",elem)[0].play();
		return current;
	}
}


function div_properties(qr_id) {
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
		console.log("hi there");
		$(this).parent().css({"visibility":"hidden"});
		$(this).css({"visibility":"visible"});
	});

	//div_visibility();
	//rss_update();

	$(".scrolling_text").each(function(){
		var time_in_sec = $(this).css("animation-duration");
		console.log(time_in_sec);
		$(this).css("animation-duration",$(this).attr("data-pdm-animation-duration"))
	});

	$(".slideshow").each(function(){
		var elem = $(this);
		console.log(elem);
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
}
