//place file to iframe
jQuery(function($){
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
    // Listen to message from parent IFrame window
    eventer(messageEvent, function (e) {
           //alert('child:'+e.data);
           //e.source.postMessage('inside frame', e.origin);
           /*adjust iframe size as content changes*/
        if(e.data){
        //jQuery(function($){
          var lastHeight = 0, curHeight = 0;//$('iframe:eq(0)');
          
            curHeight=$(document).find('body').height()+0;	//every element like h1,h2..should be padding,margin to 0px
            if ( curHeight != lastHeight ) {	
                e.source.postMessage({service:'adjust-frame-height',height:(lastHeight = curHeight)+'px'}, e.origin);
            }
        //});
		}
           //just test
           if (e.origin == 'http://iframe.example.com') {
                alert(e.data); 
            }
    }, false);
});