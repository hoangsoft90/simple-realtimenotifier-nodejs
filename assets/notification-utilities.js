//show nofitifier
function vcn_add_notification(ele){
	$('#vcn_notification_bar').prepend(ele.fadeIn()/*.delay(5000).fadeOut()*/);
	setTimeout(function(){ele.fadeOut();},5000);
}
//create notifier from parent site
function vcn_create_notifier_ui(){
	if(!$('#vcn_notification_bar').length){
		$('<div class="vcn_notifier"><div id="vcn_notification_bar"/></div>').appendTo($(document).find('body'));
	}
}
//create notification item
function vcn_create_notification_item(data){
	var t=$('<div/>').addClass('notification').css({'display':''});
	var c=$('<div style="padding:10px"/>');
	t.append(c);
	c.append($('<h3/>').html(data.fullname));	//fullname
	c.append($('<div class="noti-salary"/>').html('<i>Luong:</i> '+data.salary));
	c.append($('<div class="noti-loan"/>').html('<i>Vay:</i> '+data.loan));
	return t;
}