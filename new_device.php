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
	$screen=filter_var($_POST['scrname'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
	$descr=filter_var($_POST['description'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
	$groups=$_POST['group'];

	
	$sql_query=$conn->prepare("SELECT name FROM screens WHERE name=?");
	$sql_query->bindParam(1,$screen);
	$sql_query->execute();
	$result=$sql_query->fetchAll();
	//print_r($result);
	$var1=empty($result);
	
	$descr_length = 1;
	$scrname_length = 1;
	
	if (strlen($screen)<=25 && strlen($descr)<=300) {
		if ($var1==0) { // check if screen name exist
			$uniquescreen = 0;
			$screen="";
			
		} else { // if screen name is unique
			$uniquescreen = 1;
			
			$sql_query=$conn->prepare("INSERT INTO screens (name,description) VALUES (?,?)");
			$sql_query->bindParam(1,$screen);
			$sql_query->bindParam(2,$descr);
			
			if ($sql_query->execute()) {
				$success_msg = "New device created.";
				
				if (!empty($groups)){ //run this block if admin has selected at least one group
					$sql_query=$conn->prepare("SELECT id FROM screens WHERE name = ?"); //find screen id
					$sql_query->bindParam(1,$screen);
					$sql_query->execute();
					
					$result=$sql_query->fetchAll();
					foreach ($result as $row) {
						$screen_id = $row[0];
					}
					for ($i=0;$i<count($groups);$i=$i+1) {
						$sql_query=$conn->prepare("SELECT id FROM groups WHERE name = ?"); //find group id
						$sql_query->bindParam(1,$groups[$i]);
						$sql_query->execute();						
						$result=$sql_query->fetch();

						$sql_query=$conn->prepare("INSERT INTO screens_groups (screen_id,group_id) VALUES (?,?)");
						$sql_query->bindParam(1,$screen_id);
						$sql_query->bindParam(2,$result['id']);
						$sql_query->execute();
					}
				}
				$screen="";
			} else {
				$success_msg = "An error occured. Please try again.";
			}
		}
		//header('Location: control_panel.php');
	} else {
		if (strlen($descr)>300){
			$descr_length = 0;
		}
		if (strlen($screen)>25){
			$scrname_length = 0;
		}
	}
}

$conn = NULL;	

?>

<!DOCTYPE html>
<html>
<head>
    <title>PD UOWM - Create Device</title>
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
	<h1>Create Device</h1>
<form method="post" action="new_device.php">
	<label>
		<span>Screen Name:</span>
    	<input type="text" name="scrname" maxlength="25" value="<?php echo $screen; ?>" onblur="notblank(this.value,this.name);"> 
	</label>
	
		<?php
		if (isset($_POST['submit_reg']) && isset($uniquescreen) && $uniquescreen==0){
			print '<span class = "error_msg">';
			echo "Screen name already exists.";
			print '</span>';
			print '<br><br>';
		}
		?>
		<?php
		if (isset($_POST['submit_reg']) && $scrname_length==0){
			print '<span class = "error_msg">';
			echo "Screen name must not exceed 25 characters.";
			print '</span>';
			print '<br><br>';
		}
		?>
	
	<label>
		<span>Description:</span>
    	<textarea name="description" maxlength="300" value="<?php echo $descr; ?>" onblur="notblank(this.value,this.name);"></textarea>
    	<br>
	</label>
	<?php
		if (isset($_POST['submit_reg']) && $descr_length==0){
			print '<span class = "error_msg">';
			echo "Description must not exceed 300 characters.";
			print '</span>';
			print '<br><br>';
		}
	?>
	
	<label>
		<span>Groups:</span><br>
		<?php
			require_once('connect.inc');
			require_once('connect2db');

			$conn=connect_db($host,$db,$db_user,$db_pass);
			
			$sql_query=$conn->prepare("SELECT name FROM groups");
			$sql_query->execute();
			$result=$sql_query->fetchAll();
			
			foreach ($result as $row) {
				print '<label>';
				print '<input type="checkbox" name="group[]" value="'.$row['name'].'">'.$row['name'].'<br>';
				print '</label>';
			}
			
			$conn = NULL;
		?>   	
	</label>
	<br>
	<input type="submit" name="submit_reg" class= "submit_btn" value="Register" disabled>

</form>
<div class = "success"><?php echo $success_msg; ?></div>
</div>
<?php include 'footer.php'; ?>
<script>
</script>
</body>
</html>
