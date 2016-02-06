function rt_nodejs_notifier(domain,port){
	var o=this;
	o.domain;		//domain nodejs
	o.port;	//port
	o.enabled_sound=true;	//enabled sound with message
	
	if(typeof domain=='string') {o.domain=domain;}
	if(typeof port=='string') o.port=port;
	
	/**
	private object
	*/
	var vcn_socket;		//socketio
	var audioElement;	//sound
	
	/**
	socketIO event listener
	*/
	function socketio_notify_messageListener(s){
		//alert(JSON.stringify(s));
			//prep data
		if(typeof s=='string') s=JSON.parse(s);
				//child page refer to multi choice quiz inside an iframe
			if(inIframe() && window && window.parent) window.parent.postMessage({type:'vcn-notifier',data:s},'*');	//if file this inside frame
			else if(typeof vcn_add_notification=='function'){		//for current site but nerver meet
				vcn_create_notifier_ui();
				var item=vcn_create_notification_item(s);
				vcn_add_notification(item);
				playSound();	//play sound
			}
	}
	function socketio_notifierParentFrameListener(s){
		if(typeof s=='string') s=JSON.parse(s);
		//function locate /tuvan/js/notification.js
		if(typeof vcn_add_notification=='function'){		//for current site
			vcn_create_notifier_ui();	//create notification bar
			var item=vcn_create_notification_item(s);
			vcn_add_notification(item);
			playSound();		//play sound
		}
	}
	/**
	private
	*/
	//play sound message
	function playSound(){
		if(o.enabled_sound==false) return;		//disabled sound
		if(!audioElement){
			audioElement = document.createElement('audio');
			audioElement.setAttribute("preload", "auto");
			 audioElement.autobuffer = true;
			 var source1 = document.createElement('source');
			 source1.type= 'audio/mpeg';
			 source1.src= o.sound_url? o.sound_url:rt_nodejs_notifier.uri+'/message.mp3';
			 audioElement.appendChild(source1);
		 }
		 //audioElement.pause();
		//audioElement.currentTime = 0;
		 audioElement.play();
	}
	function inIframe () {
		try {
			return window.self !== window.top;
		} catch (e) {
			return true;
		}
	}
	//add dynamic js file
	function vcn_addJs(src,cb){
		var s=document.createElement('script');
		s.src=src;
		s.type='text/javascript';
		if(typeof cb=='function') s.onload=cb;
		document.getElementsByTagName('head')[0].appendChild(s);;
	}
	/**
	@public
	*/
	//init
	o.init=function(cb){
		
		if(!o.domain || !o.port) return;
		//check socketio lib
		var scripts=document.getElementsByTagName('script'), exists=false;
		for(var i=0;i<scripts.length;i++){
			if(scripts[i].src){
				if(scripts[i].src==o.domain.replace(/\/$/, '')+'/socket.io/socket.io.js') exists=true;
			}
		}
		//connect to socketio
		if(!exists){
			$.getScript( o.domain.replace(/\/$/, '')+'/socket.io/socket.io.js', 
			function(script, textStatus){
				vcn_socket=io.connect(o.domain+':'+o.port);
				//listen message from sender who emit to all
				vcn_socket.on('_new_customer_record_notify',socketio_notify_messageListener);
				if(typeof cb=='function') cb(o);
			});
			
		}else{
			vcn_socket=io.connect(o.domain+':'+o.port);
			//listen message from sender who emit to all
			vcn_socket.on('_new_customer_record_notify',socketio_notify_messageListener);
			if(typeof cb=='function') cb(o);
		}
		return o;
	}
	//announce to all client be viewing this site
	o.announce_new_customer_record=function(data){
		if(vcn_socket) vcn_socket.emit('new_customer_record_notify',data);
		return o;
	}
	//test notification
	o.test_randome_new_register=function(){
		var data=[
			{fullname:'Quách văn hoàng',salary:'3.000.000',loan:'10.000.000'},
			{fullname:'Nguyễn thị vân anh',salary:'2.500.000',loan:'11.000.000'},
			{fullname:'Bui thi kim thi',salary:'4000.000',loan:'12.000.000'}
			];
			
		//announce to all
		o.announce_new_customer_record(data[Math.floor(Math.random() * data.length)]);
	}
	//setup notifier for parent frame listen from child frame
	o.init_from_parent=function(){
		if(!o.domain || !o.port) return;
		jQuery(function($){
			/*post message listener from child*/
			var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
			var eventer = window[eventMethod];
			var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
			eventer(messageEvent, function (e) {
				if(vcn_socket) return;	//exists vcn socket listener to show message
			   //alert('child:'+e.data);
			   //e.source.postMessage('inside frame', e.origin);
			   if(e.data && e.data.type=='vcn-notifier') {
					vcn_create_notifier_ui();	//create notification bar
					var noti=vcn_create_notification_item(e.data.data);
					vcn_add_notification(noti);
					playSound();
			   }
			}); 
			/*socket.io->to listen socket message from sender who emit to all (refer: parent site)*/
			$.getScript( o.domain.replace(/\/$/, '')+'/socket.io/socket.io.js' ,function(script, textStatus){
				if(!vcn_socket) {
					vcn_socket=io.connect(o.domain+':'+o.port);
					//listen message from server
					vcn_socket.on('_new_customer_record_notify',socketio_notifierParentFrameListener);
				}
			});
		});
		return o;
	}
};
(function(){
	/*load external js*/
	//get parameters
	var myTag=document.getElementsByTagName("script");
	var src= myTag[myTag.length-1].src;
	var uri=src.substring(0,src.split('?')[0].lastIndexOf('/'));
	rt_nodejs_notifier.uri=uri;
	//alert(dir);
	$.getScript(uri+'/notification-utilities.js');
	//load css
	$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', uri+'/notification.css') );
})();	