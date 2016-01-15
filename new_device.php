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
	$screen=filter_var($_POST['scrname'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
	$descr=filter_var($_POST['description'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
	$groups=$_POST['group'];

	
	$sql_query=$conn->prepare("SELECT name FROM screens WHERE name=?");
	$sql_query->bindParam(1,$screen);
	$sql_query->execute();
	$result=$sql_query->fetchAll();
	//print_r($result);
	$var1=empty($result);

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
		} else {
			$success_msg = "An error occured. Please try again.";
		}
	
		if (!empty($groups)){ //run this block if admin has selected at least one group
			$sql_query=$conn->prepare("SELECT id FROM screens WHERE name = ?"); //find screen id
			$sql_query->bindParam(1,$screen);
			$sql_query->execute();
			
			$result=$sql_query->fetchAll();
			foreach ($result as $row) {
				$screen_id = $row[0];
			}
			
			for ($i=0;$i<count($groups);$i=$i+1) {
				$sql_query=$conn->prepare("SELECT id FROM groups WHERE description = ?"); //find group id
				$sql_query->bindParam(1,$groups[$i]);
				$sql_query->execute();
				
				$result=$sql_query->fetch();
				
				$sql_query=$conn->prepare("INSERT INTO screens_groups (screen_id,group_id) VALUES (?,?)");
				$sql_query->bindParam(1,$screen_id);
				$sql_query->bindParam(2,$result['id']);
				$sql_query->execute();
			}
		}
	}
	//header('Location: control_panel.php');
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
		if (isset($_POST['submit_reg']) && $uniquescreen==0){
			print '<span class = "error_msg">';
			echo "Screen name already exists.";
			print '</span>';
			print '<br><br>';
		}
		?>
	
	<label>
		<span>Description:</span>
    	<input type="text" name="description" maxlength="300" value="<?php echo $descr; ?>" onblur="notblank(this.value,this.name);">    	
	</label>
	
	<label>
		<span>Groups:</span><br>
		<?php
			require_once('connect.inc');
			require_once('connect2db');

			$conn=connect_db($host,$db,$db_user,$db_pass);
			
			$sql_query=$conn->prepare("SELECT description FROM groups");
			$sql_query->execute();
			$result=$sql_query->fetchAll();
			
			foreach ($result as $row) {
				print '<label>';
				print '<input type="checkbox" name="group[]" value="'.$row['description'].'">'.$row['description'].'<br>';
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
	
	var validdescr;
	var validname;
	
	function enablebutton(){
		if (validname == 1 && validdescr == 1 ) {
			document.getElementsByName("submit_reg")[0].disabled = false;
		} else {
			document.getElementsByName("submit_reg")[0].disabled = true;
		}
	}

	/*function isnumeric(arg,input) {
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
	}*/
	
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
</script>
</body>
</html>
