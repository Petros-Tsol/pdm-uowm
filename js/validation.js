var validgroup = 0; //variables for group
var validgrp_descr = 0

var validfn = 0; //variables for user
var validln = 0;
var validun = 0;
var validem = 0;


var validdescr = 0; //variables for screen
var validname = 0;	

document.querySelector("form").addEventListener("submit", function(e){
	check_data(e);
});

function check_data(){
	var inputs = document.getElementsByTagName("form");
	var last_elem = inputs[inputs.length-1];
	var first_elem = inputs[0];
	//console.log(arguments[0].target.id);
	
	if (arguments.length == 0 ||arguments[0].target.id != "search") 
	{
		var i = 0; 
		while (i<last_elem.length) {
			if (last_elem[i].type == "text") {
				if (last_elem[i].name == "fname" || last_elem[i].name == "lname") {
					checkname(last_elem[i].value,last_elem[i].name);
				} else if (last_elem[i].name == "uname" || last_elem[i].name == "scrname" || last_elem[i].name == "gname") {
					notblank(last_elem[i].value,last_elem[i].name);
				} else if (last_elem[i].name == "email") {
					checkemail(last_elem[i].value,last_elem[i].name);
				}
			} else if (last_elem[i].type == "textarea") {
				notblank(last_elem[i].value,last_elem[i].name);
			}
			i++;
		}
		
		if (validfn == 0 || validln == 0 || validun == 0 || validem == 0) {
			//e.preventDefault();
			//8a gine me emfoleymenes if
			if (validname == 0 || validdescr == 0){
				if (validgroup == 0 || validgrp_descr == 0) {
					if (arguments.length == 1) {
						arguments[0].preventDefault();
					}
					return false;
				} else {
					return true;
				}
			} else {
				return true;
			}
		} else {
			return true;
		}
	}
	
}

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
	if (arg.length>0 && /\S/.test(arg)){
		document.getElementsByName(input)[0].style.backgroundColor="#21E421";
		if (input == "uname") {
			validun = 1;
			//enablebutton(validun,validfn,validln,validem);
		} else if (input == "scrname") {
			validname = 1;
			//enablebutton(validname,validdescr);
		} else if (input == "description") {
			validdescr = 1;
			//enablebutton(validname,validdescr);
		} else if (input == "gname") {
			validgroup = 1;
			//enablebutton(validgroup,validgrp_descr);
		} else if (input == "group_description") {
			validgrp_descr = 1;
			//enablebutton(validgroup,validgrp_descr);
		}
	} else {
		document.getElementsByName(input)[0].style.backgroundColor="red";
		if (input == "uname") {
			validun = 0;
			//enablebutton(validun,validfn,validln,validem);
		} else if (input == "scrname") {
			validname = 0;
			//enablebutton(validname,validdescr);
		} else if (input == "description") {
			validdescr = 0;
			//enablebutton(validname,validdescr);
		} else if (input == "gname") {
			validgroup = 0;
			//enablebutton(validgroup,validgrp_descr);
		} else if (input == "group_description") {
			validgrp_descr = 0;
			//enablebutton(validgroup,validgrp_descr);
		}
	}
}

function checkname(arg,flname) { //check first and last name input are only letters not numbers
	var patt=/^[A-ZA-zΑ-Ωα-ωίϊΐόάέύϋΰήώ]+$/g;
	var check = patt.test(arg);
	if (check) {
		document.getElementsByName(flname)[0].style.backgroundColor="#21E421";
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
	//enablebutton(validun,validfn,validln,validem);
}
	
function checkemail(arg,nemail){ //check if email matches the regular expression
	var patt=/^[_\.0-9a-zA-Z-]+@[0-9a-zA-Z][0-9a-zA-Z-\.]+\.+[a-zA-Z]{2,8}$/g;
	var check = patt.test(arg);
	if (check) {
		document.getElementsByName(nemail)[0].style.backgroundColor="#21E421";
		validem=1;
	} else {
		document.getElementsByName(nemail)[0].style.backgroundColor="red";
		validem=0;
	}
	//enablebutton(validun,validfn,validln,validem);
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

