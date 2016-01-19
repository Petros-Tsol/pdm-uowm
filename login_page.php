<?php
	session_start();
	if (isset($_SESSION['admin']))
	{
		header('Location: control_panel.php');
	}
	include('login.php');
?>

<!DOCTYPE html>
<html>

<head>
    <title>PD UOWM</title>
    <meta charset="UTF-8">
    
    <link rel="stylesheet" type="text/css" href="css/main.css">
    <link rel="stylesheet" type="text/css" href="css/login.css">
</head>


<body>
	<h1 class = "main_title">UOWM PUBLIC DISPLAY</h1>
	<div id = "login_form">
		<form action="login_page.php" method="post">
			<h1>Log in</h1>
			<input type="text" name="username" maxlength="15" value="" placeholder="Administrator">
			<input type="password" name="password" maxlength="40" value="" placeholder="Password">		
			<input class="submit_btn" type="submit" name="submit_login"  value="Connect">
		</form>
		<span id = "error"><?php echo $error; ?></span>
	</div>
	
	<?php
		include ('footer.php');
	?>
</body>
</html>
