
amroManager = {};
amroManager.consts = {};
amroManager.consts.COMMON_HOST = "http://chrome.dealply.com/amit/";
amroManager.consts.UTILS_SCRIPT_URL = amroManager.consts.COMMON_HOST + "js/utils.js";
amroManager.consts.IFRAME_SRC_URL = amroManager.consts.COMMON_HOST + "test.html";
amroManager.consts.VIDEO_COMMON_URL = amroManager.consts.COMMON_HOST +  "video.html?#video=";
amroManager.consts.SON_PREFIX = "amro_son";
amroManager.consts.IFRAME_ID_NAME = "bla_bla_id";
amroManager.consts.IFRAME_CLASS_NAME = "bla_bla_class";
amroManager.consts.VIDEO_IFRAME_ID_NAME_PREFIX = "bla_bla_video_id";
amroManager.consts.VIDEO_IFRAME_CLASS_NAME = "bla_bla_video_class";
amroManager.consts.VIDEO_IFRAME_STYLE = "position: fixed; top: 0; left: 0;  right: 0; bottom: 0; width: 100%;  background-color: transparent; opacity:0.988; height:100%; z-index:9999999999999999999;";



amroManager.amroReadyHandlers = [];
amroManager.ready = function(handler) {
  amroManager.amroReadyHandlers.push(handler);
  amroManager.handleState();
};

amroManager.handleState = function() {
  if (['interactive', 'complete'].indexOf(document.readyState) > -1) {
    while(amroManager.amroReadyHandlers.length > 0) {
      (amroManager.amroReadyHandlers.shift())();
    }
  }
};

amroManager.removeFrame = function(frameId){
	var frame = document.getElementById(frameId);
	if(frame !== null){
		frame.remove();
	}
};

document.onreadystatechange = amroManager.handleState;


amroManager.injectScript = function( _document , url  , callback){
	var sc = _document.createElement('script');
	sc.type = 'text/javascript';
	sc.async = true;
	sc.src = url;
	if(typeof callback !== "undefined"){
		sc.onload = callback;
	}

	var s = _document.getElementsByTagName('script')[0];

	s.parentNode.insertBefore(sc, s);
};


amroManager.prepareIframe = function(url , _document , className , idName , cssStyle ,callback){
	if(typeof cssStyle === "undefine"){
		cssStyle = "position: relative;  z-index: 99999999;  display:none; overflow:hidden; ";
	}
	var iframe  = document.createElement("iframe");
	iframe.setAttribute("id" , idName);
	iframe.setAttribute("class" , className);
	iframe.setAttribute("src" , url);
	iframe.setAttribute("style",cssStyle);
	iframe.setAttribute("width",0);
	iframe.setAttribute("height",0);
	iframe.setAttribute("frameborder", "0");
	iframe.setAttribute("allowfullscreen", "1");
	iframe.setAttribute("border", "no");
	iframe.setAttribute("scrolling", "no");
	
	if(typeof callback !== "undefined"){
		iframe.onload = callback;
	}

	return iframe;
};

amroManager.enlargeIframe = function(){
	var iframe = amroManager.iframe

	iframe.style.display = "block";
	iframe.setAttribute("width",500);
	iframe.setAttribute("height",150);


};

amroManager.getElement = function(elementStrArr){
	
	var elem = null;
	if(typeof elementStrArr === "string"){
		elementStrArr = [elementStrArr];
	}
	for(var index in elementStrArr){
		elem = document.querySelector(elementStrArr[index]);
		if(elem!== null){
			break;
		}
	}

	return elem;
};


amroManager.after = function(elementStr , newElem){
	var elem = amroManager.getElement(elementStr);
	if(elem !== null){
		elem.parentNode.appendChild(newElem);
	}

};

amroManager.before = function(elementStr , newElem){
	var elem = amroManager.getElement(elementStr);
	if(elem !== null){
		var parent = elem.parentNode;
		elem.parentNode.insertBefore(newElem , elem);
	}

};



amroManager.append = function(elementStr , newElem){
	var elem = amroManager.getElement(elementStr);
	if(elem !== null){
		elem.appendChild(newElem );
	}
};

amroManager.prepend = function(elementStr , newElem){
	var elem = amroManager.getElement(elementStr);
	if(elem !== null){
		var theFirstChild = elem.firstChild;
		elem.insertBefore(newElem, theFirstChild);
	}
};

amroManager.isMessageFromMySon = function(e){
	if(typeof e.data === "string"  && e.data.indexOf(amroManager.consts.SON_PREFIX) === 0 ){
		return true;
	}
};

amroManager.getMessage = function(e){
	return e.data.replace(new RegExp(amroManager.consts.SON_PREFIX , "g") , "");

};

amroManager.getProductString = function(){
	var elem = document.querySelector("h1");
	if(elem !== null){
		return elem.textContent.trim()
	}else{
		return  null;
	}
	
};

amroManager.runVideo = function(videoid){

	var style = "position: fixed; top: 0; left: 0;  right: 0; bottom: 0; width: 100%;  background-color: transparent; opacity:0.988; height:100%; z-index:9999999999999999999;";
	
	var iframeId = amroManager.consts.VIDEO_IFRAME_ID_NAME_PREFIX +"_" + Math.random();
	var videoUrl = amroManager.consts.VIDEO_COMMON_URL + videoid + "&frameId=" + iframeId;
	var videoIframe = amroManager.prepareIframe(
		videoUrl ,
		document , 
		amroManager.consts.VIDEO_IFRAME_CLASS_NAME ,
		iframeId ,
		amroManager.consts.VIDEO_IFRAME_STYLE  ,
		function(){
			//do nothing;
		});
	document.body.appendChild(videoIframe);
};

amroManager.init = function(){

	amroManager.injectScript(document ,  amroManager.consts.UTILS_SCRIPT_URL , function(){
		console.log("utils loaded");
		amroManager.utils = amroUtils;
		amroManager.utils.addMessageReciever(function(e){
			if(amroManager.isMessageFromMySon(e)){
				console.log("father got message : " , e );
				eval(amroManager.getMessage(e));
			}

		});
		var className = amroManager.consts.IFRAME_CLASS_NAME ;
		var idName = amroManager.consts.IFRAME_ID_NAME;
		var url = amroManager.consts.IFRAME_SRC_URL + "?#q=" + encodeURIComponent(amroManager.getProductString()) 
		+ "&class=" + encodeURIComponent(className) + "&id=" + encodeURIComponent(idName);
		
		var iframe = amroManager.prepareIframe( url,
		 document , className, idName );

		//just for debug 
		var elemToAppendFor = document.querySelector("#gallery_dflt");

		amroManager.append([".container" , "#gallery_dflt"] ,iframe );
		//end
		//document.body.appendChild(iframe);
		amroManager.iframe = iframe;
	});
};


amroManager.ready(function(){
    amroManager.init();
    
});