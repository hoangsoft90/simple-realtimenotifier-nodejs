(function(){
  //get argument
	var myTag=document.getElementsByTagName("script");
	var src= myTag[myTag.length-1].src;
	var query=src.split("?")[1];
	var params=QueryStringToJSON(query);
	//alert(query);
  
  //http://hn.tindung24h.com/embedquiz/
	var open=1;
	
	//valid
	if(!params['frameid']) return;
	
	jQuery(function($){
		//frame load event
		$('#'+params['frameid']).bind('load',function(){
			setInterval(function(){
				if(open){
					document.getElementById(params['frameid']).contentWindow.postMessage('connect to child','*');
					open=0;		//locked
				}
			},500);
		});
		/*listen message from child*/
		var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
		var eventer = window[eventMethod];
		var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

		// Listen to message from child IFrame window
		eventer(messageEvent, function (e) {
			   //alert('parent:'+e.data);
			   if(e.data && e.data.service=='adjust-frame-height') $('#'+params['frameid']).css({height:e.data.height});
			   //unlock
			   open=1;
		}, false); 
	});
		
	//querystring to json
	function QueryStringToJSON(query) {            
		var pairs = query.split('&');
		
		var result = {};
		pairs.forEach(function(pair) {
			pair = pair.split('=');
			result[pair[0]] = decodeURIComponent(pair[1] || '');
		});

		return JSON.parse(JSON.stringify(result));
	}
	
}());
	