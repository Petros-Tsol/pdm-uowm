function pass_data(arg){
	var id=arg.substring(0,arg.length-1);
	un = document.getElementById(id).innerHTML;
	var send_data="admin=".concat(un);
	
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
		}
	  }
	

	xmlhttp.open("POST","modify_user.php",true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send(send_data);	
}

function upd_dlt_us(arg){
	var n=document.getElementsByName(arg)[0].value;

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
			document.getElementById("retDiv").innerHTML=xmlhttp2.responseText;
		}
	  }
	  

	if (n.localeCompare("Delete")==0) {
		var send_data="delete_user=".concat(document.getElementsByName("uname")[0].value);
		xmlhttp2.open("POST","upddel_user.php",true);
		xmlhttp2.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp2.send(send_data);
	} else {
		var send_data="update_user=".concat(document.getElementsByName("uname")[0].value,"&lname=",document.getElementsByName("lname")[0].value,"&fname=",document.getElementsByName("fname")[0].value,"&email=",document.getElementsByName("email")[0].value);
		xmlhttp2.open("POST","upddel_user.php",true);
		xmlhttp2.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp2.send(send_data);
	}

}
