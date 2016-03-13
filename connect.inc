<?php

    function connect_db($host,$db,$usr,$pass) {
    
        try {
            // database connection
            $conn = new PDO("mysql:host=$host;dbname=$db",$usr,$pass,
                array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET CHARACTER SET utf8","SET NAMES utf8")
                );
        }
        
        catch(PDOException $pe) {
            die('Connection error, because: ' .$pe->getMessage());
        }

        return $conn;

    }

?>
