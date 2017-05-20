//bruh
currentSession = new Session(Date.now(), "chrome://extensions/");
console.log('initialize');
var urlDict = {};

chrome.browserAction.onClicked.addListener(report);

chrome.tabs.onActivated.addListener(function(activeInfo){
	chrome.tabs.get(activeInfo.tabId, function(t){
		update(t.url);
	});
}); // returns activeInfo of tab that has become active
	// activeInfo.tabId and activeInfo.windowId

chrome.windows.onFocusChanged.addListener(function(windowId){
	chrome.tabs.query({"active" : true, "currentWindow" : true}, function(t){
		if(t[0] !== undefined){
			update(t[0].url);
		};
	});
}); // returns windowId of newly focused window

function Session(startTime, url){
	this.url = url;
	this.startTime = startTime;
	this.endTime = 0;
};

function update(url){

	var epochTime = Date.now();
	currentSession.endTime = epochTime;
	elapsed = Math.floor((currentSession.endTime - currentSession.startTime)/1000);

	if(elapsed > 1 && url !== currentSession.url){
		if(currentSession.url in urlDict)
		{
			urlDict[currentSession.url] += elapsed;
		}else {
			urlDict[currentSession.url] = elapsed;
		}
		console.log("url : " + currentSession.url + " elapsed: " + urlDict[currentSession.url]);
		currentSession = new Session(epochTime, url);
	};
};


function report(){

	console.log("Summary of Current Session: ")
	for(var url in urlDict){
		console.log("\tURL: " + url + "\tElapsed Time: " + urlDict[url] + "s");
	}
};

