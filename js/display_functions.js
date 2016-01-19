//THE FIRST TWO FUNCTIONS TAKE PLACE BEFORE WE INSTALL A COOKIE FOR THIS SCREEN

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


$(document).on('click','button',function() { //when install button clicked.
	var screen = $("#screen").val();
	if (screen != null){
		$.ajax({
			type: "POST",
			url: "update_screen_db.php",
			data : {name:screen}
		})
		 .done(function(server_echo) {
			if (server_echo = "ok") { 
				window.location.replace("/pd_uowm/redirect.html");
				//redirect to redirect.html because of the cookie
			} else {
				alert(server_echo);
			}
		});
	}
	
});

//AFTER THIS POINT THESE FUNCTIONS MANIPULATE THE DATA THAT HAVE RECEIVED FROM THE SERVER

function image_rotation(object,ind) { //rotate images
	$(object).find("img").hide();
	$(object).find("img:eq("+ind+")").show();
}

function rss_update(){ //load rss link
	$(".rss_feed").each(function(){
		//console.log($(this).attr("data-pduowm-rss-items"));
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
	var start_day = get_date($(div_obj).attr("data-pduowm-start-date"),00,00,00); //staring day
	var end_day = get_date($(div_obj).attr("data-pduowm-end-date"),23,59,59); //ending day
	
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
	
	if (now >= start_day && now <= end_day) {
		if ($(div_obj).attr("data-pduowm-week-days").indexOf(day_of_week) != -1 ) {
			var start_time = $(div_obj).attr("data-pduowm-start-time");
			var end_time = $(div_obj).attr("data-pduowm-end-time");
			
			var hour = (now.getHours() <= 9) ? '0'+now.getHours() : now.getHours(); //add leading zero if needed
			var minute = (now.getMinutes() <= 9) ? '0'+now.getMinutes() : now.getMinutes(); //add leading zero if needed.
			var now_time = hour+":"+minute;
			//console.log(start_time,now_time,end_time);
			if (now_time >= start_time && now_time <= end_time) {
				$(div_obj).css("visibility",true_string);
			} else {
				$(div_obj).css("visibility",false_string);
			}
		} else {
			$(div_obj).css("visibility",false_string);
		}
	} else {
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


$(function() {
	if (getCookie("dev_id") != ""){ //connect to server to get new data.
		if(typeof(EventSource) !== "undefined") {
			var source = new EventSource("update_screen.php");		
			source.onmessage = function(event) {
				var data = JSON.parse(event.data);
				//console.log(data);
				if (data.html == "NOMOREDATA") { //close the connection when cookie expires
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
					
					div_visibility();
					rss_update();
					
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
					
					
				}
			}
		} else {
			document.getElementById("result").innerHTML = "Sorry, your browser does not support server-sent events...";
		}
	}
	
	//setInterval(div_visibility,3000);
	//setInterval(image_rotation,4000);
	//setInterval(rss_update,100000);
	//window.onload = div_visibility;
});
