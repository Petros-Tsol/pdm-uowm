//last_clicked_div = "";
//last_clicked_div_border = "";
content_name_from_db = "";

function warning_message(){
	return "You are about to leave. Any unsaved layout or content will not be stored.";
}

function draw(){ //function to draw divs
	i = 1; // number of divs created by user, global variable.
	layout_id = 0; // number of layout, global variable
	$('#draw_area').selectable({					
		start : function(e) { // start point of div
			//start_x=e.pageX - this.offsetLeft;
			start_x=e.pageX - $(this).offset().left;
			//start_y=e.pageY - this.offsetTop;
			start_y=e.pageY - $(this).offset().top;
		},

		
		stop : function(e) { // end point of div
			end_x = e.pageX - this.offsetLeft;
			end_y = e.pageY - this.offsetTop;
			
			if (end_x > $("#draw_area").width()) {
				//end_x = $("#draw_area").width() + this.offsetLeft;
				end_x = $("#draw_area").width();
			}
			
			if (end_y > $("#draw_area").height()) {
				//end_y = $("#draw_area").height() + this.offsetTop;
				end_y = $("#draw_area").height();
			}
			
			if (end_x < 0) {
				end_x = 0;
			}
			
			if (end_y < 0) {
				end_y = 0;
			}
			
			width = Math.abs(end_x - start_x);
			height = Math.abs(end_y - start_y);
			if (width >= 60 && height >= 20) {
				if (end_x > start_x && end_y > start_y) { //direction top->bottom and left->right
					//width = end_x - start_x;
					//height = end_y - start_y;
				} else if (end_x > start_x && start_y > end_y){ //direction bottom->top and left->right
					//width = end_x - start_x;
					//height = start_y - end_y;
					start_y = end_y;
				} else if (start_x > end_x && end_y > start_y){ //direction top->bottom and right->left
					//width = start_x - end_x;
					//height = end_y - start_y;
					start_x = end_x;
				} else if (start_x > end_x && start_y > end_y) { //direction bottom->top and right->left
					//width = start_x - end_x;
					//height = start_y - end_y;
					start_x = end_x;
					start_y = end_y;
				}

				$(this).append('<div class="draw_div" id ="div' + i +'" data-pdm-draw-div="div'+i+'"></div>');
				newdiv = $('#div'+i);
				
				$(newdiv).css({
					"width" : (100* width / $("#draw_area").width())+'%', 
					"height" : (100*height / $("#draw_area").height())+'%', 
					"left" : (100*start_x / $("#draw_area").width())+'%',
					"top" : (100*start_y / $("#draw_area").height())+'%',
					"background-color" : "#FFFFFF",
					"position" : "absolute",
					"border" : "1px solid",
					"z-index" : 1
				});
							
				$(newdiv).append('<h5 class = "div_name">div'+i+'</h5>');
				$(newdiv).append('<button type="button" id = "close'+i+'" class = "close_btn">X</button>');
				
				$(newdiv).draggable({containment: "parent"});
				$(newdiv).resizable({containment: "parent", minHeight:20, minWidth:60});
				get_divs("current_divs");
				get_divs("mode");

				i++;
			}
		}
	});
}

$(document).on("click",".draw_div",function(){
	var slc_div = $(this).attr("data-pdm-draw-div");
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");
	$("#mydiv").val(slc_div);
	$("#mydiv").trigger("click");
	
	$("#manage_div").val(slc_div);
	$('#'+div_unique_id).removeClass("draw_div_hover");
	$("#manage_div").trigger("change");
	$('#'+div_unique_id).addClass("draw_div_hover");
});

$("#draw_area").on({
	mouseenter: function() {
		$(this).addClass("draw_div_hover");
	},
	mouseleave: function(){
		$(this).removeClass("draw_div_hover");
	}
	},".draw_div");

/*
$(".draw_div").hover(
	function(){
		$(this).addClass("draw_div_hover");
		console.log("mpika");
	}, function() {
		$(this).removeClass("draw_div_hover");
	}
);*/


$(document).on("dragstop",".draw_div",function(){ //if a div moved, recalculate new position and convert width, height, top, and left in percentages in order to fit in any screen resolution.
	start_y = $(this).position().top; //this work for sure for position() instead of offset()!!!!
	start_x = $(this).position().left;
	height = $(this).height();
	width = $(this).width();
	$(this).css({
		"top":  (100* start_y / $("#draw_area_cont").height())+'%',
		"left": (100* start_x / $("#draw_area").width())+'%',
		"height":  (100* height / $("#draw_area_cont").height())+'%',
		"width": (100* width / $("#draw_area").width())+'%'
	});
	
	if ($(this).position().left < 0 ) {
		$(this).css("left",0+'%');
	}
	
	if ($(this).children(".clock_visibility").length || $(this).children(".countdown_visibility").length || $(this).children(".qrcode_link").length || $(this).children(".qrcode_layout").length || $(this).children(".weather_script").length) {
		
		var which_element = $(this).children(".clock_visibility").length ? ".clock_visibility" : $(this).children(".countdown_visibility").length ? ".countdown_visibility" : $(this).children(".qrcode_link").length ? ".qrcode_link" : $(this).children(".qrcode_layout").length ? ".qrcode_layout" : ".weather_script";
		
		var centerX = $(this).offset().left + $(this).width() / 2 ;
		
		//console.log("centerX : "+centerX);
		//console.log("area width : "+$("#draw_area").width());
		
		if (centerX < $("#draw_area").width() / 2) {
			$(" > "+which_element,this).css({"float":"left"});
		} else {
			$(" > "+which_element,this).css({"float":"right"});
		}
	}
});

$(document).on("resize",".draw_div",function(){//if a div resized, recalculate new size and convert width, height in percentages in order to fit in any screen resolution.
	height = $(this).height();
	width = $(this).width();
	$(this).css({
		"height":  (100* height / $("#draw_area").height())+'%',
		"width": (100* width / $("#draw_area").width() )+'%'
	});
});


function load_layouts(){ //function to load the saved layouts and append them to #saved_layouts
// function to draw thubs	
	$.ajax({
		type:"POST",
		dataType:"json",
		url:"layout_sql.php",
		data : {button:"layouts"}
	})
	 .done(function(n) {
		//alert(n[4][0]);
		$.each(n,function(ix){
			$("#saved_layouts").append('<div class="wrapper"><div class="thub_layout" id="thub'+n[ix][1]+'"></div><button class = "dlt_layout">Delete</button></div>');
			thub = $('#thub'+n[ix][1]);

			$(thub).append(n[ix][0]);		
		});
	});
}

function load_contents(elem){
	$.ajax({
		type:"POST",
		dataType:"json",
		url:"layout_sql.php",
		data : {button:"contents"}
	})
	.done(function(n) {
		/*
		$("#load_content").append('<option value ="pdm-default00">Content to load</option>');
		$.each(n,function(ix){
			$("#load_content").append('<option value ="'+n[ix][0]+'">'+n[ix][0]+'</option>');
		});*/
		if (elem == "load_content") {
			$("#"+elem).append('<option value ="pdm-default00">Content to load</option>');
		} else if (elem == "update_content" || elem == "select_content_rotation") {
			$("#"+elem).append('<option value ="pdm-default00">Select content</option>');
		}
		$.each(n,function(ix){
			if (n[ix][0] == content_name_from_db) {
				$("#"+elem).append('<option value ="'+n[ix][0]+'" selected>'+n[ix][0]+'</option>');
			} else {
				$("#"+elem).append('<option value ="'+n[ix][0]+'">'+n[ix][0]+'</option>');
			}
		});
	});
}

function get_divs(element){//function to create a select box of the created divs
//get the id attr of selected layout and generate select input
	var divs = [];
	divs = $("#draw_area").children().map(function() //get the ids
	{
		return $(this).attr("data-pdm-draw-div");
	}).get();
	
	var select_id = (element=="mode") ? "mydiv" : "manage_div";
	
	//$("#"+element).empty(); // print the drop down menu
	
	$("#"+element+" > select").remove();
	$("#"+element+" > button").remove();
	
	if (element == "current_divs"){
		$("#"+element).empty();
	}
	
	$("#"+element).prepend('<select id="'+select_id+'">');
	for (var i=0; i<divs.length; i++) {
		$("#"+element+" > select").append('<option value="'.concat(divs[i],'">',divs[i],'</option>'));
	}
	$("#"+element+ " > select:last").after('</select>');
	//$("#"+element+ " > select > option:last").prop('selected',true);
	$("#"+element+ " > select > option:last").prop('selected', true);
	$("#"+element+ " > select > option:last").trigger("click");
	
	if (element == "current_divs"){
		$("#"+element).append('<button type="button" id="fade_toggle_div">Fade Div</button>');
		$("#"+element).append('<button type="button" id="toggle_border" class = "active_border">Border</button>');
		$("#"+element).append('<button type="button" id="rename_div">Rename Div</button><br><br>');
		$("#"+element).append('<label for = "div_z_index">z-index (default 1)</label>');
		$("#"+element).append('<input id = "div_z_index" class="spinner"><br>');
		$("#"+element).append('<label for = "div_opacity">opacity (default 1)</label>');
		$("#"+element).append('<input id = "div_opacity" class="spinner"><br>');
		$("#"+element).append('<span>background color</span>');
		$("#"+element).append('<div id = "div_bg_color" class="colorpick_div"></div>');
		spin();
	} else if (element = "mode") {
		$("#"+element+" > #"+select_id).after('<button type="button" id="clear_div">Clear Div Content</button>');
	}
}

$(document).on('change',"#manage_div", function() { //in manage divs menu get the values of opacity z-index and background color of the selected div.
	//if (last_clicked_div) {
	//	$("#"+last_clicked_div).css("border",last_clicked_div_border);
	//}
	
	var slc_div = $("#manage_div").val();
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");
	
	$(".draw_div").removeClass("wrapper_divs");
	
	
	var z_index = $('#'+div_unique_id).css("z-index");
	var opac = $('#'+div_unique_id).css("opacity");
	var color = $('#'+div_unique_id).css("background-color");
	var border_style = $('#'+div_unique_id).css("border-right-style");
	console.log(border_style);
	
	//last_clicked_div = div_unique_id;
	//last_clicked_div_border = document.getElementById(div_unique_id).style.border;
	//$("#"+last_clicked_div).css("border","4px solid red");
	
	
	var bg_color_split=color.split(","); // split it with ',' keep numbers and convert to integers
	bg_color_split[0]=parseInt(bg_color_split[0].replace(/\D+/,''),10);
	bg_color_split[1]=parseInt(bg_color_split[1].replace(/\D+/,''),10);
	bg_color_split[2]=parseInt(bg_color_split[2].replace(/\D+/,''),10);
	
	bg_color_split[0]=bg_color_split[0].toString(16); //convert dec to hex.
	bg_color_split[1]=bg_color_split[1].toString(16);
	bg_color_split[2]=bg_color_split[2].toString(16);
		
	var bg_color=bg_color_split[0]+bg_color_split[1]+bg_color_split[2]; //concatenate
	//console.log(bg_color);
	$("#div_z_index").val(z_index);
	$("#div_opacity").val(opac);
	
	if (border_style == "solid"){
		$("#toggle_border").addClass("active_border");
	} else {
		$("#toggle_border").removeClass("active_border");
	}
	
	$("#div_bg_color").css('background-color','#'+bg_color);
	$("#div_bg_color").colpickSetColor(bg_color,true)
	$("#div_bg_color").colpick({submit:1, layout:'hex',
	onSubmit:function(hsb,hex,rgb,el,bySetColor) {
		var slc_user_div = $("#manage_div").val();
		div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_user_div+"]").attr("id");
		$(el).css('background-color','#'+hex);
		$('#'+div_unique_id).css('background-color','#'+hex);
		$(el).colpickHide();
		return false;
	}});
	
	$("#"+div_unique_id).addClass("wrapper_divs");
});

