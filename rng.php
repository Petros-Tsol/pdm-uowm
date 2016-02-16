<?php
function random_webid($length) {
	$index = array("a", "b" ,"c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B" ,"C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"); //password characters

	$n=count($index)-1; //number of characters

	for ($i=0;$i<$length;$i=$i+1) {
		$generated = $generated.$index[rand(0,$n)];
	}
	
	return $generated;
}
?>
