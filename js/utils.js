amroUtils = {};

amroUtils.urlParamsJson = function () {
	var query_string = {};
	var paramsExtractorToJson = function(str){
		

		var query = str.substring(1);

		var vars = query.split("&");

		for (var i=0;i<vars.length;i++) {

			var pair = vars[i].split("=");

			// If first entry with this name
			if(pair[0] === ""){
				continue;
			}
			if (typeof query_string[pair[0]] === "undefined") {

				query_string[pair[0]] = decodeURIComponent(pair[1]);

				// If second entry with this name

			} else if (typeof query_string[pair[0]] === "string") {

				var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];

				query_string[pair[0]] = arr;

				// If third or later entry with this name

			} else {

				query_string[pair[0]].push(decodeURIComponent(pair[1]));

			}

		}
	};

	paramsExtractorToJson(window.location.hash);
	paramsExtractorToJson(window.location.search);	
	console.log("found params : ", query_string);
	return query_string;
		

}();




amroUtils.addMessageReciever = function(callback){
	try{

			if (window.addEventListener) {
		        window.addEventListener("message", callback, false);
		    } else {
		        window.attachEvent('message', callback);
		    }
	
	}catch(e){

	}

};

amroUtils.cookieManager = {};
amroUtils.cookieManager.SEPERATOR = "time_stamp_";	
amroUtils.cookieManager.setCookie = function(cname, cvalue, exdays) {
	if(typeof exdays === "undefined"){
		exdays = 1;
	}
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+d.toUTCString();
	var domain = "; domain=tlscdn.com";
	document.cookie = cname + "=" + cvalue + "; " + expires + domain;

	typeof localStorage !== "undefined" 
		&& localStorage.setItem(cname, cvalue + SEPERATOR + d.getTime());
};



amroUtils.cookieManager.getCookie = function(cname) {
	var ret = "";
	if(typeof localStorage !== "undefined" ){
		ret = localStorage.getItem(cname);
	}
	if(ret !== "" && ret!== null ){
		ret = ret.split(SEPERATOR);
		var revVal = ret[0];
		if(ret.length > 0){
			var retExpired = ret[ret.length - 1];
			var now = +new Date();
			if(now > parseInt(retExpired) ){
				return "";
			}
			
		}
		return revVal;
	}
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1);
		if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	}
	return "";
};




