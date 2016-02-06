<html>
<head>
	<title>Realtime notification popup with nodejs (action)</title>
	<meta charset="utf-8"/>
	<script src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
	<script src="assets/js/rt_nodejs_notifier.js"></script>
	<script src="assets/js/inside-frame-embed.js"></script>
</head>
<body>
<?php 
if(isset($_POST['submit'])){
	var_dump($_POST);
	?>
	<script>
	(new rt_nodejs_notifier('http://mighty-retreat-4105.herokuapp.com','80')).init(function(p){
		p.announce_new_customer_record('<?php echo json_encode($_POST)?>');	//emit message to all
	});
	
	</script>
	<?php
}
?>
</body>
</html>