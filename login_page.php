<!DOCTYPE html>
<html>

<head>
    <title>PD UOWM</title>
    <meta charset="UTF-8">
    
    <style>
		#title {
			text-align:center;
			color: blue;
			font-size:3em;
		}
		
		#form{
			width:25em;
			margin:0px auto;
			box-sizing:border-box;
			background-color:#A9FFFF;
			text-align:center;
			padding:1em 5em;
		}
		
		input{
			width:180px;
			height:20px;
			border:1px solid #DBDBDB;
			margin-bottom:13px;
		}
		
		#log_err{
			color : #E53023;
		}
		
		body{
			background: linear-gradient(white, #5F8EFF);
			background-repeat: no-repeat;
			background-attachment: fixed;
		}
		
		.submit_btn{
			padding:5px 10px;
			width:120px;
			height:inherit;
			background-color:#00B0E0;
			text-align:center;
		}
		
		#footer{
			margin-top:120px;
			text-align:center;
		}
	</style>
</head>


<body>
<?php
	session_start();
	if (isset($_SESSION['admin']))
	{
		header('Location: control_panel.php');
	}
	include('login.php');
?>
	<h1 id = "title">UOWM PUBLIC DISPLAY</h1>
	<div id = "form">
		<form action="login_page.php" method="post">
			<h1>Log in</h1>
			<input type="text" name="username" maxlength="15" value="" placeholder="Administrator">
			<input type="password" name="password" maxlength="40" value="" placeholder="Password">		
			<input class="submit_btn" type="submit" name="submit_login"  value="Connect">
		</form>
		<span id = "log_err"><?php echo $error; ?></span>
	</div>
	
	<?php
		include ('footer.php');
	?>
</body>
</html>
