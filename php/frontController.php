<?php
// Bootstrap the HECK out of the backend
// Filter incoming queries and call the correct script

// 2 queries - TYPE (req) and DATE (opt)
// TYPE = manifest or photolist
// DATE = dd/mm/yyyy

$type = $_REQUEST["type"];
$date = $_REQUEST["date"];

if ($type == "manifest"){  
  getManifest();  
} else if ($type == "photolist"){  
  getPhotoList();  
} else {
  echo "PHP error in frontController";
}

function getManifest() {
  include "../../../private/curiosityhome/php/scripts/getManifest.php";  
}

function getPhotoList() {
  $output = include "../../private/phptests/getPhotolist.php";
  echo "Output = " . $output;
}
?>