$(document).on('change',"#device", function() {
	var which_device = $("#device").val();
	
	if ($("#device option:selected").text() != "(update all)"){
		$("#update_screen_scheduler").text("Update Screen Scheduler for "+which_device);
		$.ajax({
			type:"POST",
			dataType:"json",
			url:"layout_sql.php",
			data : {screen:which_device,button:"load_scheduler"}
		})
		 .done(function(server_echo) {
			//console.log(server_echo);
			//console.log(server_echo['error']);

			if (typeof server_echo['error'] == "undefined") {
				$("#current_contents > ol").empty();
				$("#current_contents > #content_rotation_echo").remove();
				for (var data_index = 0 ; data_index < server_echo.length ; data_index++) {
					$("#current_contents > ol").append('<li><span>'+server_echo[data_index]+'</span><button class="remove_scheduled_content close_buttons_style">&#10005</button></li>');
				}
			} else {
				$("#current_contents > ol").empty();
				$("#current_contents > #content_rotation_echo").remove();
				$("#current_contents > ol").after('<p id = "content_rotation_echo">'+server_echo['error']+'</p>');
			}
		});
		
	}
});


function clear_server_return() {
	$("#server_return").empty();
	$("#server_return").css("display","inline-block");
}


function preview_screen(){ //function to preview a content
	var preview_window_width = $("#preview_width").val();
	var preview_window_height = $("#preview_height").val();
	
	if (isNaN(preview_window_width) == true || preview_window_width == "") {
		preview_window_width = window.screen.availWidth;
	}
	
	if (isNaN(preview_window_height) == true || preview_window_height == "") {
		preview_window_height = window.screen.availHeight;
	}
	
	var data_html = [];
	data_html = save_content();
	if (data_html[2]=="stretched"){
		data_html[2]="no-repeat";
		var bg_size = "100%";
	} else if (data_html[2] == "tilled") {
		data_html[2] = "repeat";
		var bg_size = "auto";
	}
	
	//alert(draw_area_data);
	//http://service.24media.gr/js/deltiokairou_widget.js
	preview_data = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Layout Preview</title><style>html{width:100%; height:100%; overflow:hidden} body {background-color:'+data_html[0]+'; background-image:'+data_html[1]+'; background-repeat:'+data_html[2]+'; background-size:'+bg_size+' '+bg_size+'; width:100%; height:100%;} .video_div{height:100%;} video{min-width: 100%; min-height: 100%; width: inherit; height: inherit;} div:not(.weather_script) > iframe{width:100%;height:100%;}</style><link rel="stylesheet" type="text/css" href="css/rss_and_scrolling_animation.css"><script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script><script src="flipclock/flipclock.js"></script><link rel="stylesheet" href="flipclock/flipclock.css"><script type="text/javascript" src="js/qrcode.js"></script><script src="js/content_properties.js"></script><script type="text/javascript" src="js/deltiokairou_widget.js"></script></head><body>'+data_html[3]+'<script>$(function() { div_properties("ID WILL BE GENERATED AT SCREEN UPDATE"); rss_update(); div_visibility(); });</script></body></html>';
	preview_window = window.open("", "Preview", "width="+preview_window_width+",height="+preview_window_height+",resizable=no, menubar=no");
	preview_window.document.open();
	preview_window.document.write(preview_data);
	preview_window.document.close();
}


function update_screen(){ //update current screen selected with the content in the #draw_area
	//get the device or group
	var slc_device = $("#device").val();
	var slc_content = $("#load_content").val();
	
	if ($("#device option:selected").text() == "(update all)") {
		var slc_group = "yes";
		var group_name = $("#device :selected").parent().attr("label");
	} else {
		var slc_group = "no";
	}
	
	if (slc_content != "pdm-default00") {
		//get the bg color
		if (slc_group == "no") {
			var answer = confirm("You are about to push a content named "+slc_content+" to screen "+slc_device+". Are you sure about this?");
		} else {
			var answer = confirm("You are about to push a content named "+slc_content+" to group "+group_name+". Are you sure about this?");
		}
		
		if (answer == true) {
			$.ajax({
				type:"POST",
				url:"update_screen_db.php",
				data : {device_name:slc_device,group:slc_group,content:slc_content}
			})
			 .done(function(server_echo) {
				$("#server_return").empty();
				$("#server_return").append('<span style="background-color:#C1BE2B;">'+server_echo+'</span>');
			});
		}
	} else {
		alert("Please select a content");
	}
}

$(document).on('click','.close_btn',function(e) { //delete the clicked div when X pressed
	$(e.currentTarget).parent().remove();
	get_divs("current_divs");
	get_divs("mode");
});

$(document).on('click','.dlt_layout',function() { //delete the clicked layout when delete pressed
	var elem = $(this);
	var layout_id_str = elem.prev().attr("id"); //its like thubXXX ~ XXX an integer
	var patt=/[^0-9]/g;
	layout_id_str = layout_id_str.replace(patt,''); //remove thub keep XXX
	
	$.ajax({
		type:"POST",
		url:"layout_sql.php",
		data : {button:"delete_layout",id:layout_id_str}
	})
	 .done(function(server_echo) {
		if (server_echo == "Layout deleted.") {
			//elem.parent().remove();
			$("#saved_layouts").empty();
			load_layouts();
			$("#server_return").empty();
			$("#server_return").append('<span style="background-color:#C1BE2B;">'+server_echo+'</span>');
			if (layout_id_str == layout_id) {
				$("#new_btn").trigger('click');
			}
		}
	});
});

$(document).on('click','#add_content',function() { //add content in content scheduler
	var slc_content = $("#select_content_rotation").val();
	$("#current_contents > ol").append('<li><span>'+slc_content+'</span><button class = "remove_scheduled_content close_buttons_style">&#10005</button></li>');
});

$(document).on('click','.remove_scheduled_content',function(){ //remove content from content scheduler
	$(this).parent().remove();
	$(this).remove();
});

$(document).on('click','#update_screen_scheduler',function() { //update database with the new content scheduler for the selected screen
	var rotation_time = $("#content_sec_rotate").val();
	var slc_scr = $("#device").val();
	
	var pattern = /^\d+$/;
	
	if (pattern.test(rotation_time)) {
		var content_scheduler = $("#current_contents > ol > li > span").map(function() { return $(this).text() }).get();
		
		if (content_scheduler.length > 0) {
			$.ajax({
				type:"POST",
				url:"update_screen_db.php",
				data : {button:"update_screen_scheduler",screen:slc_scr,contents:content_scheduler,time_sec:rotation_time}
			})
			 .done(function(server_echo) {
				//console.log(server_echo);
				$("#server_return").empty();
				$("#server_return").append('<span style="background-color:#C1BE2B;">'+server_echo+'</span>');
			});
		}
	} else {
		$("#server_return").empty();
		$("#server_return").append('<span style="background-color:#C1BE2B;">Seconds must be a positive number.</span>');
	}
});

$(document).on('click','#new_btn',function() { //when new layout pressed clear the #draw_area
	$("#draw_area").empty();
	$("#draw_area").css({
		"background-image":"none",
		"background-color":"#f1f9b8"
	});
	i=1;
	layout_id = 0;
	//last_clicked_div="";
	//last_clicked_div_border="";
});

$(document).on('click','#save_btn',function() { //save or update the current layout in database
	var draw_data = $("#draw_area").html(); //get the layout
	//alert(draw_data);
	
	//save the preview
	$("#hidden_draw_area").empty();
	$("#hidden_draw_area").append(draw_data);
	
	$("#hidden_draw_area > .draw_div").each(function() {
		clear_div_content($(this).attr("id"),"hidden_draw_area");
		$(this).css({"background-color":"#FFFFFF",
					"opacity":1,
					"z-index":1
		});
		$(this).removeClass("wrapper_divs");
		$(this).removeAttr("data-pduowm-start-date data-pduowm-end-date data-pduowm-start-time data-pduowm-end-time data-pduowm-div-visib data-pduowm-week-days");
	});
	//$("#hidden_draw_area > .draw_div").removeClass("wrapper_divs");
	/*
	if (last_clicked_div_border == "initial") {
		//$("#hidden_draw_area > #"+last_clicked_div).css("border","");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-top-style","none");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-bottom-style","none");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-left-style","none");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-right-style","none");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-bottom-width","0px");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-top-width","0px");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-left-width","0px");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-right-width","0px");
	} else if (last_clicked_div_border == "1px solid") {
		//$("#hidden_draw_area > #"+last_clicked_div).css("border","");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-bottom-style","solid");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-top-style","solid");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-right-style","solid");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-left-style","solid");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-bottom-width","1px");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-top-width","1px");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-right-width","1px");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-left-width","1px");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-top-color","black");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-bottom-color","black");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-left-color","black");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-right-color","black");
	}*/

	var draw_data = $("#hidden_draw_area").html(); //save layout
	//alert(draw_data);
	
	$("#hidden_draw_area h5").remove();
	$("#hidden_draw_area button").remove();
	$("#hidden_draw_area .ui-resizable-handle").remove();
	$("#hidden_draw_area").children().removeClass();
	$("#hidden_draw_area").children().removeAttr("id");
	var thub_data = $("#hidden_draw_area").html();
	//alert (thub_data);
	
	//alert(draw_data);

	$.ajax({
		type:"POST",
		url:"layout_sql.php",
		data : {html_data:draw_data, scaled_data:thub_data, button:"save_btn", lay_id:layout_id, div_id:i}
	})
	 .done(function(server_echo) {
		var data;
		try {
			data = JSON.parse(server_echo);
			//console.log(data);
		} catch(err) {
			$("#server_return").empty();
			$("#server_return").append('<span style="background-color:#C1BE2B;">'+server_echo+'</span>');
			data = null;
		}
		if (data != null) {
			layout_id = data['id'];
			$("#saved_layouts").empty();
			load_layouts();
			$("#server_return").empty();
			$("#server_return").append('<span style="background-color:#C1BE2B;">'+data['msg']+'</span>');
		}
	}); 
});

