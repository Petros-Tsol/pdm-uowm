<!DOCTYPE html>
<?php
	session_start();
	if (isset($_SESSION['device_id'])){
		if (!isset($_COOKIE['dev_id'])) {
			$cookie_life = 1000; // how much time the screen will be active (in seconds)
			setcookie('dev_id',$_SESSION['device_id'],time()+$cookie_life,'/'); //5 sec have already passed because of the page reload
			require_once('connect.inc');
			require_once('connect2db');
			$conn=connect_db($host,$db,$db_user,$db_pass);

			$sql_query=$conn->prepare("UPDATE screens SET valid_time=? WHERE webid=?");
			$sql_query->bindValue(1,time() + $cookie_life);
			$sql_query->bindParam(2,$_SESSION['device_id']);
			$sql_query->execute();
			
			$conn = NULL;
			//session_destroy();
			unset($_SESSION['device_id']);
		}
	} else {
		if (isset($_COOKIE['dev_id'])) {
			
		}
	}
?>
<html>
<head>
	<meta charset="UTF-8">
	<title>PD UOWM - DISPLAY</title>
	
	<link rel="stylesheet" type="text/css" href="css/main.css">
	
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	
	<script src="../flipclock/flipclock.js"></script>
	<link rel="stylesheet" href="../flipclock/flipclock.css">

	<script type="text/javascript" src="js/qrcode.js"></script>
	<script type="text/javascript" src="http://service.24media.gr/js/deltiokairou_widget.js"></script>
	
	<style>
		html {
			width:99%;
			height:99%;
			overflow:hidden;
		}
		
		#pdm_choose_screen{
			width:40em;
			margin:0px auto;
			box-sizing:border-box;
			background-color:#A9FFFF;
			text-align:center;
			padding:2em 4em;
		}
		
		#pdm_title {
			text-align:center;
			color: blue;
			font-size:3em;
		}
		
		.rss_feed > div { /* rss feed animation on client */ /* [28] */
			/* Normal move from right to left */
			-webkit-animation-direction: normal; 
			animation-direction: normal;
			
			/* How long it will be last */
			-webkit-animation-duration: 60s;
			animation-duration: 60s;
			
			/* How many times it will be executed */
			-webkit-animation-iteration-count: infinite;
			animation-iteration-count: infinite;
			
			/* Animation name */
			-webkit-animation-name: auto_scroll_rss;
			animation-name: auto_scroll_rss;
			
			/*Keep the same speed throught the move */
			-webkit-animation-timing-function: linear;
			animation-timing-function: linear;
		}
		
		.scrolling_text span{
			/* Starting position far right 
			-webkit-transform:translateX(100%);	
			transform:translateX(100%); */
			
			/* Normal move from right to left */
			-webkit-animation-direction: normal; 
			animation-direction: normal;
			
			/* How long it will be last */
			-webkit-animation-duration: 10s;
			animation-duration: 10s;
			
			/* How many times it will be executed */
			-webkit-animation-iteration-count: infinite;
			animation-iteration-count: infinite;
			
			/* Animation name */
			-webkit-animation-name: scroll_text;
			animation-name: scroll_text;
			
			/*Keep the same speed throught the move */
			-webkit-animation-timing-function: linear;
			animation-timing-function: linear;
		}
		
		@-webkit-keyframes auto_scroll_rss{ /* scroll text animation */
			100% {-webkit-transform:translateY(-100%);}
		}
			
		@keyframes auto_scroll_rss{ /* scroll text animation */
			to {transform:translateY(-100%);}
		}
	
		@-webkit-keyframes scroll_text{ /* rss text animation */
			100% {left:0%;-webkit-transform:translateX(-100%);}
		}
		
		@keyframes scroll_text{ /* rss text animation */
			to {left:0%;transform:translateX(-100%);}
		}
	</style>
</head>

<body>

