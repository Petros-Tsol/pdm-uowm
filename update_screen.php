<?php

ignore_user_abort(1);
set_time_limit(0);
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive'); //FIREFOX ONLY
//echo "retry: 6000\n"; //reconnect after 7 sec (7000 ms)

	require_once('connect.inc');
	require_once('connect2db');
	$conn=connect_db($host,$db,$db_user,$db_pass);



	//echo json_encode(array("data"=>"Waiting for data...","color"=>"#FF4a3d"));
	
/*
	if (empty($result)) {
		echo json_encode(array("data"=>"Waiting for data...","color"=>"#FFFFFF"));
	} else if ($result!=$_POST['current_data']) {
		foreach ($result as $row){
			echo json_encode(array("data"=>$row[0],"color"=>$row[1]));
		}
	} else {
		echo json_encode(array("data"=>"","color"=>"")); //WILL NEVER BE USED FROM CLIENT!!!
	}	
	
*/	
	$id = $_COOKIE['dev_id']; //webid of screen
	
	$sql_query=$conn->prepare("SELECT valid_time, id FROM screens WHERE webid=?"); //get the expiration time of cookie. in other words the time to stop the streaming. unix time
	$sql_query->bindParam(1,$id);
	$sql_query->execute();
	$result=$sql_query->fetchAll();
	
	foreach ($result as $row){
		$valid_time = $row[0];
		$screen_id = $row[1];
	}
	//unset($row);
	
	$flag = 0;
	$current_content = 1; //shows queue element from the content_scheduler table.
	$content_time = time(); // unix time to compute the next change of content
	while (time() <= $valid_time) {
		$sql_query=$conn->prepare("SELECT content_id, datetimefrom, datetimeto FROM announcements WHERE screen_id=?");
		$sql_query->bindParam(1,$screen_id);
		$sql_query->execute();
		$result=$sql_query->fetchAll();
		
		/*
		$myfile = fopen("announcement", "w") or die("Unable to open file!");
		fwrite($myfile,!empty($result[0]));
		fclose($myfile);
		*/	
		if (empty($result[0]) || (time() >= $result[0]['datetimefrom'] && time() <= $result[0]['datetimeto']) == false) { //if no announcement found or if a announcement found but it is not in the time limit.
			$sql_query=$conn->prepare("SELECT content_id, refresh_rate FROM content_scheduler WHERE screen_id=? ORDER BY queue");
			$sql_query->bindParam(1,$screen_id);
			$sql_query->execute();
			$result=$sql_query->fetchAll();
			
			if (time() - $content_time >= $result[$current_content - 1]["refresh_rate"]) {
				$content_time = time();
				
				if ($current_content < count($result)) {
					$current_content = $current_content + 1;
				} else {
					$current_content = 1;
				}
				
				/* THIS IS WORKING!!!! NEW WAY FROM NOW
				$sql_query=$conn->prepare("UPDATE screens AS s JOIN contents AS c
				SET s.html = c.content_html, s.backcolor = c.backcolor, s.backimage_url = c.backimage_url, s.qrcode_id = c.qrcode_id, s.backimage_option = c.backimage_option WHERE c.id = ? AND s.webid = ?");
				$sql_query->bindParam(1,$result[$current_content - 1]['content_id']);
				$sql_query->bindParam(2,$id);
				$sql_query->execute();
				*/
				
				$sql_query=$conn->prepare("UPDATE screens SET content_id=? WHERE webid = ?");
				$sql_query->bindParam(1,$result[$current_content - 1]['content_id']);
				$sql_query->bindParam(2,$id);
				$sql_query->execute();
			}
		} else {
			if (time() >= $result[0]['datetimefrom'] && time() <= $result[0]['datetimeto']) {
				/*
				$sql_query=$conn->prepare("UPDATE screens AS s JOIN contents AS c
				SET s.html = c.content_html, s.backcolor = c.backcolor, s.backimage_url = c.backimage_url, s.qrcode_id = c.qrcode_id, s.backimage_option = c.backimage_option WHERE c.id = ? AND s.webid = ?");
				$sql_query->bindParam(1,$result[0]['content_id']);
				$sql_query->bindParam(2,$id);
				$sql_query->execute();
				*/
				
				$sql_query=$conn->prepare("UPDATE screens SET content_id=? WHERE webid = ?");
				$sql_query->bindParam(1,$result[0]['content_id']);
				$sql_query->bindParam(2,$id);
				$sql_query->execute();
			}
		}
		
		
		
		
		
		$sql_query=$conn->prepare("SELECT content_id, qrcode_id FROM screens WHERE webid = ?");
		$sql_query->bindParam(1,$id);
		$sql_query->execute();
		$screen=$sql_query->fetch();
		
		
		$sql_query=$conn->prepare("SELECT content_html, backcolor, backimage_url, backimage_option FROM contents WHERE id=?");
		$sql_query->bindParam(1,$screen['content_id']);
		$sql_query->execute();
		$result=$sql_query->fetchAll();
		
		/*
		$sql_query=$conn->prepare("SELECT html, backcolor, backimage_url,backimage_option, qrcode_id FROM screens WHERE webid=?");
		$sql_query->bindParam(1,$id);
		$sql_query->execute();
		$result=$sql_query->fetchAll();
		*/
		foreach ($result as $row){
			$content["html"] = $row[0];
			$content["bg_color"] = $row[1];
			$content["bg_img"] = $row[2];
			$content["bg_opt"] = $row[3];
			$content["qr"] = $screen['qrcode_id'];
		}
		
		if ($content != $old_content || !(isset($old_content))) {
			echo 'data: '.json_encode($content)."\n\n";
			ob_end_flush();
			flush();	
		}
		
		echo "data:0\n\n"; //sending data to dead TCP connection will fail and return connection aborted
		ob_end_flush();
		flush();
		
		if (connection_status() != 0){
			$flag = 1;
			break;
		}

		$old_content = $content;
		sleep(8); //attempt to send new data after X sec
	}
	
	if ($flag == 0) {
		$content["html"] = "NOMOREDATA"; 
		$content["bg_color"] = "";
		$content["bg_img"] = "";
		$content["bg_opt"] = "";
		$content["qr"] = "";
		echo 'data: '.json_encode($content)."\n\n"; //notify client to close the conenction
	
		$sql_query=$conn->prepare("UPDATE screens SET webid=?, valid_time=? WHERE webid=?");
		$sql_query->bindValue(1,"");
		$sql_query->bindValue(2,"");
		$sql_query->bindParam(3,$id);
		$sql_query->execute();
	}
	
	$conn = NULL;
?>