function save_content() {
	//get the bg color
	var color = $("#draw_area").css('background-color'); //get the color in rgb(X,Y,Z) pattern
			
	var bg_color_split=color.split(","); // split it with ',' keep numbers and convert to integers
	bg_color_split[0]=parseInt(bg_color_split[0].replace(/\D+/,''),10);
	bg_color_split[1]=parseInt(bg_color_split[1].replace(/\D+/,''),10);
	bg_color_split[2]=parseInt(bg_color_split[2].replace(/\D+/,''),10);
	
	bg_color_split[0]=bg_color_split[0].toString(16); //convert dec to hex.
	bg_color_split[1]=bg_color_split[1].toString(16);
	bg_color_split[2]=bg_color_split[2].toString(16);
		
	var bg_color='#'+bg_color_split[0]+bg_color_split[1]+bg_color_split[2]; //concatenate
	var bg_image = $("#draw_area").css('background-image');
	var bg_option = $("#bg_img_option").val();
	//get the inner content
	var draw_area_data = $("#draw_area").html();
	
	$("#hidden_draw_area").empty();
	$("#hidden_draw_area").append(draw_area_data);
	$("#hidden_draw_area > .draw_div").removeClass("wrapper_divs");
	/*
	if (last_clicked_div_border == "initial") {
		//$("#hidden_draw_area > #"+last_clicked_div).css("border","");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-top-style","none");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-bottom-style","none");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-left-style","none");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-right-style","none");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-bottom-width","0px");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-top-width","0px");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-left-width","0px");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-right-width","0px");
	} else if (last_clicked_div_border == "1px solid") {
		//$("#hidden_draw_area > #"+last_clicked_div).css("border","");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-bottom-style","solid");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-top-style","solid");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-right-style","solid");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-left-style","solid");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-bottom-width","1px");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-top-width","1px");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-right-width","1px");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-left-width","1px");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-top-color","black");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-bottom-color","black");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-left-color","black");
		$("#hidden_draw_area > #"+last_clicked_div).css("border-right-color","black");
	}*/
	

	$("#hidden_draw_area button").remove();
	$("#hidden_draw_area h5").remove();
	$("#hidden_draw_area .ui-resizable-handle").remove();
	//$("#hidden_draw_area .rss_feed > p").remove();
	$("#hidden_draw_area").children().removeClass(function (index, classes){
		classes = classes.replace(/(rss_feed|slideshow|countdown_visibility|clock_visibility|qrcode_layout|weather_script)/,' ');//remove all classes except for slideshow, rss_feed etc
		return classes; 
	});
	$("#hidden_draw_area").children().attr("id","");
	//$("#hidden_draw_area > .rss_feed").css("overflow","hidden");
	$("#hidden_draw_area").children().css("display","block");
	//$("#hidden_draw_area img").closest("div").addClass("slideshow");
	//$("#hidden_draw_area").children().attr("id","");
	
	draw_area_data = $("#hidden_draw_area").html();
	//alert(draw_area_data);
	//var extra_css = convert_css_styles();
	//alert(extra_css);
	return new Array(bg_color,bg_image,bg_option,draw_area_data);
}

$(document).on('click','#upd_curr_cont',function() {
	var data_html = [];
	data_html = save_content();
	console.log(data_html[0],data_html[1],data_html[2],data_html[3]);
	
	$.ajax({
		type:"POST",
		url:"layout_sql.php",
		data : {button:"upd_content",data:data_html[3],bg_clr:data_html[0],bg_img:data_html[1],bg_opt:data_html[2],content_name:content_name_from_db}
	})
	 .done(function(server_echo) {
		$("#load_content").empty();
		$("#update_content").empty();

		load_contents("load_content");
		load_contents("update_content");
		$("#server_return").empty();
		$("#server_return").append('<span style="background-color:#C1BE2B;">'+server_echo+'</span>');
	});
	location.href = "#close";
});

$(document).on('click','.save_cont_btn',function() { //save content in database
	
	if ($(this).parent().attr("id")=="new_cont_name_div") {
		var cont_name = $("#new_cont_name").val();
		var button_pressed = "new_content";
	} else if ($(this).parent().attr("id")=="select_cont_name_div"){
		var cont_name = $("#update_content").val();
		var button_pressed = "upd_content";
	}
	
	if (cont_name != "pdm-default00") {
		if (/\S/.test(cont_name)) { //check if string is not null
			//get the bg color
			/*
			
			var color = $("#draw_area").css('background-color'); //get the color in rgb(X,Y,Z) pattern
			
			var bg_color_split=color.split(","); // split it with ',' keep numbers and convert to integers
			bg_color_split[0]=parseInt(bg_color_split[0].replace(/\D+/,''),10);
			bg_color_split[1]=parseInt(bg_color_split[1].replace(/\D+/,''),10);
			bg_color_split[2]=parseInt(bg_color_split[2].replace(/\D+/,''),10);
			
			bg_color_split[0]=bg_color_split[0].toString(16); //convert dec to hex.
			bg_color_split[1]=bg_color_split[1].toString(16);
			bg_color_split[2]=bg_color_split[2].toString(16);
				
			var bg_color='#'+bg_color_split[0]+bg_color_split[1]+bg_color_split[2]; //concatenate
			var bg_image = $("#draw_area").css('background-image');
			var bg_option = $("#bg_img_option").val();
			//get the inner content
			var draw_area_data = $("#draw_area").html();
			
			$("#hidden_draw_area").empty();
			$("#hidden_draw_area").append(draw_area_data);
			
			
			if (last_clicked_div_border == "initial") {
				//$("#hidden_draw_area > #"+last_clicked_div).css("border","");
				$("#hidden_draw_area > #"+last_clicked_div).css("border-top-style","none");
				$("#hidden_draw_area > #"+last_clicked_div).css("border-bottom-style","none");
				$("#hidden_draw_area > #"+last_clicked_div).css("border-left-style","none");
				$("#hidden_draw_area > #"+last_clicked_div).css("border-right-style","none");
				$("#hidden_draw_area > #"+last_clicked_div).css("border-bottom-width","0px");
				$("#hidden_draw_area > #"+last_clicked_div).css("border-top-width","0px");
				$("#hidden_draw_area > #"+last_clicked_div).css("border-left-width","0px");
				$("#hidden_draw_area > #"+last_clicked_div).css("border-right-width","0px");
			} else if (last_clicked_div_border == "1px solid") {
				//$("#hidden_draw_area > #"+last_clicked_div).css("border","");
				$("#hidden_draw_area > #"+last_clicked_div).css("border-bottom-style","solid");
				$("#hidden_draw_area > #"+last_clicked_div).css("border-top-style","solid");
				$("#hidden_draw_area > #"+last_clicked_div).css("border-right-style","solid");
				$("#hidden_draw_area > #"+last_clicked_div).css("border-left-style","solid");
				$("#hidden_draw_area > #"+last_clicked_div).css("border-bottom-width","1px");
				$("#hidden_draw_area > #"+last_clicked_div).css("border-top-width","1px");
				$("#hidden_draw_area > #"+last_clicked_div).css("border-right-width","1px");
				$("#hidden_draw_area > #"+last_clicked_div).css("border-left-width","1px");
				$("#hidden_draw_area > #"+last_clicked_div).css("border-top-color","black");
				$("#hidden_draw_area > #"+last_clicked_div).css("border-bottom-color","black");
				$("#hidden_draw_area > #"+last_clicked_div).css("border-left-color","black");
				$("#hidden_draw_area > #"+last_clicked_div).css("border-right-color","black");
			}
			

			$("#hidden_draw_area button").remove();
			$("#hidden_draw_area h5").remove();
			$("#hidden_draw_area .ui-resizable-handle").remove();
			//$("#hidden_draw_area .rss_feed > p").remove();
			$("#hidden_draw_area").children().removeClass(function (index, classes){
				classes = classes.replace(/(rss_feed|slideshow|countdown_visibility|clock_visibility|qrcode_layout|weather_script)/,' ');//remove all classes except for slideshow, rss_feed etc
				return classes; 
			});
			$("#hidden_draw_area").children().attr("id","");
			//$("#hidden_draw_area > .rss_feed").css("overflow","hidden");
			$("#hidden_draw_area").children().css("display","block");
			//$("#hidden_draw_area img").closest("div").addClass("slideshow");
			//$("#hidden_draw_area").children().attr("id","");
			
			draw_area_data = $("#hidden_draw_area").html();
			//alert(draw_area_data);
			//var extra_css = convert_css_styles();
			//alert(extra_css);
			
			*/
			var data_html = [];
			data_html = save_content();
			console.log(data_html[0],data_html[1],data_html[2],data_html[3]);
			
			$.ajax({
				type:"POST",
				url:"layout_sql.php",
				data : {button:button_pressed,data:data_html[3],bg_clr:data_html[0],bg_img:data_html[1],bg_opt:data_html[2],content_name:cont_name}
			})
			 .done(function(server_echo) {
				$("#load_content").empty();
				$("#update_content").empty();
				
				content_name_from_db = cont_name;
				
				load_contents("load_content");
				load_contents("update_content");
				$("#server_return").empty();
				$("#server_return").append('<span style="background-color:#C1BE2B;">'+server_echo+'</span>');
			});
			/*
			$("#hidden_draw_area .video_div").each(function(){
				$(this).empty();
			});*/
		} else {
			$("#server_return").empty();
			$("#server_return").append('Content name must not be empty.');
		}
		location.href = "#close";
	}
	
});

$(document).on('click','.thub_layout',function(e) { //load a layout from database
	//load the selected layout
	$.ajax({
		type:"POST",
		dataType:"json",
		url:"layout_sql.php",
		data : {button:"load_btn", lay_id:$(this).attr('id')}
	})
	 .done(function(server_data) {
		design = server_data.layout_html;
		i = server_data.div_id;
		layout_id = server_data.lay_id;
		
		//last_clicked_div="";
		//last_clicked_div_border="";
	
		$("#draw_area").empty();
		$("#draw_area").append(design);
		$(".draw_div").draggable({containment: "parent"});

		$(".ui-resizable-handle").remove();
		$(".draw_div").resizable({containment: "parent", minHeight:20, minWidth:60});
		
		get_divs("mode");
		get_divs("current_divs");
	 });
});

