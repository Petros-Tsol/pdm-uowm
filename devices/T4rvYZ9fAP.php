<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<script src="http://code.jquery.com/jquery-2.1.1.js"></script>
    <script src="http://code.jquery.com/ui/1.11.2/jquery-ui.js"></script>
</head>
<body>
	<div id = "content_data"></div>
	
	
<script>
	$(function() {
		//update();
		setInterval(function(){update()},5000);
	});

	function update(){
		var post = $.ajax ({
			type : "POST",
			dataType:"json",
			url : "/pd_uowm/update_screen.php",
			data: {current_data:$("#content_data").html()}
		});
		
		post.done(function(db_content){
			//$("body").empty();
			//$("body").append(n);
			//alert(n);
			if (db_content.data) { //if there are new data.
				$("#content_data").empty();
				$("body").css('background-color',db_content.color);
				$("#content_data").append(db_content.data);
				//alert("DONE!");
			}
		});
				
		post.fail(function(xhr, statusText){
			alert(statusText);
		});
	}
</script>
</body>

</html>	
