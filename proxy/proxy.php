<?php

//$proxy = 'localhost';
//$proxyauth = 'user:password';

// File with the list of allowed hosts
$URL_PROXY = 'urls.proxy';

$allowed_urls = file($URL_PROXY);
foreach($allowed_urls as $k => $d){
   if (strpos($d, '#', 0) === 0) {
      continue;
   }
   $d = str_replace(",","",$d);
   $d = str_replace("\n","",$d);
   $d = str_replace("\r","",$d);
   $allowed_urls[$k] = str_replace("'","",$d);
}

$url = $_REQUEST['url'];
$p_url = parse_url($url);

if (!in_array($p_url['host'], $allowed_urls)){
   echo "Host not allowed by XVM proxy.\n";
   return;
};

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL,$url);
//curl_setopt($ch, CURLOPT_PROXY, $proxy);
//curl_setopt($ch, CURLOPT_PROXYUSERPWD, $proxyauth);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
//curl_setopt($ch, CURLOPT_HEADER, 1);
$curl_scraped_page = curl_exec($ch);
curl_close($ch);

echo $curl_scraped_page;

?>