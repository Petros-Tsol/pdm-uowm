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
    <style>
		table {
			position:relative;
			border: 1px solid black;
			border-collapse: collapse;
			margin-left:auto;
			margin-right:auto;
			background-color:#A9FFFF;
			width:16em;
		}
		
		th,td {
			border: 1px solid black;
			padding:7px;
		}
    </style>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
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
	
	$sql_query=$conn->prepare("SELECT name, description, valid_time FROM screens WHERE webid<>?");
	$sql_query->bindValue(1,"");
	$sql_query->execute();
	
	echo "<table>";
	echo "<tr>";
	echo "<th>Screen</th>";
	echo "<th>Place</th>";
	echo "<th>Expire</th>";
	echo "</tr>";
	$result=$sql_query->fetchAll();
	foreach ($result as $row){
		echo "<tr>";
		echo "<td>".$row[0]."</td>";
		echo "<td>".$row[1]."</td>";
		echo "<td>".date("l d F Y H\:i T",$row[2])."</td>";
		echo "</tr>";
	}
	echo "</table>";
	$conn = NULL;
?>
<?php include 'footer.php'; ?>
</body>
</html>
