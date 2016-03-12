<?php
	require_once('session_check.php');
?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
    <title>PD - Layout Design</title>

	<link rel="stylesheet" type="text/css" href="css/layout_design.css">

    <script src="http://code.jquery.com/jquery-2.1.1.js"></script>
    <script src="http://code.jquery.com/ui/1.11.2/jquery-ui.js"></script>
    <link rel="stylesheet" href="http://code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css">
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-ui-timepicker-addon/1.4.5/jquery-ui-timepicker-addon.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-ui-timepicker-addon/1.4.5/jquery-ui-sliderAccess.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-ui-timepicker-addon/1.4.5/jquery-ui-timepicker-addon.min.css">
    
    <script src="js/colpick.js" type="text/javascript"></script>
	<link rel="stylesheet" href="css/colpick.css">
	
	<script src="../flipclock/flipclock.js"></script>
	<link rel="stylesheet" href="../flipclock/flipclock.css">
	
	<script type="text/javascript" src="js/qrcode.js"></script>
	<script src="/pd_uowm/ckeditor/ckeditor.js"></script>
	
	<script type="text/javascript" src="js/deltiokairou_widget.js"></script>
</head>
<body onbeforeunload = "return warning_message()">
<div id="tools">
	<a id = "link_to_control_panel"href="control_panel.php">Return to control panel</a>
	<br><br>
	<div id = "buttons">
		<div class= "buttons_menu">
			<button id = "lay_but">Layouts</button>	
			<button id = "tool_but">Options</button>
			<button id = "divs_but">Manage Divs</button>
			<button id = "cont_but">Manage Contents</button><br>
		</div><hr>
		
		<div class = "buttons_menu">
			<button id = "new_btn">New Layout</button>
			<button id = "save_btn">Save Layout</button>
			<a href = "#openModal"><button onclick="document.getElementById('select_cont_name_div').style.display='none';document.getElementById('new_cont_name_div').style.display='none';">Save Content</button></a><br>
		</div><hr>
		
		<div class = "buttons_menu">
			<select id = "load_content"></select>
			<button id = "button_load_cont" onclick="">Load Content</button><br>
		</div><hr>
		
		<div id="openModal" class="modalDialog">
			<div>
				<a href="#close" class="close">X</a>
				<h3>Please select</h3>
				<button id ="upd_curr_cont">Update Current</button><br>
				<button onclick="document.getElementById('select_cont_name_div').style.display='none';document.getElementById('new_cont_name_div').style.display='inline';">New Content</button>
				<button onclick="document.getElementById('select_cont_name_div').style.display='inline';document.getElementById('new_cont_name_div').style.display='none';">Update Content</button>
				<div id = "new_cont_name_div">
					<h4>Content Name</h4>
					<input type="text" id = "new_cont_name">
					<button class = "save_cont_btn">Save</button>
				</div>
				
				<div id = "select_cont_name_div">
					<h4>Select Content</h4>
					<select id = "update_content"></select>
					<button class = "save_cont_btn">Save</button>
				</div>
			</div>
		</div>
		
		<div class = "buttons_menu">
		<?php
			require_once('connect.inc');
			require_once('connect2db');
				
			$conn=connect_db($host,$db,$db_user,$db_pass);
			print "<select id= 'device'>";
				$sql_query=$conn->prepare("SELECT id FROM users_information WHERE username = ?");
				$sql_query->bindParam(1,$_SESSION['admin']);
				$sql_query->execute();
				
				$result = $sql_query->fetchAll();
				foreach ($result as $row) {
					$user_id = $row[0];
				}
				
				$sql_query=$conn->prepare("SELECT screens_groups.group_id, screen_id FROM screens_groups JOIN users_privileges ON screens_groups.group_id = users_privileges.group_id WHERE users_privileges.user_id=? ORDER BY screens_groups.group_id");
				$sql_query->bindParam(1,$user_id);
				$sql_query->execute();
				
				$result = $sql_query->fetchAll(PDO::FETCH_COLUMN|PDO::FETCH_GROUP);
				foreach ($result as $index=>$row) {
					$sql_query=$conn->prepare("SELECT name FROM groups WHERE id = ?");
					$sql_query->bindParam(1,$index);
					$sql_query->execute();
					$group_res=$sql_query->fetch();
					print '<optgroup label="'.$group_res['name'].'">';
					
					for ($i=0;$i<count($row);$i=$i+1){
						$sql_query=$conn->prepare("SELECT name,webid FROM screens WHERE id = ?");
						$sql_query->bindParam(1,$row[$i]);
						$sql_query->execute();
						$screen_res = $sql_query->fetch();
						if ($screen_res['webid'] != "") {
							print '<option style="color:#29b332;" value = "'.$screen_res['name'].'">'.$screen_res['name'].'</option>';
						} else {
							print '<option value = "'.$screen_res['name'].'">'.$screen_res['name'].'</option>';
						}
					}
					print '<option value = "'.$group_res['name'].'">(update all)</option>';
					print '</optgroup>';
				}
			print'</select>';
			$conn = NULL;
		?>
		<button id = "upd_scr" onclick="update_screen();">Update Screen(s)</button><br>
		</div><hr>
		<div class = "buttons_menu">
			<button id = "preview_scr" onclick="preview_screen();">Preview</button>
			<input id="preview_width" type="number" value="" placeholder = "Width" class="number_inputs"></input> x
			<input id="preview_height" type="number" value="" placeholder = "Height" class="number_inputs"></input>
		</div>
	</div>
	<div id = "server_return"></div>
	
	<div id = "toolbox" class = "options_menu">
		<form id = "data_form">
			<label><input type="radio"  name="data_type" value="text">Text</label><br>
			<label><input type="radio"  name="data_type" value="img">Image</label><br>
			<label><input type="radio"  name="data_type" value="video">Video</label><br>
			<label><input type="radio"  name="data_type" value="audio">Audio</label><br>
			<label><input type="radio"  name="data_type" value="rss">RSS Feed</label><br>
			<label><input type="radio"  name="data_type" value="weather">Weather</label><br>
			<label><input type="radio"  name="data_type" value="timer">Clock/Countdown</label><br>
			<label><input type="radio"  name="data_type" value="qrcodes">QR Code</label><br>
			<label><input type="radio"  name="data_type" value="iframe">Iframe</label><br>
			<label><input type="radio"  name="data_type" value="bg">Screen Background</label><br>
			<label><input type="radio"  name="data_type" value="html">HTML</label><br>
		</form>
		<div id = "mode"></div>	
	</div>
	<div id = "div_management" class = "options_menu" style="display:none;">
		<br>
		<div id = "current_divs">PLEASE LOAD A LAYOUT</div>
		<div id = "div_scheduler">
			<h4>DIV SCHEDULER</h4>
			<table id ="table_scheduler">
				<tr>
					<th>DATE<br></th>
					<th>HOUR<br></th>
					<th>DAYS<br></th>
				</tr>
				<tr>
					<td>from<br></td>
					<td>from<br></td>
					<td rowspan="4">
						<select name="days" size='7' id = "week_days" multiple>
						  <option value="mon">Monday</option>
						  <option value="tue">Tuesday</option>
						  <option value="wed">Wednesday</option>
						  <option value="thu">Thursday</option>
						  <option value="fri">Friday</option>
						  <option value="sat">Saturday</option>
						  <option value="sun">Sunday</option>
						</select>
					<br></td>
				</tr>
				<tr>
					<td><input type="text" class="datepicker input_date_time" id = "start_date"><br></td>
					<td><input type="text" class="timepicker input_date_time" id = "start_time"><br></td>
				</tr>
				<tr>
					<td>to<br></td>
					<td>to<br></td>
				</tr>
				<tr>
					<td><input type="text" class="datepicker input_date_time" id = "end_date"><br></td>
					<td><input type="text" class="timepicker input_date_time" id = "end_time"><br></td>
				</tr>
			</table>
			<button class="show_hide_div" value = "show">Show</button>
			<button class="show_hide_div" value = "hide">Hide</button>
			<button id = "reset_div_scheduler_table" value = "reset_div_sch">Reset</button>
		</div>
		<div id = "div_rules"></div>
	</div>
	<div id = "content_rotation" class = "options_menu" style="display:none;">
		<div id = "current_contents">
			<br>
			<h4>Add contents for rotation</h4>
			<select id= 'select_content_rotation'></select>
			<button id = "add_content">Add</button>
			<ol>				
			</ol>
			<span>Time between rotation (seconds)</span>
			<input type="number" min = "0" value = "0" id = "content_sec_rotate"><br>
			<button id = "update_screen_scheduler">Update Screen Scheduler</button>
		</div>
	</div>
	<!--<div id = "mode"></div>	-->
	<div id = "saved_layouts" class = "options_menu" style="display:none;"></div>
</div>
<div id="draw_area_cont">
	<div id="draw_area">
	</div>
</div>
<div id="hidden_draw_area">
</div>
<script src="js/layout_design.js"></script>
</body>
</html>
