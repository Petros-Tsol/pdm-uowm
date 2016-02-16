function draw(){ //function to draw divs
	i = 1; // number of divs created by user, global variable.
	layout_id = 0; // number of layout, global variable
	$('#draw_area').selectable({					
		start : function(e) { // start point of div
			start_x=e.pageX - this.offsetLeft;
			start_y=e.pageY - this.offsetTop;
		},

		
		stop : function(e) { // end point of div
			end_x = e.pageX - this.offsetLeft;
			end_y = e.pageY - this.offsetTop;
			
			if (end_x > $("#draw_area").width()) {
				end_x = $("#draw_area").width() + this.offsetLeft;
			}
			
			if (end_y > $("#draw_area").height()) {
				end_y = $("#draw_area").height() + this.offsetTop;
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

				$(this).append('<div class="draw_div" id ="div' + i +'"></div>');
				newdiv = $('#div'+i);
				
				
				//absolute position.
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

$(document).on("dragstop",".draw_div",function(){ //if a div moved, recalculate new position and convert width, height, top, and left in percentages in order to fit in any screen resolution.
	console.log($(this).position().top);
	console.log($(this).parent().offset().top);
	start_y = $(this).offset().top; //this work for sure for position() instead of offset()!!!!
	start_x = $(this).position().left;
	height = $(this).height();
	width = $(this).width();
	$(this).css({
		"top":  (100* start_y / $("#draw_area").height())+'%',
		"left": (100* start_x / $("#draw_area").width())+'%',
		"height":  (100* height / $("#draw_area").height())+'%',
		"width": (100* width / $("#draw_area").width())+'%'
	});
	
	if ($(this).children(".clock_visibility")) {
		if ($(this).css("left") < "50%") {
			$(" > .clock_visibility",this).css({"float":"left"});
		} else {
			$(" > .clock_visibility",this).css({"float":"right"});
		}
	}
	
	if ($(this).children(".countdown_visibility")) {
		if ($(this).css("left") < "50%") {
			$(" > .countdown_visibility",this).css({"float":"left"});
		} else {
			$(" > .countdown_visibility",this).css({"float":"right"});
		}
	}
	
	if ($(this).children(".qrcode_link")) {
		if ($(this).css("left") < "50%") {
			$(" > .qrcode_link",this).css({"float":"left"});
		} else {
			$(" > .qrcode_link",this).css({"float":"right"});
		}
	}
	
	if ($(this).children(".qrcode_layout")) {
		if ($(this).css("left") < "50%") {
			$(" > .qrcode_layout",this).css({"float":"left"});
		} else {
			$(" > .qrcode_layout",this).css({"float":"right"});
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
		$("#"+elem).append('<option value ="pdm-default00">Content to load</option>');
		$.each(n,function(ix){
			$("#"+elem).append('<option value ="'+n[ix][0]+'">'+n[ix][0]+'</option>');
		});
	});
}

function get_divs(element){//function to create a select box of the created divs
//get the id attr of selected layout and generate select input
	var divs = [];
	divs = $("#draw_area").children().map(function() //get the ids
	{
		return $(this).attr("id");
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
	
	if (element == "current_divs"){
		$("#"+element).append('<button type="button" id="fade_toggle_div">Fade Div</button>');
		$("#"+element).append('<button type="button" id="toggle_border">Fade Border</button>');
		$("#"+element).append('<button type="button" id="rename_div">Rename Div</button><br>');
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
	var slc_div = $("#manage_div").val();
	var z_index = $('#'+slc_div).css("z-index");
	var opac = $('#'+slc_div).css("opacity");
	var color = $('#'+slc_div).css("background-color")
	
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
	$("#div_bg_color").css('background-color','#'+bg_color);
	$("#div_bg_color").colpickSetColor(bg_color,true)
	$("#div_bg_color").colpick({submit:1, layout:'hex',
	onSubmit:function(hsb,hex,rgb,el,bySetColor) {
		var slc_user_div = $("#manage_div").val();
		$(el).css('background-color','#'+hex);
		$('#'+slc_user_div).css('background-color','#'+hex);
		$(el).colpickHide();
		return false;
	}});
});

/*
function convert_css_styles(){ //convert webkit to mozilla syntax and vice-versa. unused function
	var mozilla_strings_scroll="transform: translateX(100%); animation-direction: ; animation-duration: ; animation-iteration-count: ; animation-name: ; animation-timing-function: ; -webkit-transform: translateX(100%);}";
	var webkit_strings_scroll="transform: translateX(100%); -webkit-transform: translateX(100%); -webkit-animation-direction: ; -webkit-animation-duration: ; -webkit-animation-iteration-count: ; -webkit-animation-name: ; -webkit-animation-timing-function: ; }";
	var keyframes_scroll="@-webkit-keyframes scroll_text{100% {left:0%;-webkit-transform:translateX(-100%);}}"+'\n'+"@keyframes scroll_text{to {left:0%;transform:translateX(-100%);}}"; //@keyframe rules
	
	var mozilla_strings_rss = "animation-direction: ; animation-duration: ; animation-iteration-count: ; animation-name: ; animation-timing-function: ;}";
	var webkit_strings_rss = "-webkit-animation-direction: ; -webkit-animation-duration: ; -webkit-animation-iteration-count: ; -webkit-animation-name: ; -webkit-animation-timing-function: ;}";
	var keyframes_rss = "@-webkit-keyframes auto_scroll_rss{100% {-webkit-transform:translateY(-100%);}}"+'\n'+" @keyframes auto_scroll_rss{to {transform:translateY(-100%);}}";

	var style=document.styleSheets; //save css
	var browser=style[0].cssRules[30];//get browser type keyframes rules
	var class_properties_scroll=style[0].cssRules[29].cssText;//object to be added extra rules. scrolling_text class
	var class_properties_rss=style[0].cssRules[28].cssText; //rss rules
	
	
	class_properties_scroll=class_properties_scroll.substring(0,class_properties_scroll.length-1); //remove the last character which is a right bracket }
	class_properties_rss=class_properties_rss.substring(0,class_properties_rss.length-1); //remove the last character which is a right bracket }
	//alert(class_properties_rss);
	if (browser=="[object MozCSSKeyframesRule]"){ //mozilla browser
		var j=0;
		var pat=": ;";
		var pos=-1;
		var value = class_properties_scroll.match(/\:(.*?)\;/g); //get the values of properties...
		value[0]=value[0].substring(2,value[0].length-1);//...and remove ":" and ";"
		value[1]=value[1].substring(2,value[1].length-1);
		value[2]=value[2].substring(2,value[2].length-1);
		value[3]=value[3].substring(2,value[3].length-1);
		value[4]=value[4].substring(2,value[4].length-1);
		class_properties_scroll=class_properties_scroll+webkit_strings_scroll;
		//alert(class_properties.indexOf(pat));
		//console.log(value);
		do {
			pos=class_properties_scroll.indexOf(pat,pos+1); //find the next position to insert a string
			if (pos!=-1) {
				class_properties_scroll=class_properties_scroll.slice(0,pos+1)+value[j++]+class_properties_scroll.slice(pos+1);
			}
		} while (pos!=-1);
		//-------RSS animation below----------//
		j=0;
		pos=-1;
		var value = class_properties_rss.match(/\:(.*?)\;/g); //get the values of properties...
		value[0]=value[0].substring(2,value[0].length-1);//...and remove ":" and ";"
		value[1]=value[1].substring(2,value[1].length-1);
		value[2]=value[2].substring(2,value[2].length-1);
		value[3]=value[3].substring(2,value[3].length-1);
		value[4]=value[4].substring(2,value[4].length-1);
		class_properties_rss=class_properties_rss+webkit_strings_rss;
		do {
			pos=class_properties_rss.indexOf(pat,pos+1); //find the next position to insert a string
			if (pos!=-1) {
				class_properties_rss=class_properties_rss.slice(0,pos+1)+value[j++]+class_properties_rss.slice(pos+1);
			}
		} while (pos!=-1);
		//alert(class_properties_rss);
	} else if (browser=="[object CSSKeyframesRule]") { //webkit browser
		var j=0;
		var pat=": ;";
		var pos=-1;
		var value = class_properties_scroll.match(/\:(.*?)\;/g); //get the values of properties...
		value[0]=value[0].substring(2,value[0].length-1); //...and remove ":" and ";"
		value[1]=value[1].substring(2,value[1].length-1);
		value[2]=value[2].substring(2,value[2].length-1);
		value[3]=value[3].substring(2,value[3].length-1);
		value[4]=value[4].substring(2,value[4].length-1);
		class_properties_scroll=class_properties_scroll+mozilla_strings_scroll;
		//alert(class_properties.indexOf(pat));
		//console.log(value);
		do {
			pos=class_properties_scroll.indexOf(pat,pos+1); //find the next position to insert a string
			if (pos!=-1) {
				class_properties_scroll=class_properties_scroll.slice(0,pos+1)+value[j++]+class_properties_scroll.slice(pos+1);
			}
		} while (pos!=-1);
		//alert(class_properties);
		
		j=0;
		pos=-1;
		var value = class_properties_rss.match(/\:(.*?)\;/g); //get the values of properties...
		value[0]=value[0].substring(2,value[0].length-1);//...and remove ":" and ";"
		value[1]=value[1].substring(2,value[1].length-1);
		value[2]=value[2].substring(2,value[2].length-1);
		value[3]=value[3].substring(2,value[3].length-1);
		value[4]=value[4].substring(2,value[4].length-1);
		class_properties_rss=class_properties_rss+mozilla_strings_rss;
		do {
			pos=class_properties_rss.indexOf(pat,pos+1); //find the next position to insert a string
			if (pos!=-1) {
				class_properties_rss=class_properties_rss.slice(0,pos+1)+value[j++]+class_properties_rss.slice(pos+1);
			}
		} while (pos!=-1);
	}
	//alert(class_properties_scroll+'\n'+class_properties_rss+'\n'+keyframes_scroll+'\n'+keyframes_rss);
	return class_properties_scroll+'\n'+class_properties_rss+'\n'+keyframes_scroll+'\n'+keyframes_rss;
}*/

/*unused function
function preview(){
	draw_area_width = $("#draw_area").width();
	draw_area_height = $("#draw_area").height();
	
	//alert(draw_area_width +'x'+ draw_area_height);
	
	draw_area_data = $("#draw_area").html();
	
	//alert(draw_area_data);
	
	$("#hidden_draw_area").empty();
	$("#hidden_draw_area").append(draw_area_data);
	
	$("#hidden_draw_area button").remove();
	$("#hidden_draw_area h5").remove();
	$("#hidden_draw_area .ui-resizable-handle").remove();
	$("#hidden_draw_area").children().removeClass();
	$("#hidden_draw_area").children().attr("id","");
	
	draw_area_data = $("#hidden_draw_area").html();
	//alert(draw_area_data);
	preview_data = '<html><head><title>Layout Preview</title></head><style>body{background-color:#f1f9b8;}</style><body>'+draw_area_data+'</body></html>';
	preview_window = window.open("", "Preview", "width="+draw_area_width+",height="+draw_area_height+",resizable=no, menubar=no");
	preview_window.document.open();
	preview_window.document.write(preview_data);
	preview_window.document.close();
}*/

function update_screen(){ //update current screen selected with the content in the #draw_area
	//get the device or group
	var slc_device = $("#device").val();
	var slc_content = $("#load_content").val();
	
	if ($("#device option:selected").text() == "(update all)") {
		var slc_group = "yes";
	} else {
		var slc_group = "no";
	}
	
	if (slc_content != "pdm-default00") {
		//get the bg color
		var answer = confirm("You are about to push a content named "+slc_content+". Are you sure about this?");
		if (answer == true) {
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
			var bg_image = $("#draw_area").css('background-image'); //get the background image
			var bg_option = $("#bg_img_option").val(); //get background image option (tilled or stretched)
			//get the inner content
			var draw_area_data = $("#draw_area").html();
			
			$("#hidden_draw_area").empty();
			$("#hidden_draw_area").append(draw_area_data);
			
			$("#hidden_draw_area .video_div").each(function(){
				var $this = $(this);
				var links = [];
				$this.children("p").each(function(ind){
					links[ind] = $(this).text().match(/=(.*)?/).pop();//get youtube video id
					//console.log(links[ind]);
				});
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
			});
			
			$("#hidden_draw_area button").remove();
			$("#hidden_draw_area h5").remove();
			$("#hidden_draw_area .ui-resizable-handle").remove();
			$("#hidden_draw_area .rss_feed > p").remove();
			$("#hidden_draw_area").children().removeClass(function (index, classes){
				//classes.match(/slideshow/) || [].join(' ');
				//classes.match(/rss_feed/) || [].join(' ');
				classes = classes.replace(/(rss_feed|slideshow|countdown_visibility|clock_visibility|qrcode_layout|qrcode_link)/,' ');//remove all classes except for slideshow, rss_feed etc
				return classes; 
			});
			$("#hidden_draw_area").children().attr("id","");
			$("#hidden_draw_area > .rss_feed").css("overflow","hidden");
			$("#hidden_draw_area").children().css("display","block");
			//$("#hidden_draw_area img").closest("div").addClass("slideshow");
			//$("#hidden_draw_area").children().attr("id","");
			
			draw_area_data = $("#hidden_draw_area").html();
			//alert(draw_area_data);
			//var extra_css = convert_css_styles();
			//alert(extra_css);
			*/
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
		}
	});
});

$(document).on('click','#add_content',function() { //add content in content scheduler
	var slc_content = $("#select_content").val();
	$("#current_contents > ol").append('<li><span>'+slc_content+'</span><button class = "remove_scheduled_content close_buttons_style">&#10005</button></li>');
});

$(document).on('click','.remove_scheduled_content',function(){ //remove content from content scheduler
	$(this).parent().remove();
	$(this).remove();
});

$(document).on('click','#update_screen_scheduler',function() { //update database with the new content scheduler for the selected screen
	var rotation_time = $("#content_sec_rotate").val();
	var slc_scr = $("#device").val();
	
	var content_scheduler = $("#current_contents > ol > li > span").map(function() { return $(this).text() }).get();
	
	$.ajax({
		type:"POST",
		url:"update_screen_db.php",
		data : {button:"update_screen_scheduler",screen:slc_scr,contents:content_scheduler,time_sec:rotation_time}
	})
	 .done(function(server_echo) {
		$("#server_return").empty();
		$("#server_return").append('<span style="background-color:#C1BE2B;">'+server_echo+'</span>');
	});
});

$(document).on('click','#new_btn',function() { //when new layout pressed clear the #draw_area
	$("#draw_area").empty();
	$("#draw_area").css({
		"background-image":"none",
		"background-color":"#f1f9b8"
		
	});
	i=1;
	layout_id = 0;
});

$(document).on('click','#save_btn',function() { //save or update the current layout in database
	var draw_data = $("#draw_area").html(); //get the layout
	//alert(draw_data);
	
	//save the preview
	$("#hidden_draw_area").empty();
	$("#hidden_draw_area").append(draw_data);
	
	$("#hidden_draw_area p").remove();
	$("#hidden_draw_area img").remove();
	var draw_data = $("#hidden_draw_area").html(); //save layout
	//alert(draw_data);
	
	$("#hidden_draw_area h5").remove();
	$("#hidden_draw_area button").remove();
	$("#hidden_draw_area .ui-resizable-handle").remove();
	$("#hidden_draw_area").children().removeClass();
	$("#hidden_draw_area").children().removeAttr("id");
	var thub_data = $("#hidden_draw_area").html();
	//alert (thub_data);

	$.ajax({
		type:"POST",
		url:"layout_sql.php",
		data : {html_data:draw_data, scaled_data:thub_data, button:"save_btn", lay_id:layout_id, div_id:i}
	})
	 .done(function(server_echo) {
		var data;
		try {
			data = JSON.parse(server_echo);
			console.log(data);
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

$(document).on('click','.save_cont_btn',function() { //save content in database
	//get the bg color
	if ($(this).parent().attr("id")=="new_cont_name_div") {
		var cont_name = $("#new_cont_name").val();
		var button_pressed = "new_content";
	} else if ($(this).parent().attr("id")=="select_cont_name_div"){
		var cont_name = $("#update_content").val();
		var button_pressed = "upd_content";
	}
	
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
	
	$("#hidden_draw_area .video_div").each(function(){
		/*
		var $this = $(this);
		var links = [];
		$this.children("p").each(function(ind){
			links[ind] = $(this).text().match(/=(.*)?/).pop();//get youtube video id
			//console.log(links[ind]);
		});
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
		*/
	});
	
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
	
	
	$.ajax({
		type:"POST",
		url:"layout_sql.php",
		data : {button:button_pressed,data:draw_area_data,bg_clr:bg_color,bg_img:bg_image,bg_opt:bg_option,content_name:cont_name}
	})
	 .done(function(server_echo) {
		$("#load_content").empty();
		$("#update_content").empty();
		
		load_contents("load_content");
		load_contents("update_content");
		$("#server_return").empty();
		$("#server_return").append('<span style="background-color:#C1BE2B;">'+server_echo+'</span>');
	});
	/*
	$("#hidden_draw_area .video_div").each(function(){
		$(this).empty();
	});*/
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
	
		$("#draw_area").empty();
		$("#draw_area").append(design);
		$(".draw_div").draggable({containment: "parent"});

		$(".ui-resizable-handle").remove();
		$(".draw_div").resizable({containment: "parent", minHeight:20, minWidth:60});
		
		get_divs("mode");
		get_divs("current_divs");
	 });
});

$(document).on('change','#load_content',function(){ //load a content from the database
	var content_name = $("#load_content").val();
	
	if (content_name != "pdm-default00") {
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
				$(this).prepend('<h5 class = "div_name">'+$(this).attr("id")+'</h5>');
				
				var images = $(" > img",this).detach(); //must reposition images at the end of parent div.
				$(this).append(images);
			});
			i = div_number;
			/*
			$(".draw_div").append('<button type="button" class = "close_btn">X</button>');
			$(".draw_div").draggable({containment: "parent"});

			$(".ui-resizable-handle").remove();
			$(".draw_div").resizable({containment: "parent", minHeight:20, minWidth:60}); */
			
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
			
			get_divs("mode");
			get_divs("current_divs");
		 });
	}
});

$(document).on('click', "#fade_toggle_div", function(){ //temporary fadeout a div. IT WILL ONLY BE VISIBLE/HIDDEN IN LAYOUT DESIGN SO THE USER CAN PLACE OTHER DIVS ON TOP OF IT TO SCHEDULE THEM APPEAR ON THE SELECTED TIME. IT HAS NO EFFECT IN FINAL SCREEN.
	var slc_div = $("#manage_div").val();
	$("#"+slc_div).fadeToggle(200);
});

$(document).on('click', "#rename_div", function(){ //name of a div
	var new_name = prompt("Enter a new name for this div");
	var slc_div = $("#manage_div").val();
	$("#"+slc_div).attr("id",new_name);
	$("#"+new_name+" > .div_name").text(new_name);
	get_divs("current_divs");
});

$(document).on('click', "#toggle_border", function(){ //put or remove the border from a div
	var slc_div = $("#manage_div").val();
	if ($('#'+slc_div).css("border-right-style")=="solid") {
		$('#'+slc_div).css("border-style","initial");
	} else {
		$('#'+slc_div).css("border-style","solid");
	}
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
			if ($(this).attr("id")=="div_z_index") {
				$('#'+slc_div).css("z-index",$(this).spinner("value"));
			} else if ($(this).attr("id")=="div_opacity") {
				$('#'+slc_div).css("opacity",$(this).spinner("value"));
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
		console.log("mmpika");
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
	
	var video_pos = $(this).parent("li").index();
	$(this).parent("li").remove();
	
	$('#'+slc_div+" > .video_div > p:eq("+video_pos+")").remove();
	
	if ($('#'+slc_div+" > .video_div > p").length == 0) {
		$('#'+slc_div+" > .video_div").remove();
	}
});

$(document).on('click','.remove_image_list',function(){ //remove an image
	var slc_div = $("#mydiv").val();
	
	var img_pos = $(this).parent("li").index();
	$(this).parent("li").remove();
	
	$('#'+slc_div+" > img:eq("+img_pos+")").remove();
	
	$('#'+slc_div+" > img").last().css({"width":"100%","height":"100%","max-width":"100%","max-height":"100%","display":"inline"});
	
	if ($('#'+slc_div+" > img").length == 1) {
		$('#'+slc_div).removeClass("slideshow");
		$('#'+slc_div).removeAttr("data-pduowm-time-rotation");
	}
});

$(document).on('click','.show_hide_div',function() { //update custom attributes (data-pduowm-XXXXX) for this div with the date and time this will be visible/hidden
	var days;
	var slc_div = $("#manage_div").val();
	if ($("#week_days").val()==null) {
		$('#'+slc_div).attr("data-pduowm-week-days","mon,tue,wed,thu,fri,sat,sun");
		days = "mon,tue,wed,thu,fri,sat,sun";
	} else {
		$('#'+slc_div).attr("data-pduowm-week-days",$("#week_days").val());
		days = $("#week_days").val();
	}
	$('#'+slc_div).attr("data-pduowm-start-date",$("#start_date").val());
	$('#'+slc_div).attr("data-pduowm-end-date",$("#end_date").val());
	$('#'+slc_div).attr("data-pduowm-start-time",$("#start_time").val());
	$('#'+slc_div).attr("data-pduowm-end-time",$("#end_time").val());
	$('#'+slc_div).attr("data-pduowm-div-visib",$(this).val());
	
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
	var the_div = pattern.exec($(this).prev().text());//execute the regular expression.
	$('#'+the_div).removeAttr("data-pduowm-week-days data-pduowm-start-date data-pduowm-end-date data-pduowm-start-time data-pduowm-end-time data-pduowm-div-visib");
	$(this).prev().prev().remove();//remove the rule (mark tag)
	$(this).prev().remove();//remove the edit button
	$(this).next().remove();//remove the new line (br)
	$(this).remove();//remove this button
});

$(document).on('click','.edit_rule',function(){ //edit date and time rules for the selected div
	var pattern = /[^\s]+/; //pattern to find the matching div from mark tag
	var the_div = pattern.exec($(this).prev().text());//execute the regular expression.
	
	var start_time = $('#'+the_div).attr("data-pduowm-start-time"); //get the values of div
	var end_time = $('#'+the_div).attr("data-pduowm-end-time");
	var start_date = $('#'+the_div).attr("data-pduowm-start-date");
	var end_date = $('#'+the_div).attr("data-pduowm-end-date");
	var days = $('#'+the_div).attr("data-pduowm-week-days");
	
	$("#start_date").val(start_date); //paste them in the input fields
	$("#end_date").val(end_date);
	$("#start_time").val(start_time);
	$("#end_time").val(end_time);
	$('#week_days').val(days.split(','));
	$("#manage_div").val(the_div);
});


$(document).on('change',"#data_form input", function() { //function that create the tools menu with the various options when one of them clicked
	if ($("#mydiv").length > 0 && $("#mydiv").val()!=null) { //if a layout has been selected.
		if($("input[name=data_type]:eq(0)").prop("checked")) {
			$(".tools_menu").hide();
			if (!$("#text_mode").length){ //check if this menu has been created.
				$("#mode").append('<div id="text_mode" class="tools_menu">');
					$("#text_mode").append('<textarea id="user_textarea"></textarea>');
					CKEDITOR.replace('user_textarea');	
					$("#text_mode").append('<button id="scroll">Toggle Scroll</button><br>');
				$("#mode").append('</div>');
			}
			var ck_editor = CKEDITOR.instances.user_textarea;
			
			ck_editor.on('change', function(){
				var slc_div = $("#mydiv").val();
				$("#"+slc_div).not(":has(.show_text)").append('<div class="show_text"></div>');
				var user_data = ck_editor.getData();
				$('#'+slc_div+' .show_text').html(user_data);
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
							$("#"+slc_div+" > img").remove();
							$("#image_mode > ol > li > a").each(function(){
								//console.log($(this).attr("href"));
								$("#"+slc_div).append("<img src ='"+$(this).attr("href")+"'>");
								
								$('#'+slc_div+" > img").css({"width":"100%","height":"100%","max-width":"100%","max-height":"100%","display":"none"});
								$('#'+slc_div+" > img").last().css({"width":"100%","height":"100%","max-width":"100%","max-height":"100%","display":"inline"});
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
		} else if ($("input[name=data_type]:eq(8)").prop("checked")) {
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
		}else if ($("input[name=data_type]:eq(9)").prop("checked")){
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
							$("#"+slc_div+" .video_div > p").remove();
							
							$("#video_mode > ol > li > a").each(function(){
								$("#"+slc_div+" > .video_div").append("<p>"+$(this).attr("href")+"</p>");
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
					$("#weather_mode").append('<p>Weather in Thessaloniki</p>');
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
					$("#audio_mode").append('<p>We suggest to hide this div</p>');
					$("#audio_mode").append('<button id = "hide_audio_div">Show/Hide this div</button>');
					$("#audio_mode").append('<p id = "audio_warning_msg">DIV WILL BE DISPLAYED</p>');
				$("#mode").append('</div>');
			}
			$("#audio_mode").show();
		}
	}
});

$(document).on('click ',"#mydiv > option", function() {//when a div change get the the content of it
	$("#div_td").text($("#mydiv").val()); //it will be removed...
	var slc_div = $("#mydiv").val();
	$("#textarea").empty();
	if ($("#"+slc_div).hasClass("rss_feed")){ //if it has RSS
		$("input:radio[name=data_type]:eq(4)").prop('checked', true); //select the radio
		$("input:radio[name=data_type]:eq(4)").trigger("change"); //trigger the function. if this line commented it will not change to this radio.
		
		var rss_items = $("#"+slc_div).attr("data-pduowm-rss-items");
		$("#rss_items").val(rss_items);
	} else if ($("#"+slc_div).children("img").length > 0) { //if it has image
		$("input:radio[name=data_type]:eq(1)").prop('checked', true); //select the radio
		$("input:radio[name=data_type]:eq(1)").trigger("change"); //trigger the function. if this line commented it will not change to this radio.
		
		if ($("#"+slc_div).hasClass("slideshow")) {
			$("#time_rotation").val($("#"+slc_div).attr("data-pduowm-time-rotation"));
		}
		
		find_images($("#"+slc_div));
	} else if ($("#"+slc_div).find(".show_text").length > 0){ //if it is a text
		$("input:radio[name=data_type]:eq(0)").prop('checked', true); //select the radio
		$("input:radio[name=data_type]:eq(0)").trigger("change"); //trigger the function. if this line commented it will not change to this radio.
		CKEDITOR.instances['user_textarea'].setData($("#"+slc_div+" .show_text").html());
	} else if ($("#"+slc_div).children(".clock_visibility").length > 0) { //if it has a clock
		$("input:radio[name=data_type]:eq(6)").prop('checked', true);
		$("input:radio[name=data_type]:eq(6)").trigger("change");
		$("#clock24").prop('checked', true);
	} else if ($("#"+slc_div).children(".countdown_visibility").length > 0) { //if it has a countdown timer
		var inputDate = new Date($("#"+slc_div+" > .countdown_visibility").attr("data-pduowm-ct-date"));
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
	} else if ($("#"+slc_div).children(".qrcode_layout").length > 0 || $("#"+slc_div).children(".qrcode_link").length > 0) { //if a qrcode for content selection
		$("input:radio[name=data_type]:eq(7)").prop('checked', true);
		$("input:radio[name=data_type]:eq(7)").trigger("change");
	} else if ($("#"+slc_div).children(".pure_html").length > 0) { //if it has html
		$("input:radio[name=data_type]:eq(9)").prop('checked', true);
		$("input:radio[name=data_type]:eq(9)").trigger("change");
		$("#html_textarea").val($("#"+slc_div+" > .pure_html").html());
	} else if ($("#"+slc_div).children(".video_div").length > 0) {
		$("input:radio[name=data_type]:eq(2)").prop('checked', true);
		$("input:radio[name=data_type]:eq(2)").trigger("change");
		
		find_yt_videos($("#"+slc_div));
	} else if ($("#"+slc_div).children(".weather_script").length > 0) {
		$("input:radio[name=data_type]:eq(5)").prop('checked', true);
		$("input:radio[name=data_type]:eq(5)").trigger("change");
	} else if ($("#"+slc_div).children(".audio_div").length > 0) {
		$("input:radio[name=data_type]:eq(3)").prop('checked', true);
		$("input:radio[name=data_type]:eq(3)").trigger("change");
		
		if ($("#"+slc_div+" > .audio_div").hasClass("hidden_player")) {
			$("#audio_warning_msg").text("DIV WILL NOT BE DISPLAYED.");
		} else {
			$("#audio_warning_msg").text("DIV WILL BE DISPLAYED.");
		}
	}
});

$(document).on('click','#clear_div',function() { //clear div content and make it brand new
	var slc_div = $("#mydiv").val();
	
	$('#'+slc_div+' > .show_text').remove(); //remove text
	
	$('#'+slc_div).removeAttr("data-pduowm-rss-items"); //remove rss
	$('#'+slc_div).removeAttr("data-pduowm-rss");
	$('#'+slc_div).removeClass("rss_feed");
	$('#'+slc_div+' > p').remove();
	
	$('#'+slc_div+' > .clock_visibility').remove(); //remove clock
	$('#'+slc_div+' > .countdown_visibility').remove(); //remove countdown
	
	$('#'+slc_div+' > .qrcode_layout').remove(); //remove qrcode for layout selection
	$('#'+slc_div+' > .qrcode_link').remove(); //remove qrcode for user link
	
	$('#'+slc_div+' > img').remove(); //remove image
	$('#'+slc_div).removeClass("slideshow");
	$('#'+slc_div).removeAttr("data-pduowm-time-rotation");
	
	$('#'+slc_div+' > .pure_html').remove(); //clear html code directly inserted
	$('#'+slc_div+' > .video_div').remove(); //clear video
	
	$('#'+slc_div+' > .weather_script').remove(); //remove weather
});

$(document).on('click', "#add_audio", function(){ //add a audio file
	var slc_div = $("#mydiv").val();
	var audio_list = $("#audio_file").val();
	
	$.ajax({
		type:"POST",
		url:"get_media_files.php",
		data : {file:audio_list}
	})
	 .done(function(server_echo) {
		if (server_echo != "File not loaded.") {
			if (!$("#"+slc_div+" > .audio_div").length) {
				$("#"+slc_div).append('<div class="audio_div"></div>');
				$('#'+slc_div+" > .audio_div").append(server_echo);
			}
		} else {
			$('#server_return').empty();
			$('#server_return').append(server_echo);
		}
		
	 });
	
	
});

$(document).on('click',"#hide_audio_div",function(){
	var slc_div = $("#mydiv").val();
	if ($("#"+slc_div+" > .audio_div").length > 0) {
		if (!$("#"+slc_div+" > .audio_div").hasClass("hidden_player")) {
			$("#"+slc_div+" > .audio_div").addClass("hidden_player");
			$("#audio_mode > #audio_warning_msg").text("DIV WILL NOT BE DISPLAYED.");
			
		} else {
			$("#"+slc_div+" > .audio_div").removeClass("hidden_player");
			$("#audio_mode > #audio_warning_msg").text("DIV WILL BE DISPLAYED.");
		}
	}
});

$(document).on('click', "#add_video", function(){ //add youtube video to div. NO VIDEO WILL BE PLAYED DURING LAYOUT DESIGN. IT WILL PLAY IN THE SCREEN.
	var slc_div = $("#mydiv").val();
	var yt_link = $("#video_link").val();
	
	//alert(yt_link);
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
					if (!$("#"+slc_div+" > .video_div").length) {
						$("#"+slc_div).append('<div class="video_div"></div>');
						$('#'+slc_div+" > .video_div").append(server_echo);
					}
				} else {
					$('#server_return').empty();
					$('#server_return').append(server_echo);
				}
				
			 });
		} else {
			if (!$("#"+slc_div+" > .video_div").length) {
				$("#"+slc_div).append('<div class="video_div"></div>');
				$('#'+slc_div+' > .video_div').css({"width":"100%"});
				$('#'+slc_div+' > .video_div').attr({"data-pduowm-video-delay":$("#video_delay").val()});
			}
			$('#'+slc_div+' > .video_div').append("<p>"+yt_link+"</p>");
		}
	}
	$("#video_link").val(null);
});

$(document).on('click', "#link_qr", function(){ //create a QR with a custom text
	var slc_div = $("#mydiv").val();
	if ($('#'+slc_div).children(".qrcode_link").length > 0) {
		$('#draw_area > #'+slc_div+' > .qrcode_link').remove();
	} else {
		$("#draw_area > #"+slc_div).append('<div class = "qrcode_link" id = "'+slc_div+'_qrlink"</div>');
		
		var qrcode = new QRCode(document.getElementById(slc_div+"_qrlink"), {
			text : $("#qr_code_link").val(),
			width:100,
			height:100,
			correctLevel : QRCode.CorrectLevel.H
		});
	}
});


$(document).on('click', "#layout_qr", function(){ //create a QR for user interaction in order to change content for this screen
	var slc_div = $("#mydiv").val();
	
	if ($('#'+slc_div).children(".qrcode_layout").length > 0) {
		$('#draw_area > #'+slc_div+' > .qrcode_layout').remove();
	} else {
		$('#draw_area > #'+slc_div).append('<div class = "qrcode_layout" id = "'+slc_div+'_qr"</div>');
					
		var qrcode = new QRCode(document.getElementById(slc_div+"_qr"), {
			text :"Sample text. Original will be generated when the screen will be updated.",
			width : 100,
			height : 100,
			correctLevel : QRCode.CorrectLevel.H
		});
	}
});

$(document).on('click', "#weather_plugin", function(){ //add a weather plugin
	var slc_div = $("#mydiv").val();
	
	if ($('#'+slc_div).children(".weather_script").length > 0) {
		$('#draw_area > #'+slc_div+' > .weather_script').remove();
	} else {
		$("#draw_area > #"+slc_div).append('<div class = "weather_script"><iframe id="BD1E4C55-94F2-412A-81F8-FD2D93EB88E4" scrolling="no" frameborder="0" width="300" height="235" src=""></iframe><a target="_blank" style="display: block; text-decoration: underline; font: 10px/10px Arial,san-serif; color: rgb(119, 119, 119);" href="http://www.deltiokairou.gr/?widget_type=square">Καιρός σήμερα και πρόγνωση καιρού για κάθε περιοχή</a></div>');
		
		$.getScript("http://service.24media.gr/js/deltiokairou_widget.js", function(){
			script = document.createElement('script');
			script.type = 'text/javascript';
			script.innerHTML='set_url("BD1E4C55-94F2-412A-81F8-FD2D93EB88E4", "http://service.24media.gr/app/forecast/lat/40.6382/lon/22.9369/alt/0/single-square.html?label=%CE%98%CE%B5%CF%83%CF%83%CE%B1%CE%BB%CE%BF%CE%BD%CE%AF%CE%BA%CE%B7&noItems=20&interval=6&time=6&css=/css/single-square.css&color=RED&js=/js/single-square.js");';
			$('#draw_area > #'+slc_div+' > .weather_script').append(script);
		});
		
		$('#draw_area > #'+slc_div+' > .weather_script').append(script);
	}
});

$(document).on('click', "#clock24", function(){ //display a 24H clock
	var slc_div = $("#mydiv").val();
	
	if ($('#'+slc_div).children(".clock_visibility").length > 0) {
		$('#draw_area > #'+slc_div+' > .clock_visibility').remove();
	} else {
		$('#draw_area > #'+slc_div).append('<div class="clock_visibility"></div>');
		
		$('#draw_area > #'+slc_div+' > .clock_visibility').FlipClock({
			clockFace: 'TwentyFourHourClock',
			showSeconds: false
		});
	}
});

$(document).on('click', "#pdm-countdown", function(){ //display a countdown timer
	var slc_div = $("#mydiv").val();
	
	var ct_day = $("#countdown_date").val();
	var ct_time = $("#countdown_time").val();
	
	if (ct_day != "" && ct_time != "") {
		splitted_day = ct_day.split("/");
		ct_day = splitted_day[2]+'/'+splitted_day[1]+'/'+splitted_day[0]; //we reverse the day to pass it in Date() object because it accepts arguments in yyyy/mm/dd format.
		
		if ($('#'+slc_div).children(".countdown_visibility").length > 0) {
			$('#draw_area > #'+slc_div+' > .countdown_visibility').remove();
		} else {
			var userDate = new Date(ct_day+' '+ct_time);
			var currentDate = new Date();
			var diff = userDate.getTime() / 1000 - currentDate.getTime() / 1000; //calculate the difference of the dates in seconds
			$('#draw_area > #'+slc_div).append('<div class="countdown_visibility"></div>');
			$('#draw_area > #'+slc_div+' > .countdown_visibility').attr({"data-pduowm-ct-date":userDate});
			$('#draw_area > #'+slc_div+' > .countdown_visibility').FlipClock(diff,{
				clockFace: 'DailyCounter',
				countdown: true
			});
		}
	} else {
		alert("You forgot something..."); 
	}
});

$(document).on('click', "#add_bg_img", function(){ //add a background image either strechted of tilled
	var img = $("#bg_img_url").val();
	var option = $("#bg_img_option").val();
	if (option == "stretched") {
		$("#draw_area").css('background-repeat','no-repeat');
		$("#draw_area").css('background-size','100% 100%')
	} else if (option == "tilled") {
		$("#draw_area").css('background-repeat','repeat');
		$("#draw_area").css('background-size','auto auto');
	}
	$("#draw_area").css('background-image','url('+img+')');
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
	var url="<img src='"+$("#img_url").val()+"'>";
	$("#img_url").val("");
	var slc_div = $("#mydiv").val();
	if ($('#'+slc_div).children("img").length > 0) {
		$('#'+slc_div).addClass("slideshow");
	}

	$('#'+slc_div).append(url);
	$('#'+slc_div+" > img").css({"width":"100%","height":"100%","max-width":"100%","max-height":"100%","display":"none"});
	$('#'+slc_div+" > img").last().css({"width":"100%","height":"100%","max-width":"100%","max-height":"100%","display":"inline"});
	
	find_images($('#'+slc_div));
});

$(document).on('focusout', "#time_rotation", function(){ //update image time rotation
	var slc_div = $("#mydiv").val();
	if ($('#'+slc_div).children("img").length > 1) {
		var time_sec = ($("#time_rotation").val() >= 1) ? $("#time_rotation").val() : 15;
		$('#'+slc_div).attr("data-pduowm-time-rotation",time_sec);
	}
});

$(document).on('click', "#add_rss", function(){ //add an RSS updater to the div. THIS WILL NOT VISIBLE IN LAYOUT DESIGN BUT IT WILL WORK WHEN IN THE OUTCOME
	var slc_div = $("#mydiv").val();
	var url=$("#rss_url").val();
	$('#'+slc_div).addClass("rss_feed");
	$('#'+slc_div).attr("data-pduowm-rss",url);
	$('#'+slc_div).append("<p>RSS : "+url+" </p>");
	var items = ($("#rss_items").val() > 1) ? $("#rss_items").val() : 1;
	$('#'+slc_div).attr("data-pduowm-rss-items",items);
});

$(document).on('focusout', "#rss_items", function(){ //set how many items it will be displayed in an RSS
	var slc_div = $("#mydiv").val();
	var items = ($("#rss_items").val() > 1) ? $("#rss_items").val() : 1;
	$('#'+slc_div).attr("data-pduowm-rss-items",items);
});


$(document).on('focusout', "#html_textarea", function(){ //append pure HTML code to a div
	var slc_div = $("#mydiv").val();
	var html_code =$("#html_textarea").val();
	if (!$("#"+slc_div+" > .pure_html").length) {
		$("#"+slc_div).append('<div class="pure_html"></div>');
	}
	$("#"+slc_div+" > .pure_html").empty();
	$("#"+slc_div+" > .pure_html").append(html_code);
});

$(document).on('click','#scroll',function(){ //make a text scrolling or not
	var write_div = $("#mydiv").val();
	
	$('#'+write_div+" > .show_text").toggleClass("scrolling_text");
	
	if ($('#'+write_div+" > .show_text").hasClass("scrolling_text")) {
		$("#"+write_div+" > .show_text").addClass("scrolling_text");
		$("#"+write_div+" > .show_text").wrap("<div></div>");
		$("#"+write_div+" > div").css("overflow","hidden");
		$("#"+write_div+" > div > .show_text").css({"white-space":"nowrap",
			"display":"inline-table",
			"position":"relative",
			"left":100+'%'});
	} else {
		$("#"+write_div+" > div > .show_text").removeClass("scrolling_text");
		$("#"+write_div+" > div > .show_text").unwrap();
		$("#"+write_div+" > .show_text").css({"white-space":"normal",
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
	});
});