$(document).on('click','#button_load_cont',function(){ //load a content from the database
	var content_name = $("#load_content").val();
	
	if (content_name != "pdm-default00") {
		var answer;
		if (document.getElementById("draw_area").children.length === 0){
			answer = true;
		} else {
			answer = confirm("You are about to load a content. Any unsaved layout or content will not be stored. Are you sure?");
		}
		if (answer == true) {
			$.ajax({
				type:"POST",
				dataType:"json",
				url:"layout_sql.php",
				data : {button:"load_content", content:content_name}
			})
			 .done(function(content_data){
				var content_divs = content_data.html;
				var content_image = content_data.image;
				var content_background = content_data.bgcolor;
				
				content_name_from_db = content_name;
				
				//last_clicked_div="";
				//last_clicked_div_border="";
				
				$("#draw_area").empty();
				$("#draw_area").append(content_divs);

				$("#draw_area").css({"background-image":content_image});
				$("#draw_area").css({"background-color":content_background});
				
				$("#draw_area > div").addClass("draw_div ui-draggable ui-draggable-handle ui-resizable ui-selectee");
				
				
				$(".draw_div").prepend('<button type="button" class = "close_btn">X</button>');
				$(".draw_div").draggable({containment: "parent"});

				$(".ui-resizable-handle").remove();
				$(".draw_div").resizable({containment: "parent", minHeight:20, minWidth:60});
				
				var div_number = 1;
				$(".draw_div").each(function() {
					$(this).attr("id","div"+div_number);
					div_number = div_number + 1;
					$(this).prepend('<h5 class = "div_name">'+$(this).attr("data-pdm-draw-div")+'</h5>');
					
					var images = $(" > img",this).detach(); //must reposition images at the end of parent div.
					$(this).append(images);
				});
				i = div_number;
				/*
				$(".draw_div").append('<button type="button" class = "close_btn">X</button>');
				$(".draw_div").draggable({containment: "parent"});

				$(".ui-resizable-handle").remove();
				$(".draw_div").resizable({containment: "parent", minHeight:20, minWidth:60}); */
				
				$(".clock_visibility").empty();
				
				$(".clock_visibility").FlipClock({
					clockFace: 'TwentyFourHourClock',
					showSeconds: false
				});
				
				$(".countdown_visibility").each(function(){
					var userDate = new Date($(this).attr("data-pduowm-ct-date"));
					var currentDate = new Date();
					var diff = userDate.getTime() / 1000 - currentDate.getTime() / 1000;
					//console.log($(this).attr("data-pduowm-ct-date"));
					$(this).FlipClock(diff,{
						clockFace: 'DailyCounter',
						countdown: true
					});
				});
				
				//$('.weather_script').append(script);
				
				get_divs("mode");
				get_divs("current_divs");
			});
		}
	}
});

$(document).on('click', "#fade_toggle_div", function(){ //temporary fadeout a div. IT WILL ONLY BE VISIBLE/HIDDEN IN LAYOUT DESIGN SO THE USER CAN PLACE OTHER DIVS ON TOP OF IT TO SCHEDULE THEM APPEAR ON THE SELECTED TIME. IT HAS NO EFFECT IN FINAL SCREEN.
	var slc_div = $("#manage_div").val();
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");
	$("#"+div_unique_id).fadeToggle(200);
});

$(document).on('click', "#rename_div", function(){ //name of a div
	var new_name = prompt("Enter a new name for this div");
	
	if (new_name.match(/\s/g) == null) {
		var div_name="";
		var flag_different_name = 0;
		$("#draw_area > .draw_div").each(function(){
			div_name = $(this).attr("data-pdm-draw-div");
			
			if (div_name == new_name) {
				flag_different_name = 1;
				return false;
			}
		});
		
		if (flag_different_name == 0) {	
			var slc_div = $("#manage_div").val();
			var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");
			
			$("#"+div_unique_id).attr("data-pdm-draw-div",new_name);
			$("#"+div_unique_id+" > .div_name").text(new_name);
			
			get_divs("current_divs");
			get_divs("mode");
			
			$("#manage_div").trigger("change");
		} else {
			$("#server_return").empty();
			$("#server_return").append('<span style="background-color:#C1BE2B;">Div name exists. Write a new one</span>');
		}
	} else {
		$("#server_return").empty();
		$("#server_return").append('<span style="background-color:#C1BE2B;">No whitespaces allowed for div name</span>');
	}
});

$(document).on('click', "#toggle_border", function(){ //put or remove the border from a div
	var slc_div = $("#manage_div").val();
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");
	
	$('#'+div_unique_id).removeClass("wrapper_divs");
	if ($('#'+div_unique_id).css("border-right-style")=="solid") {
		$('#'+div_unique_id).css("border-style","initial");
		$("#toggle_border").removeClass("active_border");
	} else {
		$('#'+div_unique_id).css("border-style","solid");
		$("#toggle_border").addClass("active_border");
	}
	$('#'+div_unique_id).addClass("wrapper_divs");
	/*
	if (last_clicked_div_border=="1px solid") {
		last_clicked_div_border = "initial";
	} else {
		last_clicked_div_border = "1px solid";
	}*/
	
});

function spin(){ //if a input has a spin (up and down button)
	$(".spinner").spinner({
		create: function(event,ui){
			if ($(this).attr("id")=="div_z_index"){
				$(this).spinner("option","step",1);
			} else if ($(this).attr("id")=="div_opacity"){
				$(this).spinner("option","step",0.05);
			}
		},
		spin: function(event, ui) {
			if ($(this).attr("id")=="div_z_index"){
				if (ui.value > 100) {
					$(this).spinner("value",0);
					return false;
				} else if ( ui.value < 0 ) {
					$(this).spinner("value", 100);
					return false;
				}
			} else if ($(this).attr("id")=="div_opacity"){
				if (ui.value > 1) {
					$(this).spinner("value",1);
					return false;
				} else if (ui.value < 0) {
					$(this).spinner("value",0);
					return false;
				}
			}
		},
		
		stop: function(event,ui) {
			var slc_div = $("#manage_div").val();
			var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");
			if ($(this).attr("id")=="div_z_index") {
				$('#'+div_unique_id).css("z-index",$(this).spinner("value"));
			} else if ($(this).attr("id")=="div_opacity") {
				$('#'+div_unique_id).css("opacity",$(this).spinner("value"));
			}
		}
	});
}

function find_images(elem) { //find images of the selected element
	$("#image_mode > ol").empty();
	$(" > img",elem).each(function(){
		$("#image_mode > ol").append("<li><a href = '"+$(this).attr("src")+"'>"+$(this).attr("src")+"</a><button class = 'remove_image_list close_buttons_style'>&#10005</button></li>")
	});
	preview_images();
}

function preview_images() { //make image thubnail
	$("#image_mode > ol > li > a").hover(function(e){
		//console.log("mmpika");
		$("body").append("<p id='preview'><img src='"+this.href+"'></p>");
		
		$("#preview")
			.css("top",(e.pageY - 10) + "px")
			.css("left",(e.pageX - 30) + "px")
			.fadeIn("fast");
		
	},
	function(){
		$("#preview").remove();
	});

	$("#image_mode > ol > li > a").mousemove(function(e){
		$("#preview")
			.css("top",(e.pageY - 10) + "px")
			.css("left",(e.pageX + 30) + "px");
	});	
}

function find_yt_videos(elem) {
	$("#video_mode > ol").empty();
	$(" > .video_div > p",elem).each(function(){
		$("#video_mode > ol").append("<li><a href = '"+$(this).text()+"'>"+$(this).text()+"</a><button class = 'remove_video_list close_buttons_style'>&#10005</button></li>")
	});
}

$(document).on('click','.remove_video_list',function(){ //remove a video
	var slc_div = $("#mydiv").val();
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");

	var video_pos = $(this).parent("li").index();
	$(this).parent("li").remove();
	
	$('#'+div_unique_id+" > .video_div > p:eq("+video_pos+")").remove();
	
	if ($('#'+div_unique_id+" > .video_div > p").length == 0) {
		$('#'+div_unique_id+" > .video_div").remove();
	}
});

$(document).on('click','.remove_image_list',function(){ //remove an image
	var slc_div = $("#mydiv").val();
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");
	
	var img_pos = $(this).parent("li").index();
	$(this).parent("li").remove();
	
	$('#'+div_unique_id+" > img:eq("+img_pos+")").remove();
	
	$('#'+div_unique_id+" > img").last().css({"width":"100%","height":"100%","max-width":"100%","max-height":"100%","display":"inline"});
	
	if ($('#'+div_unique_id+" > img").length == 1) {
		$('#'+div_unique_id).removeClass("slideshow");
		$('#'+div_unique_id).removeAttr("data-pduowm-time-rotation");
	}
});

$(document).on('click','.show_hide_div',function() { //update custom attributes (data-pduowm-XXXXX) for this div with the date and time this will be visible/hidden
	var days;
	var slc_div = $("#manage_div").val();
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");

	if ($("#week_days").val()==null) {
		$('#'+div_unique_id).attr("data-pduowm-week-days","mon,tue,wed,thu,fri,sat,sun");
		days = "mon,tue,wed,thu,fri,sat,sun";
	} else {
		$('#'+div_unique_id).attr("data-pduowm-week-days",$("#week_days").val());
		days = $("#week_days").val();
	}
	$('#'+div_unique_id).attr("data-pduowm-start-date",$("#start_date").val());
	$('#'+div_unique_id).attr("data-pduowm-end-date",$("#end_date").val());
	$('#'+div_unique_id).attr("data-pduowm-start-time",$("#start_time").val());
	$('#'+div_unique_id).attr("data-pduowm-end-time",$("#end_time").val());
	$('#'+div_unique_id).attr("data-pduowm-div-visib",$(this).val());
	
	$("#div_rules > mark").each(function(index){
		var pattern = /[^\s]+/; //pattern to find the matching div from mark tag
		var the_div = pattern.exec($(this).text());//execute the regular expression.
		if (the_div == slc_div) { //if a rule for this div found
			$(this).next().next().next().remove(); //remove new line (br tag)
			$(this).next().next().remove(); //remove close button
			$(this).next().remove(); //remove edit button
			$(this).remove(); //remove rule
			return false; //break from .each function
		}
	});
	
	var rule = '<mark>'+slc_div+' '+$(this).val()+' '+$("#start_date").val()+' '+$("#end_date").val()+' '+$("#start_time").val()+' '+$("#end_time").val()+' '+days+'</mark><button class="edit_rule">&#9998</button><button class = "remove_rule close_buttons_style">&#10005</button><br>';
	$("#div_rules").append(rule);
});



$(document).on('click','.remove_rule',function(){ //remove the date and time visibility rules.
	var pattern = /[^\s]+/; //pattern to find the matching div from mark tag
	var the_div = pattern.exec($(this).prev().prev().text());//execute the regular expression.
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+the_div+"]").attr("id");
	
	$('#'+div_unique_id).removeAttr("data-pduowm-week-days data-pduowm-start-date data-pduowm-end-date data-pduowm-start-time data-pduowm-end-time data-pduowm-div-visib");
	$(this).prev().prev().remove();//remove the rule (mark tag)
	$(this).prev().remove();//remove the edit button
	$(this).next().remove();//remove the new line (br)
	$(this).remove();//remove this button
});

