$(document).on('change',"#groups", function() {
	var slc_group = $("#groups").val();
	
	$.ajax({
		type:"POST",
		url:"group_management_sql.php",
		data : {button:"select",group:slc_group}
	})
	 .done(function(n) {
		var data = JSON.parse(n); //decode the data
		$("input[name='screen']").prop('checked',false); //clear all checkboxes
		$("input[name='user']").prop('checked',false);
		//console.log(data.users.length);
		
		for (var i = 0;i < data.screens.length;i=i+1) {
			$("input[name='screen']").each(function(){
				//console.log(data.screens[i][0]);
				if ($(this).val()==data.screens[i][0]) {
					$(this).prop('checked',true); //check the boxes which match the screen
				}
			});
		}
		
		for (var i = 0;i < data.users.length;i=i+1) {
			$("input[name='user']").each(function(){
				//console.log(data.users[i][0]);
				if ($(this).val()==data.users[i][0]) {
					$(this).prop('checked',true);
				}
			});
		}
	}); 
});

$(document).ready(function(){
	$("#groups").trigger("change");
});

$(document).on('click',"#upd_group", function() {
	var slc_group = $("#groups").val();
	var slc_users = $("input[name='user']:checked").map(function(){
		return this.value;
	}).get();
	
	var slc_screens = $("input[name='screen']:checked").map(function(){
		return this.value;
	}).get();
	
	
	$.ajax({
		type:"POST",
		url:"group_management_sql.php",
		data : {button:"update",group:slc_group,users:slc_users,screens:slc_screens}
	})
	 .done(function(n) {
		$("#success_msg").empty();
		$("#success_msg").append(n);
	});
});
