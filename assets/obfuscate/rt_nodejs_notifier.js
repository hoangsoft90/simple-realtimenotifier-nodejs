function rt_nodejs_notifier(d,b){var a=this;a.domain;a.port;a.enabled_sound=true;if(typeof d=="string"){a.domain=d}if(typeof b=="string"){a.port=b}var j;var i;function g(k){if(typeof k=="string"){k=JSON.parse(k)}if(c()&&window&&window.parent){window.parent.postMessage({type:"vcn-notifier",data:k},"*")}else{if(typeof vcn_add_notification=="function"){vcn_create_notifier_ui();var l=vcn_create_notification_item(k);vcn_add_notification(l);f()}}}function h(k){if(typeof k=="string"){k=JSON.parse(k)}if(typeof vcn_add_notification=="function"){vcn_create_notifier_ui();var l=vcn_create_notification_item(k);vcn_add_notification(l);f()}}function f(){if(a.enabled_sound==false){return}if(!i){i=document.createElement("audio");i.setAttribute("preload","auto");i.autobuffer=true;var k=document.createElement("source");k.type="audio/mpeg";k.src=a.sound_url?a.sound_url:rt_nodejs_notifier.uri+"/message.mp3";i.appendChild(k)}i.play()}function c(){try{return window.self!==window.top}catch(k){return true}}function e(m,k){var l=document.createElement("script");l.src=m;l.type="text/javascript";if(typeof k=="function"){l.onload=k}document.getElementsByTagName("head")[0].appendChild(l)}a.init=function(l){if(!a.domain||!a.port){return}var k=document.getElementsByTagName("script"),n=false;for(var m=0;m<k.length;m++){if(k[m].src){if(k[m].src==a.domain.replace(/\/$/,"")+"/socket.io/socket.io.js"){n=true}}}if(!n){$.getScript(a.domain.replace(/\/$/,"")+"/socket.io/socket.io.js",function(o,p){j=io.connect(a.domain+":"+a.port);j.on("_new_customer_record_notify",g);if(typeof l=="function"){l(a)}})}else{j=io.connect(a.domain+":"+a.port);j.on("_new_customer_record_notify",g);if(typeof l=="function"){l(a)}}return a};a.announce_new_customer_record=function(k){if(j){j.emit("new_customer_record_notify",k)}return a};a.test_randome_new_register=function(){var k=[{fullname:"Quách văn hoàng",salary:"3.000.000",loan:"10.000.000"},{fullname:"Nguyễn thị vân anh",salary:"2.500.000",loan:"11.000.000"},{fullname:"Bui thi kim thi",salary:"4000.000",loan:"12.000.000"}];a.announce_new_customer_record(k[Math.floor(Math.random()*k.length)])};a.init_from_parent=function(){if(!a.domain||!a.port){return}jQuery(function(m){var n=window.addEventListener?"addEventListener":"attachEvent";var l=window[n];var k=n=="attachEvent"?"onmessage":"message";l(k,function(p){if(j){return}if(p.data&&p.data.type=="vcn-notifier"){vcn_create_notifier_ui();var o=vcn_create_notification_item(p.data.data);vcn_add_notification(o);f()}});m.getScript(a.domain.replace(/\/$/,"")+"/socket.io/socket.io.js",function(o,p){if(!j){j=io.connect(a.domain+":"+a.port);j.on("_new_customer_record_notify",h)}})});return a}}(function(){var a=document.getElementsByTagName("script");var c=a[a.length-1].src;var b=c.substring(0,c.split("?")[0].lastIndexOf("/"));rt_nodejs_notifier.uri=b;$.getScript(b+"/notification-utilities.js");$("head").append($('<link rel="stylesheet" type="text/css" />').attr("href",b+"/notification.css"))})();