$(document).on('click','.edit_rule',function(){ //edit date and time rules for the selected div
	var pattern = /[^\s]+/; //pattern to find the matching div from mark tag
	var the_div = pattern.exec($(this).prev().text());//execute the regular expression.
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+the_div+"]").attr("id");
	
	var start_time = $('#'+div_unique_id).attr("data-pduowm-start-time"); //get the values of div
	var end_time = $('#'+div_unique_id).attr("data-pduowm-end-time");
	var start_date = $('#'+div_unique_id).attr("data-pduowm-start-date");
	var end_date = $('#'+div_unique_id).attr("data-pduowm-end-date");
	var days = $('#'+div_unique_id).attr("data-pduowm-week-days");
	
	$("#start_date").val(start_date); //paste them in the input fields
	$("#end_date").val(end_date);
	$("#start_time").val(start_time);
	$("#end_time").val(end_time);
	$('#week_days').val(days.split(','));
	$("#manage_div").val(the_div);
});

$(document).on('click','#reset_div_scheduler_table',function() {
	$("#start_date").val(""); //paste them in the input fields
	$("#end_date").val("");
	$("#start_time").val("");
	$("#end_time").val("");
	$('#week_days').val("");
});


$(document).on('change',"#data_form input", function() { //function that create the tools menu with the various options when one of them clicked
	if ($("#mydiv").length > 0 && $("#mydiv").val()!=null) { //if a layout has been selected.
		if($("input[name=data_type]:eq(0)").prop("checked")) {
			$(".tools_menu").hide();
			if (!$("#text_mode").length){ //check if this menu has been created.
				$("#mode").append('<div id="text_mode" class="tools_menu">');
					$("#text_mode").append('<textarea id="user_textarea"></textarea>');
					CKEDITOR.replace('user_textarea');	
					$("#text_mode").append('<br><button id="scroll">Toggle Scroll</button>');
					$("#text_mode").append('<input id="scroll_duration" type="number" value="" placeholder = "Duration (in sec)"></input>');
				$("#mode").append('</div>');
			}
			var ck_editor = CKEDITOR.instances.user_textarea;
			
			ck_editor.on('change', function(){
				var slc_div = $("#mydiv").val();
				var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");
				if (prevent_inserting_data(div_unique_id,".show_text") || prevent_inserting_data(div_unique_id,"div > .scrolling_text")) {
					$("#"+div_unique_id).not(":has(.show_text)").append('<div class="show_text"></div>');
					var user_data = ck_editor.getData();
					$('#'+div_unique_id+' .show_text').html(user_data);
				} else {
					$("#server_return").empty();
					$("#server_return").css("display","inline-block");
					$("#server_return").append("You must first clear this div to change content type.").fadeOut(5000, function() {
						clear_server_return();
					});
				}
			});
			$("#text_mode").show();
		} else  if ($("input[name=data_type]:eq(1)").prop("checked")) {
			$(".tools_menu").hide();
			if (!$("#image_mode").length){
				$("#mode").append('<div id="image_mode" class="tools_menu">');
					$("#image_mode").append('<p>Insert the image url and press Add</p>');
					$("#image_mode").append('<input id="img_url" type="text" value=""></input>');
					$("#image_mode").append('<button type="button" id ="add_img">Add</button>');
					$("#image_mode").append('<p>Rotation time in second (Default: 15seconds)</p>');
					$("#image_mode").append('<input id="time_rotation" type="text" value=""></input>');
					$("#image_mode").append('<p>List of images</p>');
					$("#image_mode").append('<ol></ol>');
					$("#image_mode > ol").sortable({
						update: function() {
							var slc_div = $("#mydiv").val();
							var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");
							$("#"+div_unique_id+" > img").remove();
							$("#image_mode > ol > li > a").each(function(){
								//console.log($(this).attr("href"));
								$("#"+div_unique_id).append("<img src ='"+$(this).attr("href")+"'>");
								
								$('#'+div_unique_id+" > img").css({"width":"100%","height":"100%","max-width":"100%","max-height":"100%","display":"none"});
								$('#'+div_unique_id+" > img").last().css({"width":"100%","height":"100%","max-width":"100%","max-height":"100%","display":"inline"});
							});
						}
					});
				$("#mode").append('</div>');
			}
			$("#image_mode").show();
		} else  if ($("input[name=data_type]:eq(4)").prop("checked")) {
			$(".tools_menu").hide();
			if (!$("#rss_mode").length){
				$("#mode").append('<div id="rss_mode" class="tools_menu">');
					$("#rss_mode").append('<p>Insert the RSS Feed</p>');
					$("#rss_mode").append('<input id="rss_url"></input>')
					$("#rss_mode").append('<button type="button" id ="add_rss">Add</button>');
					$("#rss_mode").append('<p>Number of items (Default: 1)</p>');
					$("#rss_mode").append('<input id="rss_items" type="text" value=""></input>');
				$("#mode").append('</div>');
			}
			$("#rss_mode").show();
		} else if ($("input[name=data_type]:eq(9)").prop("checked")) {
			$(".tools_menu").hide();
			if (!$("#bg_mode").length){
				$("#mode").append('<div id="bg_mode" class="tools_menu">');
					$("#bg_mode").append('<p>Insert the image url (optional)</p>');
					$("#bg_mode").append('<input id="bg_img_url" type="text" value=""></input>');
					$("#bg_mode").append('<button type="button" id ="add_bg_img">Add</button><br>');
					$("#bg_mode").append('<span>Display option : </span>');
					$("#bg_mode").append('<select id ="bg_img_option"><option value="stretched">Stretched</option><option value = "tilled">Tilled</option></select><br>');
					$("#bg_mode").append('<button type="button" id ="remove_bg_img">Remove Background Image</button><br>');
					$("#bg_mode").append('<span>Choose background color</span>');
					$("#bg_mode").append('<div id = "bg_colorpick" class="colorpick_div"></div>');
					$("#bg_colorpick").colpick({color:'000000', submit:1, layout:'hex',
					onSubmit:function(hsb,hex,rgb,el,bySetColor) {
						$(el).css('background-color','#'+hex);
						$("#draw_area").css('background-color','#'+hex);
						$(el).colpickHide();
					}});
				$("#mode").append('</div>');
			}
			$("#bg_mode").show();
		} else if ($("input[name=data_type]:eq(6)").prop("checked")){
			$(".tools_menu").hide();
			if (!$("#timer_mode").length){
				$("#mode").append('<div id="timer_mode" class="tools_menu">');
					$("#timer_mode").append('<p>Clock</p>');
					$("#timer_mode").append('<button id="clock24">Toggle 24H Clock</button><br>');
					$("#timer_mode").append('<p>Countdown Timer</p>');
					$("#timer_mode").append('<p>Select Date and Time</p>');
					$("#timer_mode").append('<input type="text" class="datepicker input_date_time" id = "countdown_date">');
					$("#timer_mode").append('<input type="text" class="timepicker input_date_time" id = "countdown_time"><br>');
					$("#timer_mode").append('<button id="pdm-countdown">Toggle Countdown Timer</button><br>');
					$("#countdown_date").datepicker({dateFormat:"dd/mm/yy"});
					$("#countdown_time").timepicker();
				$("#mode").append('</div>');
			}
			$("#timer_mode").show();
		}else if ($("input[name=data_type]:eq(7)").prop("checked")){
			$(".tools_menu").hide();
			if (!$("#qr_mode").length){
				$("#mode").append('<div id="qr_mode" class="tools_menu">');
					$("#qr_mode").append('<button id="layout_qr">Toggle QR code to change content</button><br><br>');
					$("#qr_mode").append('<input type="text" id = "qr_code_link"><br>');
					$("#qr_mode").append('<button id="link_qr">Toggle Custom QR Code</button><br>');
				$("#mode").append('</div>');
			}
			$("#qr_mode").show();
		}else if ($("input[name=data_type]:eq(10)").prop("checked")){
			$(".tools_menu").hide();
			if (!$("#html_mode").length){
				$("#mode").append('<div id="html_mode" class="tools_menu">');
					$("#html_mode").append('<p>Insert your HTML code.</p>');
					$("#html_mode").append('<textarea id ="html_textarea"></textarea>');
				$("#mode").append('</div>');
			}
			$("#html_mode").show();
		}else if ($("input[name=data_type]:eq(2)").prop("checked")){
			$(".tools_menu").hide();
			if (!$("#video_mode").length){
				$("#mode").append('<div id="video_mode" class="tools_menu">');
					$("#video_mode").append('<p>Insert a youtube link or a plain text files with multiple sources:</p>');
					$("#video_mode").append('<input type="text" id = "video_link">');
					$("#video_mode").append('<button type="button" id ="add_video">Add</button>');
					$("#video_mode").append('<p>Delay at start:</p>');
					$("#video_mode").append('<input type="text" id = "video_delay">');
					
					$("#video_mode").append('<p>List of videos</p>');
					$("#video_mode").append('<ol></ol>');
					$("#video_mode > ol").sortable({
						update: function() {
							var slc_div = $("#mydiv").val();
							var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");
							$("#"+div_unique_id+" .video_div > p").remove();
							
							$("#video_mode > ol > li > a").each(function(){
								$("#"+div_unique_id+" > .video_div").append("<p>"+$(this).attr("href")+"</p>");
							});
						}
					});
				$("#mode").append('</div>');
			}
			$("#video_mode").show();
		}else if ($("input[name=data_type]:eq(5)").prop("checked")) {
			$(".tools_menu").hide();
			if (!$("#weather_mode").length){
				$("#mode").append('<div id="weather_mode" class="tools_menu">');
					$("#weather_mode").append('<p>Select a city</p>');
					$("#weather_mode").append('<select id ="city_weather"><option value="athens">Athens</option><option value = "thess">Thessaloniki</option><option value = "patra">Patra</option><option value = "larissa">Larissa</option><option value = "volos">Volos</option><option value = "irakleio">Heraklion</option><option value = "ioannina">Ioannina</option><option value = "trikala">Trikala</option><option value = "chalcis">Chalkida</option><option value = "serres">Serres</option><option value = "kozani">Kozani</option></select><br><br>');
					$("#weather_mode").append('<button id="weather_plugin">Toggle Weather</button>');
					$("#weather_mode").append('<p>(Background div will not be shown)</p>');
				$("#mode").append('</div>');
			}
			$("#weather_mode").show();
		}else if ($("input[name=data_type]:eq(3)").prop("checked")){
			$(".tools_menu").hide();
			if (!$("#audio_mode").length){
				$("#mode").append('<div id="audio_mode" class="tools_menu">');
					$("#audio_mode").append('<p>Load a plain text file with mp3s</p>');
					$("#audio_mode").append('<input type="text" id = "audio_file">');
					$("#audio_mode").append('<button type="button" id ="add_audio">Add</button><br>');
					$("#audio_mode").append('<p>Delay at start:</p>');
					$("#audio_mode").append('<input type="text" id = "audio_delay">');
					
					$("#audio_mode").append('<p>We suggest to hide this div</p>');
					$("#audio_mode").append('<button id = "hide_audio_div">Show/Hide this div</button>');
					$("#audio_mode").append('<p id = "audio_warning_msg">DIV WILL BE DISPLAYED</p>');
				$("#mode").append('</div>');
			}
			$("#audio_mode").show();
		} else if ($("input[name=data_type]:eq(8)").prop("checked")){
			$(".tools_menu").hide();
			if (!$("#iframe_mode").length){
				$("#mode").append('<div id="iframe_mode" class="tools_menu">');
					$("#iframe_mode").append('<p>Insert a valid url</p>');
					$("#iframe_mode").append('<input type="text" id = "iframe_url">');
					$("#iframe_mode").append('<button type="button" id ="add_iframe">Add</button><br>');
				$("#mode").append('</div>');
			}
			$("#iframe_mode").show();
		}
	}
});

