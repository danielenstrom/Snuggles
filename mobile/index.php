<!DOCTYPE html>
<html>
<head>
  <title>Game Controller</title>

	<script src="http://cdn.socket.io/stable/socket.io.js"></script>
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
	
	<link href="./css/reset.css?<?= time(); ?>" rel="stylesheet" type="text/css" />
	<link href="./css/style.css?<?= time(); ?>" rel="stylesheet" type="text/css" />
	
	<meta name="viewport" content="width=device-width, height=device-height, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<link rel="apple-touch-icon" href="./img/apple-icon.png" />
	
</head>
<body>
<div id="container">
	<div class="controller">
		<div class="awesome green" id="up">UP</div>
		<div class="awesome green">LEFT</div>
		<div class="awesome green">RIGHT</div>
	</div>
	<div class="status" id="status">Setting up...</div>
</div>
	
<script type="text/javascript" src="./js/application.js"></script

</body>
</html>