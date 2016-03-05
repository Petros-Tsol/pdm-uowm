<?php
	require_once('session_check.php');
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
<h3 id ="welcome_msg">Welcome to UOWM Public Display Management</h3>
<div id = "basic_msg">With this system, you can create a nice and useful public screen. It does not required by you to have any special knowledge. With our tool, the design is quick and easy and you can have the desired result in just few minutes. <br>What are you waiting for! Start making your own content by following <a href = "layout_design.php">this link</a>.</div>
	

	<?php include 'footer.php'; ?>
</body>
</html>