$(document).on('click ',"#mydiv", function() {//when a div change get the the content of it
	//if (last_clicked_div) {
		//$("#"+last_clicked_div).css("border",last_clicked_div_border);
	//}
	
	$("#div_td").text($("#mydiv").val()); //it will be removed...
	var slc_div = $("#mydiv").val();
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");
	$("#textarea").empty();
	
	$(".draw_div").removeClass("wrapper_divs");
	$("#"+div_unique_id).addClass("wrapper_divs");

	//last_clicked_div = div_unique_id;
	//last_clicked_div_border = document.getElementById(div_unique_id).style.border;

	//$("#"+last_clicked_div).css("border","4px solid red");
	
	if ($("#"+div_unique_id).hasClass("rss_feed")){ //if it has RSS
		$("input:radio[name=data_type]:eq(4)").prop('checked', true); //select the radio
		$("input:radio[name=data_type]:eq(4)").trigger("change"); //trigger the function. if this line commented it will not change to this radio.
		var rss_link = $("#"+div_unique_id).attr("data-pduowm-rss");
		var rss_items = $("#"+div_unique_id).attr("data-pduowm-rss-items");
		$("#rss_items").val(rss_items);
		$("#rss_url").val(rss_link);
	} else if ($("#"+div_unique_id).children("img").length > 0) { //if it has image
		$("input:radio[name=data_type]:eq(1)").prop('checked', true); //select the radio
		$("input:radio[name=data_type]:eq(1)").trigger("change"); //trigger the function. if this line commented it will not change to this radio.
		
		
		if ($("#"+div_unique_id).hasClass("slideshow")) {
			$("#time_rotation").val($("#"+div_unique_id).attr("data-pduowm-time-rotation"));
		}
		
		find_images($("#"+div_unique_id));
	} else if ($("#"+div_unique_id).find(".show_text").length > 0){ //if it is a text
		$("input:radio[name=data_type]:eq(0)").prop('checked', true); //select the radio
		$("input:radio[name=data_type]:eq(0)").trigger("change"); //trigger the function. if this line commented it will not change to this radio.

		CKEDITOR.instances['user_textarea'].setData($("#"+div_unique_id+" .show_text").html());
	} else if ($("#"+div_unique_id).children(".clock_visibility").length > 0) { //if it has a clock
		$("input:radio[name=data_type]:eq(6)").prop('checked', true);
		$("input:radio[name=data_type]:eq(6)").trigger("change");

	} else if ($("#"+div_unique_id).children(".countdown_visibility").length > 0) { //if it has a countdown timer
		var inputDate = new Date($("#"+div_unique_id+" > .countdown_visibility").attr("data-pduowm-ct-date"));
		var user_date = inputDate.getDate();
		var user_month = inputDate.getMonth() + 1;
		var user_year = inputDate.getFullYear();
		var user_hour = inputDate.getHours();
		var user_minutes = inputDate.getMinutes();
		
		if (user_hour < 10) {
			user_hour = '0'+user_hour;
		}
		
		if (user_hour < 10) {
			user_minutes = '0'+user_minutes;
		}
		
		var user_countdown_date = user_date+'/'+user_month+'/'+user_year;
		var user_countdown_time = user_hour+':'+user_minutes;
		
		$("input:radio[name=data_type]:eq(6)").prop('checked', true);
		$("input:radio[name=data_type]:eq(6)").trigger("change");
		
		$("#countdown_date").val(user_countdown_date);
		$("#countdown_time").val(user_countdown_time);
	} else if ($("#"+div_unique_id).children(".qrcode_layout").length > 0 || $("#"+div_unique_id).children(".qrcode_link").length > 0) { //if a qrcode for content selection
		$("input:radio[name=data_type]:eq(7)").prop('checked', true);
		$("input:radio[name=data_type]:eq(7)").trigger("change");
	} else if ($("#"+div_unique_id).children(".pure_html").length > 0) { //if it has html
		$("input:radio[name=data_type]:eq(10)").prop('checked', true);
		$("input:radio[name=data_type]:eq(10)").trigger("change");
		$("#html_textarea").val($("#"+div_unique_id+" > .pure_html").html());
	} else if ($("#"+div_unique_id).children(".video_div").length > 0) {
		$("input:radio[name=data_type]:eq(2)").prop('checked', true);
		$("input:radio[name=data_type]:eq(2)").trigger("change");
		
		$("#video_delay").val($("#"+div_unique_id+" > .video_div").attr("data-pduowm-video-delay"));
		find_yt_videos($("#"+div_unique_id));
	} else if ($("#"+div_unique_id).children(".weather_script").length > 0) {
		$("input:radio[name=data_type]:eq(5)").prop('checked', true);
		$("input:radio[name=data_type]:eq(5)").trigger("change");
	} else if ($("#"+div_unique_id).children(".audio_div").length > 0) {
		$("input:radio[name=data_type]:eq(3)").prop('checked', true);
		$("input:radio[name=data_type]:eq(3)").trigger("change");
		
		$("#audio_delay").val($("#"+div_unique_id+" > .audio_div").attr("data-pduowm-audio-delay"));
		
		if ($("#"+div_unique_id+" > .audio_div").hasClass("hidden_player")) {
			$("#audio_warning_msg").text("DIV WILL NOT BE DISPLAYED.");
		} else {
			$("#audio_warning_msg").text("DIV WILL BE DISPLAYED.");
		}
	} else if ($("#"+div_unique_id).children("iframe").length > 0) {
		$("input:radio[name=data_type]:eq(8)").prop('checked', true);
		$("input:radio[name=data_type]:eq(8)").trigger("change");
		$("#iframe_url").val($("#"+div_unique_id+" > iframe").attr("src"));
	}
});

function prevent_inserting_data(div,elem) { //function that stop the user for inserting data if alreay exist another type of data
//div: div we want to check, elem: element that we do not care if exists because is the same type.
	
	//console.log($("#"+div+" > "+elem).length);
	
	if ($("#"+div+" > "+elem).length > 0 || $("#"+div).children().length == 5) { //if this elem exist OR if this div it is in its "pure" form. We consider "pure" form if it's empty i.e. it contain the h5, the close button and 3 resizable handlers. All these count up to 5.
		return true;
	} else {
		return false;
	}
}

function clear_div_content(elem,area) { //clear div content and make it brand new
	$('#'+area+' > #'+elem+' > div > .scrolling_text').parent().remove(); //remove scrolling text
	$('#'+area+' > #'+elem+' > .show_text').remove(); //remove text
	
	$('#'+area+' > #'+elem).removeAttr("data-pduowm-rss-items"); //remove rss
	$('#'+area+' > #'+elem).removeAttr("data-pduowm-rss");
	$('#'+area+' > #'+elem).removeClass("rss_feed");
	$('#'+area+' > #'+elem+' > p').remove();
	
	$('#'+area+' > #'+elem+' > .clock_visibility').remove(); //remove clock
	$('#'+area+' > #'+elem+' > .countdown_visibility').remove(); //remove countdown
	
	$('#'+area+' > #'+elem+' > .qrcode_layout').remove(); //remove qrcode for layout selection
	$('#'+area+' > #'+elem+' > .qrcode_link').remove(); //remove qrcode for user link
	
	$('#'+area+' > #'+elem+' > img').remove(); //remove image
	$('#'+area+' > #'+elem).removeClass("slideshow");
	$('#'+area+' > #'+elem).removeAttr("data-pduowm-time-rotation");
	
	$('#'+area+' > #'+elem+' > .pure_html').remove(); //clear html code directly inserted
	
	$('#'+area+' > #'+elem+' > .video_div').remove(); //clear video
	
	$('#'+area+' > #'+elem+' > .audio_div').remove(); //remove audio
	
	$('#'+area+' > #'+elem+' > .weather_script').remove(); //remove weather
	
	$('#'+area+' > #'+elem+' > iframe').remove(); //remove iframe
	
}

$(document).on('click','#clear_div',function() {
	var slc_div = $("#mydiv").val();
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");
	clear_div_content(div_unique_id,"draw_area");
});

function check_for_http(arg) { //find http or https in urls
	var type = arg.slice(0,arg.indexOf("://"));
	if (type != "http" && type != "https") {
		clear_server_return();
		$("#server_return").append("Url must start with http:// or https://").fadeOut(5000 ,function() {
			clear_server_return();	
		});
		return false;
	} else {
		return true;
	}
}

$(document).on('click', "#add_iframe", function(){ //add a audio file
	var slc_div = $("#mydiv").val();
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");
	var url = $("#iframe_url").val();
	
	if (check_for_http(url)) {
		if (prevent_inserting_data(div_unique_id,"iframe")){
			
			if ($("#"+div_unique_id+" > iframe").length > 0) {
				$("#"+div_unique_id+" > iframe").attr("src",url);
			} else {
				$("#"+div_unique_id).append('<iframe src = "'+url+'"></iframe>');
			}	
			$("#iframe_url").val("");
		}
	}
});

$(document).on('click', "#add_audio", function(){ //add a audio file
	var slc_div = $("#mydiv").val();
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");
	
	var audio_list = $("#audio_file").val();
	var time_sec = ($("#audio_delay").val() >= 1) ? $("#video_delay").val() : 0;
	if (check_for_http(audio_list)) {
		if (prevent_inserting_data(div_unique_id,".audio_div")){
			$.ajax({
				type:"POST",
				url:"get_media_files.php",
				data : {file:audio_list}
			})
			 .done(function(server_echo) {
				if (server_echo != "File not loaded.") {
					if (!$("#"+div_unique_id+" > .audio_div").length) {
						$("#"+div_unique_id).append('<div class="audio_div"></div>');
						$('#'+div_unique_id+" > .audio_div").append(server_echo);
						$('#'+div_unique_id+' > .audio_div').attr({"data-pduowm-audio-delay":time_sec});
					}
				} else {
					$('#server_return').empty();
					$('#server_return').append(server_echo);
				}
			 });
		} else {
			$("#server_return").empty();
			$("#server_return").css("display","inline-block");
			$("#server_return").append("You must first clear this div to change content type.").fadeOut(5000 ,function() {
				clear_server_return();	
			});
		}
	}
});

