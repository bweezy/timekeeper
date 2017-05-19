//bruh
var currentSession = 0;
initialize();

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

function Session(startTime){
	this.startTime = startTime;
	this.endTime = 0;
};

function UrlObject(url, category, time){
	this.url = url;
	this.category = category || "default";
	this.time = time || "0";
};

function initialize(){
	currentSession = new Session(Date.now());
	console.log('initialize');
};

function update(url){

	var epochTime = Date.now();
	currentSession.endTime = epochTime;
	var prevSession = currentSession;
	currentSession = new Session(epochTime);
	elapsed = ((prevSession.endTime - prevSession.startTime)/1000);

	if(elapsed > .1){
		console.log(elapsed);
		console.log(url);
	};
};


function report(){

	chrome.tabs.query({'active' : true, 'lastFocusedWindow': true}, function(tabs){
		console.log(tabs[0].url);
	})
};