<?php
	function select_device($connection){
		print "<div id = 'pdm_choose_screen'>";
		
		echo "No cookie detected for this screen. Please select the device for this screen and press install.";
		print "<br><br>";
		
		$sql_query=$connection->prepare("SELECT id FROM users_information WHERE username = ?");
		$sql_query->bindParam(1,$_SESSION['admin']);
		$sql_query->execute();
		$user_id = $sql_query->fetch();
		
		$sql_query=$connection->prepare("SELECT screens_groups.group_id, screen_id FROM screens_groups JOIN users_privileges ON screens_groups.group_id = users_privileges.group_id JOIN screens ON screens_groups.screen_id = screens.id WHERE users_privileges.user_id=? AND screens.webid=? ORDER BY screens_groups.group_id");
		$sql_query->bindParam(1,$user_id['id']);
		$sql_query->bindValue(2,"");
		$sql_query->execute();
		
		$result = $sql_query->fetchAll(PDO::FETCH_COLUMN|PDO::FETCH_GROUP);
		print "<select id = 'screen'>";
		foreach ($result as $index=>$row) {
			$sql_query=$connection->prepare("SELECT description FROM groups WHERE id = ?");
			$sql_query->bindParam(1,$index);
			$sql_query->execute();
			$group_res=$sql_query->fetch();
			print '<optgroup label="'.$group_res['description'].'">';
			
			for ($i=0;$i<count($row);$i=$i+1){
				$sql_query=$connection->prepare("SELECT name FROM screens WHERE id = ?");
				$sql_query->bindValue(1,$row[$i]);
				$sql_query->execute();
				$screen_res = $sql_query->fetch();
				print '<option value = "'.$screen_res['name'].'">'.$screen_res['name'].'</option>';
			}
				
			print '</optgroup>';
		}
		print "</select>";
		print "<button type='button'>Install</button><br>";
		print "<br>";
		print "If no screen is visible then you have probably <a href='login_page.php'>logged out</a> or the administrator has not added a screen for your group yet.";
		
		print "</div>";
	}

	if (!isset($_COOKIE['dev_id']))
	{
		require_once('connect.inc');
		require_once('connect2db');
		
		$conn=connect_db($host,$db,$db_user,$db_pass);
		print '<h1 id = "pdm_title">UOWM PUBLIC DISPLAY</h1>';
		select_device($conn);
		
		include 'footer.php';
		$conn = NULL;
		unset($_SESSION['device_id']);
	} else {
		//echo "Hooray!!! The cookie has been placed. <br />";
		/*} else {
			require_once('connect.inc');
			require_once('connect2db');
		
			$conn=connect_db($host,$db,$db_user,$db_pass);
			
			$sql_query=$conn->prepare("UPDATE Screens SET WebID=? WHERE WebID=?"); //delete the webid after the session expires
			$sql_query->bindValue(1,"");
			$sql_query->bindParam(2,$_SESSION['device_id']);
			$sql_query->execute();
			
			session_unset();
			session_destroy();
			
			select_device($conn);
		
			mysql_close($conn);
		} */
	}
?>
<script>

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


$(document).on('click','button',function() {
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

function image_rotation(object,ind) {
	$(object).find("img").hide();
	$(object).find("img:eq("+ind+")").show();
}

function rss_update(){
	//$(".rss_feed").css({"background-color":"yellow"});// THIS SHOULD WORK!!!
	$(".rss_feed").each(function(){
		//console.log($(this).attr("data-pduowm-rss-items"));
		$(this).load("rss_update.php",{url:$(this).attr("data-pduowm-rss"),items:$(this).attr("data-pduowm-rss-items")});
	});
}

function get_date(attr_date,hour,minute,second){
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

function get_time(attr_time){
	var time = attr_time.split(":");
	return time; //time[0]->hour, time[1]->minute
}

function show_hid_div(div_obj,true_string,false_string){
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
			console.log(start_time,now_time,end_time);
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

function init_qrcode(qr_un_id){
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
	//var flag = 1; //when flag == 0 then it means that the data have arrived and the functions must not run again from the beggining. if we ommit this variable the function (rss_update(), div_visibility() etc.) will rerun every 6 sec (this is the interval we get data from the server)
	if (getCookie("dev_id") != ""){ //connect to server to get new data.
		if(typeof(EventSource) !== "undefined") {
			var source = new EventSource("update_screen.php");		
			source.onmessage = function(event) {
				var data = JSON.parse(event.data);
				//console.log(data);
				if (data.html == "NOMOREDATA") { //close the connection when cookie expires
					source.close();
				} else if (data != "0") {
					$("body").empty();
					
					if (data.bg_opt == "stretched") {
						$("body").css('background-repeat','no-repeat');
						$("body").css('background-size','100% 100%')
					} else if (data.bg_opt == "tilled") {
						$("body").css('background-repeat','repeat');
						$("body").css('background-size','auto auto');
					}		
					$("body").css('background-image',data.bg_img);
					$("body").css('background-color',data.bg_color);
					$("body").append(data.html);
					//console.log(event.data);
					
					var qr_id = data.qr;
					$(".qrcode_layout").each(function(){
						$(this).parent().css({"visibility":"hidden"});
						$(this).css({"visibility":"visible"});
						init_qrcode(qr_id);
					});
					
					$(".qrcode_link").each(function(){
						$(this).parent().css({"visibility":"hidden"});
						$(this).css({"visibility":"visible"});
					});
					
					$(".weather_script").each(function(){
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
						setInterval(function() {image_rotation(elem,index++ % elem.children("img").length)},elem.attr("data-pduowm-time-rotation")*1000);
					});
					
					$(".countdown_visibility").each(function(){
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
					
					$(".clock_visibility").each(function(){
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

</script>
</body>
</html> 
