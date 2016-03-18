function pass_data(arg){
	var id=arg.substring(0,arg.length-1);
	un = document.getElementById(id).innerHTML;
	var send_data="screen=".concat(un);
	
	var xmlhttp;
	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	
	xmlhttp.onreadystatechange=function()
	  {
	  if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			document.getElementById("results").innerHTML="";
			document.getElementById("results").innerHTML=xmlhttp.responseText;
			old_name = document.getElementsByName("scrname")[0].value;
		}
	  }
	

	xmlhttp.open("POST","modify_device.php",true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send(send_data);
}

function upd_dlt_dev(arg){
	var xmlhttp2;
	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp2=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5
		xmlhttp2=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	
	xmlhttp2.onreadystatechange=function()
	  {
	  if (xmlhttp2.readyState==4 && xmlhttp2.status==200)
		{
			document.getElementById("retDiv").innerHTML="";
			document.getElementById("retDiv").innerHTML=xmlhttp2.responseText;
		}
	  }
	  
	if (arg.localeCompare("Delete")==0) {
		var send_data="delete_device=".concat(document.getElementsByName("scrname")[0].value);
		xmlhttp2.open("POST","upddel_device.php",true);
		xmlhttp2.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp2.send(send_data);
	} else if (arg.localeCompare("Update") == 0){
		if (check_data() == true) {
			var send_data="update_device=".concat(document.getElementsByName("scrname")[0].value,"&description=",document.getElementsByName("description")[0].value,"&old_name=",old_name);
			xmlhttp2.open("POST","upddel_device.php",true);
			xmlhttp2.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp2.send(send_data);
		}
	}
}
	
