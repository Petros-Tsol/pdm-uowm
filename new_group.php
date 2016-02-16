<?php
	session_start();
	if ((!isset($_SESSION['admin'])) || ($_SESSION['admin'] != "root"))
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
	$sql_query=$conn->prepare("SELECT name FROM groups WHERE name=?");
	$sql_query->bindParam(1,$group);
	$sql_query->execute();
	$result=$sql_query->fetchAll();
	
	$group_length=1;
	
	if (strlen($group)<=25){
		if (empty($result)) { //if group name DOES NOT EXISTS
			$sql_query=$conn->prepare("INSERT INTO groups (name) VALUES (?)");
			$sql_query->bindParam(1,$_POST['gname']);
			if ($sql_query->execute()){
				$success_msg="Group: ".$_POST['gname']." created";
			} else {
				$success_msg="An error occured. Please try again.";
			}
			
			$sql_query=$conn->prepare("SELECT id FROM groups WHERE name=?");
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
	} else {
		$group_length=0;
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
    <script src="js/sidebar.js"></script>
    <script src="js/validation.js"></script>
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
			<input type="text" name="gname" maxlength="25" value="<?php echo $group; ?>" onblur="notblank(this.value,this.name);">    	
		</label>
			<?php
			if (isset($_POST['submit_reg']) && isset($unique_group) && $unique_group==0){
				print '<span class = "error_msg">';	
				echo "Group name exists.";
				print '</span>';
				print '<br><br>';
			}
			?>
			
			<?php
			if (isset($_POST['submit_reg']) && $group_length==0){
				print '<span class = "error_msg">';
				echo "Group name must not exceed 25 characters.";
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
</body>
</html>
