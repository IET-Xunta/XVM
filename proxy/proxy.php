<?php

//$proxy = 'localhost';
//$proxyauth = 'user:password';

/* 
 * Set DEBUG=0 to production mode
 * Set DEBUG=1 to debug mode
 * Set DEBUG=2 to debug mode with dump responses to the log file
 */
$DEBUG=0;
require_once dirname(__FILE__).'/log4php/Logger.php';
Logger::configure(dirname(__FILE__).'/log4php_config.xml');
// Default LOG_FILE is "/tmp/xvm_proxy.log". Changes on the log4php_config.xml.

class FileLog4PHP
{
    /** Holds the Logger. */
    private $log;
 
    /** Logger is instantiated in the constructor. */
    public function __construct()
    {
        // The __CLASS__ constant holds the class name, in our case "Foo".
        // Therefore this creates a logger named "Foo" (which we configured in the config file)
        $this->log = Logger::getLogger(__CLASS__);
    }
 
    /** Logger can be used from any member method. */
    public function go()
    {
        $this->log->info("We have liftoff.");
    }
	
	public function msg($msg)
    {
        $this->log->info($msg);
    }
}

$logger = new FileLog4PHP();
$logger->msg("Init proxy request");

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
$url = str_replace(" ","",$url);

if ($DEBUG){
	//$fh = fopen($LOG_FILE, 'a') or die("can't open file");
	//fwrite($fh, $url."\n\n");
	$logger->msg($url);
}

//To do WMS getMAP request we need to pass all parameters  
foreach ($_REQUEST as $key => $value) {
	if($key == "url"){
		continue;
	}
	$msg=$key.'='.$value;
	if ($DEBUG){
		//fwrite($fh, $msg."\n");
		$logger->msg($msg);
	}
	$url .= "&".$msg;
	
}

if ($DEBUG){
	//fwrite($fh, $url);
	$logger->msg($url);
	//fclose($fh);
}

$p_url = parse_url($url);


if (!in_array($p_url['host'], $allowed_urls)){
   echo "Host not allowed by XVM proxy.\n";
   $logger->msg("Host not allowed by XVM proxy.");
   return;
};

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL,$url);
//curl_setopt($ch, CURLOPT_PROXY, $proxy);
//curl_setopt($ch, CURLOPT_PROXYUSERPWD, $proxyauth);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

//When using WFS request it is needed
$request_body = file_get_contents('php://input');
if ($request_body){
	curl_setopt($ch, CURLOPT_POSTFIELDS, $request_body);
}

//curl_setopt($ch, CURLOPT_HEADER, 1);
$curl_scraped_page = curl_exec($ch);
curl_close($ch);

if ($DEBUG==2) {
	$logger->msg($curl_scraped_page);
}

echo $curl_scraped_page;

?>
