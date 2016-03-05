<?php
	require_once('session_check.php');
?>


<?php
	require_once('connect.inc');
	require_once('connect2db');
			
	$conn=connect_db($host,$db,$db_user,$db_pass);
	
	if(isset($_POST['change_pass'])) {
		$pass=$_POST['password'];

		$sql_query=$conn->prepare("UPDATE users_information SET password = ?, password_plain = ? WHERE username=?");
		$sql_query->bindParam(1,password_hash($pass,PASSWORD_DEFAULT));
		$sql_query->bindValue(2,$pass);
		$sql_query->bindParam(3,$_SESSION['admin']);
		if ($sql_query->execute()) {
			$success_msg = "Password changed successfully.";
		} else {
			$success_msg = "An error occured. Please try again.";
		}
	}
	
	$conn = NULL;
?>
<!DOCTYPE html>
<html >

<head>
    <title>PD UOWM - Change Password</title>
    <meta charset="UTF-8">
    
    <link rel="stylesheet" type="text/css" href="css/sidebar.css">
    <link rel="stylesheet" type="text/css" href="css/main.css">
    <link rel="stylesheet" type="text/css" href="css/form.css">

    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="js/sidebar.js"></script>
    <script src="js/validation.js"></script>
</head>
<body>
	
	<?php
		include 'cp_header.php';
		include 'cp_side.php';
	?>
	
	<div class = "form_design">
		<h1>Change password</h1>
		<form action="ch_pass.php" method="post">
			<label>
				<span>New Password:</span>
				<input type="password" name="password" maxlength="25" value=""  onblur="check_sim();">
			</label>
			
			<label>
				<span>Retype Password:</span>
				<input type="password" id="retype" maxlength="25" value=""  onblur="check_sim();">
			</label>
			
			<br>
			<input type="submit" name="change_pass" value="Change" class = "submit_btn"disabled>
		</form>
		<div class = "success"><?php echo $success_msg; ?></div>
	</div>
	<?php include 'footer.php'; ?>
</body>
</html>
