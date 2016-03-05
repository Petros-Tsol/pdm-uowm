function pass_data(elem){
	//console.log(elem.parent().parent().children("td:eq(0)").text());
	var group_name = elem.parent().parent().children("td:eq(0)").text();
	
	$.ajax({
		type:"POST",
		url:"modify_group.php",
		data : {group:group_name}
	})
	 .done(function(n) {
		$("#results").empty();
		$("#results").append(n);
		old_group_name = document.getElementsByName("gname")[0].value;
	});
}

function upd_dlt_group(arg){
	console.log(arg);
	if (arg == "Update") {
		if (check_data() == true) {
			$.ajax({
				type:"POST",
				url:"upddel_group.php",
				data : {update_group:document.getElementsByName("gname")[0].value,description:document.getElementsByName("group_description")[0].value, old_name:old_group_name}
			})
			 .done(function(n) {
				$("#retDiv").empty();
				$("#retDiv").append(n);
			});
		}
	} else if (arg == "Delete") {
		$.ajax({
			type:"POST",
			url:"upddel_group.php",
			data : {delete_group:document.getElementsByName("gname")[0].value}
		})
		 .done(function(n) {
			$("#retDiv").empty();
			$("#retDiv").append(n);
		});
	}
}


$(document).on("click",".view_group",function(){
	pass_data($(this));
});