$(document).on('focusout', "#audio_delay", function(){ //starting delay of a audio
	var slc_div = $("#mydiv").val();
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");
	
	if ($('#'+div_unique_id).children(".audio_div").length > 0) {
		var time_sec = ($("#audio_delay").val() >= 1) ? $("#audio_delay").val() : 0;
		$('#'+div_unique_id+" > .audio_div").attr("data-pduowm-audio-delay",time_sec);
	}
});

$(document).on('click',"#hide_audio_div",function(){
	var slc_div = $("#mydiv").val();
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");
	
	if ($("#"+div_unique_id+" > .audio_div").length > 0) {
		if (!$("#"+div_unique_id+" > .audio_div").hasClass("hidden_player")) {
			$("#"+div_unique_id+" > .audio_div").addClass("hidden_player");
			$("#audio_mode > #audio_warning_msg").text("DIV WILL NOT BE DISPLAYED.");
			
		} else {
			$("#"+div_unique_id+" > .audio_div").removeClass("hidden_player");
			$("#audio_mode > #audio_warning_msg").text("DIV WILL BE DISPLAYED.");
		}
	}
});

$(document).on('click', "#add_video", function(){ //add youtube video to div. NO VIDEO WILL BE PLAYED DURING LAYOUT DESIGN. IT WILL PLAY IN THE SCREEN.
	var slc_div = $("#mydiv").val();
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");
	
	
	var yt_link = $("#video_link").val();
	var time_sec = ($("#video_delay").val() >= 1) ? $("#video_delay").val() : 0;
	
	//alert(yt_link);
	if (check_for_http(yt_link)) {
		if (prevent_inserting_data(div_unique_id,".video_div")){
			if (yt_link != null) {
				var isyoutube = yt_link.match(/youtube.com\/watch\?v=/i);
				if (isyoutube == null) {
					//alert("Please provide a valid youtube link.");
					$.ajax({
						type:"POST",
						url:"get_media_files.php",
						data : {file:yt_link}
					})
					 .done(function(server_echo) {
						if (server_echo != "File not loaded.") {
							if (!$("#"+div_unique_id+" > .video_div").length) {
								$("#"+div_unique_id).append('<div class="video_div"></div>');
								$('#'+div_unique_id+" > .video_div").append(server_echo);
								$('#'+div_unique_id+' > .video_div').attr({"data-pduowm-video-delay":time_sec});
								$('#'+div_unique_id+' > .video_div').css({"overflow":"hidden"});
							}
						} else {
							$('#server_return').empty();
							$('#server_return').append(server_echo);
						}
						
					 });
				} else {
					if (!$("#"+div_unique_id+" > .video_div").length) {
						$("#"+div_unique_id).append('<div class="video_div"></div>');
						$('#'+div_unique_id+' > .video_div').css({"width":"100%","overflow":"hidden"});
						
						$('#'+div_unique_id+' > .video_div').attr({"data-pduowm-video-delay":time_sec});
					}
					$('#'+div_unique_id+' > .video_div').append("<p>"+yt_link+"</p>");
					find_yt_videos($("#"+div_unique_id));
				}
			}
		} else {
			$("#server_return").empty();
			$("#server_return").css("display","inline-block");
			$("#server_return").append("You must first clear this div to change content type.").fadeOut(5000,function(){
				clear_server_return();
			});
		}
		$("#video_link").val(null);
	}
});

$(document).on('focusout', "#video_delay", function(){ //starting delay of a video or playlist
	var slc_div = $("#mydiv").val();
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");
	
	if ($('#'+div_unique_id).children(".video_div").length > 0) {
		var time_sec = ($("#video_delay").val() >= 1) ? $("#video_delay").val() : 0;
		$('#'+div_unique_id+" > .video_div").attr("data-pduowm-video-delay",time_sec);
	}
});

$(document).on('click', "#link_qr", function(){ //create a QR with a custom text
	var slc_div = $("#mydiv").val();
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");
	
	if (prevent_inserting_data(div_unique_id,".qrcode_link")) {
		if ($('#'+div_unique_id).children(".qrcode_link").length > 0) {
			$('#draw_area > #'+div_unique_id+' > .qrcode_link').remove();
		} else {
			$("#draw_area > #"+div_unique_id).append('<div class = "qrcode_link" id = "'+div_unique_id+'_qrlink"</div>');
			
			var qrcode = new QRCode(document.getElementById(div_unique_id+"_qrlink"), {
				text : $("#qr_code_link").val(),
				width:100,
				height:100,
				correctLevel : QRCode.CorrectLevel.H
			});
		}
	} else {
		$("#server_return").empty();
		$("#server_return").css("display","inline-block");
		$("#server_return").append("You must first clear this div to change content type.").fadeOut(5000,function(){	
			clear_server_return();
		});
	}
});


$(document).on('click', "#layout_qr", function(){ //create a QR for user interaction in order to change content for this screen
	var slc_div = $("#mydiv").val();
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");
	
	if (prevent_inserting_data(div_unique_id,".qrcode_layout")) {
		if ($('#'+div_unique_id).children(".qrcode_layout").length > 0) {
			$('#draw_area > #'+div_unique_id+' > .qrcode_layout').remove();
		} else {
			$('#draw_area > #'+div_unique_id).append('<div class = "qrcode_layout" id = "'+div_unique_id+'_qr"</div>');
						
			var qrcode = new QRCode(document.getElementById(div_unique_id+"_qr"), {
				text :"Sample text. Original will be generated when the screen will be updated.",
				width : 100,
				height : 100,
				correctLevel : QRCode.CorrectLevel.H
			});
		}
	} else {
		$("#server_return").empty();
		$("#server_return").css("display","inline-block");
		$("#server_return").append("You must first clear this div to change content type.").fadeOut(5000,function() {
			clear_server_return();
		});
	}
});

$(document).on('click', "#weather_plugin", function(){ //add a weather plugin
	var slc_div = $("#mydiv").val();
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");
	
	var slc_city = $("#city_weather").val();
	
	var city_id = "";
	var city_lat = "";
	var city_lon = "";
	var city_label = "";
	if (slc_city=="athens"){
		city_id = "B74F892F-E597-4C3F-807C-BC30AEA8F736";
		city_lat = "37.9966";
		city_lon = "23.741";
		city_label = "%CE%91%CE%B8%CE%AE%CE%BD%CE%B1";
	} else if (slc_city=="thess") {
		city_id = "1BD6DECB-A782-4835-8446-29FF77C1B03F";
		city_lat = "40.6382";
		city_lon = "22.9369";
		city_label = "%CE%98%CE%B5%CF%83%CF%83%CE%B1%CE%BB%CE%BF%CE%BD%CE%AF%CE%BA%CE%B7";
	} else if (slc_city=="patra") {
		city_id = "949BA896-80A9-4B00-8018-4A68CB6BC810";
		city_lat = "38.2372";
		city_lon = "21.7407";
		city_label = "%CE%A0%CE%AC%CF%84%CF%81%CE%B1";
	} else if (slc_city=="larissa") {
		city_id = "8D4A52C9-2FC2-4270-85EF-091D3A7A0542";
		city_lat = "39.6329";
		city_lon = "22.4184";
		city_label = "%CE%9B%CE%AC%CF%81%CE%B9%CF%83%CE%B1";
	} else if (slc_city=="volos") {
		city_id = "4B9EFCDB-FDCA-4FA7-A994-A21360F592E5";
		city_lat = "39.3622";
		city_lon = "22.9478";
		city_label = "%CE%92%CF%8C%CE%BB%CE%BF%CF%82";
	} else if (slc_city=="irakleio") {
		city_id = "EE40E029-7E0C-41B5-9228-38C1D5AC5B11";
		city_lat = "35.329162";
		city_lon = "25.138526";
		city_label = "%CE%97%CF%81%CE%AC%CE%BA%CE%BB%CE%B5%CE%B9%CE%BF";
	} else if (slc_city=="ioannina") {
		city_id = "CBA2CA74-AAFC-4AD1-A3E9-88A1FF42BF1A";
		city_lat = "39.6679";
		city_lon = "20.8512";
		city_label = "%CE%99%CF%89%CE%AC%CE%BD%CE%BD%CE%B9%CE%BD%CE%B1";
	} else if (slc_city=="trikala") {
		city_id = "FEE3E80F-A276-4D51-BF6F-29F1C3AECEF9";
		city_lat = "39.5557";
		city_lon = "21.7692";
		city_label = "%CE%A4%CF%81%CE%AF%CE%BA%CE%B1%CE%BB%CE%B1";
	} else if (slc_city=="chalcis") {
		city_id = "253BCE63-1192-443A-A1A7-56E50CA478D2";
		city_lat = "38.4667";
		city_lon = "23.6175";
		city_label = "%CE%A7%CE%B1%CE%BB%CE%BA%CE%AF%CE%B4%CE%B1";
	} else if (slc_city=="serres") {
		city_id = "A444E789-9091-41D8-9143-C500A05B065D";
		city_lat = "41.08831";
		city_lon = "23.542815";
		city_label = "%CE%A3%CE%AD%CF%81%CF%81%CE%B5%CF%82";
	} else if (slc_city=="kozani") {
		city_id = "9FFBFE0D-B0B6-4E1C-82F3-DC71B19FC14E";
		city_lat = "40.30103";
		city_lon = "40.30103";
		city_label = "%CE%9A%CE%BF%CE%B6%CE%AC%CE%BD%CE%B7";
	}
	
	if (prevent_inserting_data(div_unique_id,".weather_script") && city_id != null) {
		if ($('#'+div_unique_id).children(".weather_script").length > 0) {
			$('#draw_area > #'+div_unique_id+' > .weather_script').remove();
		} else {
			$("#draw_area > #"+div_unique_id).append('<div class = "weather_script"><iframe id="'+city_id+'" scrolling="no" frameborder="0" width="300" height="235" src=""></iframe><a target="_blank" style="display: block; text-decoration: underline; font: 10px/10px Arial,san-serif; color: rgb(119, 119, 119);" href="http://www.deltiokairou.gr/?widget_type=square">Καιρός σήμερα και πρόγνωση καιρού για κάθε περιοχή</a></div>');
			
			$.getScript("http://service.24media.gr/js/deltiokairou_widget.js", function(){
				script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = "http://service.24media.gr/js/deltiokairou_widget.js";
				$('#draw_area > #'+div_unique_id+' > .weather_script').append(script);
				
				script2 = document.createElement('script');
				script2.type = 'text/javascript';
				script2.innerHTML='set_url("'+city_id+'", "http://service.24media.gr/app/forecast/lat/'+city_lat+'/lon/'+city_lon+'/alt/0/single-square.html?label='+city_label+'&noItems=20&interval=6&time=6&css=/css/single-square.css&color=RED&js=/js/single-square.js");';
				$('#draw_area > #'+div_unique_id+' > .weather_script').append(script2);
			});
			
			//$('#draw_area > #'+slc_div+' > .weather_script').append(script);
		}
	} else {
		$("#server_return").empty();
		$("#server_return").css("display","inline-block");
		$("#server_return").append("You must first clear this div to change content type.").fadeOut(5000, function(){
			clear_server_return();
		});
	}
});

