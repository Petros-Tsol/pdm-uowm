<?php
	session_start();
	if ((!isset($_SESSION['admin'])) || ($_SESSION['admin'] != "root"))
	{
		header('Location: login_page.php');
	}
?>

<!DOCTYPE html>
<html>

<head>
    <title>PD UOWM - Manage Group</title>
    <meta charset="UTF-8">
	<link rel="stylesheet" type="text/css" href="css/sidebar.css">
	<link rel="stylesheet" type="text/css" href="css/main.css">
	<link rel="stylesheet" type="text/css" href="css/manage_group.css">
	
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="js/sidebar.js"></script>
    <script src="js/manage_group.js"></script>
</head>


<body>
	<?php
		include 'cp_header.php';
		include 'cp_side.php';
	?>
	
	<?php
	require_once('connect.inc');
	require_once('connect2db');
				
	$conn=connect_db($host,$db,$db_user,$db_pass);
	
	if (isset($_GET['group'])) {
		$selected_group = filter_var($_GET['group'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
	}

	$sql_query=$conn->prepare("SELECT name FROM groups");
	$sql_query->execute();
	$result=$sql_query->fetchAll();
	
	print '<div id="container">';
		print '<h1>Update Group</h1>';
		print "<select id= 'groups'>";
		foreach ($result as $key=>$row) {
			//if ($key > 0) {
				//print '<option>'.$row['description'].'</option>';
			//} else {
				//print '<option selected>'.$row['description'].'</option>';
			//}
			if (isset($selected_group) && $row['name']==$selected_group) {
				print '<option selected>'.$row['name'].'</option>';
			} else {
				print '<option>'.$row['name'].'</option>';
			}
		}
		print'</select>';
		print '<button id = "upd_group" class="submit_btn">Update</button>';
		
		$sql_query=$conn->prepare("SELECT username FROM users_information WHERE username <> ?");
		$sql_query->bindValue(1,"root");
		$sql_query->execute();
		$result=$sql_query->fetchAll();
		print '<div id ="users">';
		print '<h3>Users</h3>';
		foreach ($result as $row) {
			print '<label>';
			print '<input type="checkbox" name="user" value="'.$row['username'].'">'.$row['username'].'<br>';
			print '</label>';
		}
		print '</div>';
		
		$sql_query=$conn->prepare("SELECT name FROM screens");
		$sql_query->execute();
		$result=$sql_query->fetchAll();
		print '<div id ="screens">';
		print '<h3>Screens</h3>';
		foreach ($result as $row) {
			print '<label>';
			print '<input type="checkbox" name="screen" value="'.$row['name'].'">'.$row['name'].'<br>';
			print '</label>';
		}
		print '</div>';
		
		print '<div id = "success_msg"></div>';
	print '</div>';
	
	
	$conn = NULL;
	?>

<?php include 'footer.php'; ?>
</body>
</html>

