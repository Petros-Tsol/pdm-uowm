<?php
require_once('connect.inc');
require_once('connect2db');

$conn=connect_db($host,$db,$db_user,$db_pass);

session_start();

if ($_POST['button']=="save_btn" && isset($_SESSION['admin'])) //called by layout_design.php when SAVE LAYOUT BUTTON pressed
{
	
	if ($_POST['lay_id'] == 0) {
		$sql_query=$conn->prepare("SELECT id FROM users_information WHERE username = ?");
		$sql_query->bindParam(1,$_SESSION['admin']);
		$sql_query->execute();
		$user_id = $sql_query->fetch();
		
		$sql_query=$conn->prepare("INSERT INTO layouts (layout_html, div_id, preview, user_id) VALUES (?,?,?,?)");
		$sql_query->bindParam(1,$_POST['html_data']);
		$sql_query->bindParam(2,$_POST['div_id']);
		$sql_query->bindParam(3,$_POST['scaled_data']);
		$sql_query->bindParam(4,$user_id['id']);
		$sql_query->execute();
		
		$sql_query=$conn->prepare("SELECT LAST_INSERT_ID()");
		if ($sql_query->execute()) {
			$result = $sql_query->fetchAll();
			foreach ($result as $row){
				//echo ($row['LAST_INSERT_ID()']);
				$return['id']=$row['LAST_INSERT_ID()'];
				$return['msg']="Layout saved correctly.";
				echo json_encode($return);
			}
		}else {
			echo "An error occured. Please try again.";
		}
	} else {
		$sql_query=$conn->prepare("UPDATE layouts SET layout_html = ?, div_id = ?, preview = ? WHERE id = ?");
		$sql_query->bindParam(1,$_POST['html_data']);
		$sql_query->bindParam(2,$_POST['div_id']);
		$sql_query->bindParam(3,$_POST['scaled_data']);
		$sql_query->bindParam(4,$_POST['lay_id']);
		if ($sql_query->execute()) {
			//echo ($_POST['lay_id']);
			$return['id']=$_POST['lay_id'];
			$return['msg']="Layout saved correctly.";
			echo json_encode($return);
		} else {
			echo "An error occured. Please try again.";
		}
	}
	
} else if ($_POST['button']=="new_content" && isset($_SESSION['admin'])) //called by layout_design.php when SAVE CONTENT BUTTON pressed
{
	$sql_query=$conn->prepare("SELECT COUNT(*) from contents WHERE name = ?");	
	$sql_query->bindParam(1,$_POST['content_name']);
	$sql_query->execute();	
	
	$result = $sql_query->fetchAll();
	foreach ($result as $row){
		$number_of_contents = $row[0]; //should return zero if didn't find a content with this name (normal behaviour) or one if found a content with this name
	}
		if ($number_of_contents == 0) {
			$sql_query=$conn->prepare("SELECT id FROM users_information WHERE username = ?");
			$sql_query->bindParam(1,$_SESSION['admin']);
			$sql_query->execute();
			$user_id = $sql_query->fetch();
			
			$sql_query=$conn->prepare("INSERT INTO contents (name, content_html, backcolor, backimage_url, backimage_option,user_id) VALUES (?,?,?,?,?,?)");
			$sql_query->bindParam(1,$_POST['content_name']);
			$sql_query->bindParam(2,$_POST['data']);
			$sql_query->bindParam(3,$_POST['bg_clr']);
			$sql_query->bindParam(4,$_POST['bg_img']);
			$sql_query->bindParam(5,$_POST['bg_opt']);
			$sql_query->bindParam(6,$user_id['id']);
			if ($sql_query->execute()) {
				echo "Content saved correctly.";
			} else {
				echo "An error occured. Please try again.";
			}
		} else {
			echo "Please select a new name.";
		}
} else if ($_POST['button']=="upd_content" && isset($_SESSION['admin'])) {
	$sql_query=$conn->prepare("UPDATE contents SET content_html = ?, backcolor = ?, backimage_url = ? WHERE name = ?");
	$sql_query->bindParam(1,$_POST['data']);
	$sql_query->bindParam(2,$_POST['bg_clr']);
	$sql_query->bindParam(3,$_POST['bg_img']);
	$sql_query->bindParam(4,$_POST['content_name']);
	if ($sql_query->execute()) {
		echo "Content updated.";
	} else {
		echo "An error occured. Please try again.";
	}
} else if ($_POST['button']=="load_btn") //called by layout_design.php when a layout is clicked
{
	$sql_query=$conn->prepare("SELECT layout_html, div_id FROM layouts WHERE id = ?");
	$sql_query->bindParam(1,intval(str_replace("thub","",$_POST['lay_id'])));
	$sql_query->execute();
	$result = $sql_query->fetchAll();
	foreach ($result as $row){
		echo json_encode(array("layout_html"=>$row['layout_html'],"div_id"=>$row['div_id'],"lay_id"=>intval(str_replace("thub","",$_POST['lay_id']))));
	}
} else if ($_POST['button']=="load_content") { //called by layout_design.php when user load a content
	$sql_query=$conn->prepare("SELECT content_html, backcolor, backimage_url FROM contents WHERE name = ?");
	$sql_query->bindParam(1,$_POST['content']);
	$sql_query->execute();
	$result = $sql_query->fetchAll();
	foreach ($result as $row){
		echo json_encode(array("html"=>$row[0],"image"=>$row[2],"bgcolor"=>$row[1]));
	}
} else if ($_POST['button']=="delete_layout" && isset($_SESSION['admin'])) { //called by layout_design.php when user delete a layout
	$sql_query=$conn->prepare("DELETE FROM layouts WHERE id = ?");
	$sql_query->bindParam(1,$_POST['id']);
	
	if ($sql_query->execute()) {
		echo "Layout deleted.";
	} else {
		echo "An error occured. Please try again.";
	}
	
} else if ($_POST['button']=="layouts" && isset($_SESSION['admin'])) // load layouts thubs
{
	$sql_query=$conn->prepare("SELECT COUNT(*) FROM layouts");
	$sql_query->execute();
	$result = $sql_query->fetchAll();
	foreach ($result as $row){
		$x=$row[0]; //number of layouts
	}
	
	$i=0;
	if ($x>0){
		if ($_SESSION['admin']=="root"){
			$sql_query=$conn->prepare("SELECT preview,id FROM layouts");
			$sql_query->execute();
		} else {
			$sql_query=$conn->prepare("SELECT id FROM users_information WHERE username = ?");
			$sql_query->bindParam(1,$_SESSION['admin']);
			$sql_query->execute();
			$user_id = $sql_query->fetch();
			
			$sql_query=$conn->prepare("SELECT preview,id FROM layouts WHERE user_id=?");
			$sql_query->bindParam(1,$user_id['id']);
			$sql_query->execute();
		}
		$result = $sql_query->fetchAll();
		echo json_encode($result);
	}
} else if  ($_POST['button']=="contents" && isset($_SESSION['admin'])){ //load contents name in select menu
	if ($_SESSION['admin']=="root"){
		$sql_query=$conn->prepare("SELECT name FROM contents");
		$sql_query->execute();
	} else {
		$sql_query=$conn->prepare("SELECT id FROM users_information WHERE username = ?");
		$sql_query->bindParam(1,$_SESSION['admin']);
		$sql_query->execute();
		$user_id = $sql_query->fetch();
		
		$sql_query=$conn->prepare("SELECT name FROM contents WHERE user_id=?");
		$sql_query->bindParam(1,$user_id['id']);
		$sql_query->execute();
	}
	$result = $sql_query->fetchAll();
	/*foreach ($result as $row) {
		print '<option value = "'.$row['0'].'">'.$row[0].'</option>';
	}*/
	echo json_encode($result);
	
} else {
	echo "An error occured. You have probably signed out. Please re-login and try again.";
}

$conn = NULL;	
?>
