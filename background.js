

//Starts a new session, assuming that the extension is being loaded
//in the extension tab.
currentSession = new Session(Date.now(), "chrome://extensions/");
console.log('initialize');
var urlDict = {};

//When the extension button is clicked, displays time elapsed for all sessions.
chrome.browserAction.onClicked.addListener(report);

//When the activated tab is changed, update with the url of the newly activated tab
chrome.tabs.onActivated.addListener(function(activeInfo){
	chrome.tabs.get(activeInfo.tabId, function(t){
		update(t.url);
	});
}); 

//When the window is changed, update with the url of the active tab in the new window
chrome.windows.onFocusChanged.addListener(function(windowId){
	chrome.tabs.query({"active" : true, "currentWindow" : true}, function(t){
		if(t[0] !== undefined){
			update(t[0].url);
		};
	});
});

//Object encapsulating a session in one tab
function Session(startTime, url){
	this.url = url;
	this.startTime = startTime;
	this.endTime = 0;
};

//The update function called when a listener is triggered
function update(url){

	//Grab the current time, log that the last session ended at this time
	var epochTime = Date.now();
	currentSession.endTime = epochTime;

	//Calculate the total time of the last session
	elapsed = Math.floor((currentSession.endTime - currentSession.startTime)/1000);

	//Log at a 1s granularity, if session was <1 second then don't count it
	//This needs to be fixed a little, can make the wrong URL be logged
	if(elapsed > 1 && url !== currentSession.url){

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
	};
};

//Reports stats on button click
//will need to change when integrated with UI
function report(){

	console.log("Summary of Current Session: ")
	for(var url in urlDict){
		console.log("\tURL: " + url + "\tElapsed Time: " + urlDict[url] + "s");
	}
};

