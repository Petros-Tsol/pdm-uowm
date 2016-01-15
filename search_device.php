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
<script>
	
	var validname;
	var validdescr;
	
	function enablebutton(){
		if (validname == 1 && validdescr == 1)
		{
			document.getElementsByName("update_device")[0].disabled = false;
		} else {
			document.getElementsByName("update_device")[0].disabled = true;
		}
	}
	/*
	function isnumeric(arg,input) {
		var patt=/^[0-9]+$/g;
		var check = patt.test(arg);
		if (check) {
			document.getElementsByName(input)[0].style.backgroundColor="green";
			if (input == "size") {
				validsize = 1;
			} else if (input == "res_width") {
				validwidth = 1;
			} else {
				validheight = 1;
			}
		} else {
			document.getElementsByName(input)[0].style.backgroundColor="red";
			if (input == "size") {
				validsize = 0;
			} else if (input == "res_width") {
				validwidth = 0;
			} else {
				validheight = 0;
			}
		}
		enablebutton();
	}
	*/
	
	function notblank(arg,input){
		if (arg.length>0){
			document.getElementsByName(input)[0].style.backgroundColor="green";
			if (input == "scrname") {
				validname = 1;
			} else if (input == "description") {
				validdescr = 1;
			} 
		} else {
			document.getElementsByName(input)[0].style.backgroundColor="red";
			if (input == "scrname") {
				validname = 0;
			} else if (input == "description") {
				validdescr = 0;
			} 
		}
		enablebutton();
	}
	
	function pass_data(arg){
		var id=arg.substring(0,arg.length-1);
		un = document.getElementById(id).innerHTML;
		var send_data="screen=".concat(un);
		
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
				old_name = document.getElementsByName("scrname")[0].value;
			}
		  }
		

		xmlhttp.open("POST","modify_device.php",true);
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
			var send_data="delete_device=".concat(document.getElementsByName("scrname")[0].value);
			xmlhttp2.open("POST","upddel_device.php",true);
			xmlhttp2.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp2.send(send_data);
		} else {
			var send_data="update_device=".concat(document.getElementsByName("scrname")[0].value,"&description=",document.getElementsByName("description")[0].value,"&old_name=",old_name);
			xmlhttp2.open("POST","upddel_device.php",true);
			xmlhttp2.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp2.send(send_data);
		}
	
	}
	
</script>
</body>
</html>

