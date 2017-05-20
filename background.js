//Starts a new session, assuming that the extension is being loaded
//in the extension tab.
currentSession = new Session(Date.now(), "extensions");
console.log('initialize');
var urlDict = {};

//When the extension button is clicked, displays time elapsed for all sessions.
chrome.browserAction.onClicked.addListener(report);

//When the activated tab is changed, update with the url of the newly activated tab
chrome.tabs.onActivated.addListener(function(activeInfo){
	chrome.tabs.get(activeInfo.tabId, function(t){
		//Exiting out of a window would trigger this listener
		//But get would return undefined and throw an error
		//Chrome sees if you check said error and doesn't pollute console with it
		if (!chrome.runtime.lastError && typeof t !== 'undefined'){
			urlParser(t.url, update);
		}
	});
}); 

//Updates session when the URL of the tab is updated
chrome.tabs.onUpdated.addListener(function(tabId, info, tab){
	if(typeof info.url !== 'undefined'){
		urlParser(info.url, update);
	}
})

//When the window is changed, update with the url of the active tab in the new window
chrome.windows.onFocusChanged.addListener(function(windowId){
	chrome.tabs.query({"active" : true, "currentWindow" : true}, function(t){
		if(t[0] !== undefined){
			urlParser(t[0].url,update);
		};
	});
});

//Object encapsulating a session in one tab
function Session(startTime, url){
	this.url = url;
	this.startTime = startTime;
	this.endTime = 0;
};

function urlParser(url, callback){
	var parser = document.createElement('a');
	parser.href = url;
	callback(parser.hostname);
}

//The update function called when a listener is triggered
function update(url){

	//Grab the current time, log that the last session ended at this time
	var epochTime = Date.now();
	currentSession.endTime = epochTime;

	//Calculate the total time of the last session
	elapsed = Math.floor((currentSession.endTime - currentSession.startTime)/1000);

	//Log at a 1s granularity, if session was <1 second then don't count it
	if(url !== currentSession.url){
		if(elapsed > 1){

			//If there is already an entry for this URL, then increment it
			//otherwise create a new entry
			if(currentSession.url in urlDict)
			{
				urlDict[currentSession.url] += elapsed;
			}else {
				urlDict[currentSession.url] = elapsed;
			}

			//log for debugging purposes
			console.log("url : " + currentSession.url + " elapsed: " + urlDict[currentSession.url]);

			//Start a new session
			currentSession = new Session(epochTime, url);
		}else{
			currentSession.url = url;
		}
	}
};

//Reports stats on button click
//will need to change when integrated with UI
function report(){

	console.log("Summary of Current Session: ")
	for(var url in urlDict){
		console.log("\tURL: " + url + "\tElapsed Time: " + urlDict[url] + "s");
	}
};

