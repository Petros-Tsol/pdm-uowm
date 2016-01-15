<?php
//PROBABLY AN ANUSED FILE!!!
if (isset($_POST['screen'])){
	require_once('connect.inc');
	require_once('connect2db');
	require_once('rng.php');
	
	do { //generate a unique random webID
		$webid = random_webid();
		$sql_query=$conn->prepare("SELECT webid FROM Screens WHERE WebID LIKE ?");
		$sql_query->bindParam(1,$webid);
		$sql_query->execute();
		$result=$sql_query->fetchAll();
	} while (!empty($result));
	
	
	echo $webid;
	$conn=connect_db($host,$db,$db_user,$db_pass);
	$sql_query=$conn->prepare("UPDATE Screens SET WebID=? WHERE name=?");
	$sql_query->bindParam(1,$webid);
	$sql_query->bindParam(2,$_POST['screen']);
	$sql_query->execute();

	mysql_close($conn);	
}

?>
