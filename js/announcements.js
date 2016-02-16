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
			$(".form_design > form > label:eq(3)").append('<span>To Date</span>');
			$(".form_design > form > label:eq(3)").append('<input type="text" name="end_date" class="pickdate">');
		$(".form_design > form").append('</label>');
		$(".form_design > form").append('<br>');
		
		$(".form_design > form ").append('<label>');
			$(".form_design > form > label:eq(4)").append('<span>To Time</span>');
			$(".form_design > form > label:eq(4)").append('<input type="text" name="end_time" class="picktime">');
		$(".form_design > form").append('</label>');
		$(".form_design > form").append('<br>');
		
		$(".form_design > form").append('<button name = "update_announcements" class = "submit_btn">Update</button>');
		$(".form_design > form > .submit_btn").after('</form><div id = "retDiv"></div></div>')
		$(".pickdate").datepicker({dateFormat:"dd/mm/yy"});
		$(".picktime").timepicker();
	});
});

$(document).on('click','.submit_btn',function() {
	var slc_content = $("#select_content").val();
	var slc_start_date = $("input[name=start_date]").val();
	var slc_start_time = $("input[name=start_time]").val();
	var slc_end_date = $("input[name=end_date]").val();
	var slc_end_time = $("input[name=end_time]").val();
	
	if (slc_content && slc_start_date && slc_start_time && slc_end_date && slc_end_time){
		$.ajax({
			type:"POST",
			url:"update_announcement.php",
			data : {category:type,name:text,content:slc_content,sday:slc_start_date,stime:slc_start_time,eday:slc_end_date,etime:slc_end_time}
		})
		.done(function(data_received) {
			$("#retDiv").empty();
			$("#retDiv").append(data_received);
		});
	}
});
