<!DOCTYPE html>

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;">
    <title>PD - SELECT LAYOUT</title>
    <link rel="stylesheet" type="text/css" href="css/select_layout.css">
</head>

<body>
	<div id = "layout_menu">
		
		<?php				
		if (isset($_GET['qr'])) { //called from display.php when user scanned and open the qr code link
			require_once('connect.inc');
			require_once('connect2db');
			require_once('rng.php');
			$conn=connect_db($host,$db,$db_user,$db_pass);
			
			$content_list="";
			print '<div id = "menu_title">';
			if (!isset($_GET['layout_id'])) {
				$sql_query=$conn->prepare("SELECT id,name FROM screens WHERE qrcode_id=?"); 
				$sql_query->bindParam(1,$_GET['qr']);
				$sql_query->execute();
				$screen_result=$sql_query->fetch();
				
				if (!empty($screen_result)){
				 //always return zero or one screen because qrcode_id is unique
					$sql_query=$conn->prepare("SELECT content_id FROM content_scheduler WHERE screen_id=?"); 
					$sql_query->bindParam(1,$screen_result['id']);
					$sql_query->execute();
					$content = $sql_query->fetchAll();
					
					
					print '<h3>Select a content for this screen</h3>';
					
					print '<div id = "menu_items">';
						print '<nav>';
						print '<ul>';
					foreach ($content as $content_row) {
						$sql_query=$conn->prepare("SELECT name FROM contents WHERE id = ?");
						$sql_query->bindParam(1,$content_row['content_id']);
						$sql_query->execute();
						$content_result=$sql_query->fetch();
						
						
						$content_list = $content_list."<li><a href = 'select_layout.php?layout_id=".$content_row[0]."&qr=".$_GET['qr']."'>".$content_result['name']."</a></li>";
					}
					echo $content_list;
						print '</ul>';
						print '</nav>';
					print '</div>';
					
				} else {
					print '<h3>This QR Code was not found</h3>';
					print '<div id = "menu_items">';
						print 'Please scan a valid QR code.';
					print '</div>';
				}
				print '</div>';
			} else if (isset($_GET['layout_id'])) { //when a button has pressed
				$sql_query=$conn->prepare("SELECT content_html, backcolor, backimage_url, backimage_option FROM contents WHERE id = ?");  //select new content
				$sql_query->bindParam(1,$_GET['layout_id']);
				$sql_query->execute();
				$layout_result=$sql_query->fetchAll();
				
				foreach ($layout_result as $layout_row){
					/*
					$sql_query=$conn->prepare("UPDATE screens SET content_id=? WHERE qrcode_id=?"); //update screen
					$sql_query->bindParam(1,$_GET['layout_id']);
					$sql_query->bindParam(2,$_GET['qr']);
					$sql_query->execute();
					*/
					do { //generate a unique random qrcode_id
						$qrid = random_webid(15);
						$sql_query=$conn->prepare("SELECT qrcode_id FROM screens WHERE qrcode_id LIKE ?");
						$sql_query->bindParam(1,$qrid);
						$sql_query->execute();
						$result=$sql_query->fetchAll();
					} while (!empty($result));
					
					$sql_query=$conn->prepare("UPDATE screens SET qrcode_id=?, content_id=? WHERE qrcode_id=?");
					$sql_query->bindParam(1,$qrid);
					$sql_query->bindParam(2,$_GET['layout_id']);
					$sql_query->bindParam(3,$_GET['qr']);
					
					print '<h3>Change content result</h3>';
					print '<div id = "menu_items">';
					if ($sql_query->execute()) {
						echo "Content succefully changed. You will see it, after some seconds.";
					} else {
						echo "An error occured. Content did not change.";
					}
					print '</div>';
				}
			}
			$conn = NULL;
		} else {
			echo "<h3>Can't access this page without a QR code.</h3>";
		}
		?>
           
	</div>
</body>
</html>