$(document).on('click', "#clock24", function(){ //display a 24H clock
	var slc_div = $("#mydiv").val();
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");
	
	if (prevent_inserting_data(div_unique_id,".clock_visibility")){
		if ($('#'+div_unique_id).children(".clock_visibility").length > 0) {
			$('#draw_area > #'+div_unique_id+' > .clock_visibility').remove();
		} else {
			$('#draw_area > #'+div_unique_id).append('<div class="clock_visibility"></div>');
			
			$('#draw_area > #'+div_unique_id+' > .clock_visibility').FlipClock({
				clockFace: 'TwentyFourHourClock',
				showSeconds: false
			});
		}
	} else {
		$("#server_return").empty();
		$("#server_return").css("display","inline-block");
		$("#server_return").append("You must first clear this div to change content type.").fadeOut(5000,function(){
			clear_server_return();
		});
	}
});

$(document).on('click', "#pdm-countdown", function(){ //display a countdown timer
	var slc_div = $("#mydiv").val();
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");
	
	var ct_day = $("#countdown_date").val();
	var ct_time = $("#countdown_time").val();
	
	if (prevent_inserting_data(div_unique_id,".countdown_visibility")){
		if (ct_day != "" && ct_time != "") {
			splitted_day = ct_day.split("/");
			ct_day = splitted_day[2]+'/'+splitted_day[1]+'/'+splitted_day[0]; //we reverse the day to pass it in Date() object because it accepts arguments in yyyy/mm/dd format.
			
			if ($('#'+div_unique_id).children(".countdown_visibility").length > 0) {
				$('#draw_area > #'+div_unique_id+' > .countdown_visibility').remove();
			} else {
				var userDate = new Date(ct_day+' '+ct_time);
				var currentDate = new Date();
				var diff = userDate.getTime() / 1000 - currentDate.getTime() / 1000; //calculate the difference of the dates in seconds
				$('#draw_area > #'+div_unique_id).append('<div class="countdown_visibility"></div>');
				$('#draw_area > #'+div_unique_id+' > .countdown_visibility').attr({"data-pduowm-ct-date":userDate});
				$('#draw_area > #'+div_unique_id+' > .countdown_visibility').FlipClock(diff,{
					clockFace: 'DailyCounter',
					countdown: true
				});
			}
		} else {
			alert("You forgot something..."); 
		}
	} else {
		$("#server_return").empty();
		$("#server_return").css("display","inline-block");
		$("#server_return").append("You must first clear this div to change content type.").fadeOut(5000,function(){
			clear_server_return();
		});
	}
});

$(document).on('click', "#add_bg_img", function(){ //add a background image either strechted of tilled
	var img = $("#bg_img_url").val();
	var option = $("#bg_img_option").val();
	if (check_for_http(img)){
		if (option == "stretched") {
			$("#draw_area").css('background-repeat','no-repeat');
			$("#draw_area").css('background-size','100% 100%')
		} else if (option == "tilled") {
			$("#draw_area").css('background-repeat','repeat');
			$("#draw_area").css('background-size','auto auto');
		}
		$("#draw_area").css('background-image','url('+img+')');
	}
});

$(document).on('change', "#bg_img_option", function(){ //set background image stretched or tilled
	var option = $("#bg_img_option").val();
	if (option == "stretched") {
		$("#draw_area").css('background-repeat','no-repeat');
		$("#draw_area").css('background-size','100% 100%')
	} else if (option == "tilled") {
		$("#draw_area").css('background-repeat','repeat');
		$("#draw_area").css('background-size','auto auto');
	}
});

$(document).on('click', "#remove_bg_img", function(){ //remove background image
	$("#draw_area").css('background-image','none');
});

$(document).on('click', "#add_img", function(){ //add an image or more to a div
	var url = $("#img_url").val();
	var slc_div = $("#mydiv").val();
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");
	
	if (check_for_http(url)) {
		if (prevent_inserting_data(div_unique_id,"img")) {
			if ($('#'+div_unique_id).children("img").length > 0) {
				$('#'+div_unique_id).addClass("slideshow");
			}
			url="<img src='"+$("#img_url").val()+"'>";
			$('#'+div_unique_id).append(url);
			$('#'+div_unique_id+" > img").css({"width":"100%","height":"100%","max-width":"100%","max-height":"100%","display":"none"});
			$('#'+div_unique_id+" > img").last().css({"width":"100%","height":"100%","max-width":"100%","max-height":"100%","display":"inline"});
			
			find_images($('#'+div_unique_id));
		} else {
			$("#server_return").empty();
			$("#server_return").css("display","inline-block");
			$("#server_return").append("You must first clear this div to change content type.").fadeOut(5000,function(){
				clear_server_return();
			});
		}
		$("#img_url").val("");
	}
});

$(document).on('focusout', "#time_rotation", function(){ //update image time rotation
	var slc_div = $("#mydiv").val();
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");
	
	if ($('#'+div_unique_id).children("img").length > 1) {
		var time_sec = ($("#time_rotation").val() >= 1) ? $("#time_rotation").val() : 15;
		$('#'+div_unique_id).attr("data-pduowm-time-rotation",time_sec);
	}
});

$(document).on('click', "#add_rss", function(){ //add an RSS updater to the div. THIS WILL NOT VISIBLE IN LAYOUT DESIGN BUT IT WILL WORK WHEN IN THE OUTCOME
	var slc_div = $("#mydiv").val();
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");
	var url=$("#rss_url").val();
	
	if (check_for_http(url)) {
		if (prevent_inserting_data(div_unique_id,"p")) {
			$('#'+div_unique_id).addClass("rss_feed");
			$('#'+div_unique_id+" > p").remove();
			$('#'+div_unique_id).attr("data-pduowm-rss",url);
			$('#'+div_unique_id).append("<p>RSS : "+url+" </p>");
			var items = ($("#rss_items").val() > 1) ? $("#rss_items").val() : 1;
			$('#'+div_unique_id).attr("data-pduowm-rss-items",items);

		} else {
			$("#server_return").empty();
			$("#server_return").css("display","inline-block");
			$("#server_return").append("You must first clear this div to change content type.").fadeOut(5000,function(){
				clear_server_return();
			});
		}
	}
});

$(document).on('focusout', "#rss_items", function(){ //set how many items it will be displayed in an RSS
	var slc_div = $("#mydiv").val();
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");
	
	var items = ($("#rss_items").val() > 1) ? $("#rss_items").val() : 1;
	$('#'+div_unique_id).attr("data-pduowm-rss-items",items);
});


$(document).on('focusout', "#html_textarea", function(){ //append pure HTML code to a div
	var slc_div = $("#mydiv").val();
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");

	
	if (prevent_inserting_data(div_unique_id,".pure_html")) {
		var html_code =$("#html_textarea").val();
		if (!$("#"+div_unique_id+" > .pure_html").length) {
			$("#"+div_unique_id).append('<div class="pure_html"></div>');
		}
		$("#"+div_unique_id+" > .pure_html").empty();
		$("#"+div_unique_id+" > .pure_html").append(html_code);
	} else {
		$("#server_return").empty();
		$("#server_return").css("display","inline-block");
		$("#server_return").append("You must first clear this div to change content type.").fadeOut(5000,function(){
			clear_server_return();
		});
	}
});

$(document).on('focusout', "#scroll_duration", function(){ //set scroll time animation
	var slc_div = $("#mydiv").val();
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+slc_div+"]").attr("id");
	var duration = $("#scroll_duration").val();
	
	if (isNaN(duration) == true) {
		duration = 60;
	}
	$("#"+div_unique_id+" > div > .scrolling_text").css("animation-duration",duration+'s');
	$("#"+div_unique_id+" > div > .scrolling_text").attr("data-pdm-animation-duration",duration+'s');
});

$(document).on('click','#scroll',function(){ //make a text scrolling or not
	var write_div = $("#mydiv").val();
	var duration = $("#scroll_duration").val();
	var div_unique_id = $("#draw_area > .draw_div[data-pdm-draw-div="+write_div+"]").attr("id");
	
	$('#'+div_unique_id+" > .show_text").toggleClass("scrolling_text");
	
	if ($('#'+div_unique_id+" > .show_text").hasClass("scrolling_text")) {
		if (isNaN(duration) == true) {
			duration = 60;
		}
		$("#"+div_unique_id+" > .show_text").addClass("scrolling_text");
		$("#"+div_unique_id+" > .show_text").wrap("<div></div>");
		$("#"+div_unique_id+" > div").css("overflow","hidden");
		$("#"+div_unique_id+" > div > .show_text").css({"white-space":"nowrap",
			"display":"inline-table",
			"position":"relative",
			"left":100+'%',
			"animation-duration":duration+"s",
			"-webkit-animation-duration":duration+"s"});
			$("#"+div_unique_id+" > div > .show_text").attr("data-pdm-animation-duration",duration+'s');
	} else {
		$("#"+div_unique_id+" > div > .show_text").removeClass("scrolling_text");
		$("#"+div_unique_id+" > div > .show_text").unwrap();
		$("#"+div_unique_id+" > .show_text").css({"white-space":"normal",
			"display":"block",
			"left":0+'%',
			"position":"static"});
	}
});



$(function() { //main function
	draw();
	load_layouts();
	load_contents("load_content");
	load_contents("update_content");
	load_contents("select_content_rotation");
	$(".datepicker").datepicker({dateFormat:"dd/mm/yy"});
	$(".timepicker").timepicker();
	$("#lay_but").click(function(){
		$(".options_menu").hide();
		$("#saved_layouts").fadeToggle(100);
	});
	$("#tool_but").click(function(){
		$(".options_menu").hide();
		$("#toolbox").fadeToggle(100);
	});
	$("#divs_but").click(function(){
		$(".options_menu").hide();
		$("#div_management").fadeToggle(100);
		$("#manage_div").trigger("change");
	});
	$("#cont_but").click(function(){
		$(".options_menu").hide();
		$("#content_rotation").fadeToggle(100);
		$("#device").trigger("change");
	});
});
