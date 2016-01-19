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
    <title>PD UOWM - Active Screen</title>
    <meta charset = "UTF-8">
    <link rel="stylesheet" type="text/css" href="css/sidebar.css">
    <link rel="stylesheet" type="text/css" href="css/main.css">
    <link rel="stylesheet" type="text/css" href="css/active_screen.css">
    
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="js/sidebar.js"></script>
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
	
	$sql_query=$conn->prepare("SELECT id FROM users_information WHERE username = ?"); //select user id
	$sql_query->bindParam(1,$_SESSION['admin']);
	$sql_query->execute();
	
	$user_id = $sql_query->fetch();
	
	$sql_query=$conn->prepare("SELECT DISTINCT screen_id FROM screens_groups JOIN users_privileges ON screens_groups.group_id = users_privileges.group_id WHERE users_privileges.user_id=?"); //select screens where this admin can operate
	$sql_query->bindParam(1,$user_id['id']);
	$sql_query->execute();
	$result = $sql_query->fetchAll();

	echo "<table id = 'screens_table'>";
	echo "<tr>";
	echo "<th>Screen</th>";
	echo "<th>Description</th>";
	echo "<th>Expire on</th>";
	echo "</tr>";
	
	foreach ($result as $row){
		$sql_query=$conn->prepare("SELECT name, description, valid_time FROM screens WHERE webid<>? AND id=?");
		$sql_query->bindValue(1,'');
		$sql_query->bindParam(2,$row['screen_id']);
		$sql_query->execute();
		$screen = $sql_query->fetch();
		
		if (!empty($screen)) { //it will return empty records. ignore them.
			echo "<tr>";
			echo "<td>".$screen['name']."</td>";
			echo "<td>".$screen['description']."</td>";
			echo "<td>".date("l d F Y H\:i T",$screen['valid_time'])."</td>";
			echo "</tr>";
		}
	}

	echo "</table>";
	
	$conn = NULL;
?>
<?php include 'footer.php'; ?>
</body>
</html>
