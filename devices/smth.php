<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<script src="http://code.jquery.com/jquery-2.1.1.js"></script>
    <script src="http://code.jquery.com/ui/1.11.2/jquery-ui.js"></script>
</head>
<body>
	<p>Hello world!</p>
	
<script>
$(function() {
	var post = $.ajax ({
		type : "POST",
		url : "/pd_uowm/update_screen.php"
	});
	
	post.done(function(n){
		
	});
	
	post.fail(function(){
		alert("There was an error");
	});
});
</script>
</body>

</html>	
