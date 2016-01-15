<?php
$user="apap";
$pass=3904933590;
// The message
$message = 'Ενταχθήκατε στην ομάδα διαχείρισης των public displays του ΠΔΜ.'."\r\n".
'Τα στοιχεία σας είναι:'."\r\n".
'Username:'.$user."\r\n".
'Password:'.$pass."\r\n".
'Προτείνουμε ανεπυφύλαχτα να αλλάξατε τoν αυτόματο κωδικό.'."\r\n";
//echo $message;

// In case any of our lines are larger than 70 characters, we should use wordwrap()
$subject="PDM UOWM";
//$message = wordwrap($message, 70, "\r\n");
$headers = 'From: PDM UOWM Admin';
// Send
if (mail($to, $subject, $message,$headers)){
	echo "done";
}
?>
