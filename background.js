//data structure initialization
//new Date();

var currentSession = 0;
initialize();

var filtWindows = ['normal'];

chrome.browserAction.onClicked.addListener(report);

chrome.tabs.onActivated.addListener(update);

chrome.windows.onFocusChanged.addListener(update);

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
	console.log('initialize');
};




function update(activeInfo){
	var epochTime = Date.now();
	currentSession.endTime = epochTime;
	var prevSession = currentSession;
	currentSession = new session(epochTime);
	console.log((prevSession.endTime - prevSession.startTime)/1000);
};


function report(){

	chrome.tabs.query({'active' : true, 'lastFocusedWindow': true}, function(tabs){
		console.log(tabs[0].url);
	})
};

