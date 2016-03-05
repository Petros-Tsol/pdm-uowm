var type; //screen or group
var text; //name of screen of group

$(document).on('click','.group, .screen',function() {
	type = $(this).attr("class");
	text = $(this).text();
	
	
	$.ajax({
		type:"POST",
		datatype:"json",
		url:"update_announcement.php",
		data : {data:"contents"}
	})
	 .done(function(data_received) {
		contents=JSON.parse(data_received);

		$(".form_design").remove();
		$("#ann_table").after('<div class="form_design">')
		$(".form_design").append("<h1>"+text+"</h1>");
		$(".form_design").append('<form action="javascript:void(0)">');
		$(".form_design > form ").append('<label>');
			$(".form_design > form > label:eq(0)").append('<span>Content</span>');
			$(".form_design > form > label:eq(0)").append('<br>');
			$(".form_design > form > label:eq(0)").append('<select id = "select_content">');
			for (var i = 0 ; i < contents.length ; i++) {
				$(".form_design > form > label:eq(0) > select").append('<option value = "'+contents[i][0]+'">'+contents[i][0]+'</option>');
			}
			$(".form_design > form > label:eq(0)").append('</select>');
		$(".form_design > form").append('</label>');
		$(".form_design > form").append('<br>');
		
		$(".form_design > form ").append('<label>');
			$(".form_design > form > label:eq(1)").append('<span>From Date</span>');
			$(".form_design > form > label:eq(1)").append('<input type="text" name="start_date" class="pickdate">');
		$(".form_design > form").append('</label>');
		$(".form_design > form").append('<br>');
		
		
		
		$(".form_design > form ").append('<label>');
			$(".form_design > form > label:eq(2)").append('<span>From Time</span>');
			$(".form_design > form > label:eq(2)").append('<input type="text" name="start_time" class="picktime">');
		$(".form_design > form").append('</label>');
		$(".form_design > form").append('<br>');
		
		$(".form_design > form ").append('<label>');
			//$(".form_design > form > label:eq(3)").append('<span>Duration in</span>');
			//$(".form_design > form > label:eq(3)").append('<select id = "duration">');
			//$(".form_design > form > label:eq(3) > select").append('<option value = "seconds">Seconds</option>');
			//$(".form_design > form > label:eq(3) > select").append('<option value = "date">Date/Time</option>');
			//$(".form_design > form > label:eq(3)").append('</select>');
			$(".form_design > form > label:eq(3)").append('<input type="radio" id="duration_sec" name = "duration" value="seconds"> Seconds');
		$(".form_design > form").append('</label>');
			
		$(".form_design > form ").append('<label>');	
			$(".form_design > form > label:eq(4)").append('<input type="radio" id="duration_date" name = "duration" value="date"> Date/Time');
		$(".form_design > form").append('</label>');
		$(".form_design > form").append('<br>');
		
		
		$(".form_design > form").append('<button name = "update_announcements" class = "submit_btn">Update</button>');
		$(".form_design > form").append('<button name = "delete_announcements" class = "submit_btn">Delete</button>');
		$(".form_design > form > .submit_btn:eq(1)").after('</form><div id = "retDiv"></div></div>')

		$(".pickdate").datepicker({dateFormat:"dd/mm/yy"});
		$(".picktime").timepicker();
		
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1;
		var yyyy = today.getFullYear();
		
		var hh = today.getHours();
		var minutes = today.getMinutes();
		
		if(dd < 10) {
			dd='0'+dd;
		} 

		if(mm < 10) {
			mm='0'+mm;
		}
		
		if (hh < 10 ) {
			hh = '0'+hh;
		}
		
		if (minutes < 10 ) {
			minutes = '0'+minutes;
		}
		
		var day = dd+'/'+mm+'/'+yyyy;
		var time = hh+':'+minutes;

		$("input[name=start_date]").val(day);
		$("input[name=start_time]").val(time);
	});
});

$(document).on('click','.submit_btn',function() {
	
	if ($(this).attr("name")=="update_announcements") {
		var slc_content = $("#select_content").val();
		var slc_start_date = $("input[name=start_date]").val();
		var slc_start_time = $("input[name=start_time]").val();
		var slc_end_date = $("input[name=end_date]").val();
		var slc_end_time = $("input[name=end_time]").val();
		var slc_end_seconds = $("input[name=end_seconds]").val();

		if ((slc_content && slc_start_date && slc_start_time && slc_end_date && slc_end_time) || (slc_content && slc_start_date && slc_start_time && slc_end_seconds)){
			$.ajax({
				type:"POST",
				url:"update_announcement.php",
				data : {category:type,name:text,content:slc_content,sday:slc_start_date,stime:slc_start_time,eday:slc_end_date,etime:slc_end_time,eseconds:slc_end_seconds}
			})
			.done(function(data_received) {
				$("#retDiv").empty();
				$("#retDiv").append(data_received);
			});
		} else {
			$("#retDiv").empty();
			$("#retDiv").append('<p class = "error_msg">One or more of the fields is empty.</p>');
		}
	} else if ($(this).attr("name")=="delete_announcements") {
		$.ajax({
			type:"POST",
			url:"update_announcement.php",
			data : {category:type,name:text,button:"delete"}
		})
		.done(function(data_received) {
			$("#retDiv").empty();
			$("#retDiv").append(data_received);
		});
	}
});

$(document).on('click','#duration_sec',function() {
	$(".form_design > form > label:eq(6)").remove();
	$(".form_design > form > label:eq(5)").remove();

	
	$(".form_design > form > .submit_btn:eq(0)").before('<label>');
		$(".form_design > form > label:eq(5)").append('<span>For (seconds)</span>');
		$(".form_design > form > label:eq(5)").append('<input type="number" min = 0 name="end_seconds">');
	$(".form_design > form > label:eq(5)").after('</label>');
	
});

$(document).on('click','#duration_date',function() {
	$(".form_design > form > label:eq(6)").remove();
	$(".form_design > form > label:eq(5)").remove();

	
	$(".form_design > form > .submit_btn:eq(0)").before('<label>');
		$(".form_design > form > label:eq(5)").append('<span>To Date</span>');
		$(".form_design > form > label:eq(5)").append('<input type="text" name="end_date" class="pickdate">');
	$(".form_design > form > label:eq(5)").after('</label>');

		
	$(".form_design > form > label:eq(5)").after('<label>');
		$(".form_design > form > label:eq(6)").append('<span>To Time</span>');
		$(".form_design > form > label:eq(6)").append('<input type="text" name="end_time" class="picktime">');
	$(".form_design > form > label:eq(6)").after('</label>');

	
	$(".pickdate").datepicker({dateFormat:"dd/mm/yy"});
	$(".picktime").timepicker();
		
});
