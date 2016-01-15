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
    <title>PD UOWM - Search User</title>
    <meta charset="UTF-8">
    
    <link rel="stylesheet" type="text/css" href="css/sidebar.css">
	<link rel="stylesheet" type="text/css" href="css/main.css">
	<link rel="stylesheet" type="text/css" href="css/form.css">
	
	<link rel="stylesheet" type="text/css" href="css/search_user.css">

    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
</head>

<body>
<?php
	include 'cp_header.php';
	include 'cp_side.php';
?>
<div class="form_design">
	<h1>Search User</h1>
	<form method="post" action="search_user.php">
		<label>
			<span>Search: </span><br>
			<input type="search" name="crit" maxlength="25" value="">
		</label>	
			<input type="submit" name="search_db" value="Search" class ="submit_btn">
	</form>
</div>
<?php
require_once('connect.inc');
require_once('connect2db');
$conn=connect_db($host,$db,$db_user,$db_pass);


if (isset($_POST['search_db'])){
	
	$crit=$_POST['crit']."%";
	$sql_query=$conn->prepare("SELECT username, fname, lname, email FROM users_information WHERE username LIKE ? OR lname LIKE ? OR fname LIKE ?");
	$sql_query->bindParam(1,$crit);
	$sql_query->bindParam(2,$crit);
	$sql_query->bindParam(3,$crit);
	
	$sql_query->execute();
	$result=$sql_query->fetchAll();
	//print_r($result);
	print '<div id="results">';
	print "<table>";
		print "<tr>";
			print '<th>'."Username".'</th>';
			print '<th>'."First Name".'</th>';
			print '<th>'."Last Name".'</th>';
			print '<th>'."E-mail".'</th>';
			print '<th>'."Modify".'</th>';
		print "</tr>";
		$i=1;
		foreach ($result as $row){
			$tmp = 'id'.$i; //id of user
			$tmp2 = $tmp.'b'; //id of button
			print "<tr>";
			print '<td id = "'.$tmp.'" >'.$row[0].'</td>';
			print '<td>'.$row[1].'</td>';
			print '<td>'.$row[2].'</td>';
			print '<td>'.$row[3].'</td>';
			print '<td>'.'<button class = "submit_btn" id="'.$tmp2.'" onclick="pass_data(this.id);">Press</button>'.'</td>';
			print "</tr>";
			$i=$i+1;
		}
	print "</table>";
	print "</div>";
}
$conn = NULL;
?>
<br>
<br>
<br>
	
	
<?php include 'footer.php'; ?>
<script>
	function checkname(arg,flname) {
		var patt=/^[A-z]+$/g;
		var check = patt.test(arg);
		if (check) {
			document.getElementsByName(flname)[0].style.backgroundColor="green";
			if (flname == "fname"){
				validfn=1;
			} else {
				validln=1;
			}
		} else {
			document.getElementsByName(flname)[0].style.backgroundColor="red";
			if (flname == "fname"){
				validfn=0;
			} else {
				validln=0;
			}
		}
		enablebutton();

	}
	
	function notblank(arg){
		if (arg.length>0){
			document.getElementsByName("uname")[0].style.backgroundColor="green";
			validun = 1;
		} else {
			document.getElementsByName("uname")[0].style.backgroundColor="red";
			validun = 0;
		}
		enablebutton();
	}
	
	function enablebutton(){
		if (validln==1 && validfn == 1 && validun == 1)
		{
			document.getElementsByName("update_user")[0].disabled = false;
		} else {
			document.getElementsByName("update_user")[0].disabled = true;
		}
	}
	
	function pass_data(arg){
		var id=arg.substring(0,arg.length-1);
		un = document.getElementById(id).innerHTML;
		var send_data="admin=".concat(un);
		
		var xmlhttp;
		if (window.XMLHttpRequest)
		  {// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp=new XMLHttpRequest();
		  }
		else
		  {// code for IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		  }
		
		xmlhttp.onreadystatechange=function()
		  {
		  if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				document.getElementById("results").innerHTML="";
				document.getElementById("results").innerHTML=xmlhttp.responseText;
			}
		  }
		

		xmlhttp.open("POST","modify_user.php",true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.send(send_data);
		
	}
	
	function dlt_us(arg){
		var n=document.getElementsByName(arg)[0].value;

		var xmlhttp2;
		if (window.XMLHttpRequest)
		  {// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp2=new XMLHttpRequest();
		  }
		else
		  {// code for IE6, IE5
			xmlhttp2=new ActiveXObject("Microsoft.XMLHTTP");
		  }
		
		xmlhttp2.onreadystatechange=function()
		  {
		  if (xmlhttp2.readyState==4 && xmlhttp2.status==200)
			{
				document.getElementById("retDiv").innerHTML=xmlhttp2.responseText;
			}
		  }
		  

		if (n.localeCompare("Delete")==0) {
			var send_data="delete_user=".concat(document.getElementsByName("uname")[0].value);
			xmlhttp2.open("POST","upddel_user.php",true);
			xmlhttp2.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp2.send(send_data);
		} else {
			var send_data="update_user=".concat(document.getElementsByName("uname")[0].value,"&lname=",document.getElementsByName("lname")[0].value,"&fname=",document.getElementsByName("fname")[0].value,"&email=",document.getElementsByName("email")[0].value);
			xmlhttp2.open("POST","upddel_user.php",true);
			xmlhttp2.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp2.send(send_data);
		}
	
	}
	
</script>
</body>
</html>

