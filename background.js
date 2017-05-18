//data structure initialization
//new Date();

var currentSession = 0;
initialize();

chrome.browserAction.onClicked.addListener(function(tab){
	report()
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
	update(activeInfo)
});

chrome.windows.onFocusChanged.addListener(function(windowId) {
	console.log(windowId);
});

function session(startTime){
	this.startTime = startTime;
	this.endTime = 0;
};

function UrlObject(url, category, time){
	this.url = url;
	this.category = category || "default";
	this.time = time || "0";
};

function initialize(){
	currentSession = new session(Date.now());
	alert('initialize');
};


function update(activeInfo){
	var epochTime = Date.now();
	currentSession.endTime = epochTime;
	var prevSession = currentSession;
	currentSession = new session(epochTime);
	alert((prevSession.endTime - prevSession.startTime)/1000);
};


function report(){

	chrome.tabs.query({'active' : true, 'lastFocusedWindow': true}, function(tabs){
		alert(tabs[0].url);
	})
};
