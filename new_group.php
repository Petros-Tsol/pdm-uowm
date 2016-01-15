<?php
	session_start();
	if (!isset($_SESSION['admin']))
	{
		header('Location: login_page.php');
	}
?>

<?php
require_once('connect.inc');
require_once('connect2db');
			
$conn=connect_db($host,$db,$db_user,$db_pass);

if(isset($_POST['submit_reg'])) {
	$group = filter_var($_POST['gname'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW);
	$sql_query=$conn->prepare("SELECT description FROM groups WHERE description=?");
	$sql_query->bindParam(1,$group);
	$sql_query->execute();
	$result=$sql_query->fetchAll();
	
	if (empty($result)) { //if group name DOES NOT EXISTS
		$sql_query=$conn->prepare("INSERT INTO groups (description) VALUES (?)");
		$sql_query->bindParam(1,$_POST['gname']);
		if ($sql_query->execute()){
			$success_msg="Group: ".$_POST['gname']." created";
		} else {
			$success_msg="An error occured. Please try again.";
		}
		
		$sql_query=$conn->prepare("SELECT id FROM groups WHERE description=?");
		$sql_query->bindParam(1,$_POST['gname']);
		$sql_query->execute();
		$group_id = $sql_query->fetch();
		
		$sql_query=$conn->prepare("SELECT id FROM users_information WHERE username=?");
		$sql_query->bindValue(1,'root');
		$sql_query->execute();
		$user_id = $sql_query->fetch();
		
		$sql_query=$conn->prepare("INSERT INTO users_privileges (user_id,group_id) VALUES (?,?)");
		$sql_query->bindParam(1,$user_id['id']);
		$sql_query->bindParam(2,$group_id['id']);
		$sql_query->execute();
		
		$unique_group = 1;
	} else {
		$unique_group = 0;
	}

}
$conn = NULL;
?>

<!DOCTYPE html>
<html>

<head>
    <title>PD UOWM - Create Group</title>
    <meta charset="UTF-8">
	<link rel="stylesheet" type="text/css" href="css/sidebar.css">
    <link rel="stylesheet" type="text/css" href="css/main.css">
    <link rel="stylesheet" type="text/css" href="css/form.css">
    
    
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
</head>


<body>
	<?php
		include 'cp_header.php';
		include 'cp_side.php';
	?>
	<div class = "form_design">
		<h1>Create Group</h1>
	<form method="post" action="new_group.php">
		<label>
			<span>Group Name:</span>
			<input type="text" name="gname" maxlength="25" value="<? echo $group; ?>" onblur="notblank(this.value);">    	
		</label>
			<?php
			if (isset($_POST['submit_reg']) && $unique_group==0){
				print '<span class = "error_msg">';	
				echo "Group name exists.";
				print '</span>';
				print '<br><br>';
			}
			?>
			<br>
			<input type="submit" class="submit_btn" name="submit_reg" value="Create" disabled />
	</form>
	<div class = "success"><?php echo $success_msg; ?></div>
	</div>
	<?php include 'footer.php'; ?>
<script>
	function notblank(arg){
		if (arg.length>0){
			document.getElementsByName("gname")[0].style.backgroundColor="green";
			document.getElementsByName("submit_reg")[0].disabled = false;
		} else {
			document.getElementsByName("gname")[0].style.backgroundColor="red";
			document.getElementsByName("submit_reg")[0].disabled = true;
		}
	}
</script>
</body>
</html>