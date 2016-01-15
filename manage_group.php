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
    <title>PD UOWM - Manage Group</title>
    <meta charset="UTF-8">
	<link rel="stylesheet" type="text/css" href="css/sidebar.css">
	<link rel="stylesheet" type="text/css" href="css/main.css">
	<style>
		#container{
			position:relative;
			border:1px solid black;
			margin-left:auto;
			margin-right:auto;
			margin-top:4em;
			width:20em;
			background-color:#A9FFFF;
			padding:4em;
		}
		
		#users{
			width:6em;
			float:left;
			whitespace:nowrap;

		}
		
		#screens{
			float:right;
			margin-left:em;
			whitespace:nowrap;
		}
		
		#container h1{
			text-align:center;
		}
		
		#groups{
			margin-left:7em;
			margin-bottom:10px;
			background-color:white;
			padding:6px 4px;
		}
		#upd_group{
			margin-top:18%;
		}
		
		.success{
			background-color:#49D737;
			text-align:center;
			margin-top:10px;
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

	$sql_query=$conn->prepare("SELECT description FROM groups");
	$sql_query->execute();
	$result=$sql_query->fetchAll();
	
	print '<div id="container">';
		print '<h1>Update Group</h1>';
		print "<select id= 'groups'>";
		foreach ($result as $key=>$row) {
			if ($key > 0) {
				print '<option>'.$row['description'].'</option>';
			} else {
				print '<option selected>'.$row['description'].'</option>';
			}
		}
		print'</select><br>';
		
			$sql_query=$conn->prepare("SELECT username FROM users_information");
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
			print '<button id = "upd_group" class="submit_btn">Update</button>';
			print '<div class = "success"></div>';
	print '</div>';
	
	
	$conn = NULL;
	?>

<?php include 'footer.php'; ?>
<script>
	$(document).on('change',"#groups", function() {
		var slc_group = $("#groups").val();
		
		$.ajax({
			type:"POST",
			url:"group_management_sql.php",
			data : {button:"select",group:slc_group}
		})
		 .done(function(n) {
			var data = JSON.parse(n); //decode the data
			$("input[name='screen']").prop('checked',false); //clear all checkboxes
			$("input[name='user']").prop('checked',false);
			//console.log(data.users.length);
			
			for (var i = 0;i < data.screens.length;i=i+1) {
				$("input[name='screen']").each(function(){
					if ($(this).val()==data.screens[i][0]) {
						$(this).prop('checked',true); //check the boxes which match the screen
					}
				});
			}
			
			for (var i = 0;i < data.users.length;i=i+1) {
				$("input[name='user']").each(function(){
					if ($(this).val()==data.users[i][0]) {
						$(this).prop('checked',true);
					}
				});
			}
		}); 
	});
	
	$("#groups").trigger("change");
	$(document).on('click',"#upd_group", function() {
		var slc_group = $("#groups").val();
		var slc_users = $("input[name='user']:checked").map(function(){
			return this.value;
		}).get();
		
		var slc_screens = $("input[name='screen']:checked").map(function(){
			return this.value;
		}).get();
		
		
		$.ajax({
			type:"POST",
			url:"group_management_sql.php",
			data : {button:"update",group:slc_group,users:slc_users,screens:slc_screens}
		})
		 .done(function(n) {
			//alert(n);
			$(".success").empty();
			$(".success").append(n);
		});
	});
</script>
</body>
</html>

