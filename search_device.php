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
	<meta charset="UTF-8">
    <title>PD UOWM - Search Device</title>
    <link rel="stylesheet" type="text/css" href="css/sidebar.css">
	<link rel="stylesheet" type="text/css" href="css/main.css">
	<link rel="stylesheet" type="text/css" href="css/form.css">
	
	<link rel="stylesheet" type="text/css" href="css/search_device.css">

    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="js/sidebar.js"></script>
    <script src="js/validation.js"></script>
    <script src="js/search_device.js"></script>
</head>

<body>
<?php
		include 'cp_header.php';
		include 'cp_side.php';
?>
<div class="form_design">
	<form method="post" action="search_device.php">
		<h1>Search Device</h1>
		<label>
			<span>Search:</span>
			<input type="search" name="crit" maxlength="25" value="">
		</label>
			<input type="submit" name="search_db" class="submit_btn" value="Search">
	</form>
</div>
<?php
require_once('connect.inc');
require_once('connect2db');
$conn=connect_db($host,$db,$db_user,$db_pass);


if (isset($_POST['search_db'])){
	
	$crit=$_POST['crit']."%";
	$sql_query=$conn->prepare("SELECT name,description,webid FROM screens WHERE name LIKE ? OR description LIKE ?");
	$sql_query->bindParam(1,$crit);
	$sql_query->bindParam(2,$crit);
	$sql_query->execute();
	$result=$sql_query->fetchAll();
	//print_r($result);
	
	print '<div id="results">';
	print "<table>";
		print "<tr>";
			print '<th>'."Screen Name".'</th>';
			print '<th>'."Description".'</th>';
			print '<th>'."WebId".'</th>';
			print '<th>'."Modify".'</th>';
		print "</tr>";
		$i=1;
		foreach ($result as $row){
			$tmp = 'id'.$i; //id of screen
			$tmp2 = $tmp.'b'; //id of button
			print "<tr>";
			print '<td id = "'.$tmp.'" >'.$row[0].'</td>';
			print '<td>'.$row[1].'</td>';
			print '<td>'.$row[2].'</td>';
			print '<td>'.'<button class="submit_btn" id="'.$tmp2.'" onclick="pass_data(this.id);">Press</button>'.'</td>';
			print "</tr>";
			$i=$i+1;
		}
	print"</table>";
	print '</div>';
}
$conn = NULL;
?>

<?php include 'footer.php'; ?>

</body>
</html>

