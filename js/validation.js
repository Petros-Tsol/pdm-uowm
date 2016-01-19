var validgroup = 0; //variable for group

var validfn = 0; //variables for user
var validln = 0;
var validun = 0;
var validem = 0;


var validdescr = 0; //variables for screen
var validname = 0;
	

function check_sim() { //used in ch_pass.php file to check if the password fields match
	var pass1 = document.getElementsByName("password")[0].value;
	var pass2 = document.getElementById("retype").value;
	
	if (pass1 == pass2 && pass1!="") {
		document.getElementsByName("change_pass")[0].disabled = false;
	} else {
		document.getElementsByName("change_pass")[0].disabled = true;
	}
}


function notblank(arg,input){ //used in various to check if a input is empty
	if (arg.length>0){
		document.getElementsByName(input)[0].style.backgroundColor="green";
		if (input == "uname") {
			validun = 1;
			enablebutton(validun,validfn,validln,validem);
		} else if (input == "scrname") {
			validname = 1;
			enablebutton(validname,validdescr);
		} else if (input == "description") {
			validdescr = 1;
			enablebutton(validname,validdescr);
		} else if (input == "gname") {
			validgroup = 1;
			enablebutton(validgroup);
		}
	} else {
		document.getElementsByName(input)[0].style.backgroundColor="red";
		if (input == "uname") {
			validun = 0;
			enablebutton(validun,validfn,validln,validem);
		} else if (input == "scrname") {
			validname = 0;
			enablebutton(validname,validdescr);
		} else if (input == "description") {
			validdescr = 0;
			enablebutton(validname,validdescr);
		} else if (input == "gname") {
			validgroup = 0;
			enablebutton(validgroup);
		}  
	}
}

function checkname(arg,flname) { //check first and last name input are only letters not numbers
	var patt=/^[A-z]+$/g;
	var check = patt.test(arg);
	if (check) {
		document.getElementsByName(flname)[0].style.backgroundColor="green";
		if (flname == "fname"){
			validfn=1;
		} else {
			validln=1;
		}
	} else {
		document.getElementsByName(flname)[0].style.backgroundColor="red";
		if (flname == "fname"){
			validfn=0;
		} else {
			validln=0;
		}
	}
	enablebutton(validun,validfn,validln,validem);
}
	
function checkemail(arg,nemail){ //check if email matches the regular expression
	var patt=/^[_\.0-9a-zA-Z-]+@[0-9a-zA-Z][0-9a-zA-Z-\.]+\.+[a-zA-Z]{2,8}$/g;
	var check = patt.test(arg);
	if (check) {
		document.getElementsByName(nemail)[0].style.backgroundColor="green";
		validem=1;
	} else {
		document.getElementsByName(nemail)[0].style.backgroundColor="red";
		validem=0;
	}
	enablebutton(validun,validfn,validln,validem);
}	

function enablebutton() { //function to enable the submit button
	var i=0;
	
	while (i<arguments.length){ //it recieves a dynamic number of arguments, if ALL of them are value = 1 then submit button is enabled
		if (arguments[i]!=1) {
			break;
		}
		i=i+1;
	}
	
	if (i==arguments.length) {
		document.getElementsByName("submit_reg")[0].disabled = false;
	} else {
		document.getElementsByName("submit_reg")[0].disabled = true;
	}
}
