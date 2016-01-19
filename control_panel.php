<?php
	session_start();
	if (!isset($_SESSION['admin']))
	{
		header('Location: login_page.php');
	}
?>

<!DOCTYPE html>
<html>

<head>
    <title>PD UOWM - Control Panel</title>
    <meta charset="UTF-8">

    <link rel="stylesheet" type="text/css" href="css/sidebar.css">
    <link rel="stylesheet" type="text/css" href="css/main.css">
    
    <link rel="stylesheet" type="text/css" href="css/control_panel.css">
    
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    
    <script src="js/sidebar.js"></script>
</head>


<body>
	<?php
		include 'cp_header.php';
		include 'cp_side.php';
	?>
<h3 id ="welcome_msg">Welcome to UOWM Public Display Management.</h3>
	
	<?php include 'footer.php'; ?>
</body>
</html>
