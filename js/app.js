
amroManager = {};
amroManager.consts = {};
amroManager.consts.SON_PREFIX = "amro_son";
amroManager.utils = amroUtils;
amroManager.tplawesome = function(e,t){res=e;for(var n=0;n<t.length;n++){res=res.replace(/\{\{(.*?)\}\}/g,function(e,r){return t[n][r]})}return res}

amroManager.bringVideosOn = function(){
	var terms = amroManager.getQuery();
	var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            q: encodeURIComponent(terms).replace(/%20/g, "+"),
            maxResults: 3,
            order: "viewCount",
            publishedAfter: "2000-01-01T00:00:00Z"
       }); 
       // execute the request
       request.execute(function(response) {
       	var sendMessage = false;
          var results = response.result;
		  var thumbWrapper = $(".amroSetOFThumbNailsWrapper");
          thumbWrapper.html("");
          
          $.each(results.items, function(index, item) {
          	sendMessage = true;
            $.get("templates/thumbnail.html", function(data) {
                thumbWrapper.append(amroManager.tplawesome(data, [{"title":item.snippet.title, "videoid":item.id.videoId , "thumbnailimage":item.snippet.thumbnails.high.url}]));
            });
          });
          if(sendMessage){
          	amroManager.enlargeIframe();
          	
          }
       });
};

amroManager.sendMessage = function(message){
	parent.postMessage(amroManager.consts.SON_PREFIX + message, "*");
};

amroManager.enlargeIframe = function(){
	amroManager.sendMessage("amroManager.enlargeIframe()");
};


amroManager.runVideo = function(videoid){
	amroManager.sendMessage("amroManager.runVideo('"+videoid +"')");
};


amroManager.prepareMessageReciever = function(){
	amroManager.utils.addMessageReciever(function(e){

		console.log("got a message " , e);
	});
};

amroManager.loadParams = function(){
	amroManager.params = amroManager.utils.urlParamsJson;

};


amroManager.getQuery = function(){
	return amroManager.params["q"];
};


amroUtils.init = function(){
	amroManager.loadParams();
	amroManager.prepareMessageReciever();
	gapi.client.load("youtube", "v3", function() {
        amroManager.bringVideosOn();
    });

    
};


function init() {
    gapi.client.setApiKey("AIzaSyB32DsDzGeF_FE1O5AXQgpAVaJ71tgD-dk");
    amroUtils.init();
    
}





