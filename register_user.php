<?php
	require_once('session_check_root.php');
?>

<?php
require_once('connect.inc');
require_once('connect2db');
require_once('rng.php');
			
$conn=connect_db($host,$db,$db_user,$db_pass);

if(isset($_POST['submit_reg'])) {
	$username=filter_var($_POST['uname'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
	$email=filter_var($_POST['email'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
	$lname=filter_var($_POST['lname'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
	$fname=filter_var($_POST['fname'],FILTER_SANITIZE_STRING,FILTER_FLAG_STRIP_LOW);
	$groups=$_POST['group'];
	
	$sql_query=$conn->prepare("SELECT username FROM users_information WHERE username=?");
	$sql_query->bindParam(1,$username);
	$sql_query->execute();
	$result=$sql_query->fetchAll();
	//print_r($result);
	$var1=empty($result);
	
	$username_length = 1;
	$fname_length = 1;
	$lname_length = 1;
	$email_length = 1;
	
	if (strlen($username)<=15 && strlen($email)<=50 && strlen($lname)<=25 && strlen($fname)<=25) {
		if ($var1==0) { // check if username exists
			$uniqueusr = 0;
			$username="";
			
		} else { // if username is unique check email
			$uniqueusr = 1;
			$sql_query=$conn->prepare("SELECT email FROM users_information WHERE email=?");
			$sql_query->bindParam(1,$email);
			$sql_query->execute();
			$result=$sql_query->fetchAll();
			
			$var1=empty($result);
			if ($var1==0) { // check if email exists
				$uniqueem=0;
				$email="";
			} else { // if the username and the email are unique
				$uniqueem=1;
				$password_plain = random_webid(10);
				$password = password_hash($password_plain,PASSWORD_DEFAULT); //hash the password
				/*
				echo $username;
				echo $password;
				echo $group;
				echo $fname;
				echo $lname;
				echo $email;
				*/
				$sql_query=$conn->prepare("INSERT INTO users_information (username,password,password_plain,fname,lname,email) VALUES (?,?,?,?,?,?)");
				$sql_query->bindParam(1,$username);
				$sql_query->bindParam(2,$password);
				$sql_query->bindParam(3,$password_plain);
				$sql_query->bindParam(4,$fname);
				$sql_query->bindParam(5,$lname);
				$sql_query->bindParam(6,$email);
				$sql_query->execute();
				
				if (!empty($groups)){ //run this block if admin has selected at least one group
					$sql_query=$conn->prepare("SELECT id FROM users_information WHERE username = ?"); //find user id
					$sql_query->bindParam(1,$username);
					$sql_query->execute();
					
					$result=$sql_query->fetchAll();
					foreach ($result as $row) {
						$user_id = $row[0];
					}
					
					for ($i=0;$i<count($groups);$i=$i+1) {
						$sql_query=$conn->prepare("SELECT id FROM groups WHERE name = ?"); //find group id
						$sql_query->bindParam(1,$groups[$i]);
						$sql_query->execute();
						
						$result=$sql_query->fetchAll();
						foreach ($result as $row) {
							$group_id = $row[0];
						}
						
						$sql_query=$conn->prepare("INSERT INTO users_privileges (user_id,group_id) VALUES (?,?)");
						$sql_query->bindParam(1,$user_id);
						$sql_query->bindParam(2,$group_id);
						$sql_query->execute();		
					}
				}
			
				$to = $email;
				$subject = "PDM UOWM";
				$message = 'You joined the administration team of public displays of UOWM.'."\r\n".		
				'Your credentials are :'."\r\n".
				'Username : '.$username."\r\n".
				'Password : '.$password_plain."\r\n".
				'We strongly advise you to change the autogenerated password.'."\r\n";
				$headers = 'From: PDM UOWM Admin';
				
				if (mail($to, $subject, $message,$headers)){
					$username="";
					$fname="";
					$lname="";
					$email="";
					$success_msg = 'New user registered. An e-mail have sent to him/her.';
				}
			}
		}
	} else {
		if (strlen($username)>15){
			$username_length = 0;
		}
		if (strlen($fname)>25){
			$fname_length = 0;
		}
		if (strlen($lname)>25){
			$lname_length = 0;
		}
		if (strlen($email)>50){
			$email_length = 0;
		}
	}
}

$conn = NULL;	

?>
<!DOCTYPE html>
<html>

<head>
    <title>PD UOWM - Create User</title>
    <meta charset="UTF-8" />
    
    <link rel="stylesheet" type="text/css" href="css/sidebar.css">
    <link rel="stylesheet" type="text/css" href="css/main.css">
    
    <link rel="stylesheet" type="text/css" href="css/form.css">
    
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="js/sidebar.js"></script>
</head>
<body>
<?php
	include 'cp_header.php';
	include 'cp_side.php';
?>
	
<div class = "form_design">
	<h1>Create User</h1>
<form method="post" action="register_user.php">	
	<label>
		<span>Username:</span>
		<input type="text" name="uname" maxlength="15" value="<?php echo $username; ?>" onblur="notblank(this.value,this.name);">  
	</label>
	
	<?php
		if (isset($_POST['submit_reg']) && isset($uniqueusr) && $uniqueusr==0){
			print '<span class = "error_msg">';
			echo "Username exists.";
			print '</span>';
			print '<br><br>';
		}
	?>
	
	<?php
		if (isset($_POST['submit_reg']) && $username_length==0){
			print '<span class = "error_msg">';
			echo "Username must not exceed 15 characters.";
			print '</span>';
			print '<br><br>';
		}
	?>
	<label>
		<span>First name:</span>
		<input type="text" name="fname" maxlength="25" value="<?php echo $fname; ?>" onblur="checkname(this.value,this.name);">
	</label>
	<?php
		if (isset($_POST['submit_reg']) && $fname_length==0){
			print '<span class = "error_msg">';
			echo "First name must not exceed 25 characters.";
			print '</span>';
			print '<br><br>';
		}
	?>
	<br>	
	<label>
		<span>Last name:</span>
		<input type="text" name="lname" maxlength="25" value="<?php echo $lname; ?>" onblur="checkname(this.value,this.name);">    	
	</label>
	<?php
		if (isset($_POST['submit_reg']) && $lname_length==0){
			print '<span class = "error_msg">';
			echo "Last name must not exceed 25 characters.";
			print '</span>';
			print '<br><br>';
		}
	?>
	<br>
	<label>
		<span>E-mail:</span>
		<input type="text" name="email" maxlength="50" value="<?php echo $email; ?>" onblur="checkemail(this.value,this.name);">
		<?php
		if (isset($_POST['submit_reg']) && $email_length==0){
			print '<span class = "error_msg">';
			echo "E-mail must not exceed 50 characters.";
			print '</span>';
			print '<br><br>';
		}
	?>
	</label>
	
	<?php
		if (isset($_POST['submit_reg']) && isset($uniqueem) && $uniqueem==0){
			print '<span class="error_msg">';
			echo "E-mail address exists.";
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
	<input type="submit" name="submit_reg" value="Register" class="submit_btn">
</form>
<div class = "success"><?php echo $success_msg; ?></div>
</div>
<?php include 'footer.php'; ?>
<script src = "js/validation.js"></script>
</body>
</html>
