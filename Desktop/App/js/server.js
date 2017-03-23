var http = require('http');
var gui = require('nw.gui');
var fs = require('fs');
var url = require('url');
var path = require('path');
var sys = require('util');
var os = require('os');
var WebSocket = require('ws');
var win = gui.Window.get();

var wss=null;
var socketsId = 0;
var sockets = [];

var settingsFile = 'WiFi-Code-Scanner-Settings.json';
var mySettings = {};

//win.hide();
win.setShowInTaskbar(false);


// ini - code to control the window and the tray icon
var tray;

win.on('close', function () {
	this.hide();
});

win.on('minimize', function () {
	this.hide();
});

tray = new gui.Tray({ tooltip: "WiFi Code Scanner", icon: "tray-" + ((os.platform() == "darwin") ? "mac" : "win") + ".png" });

// Show window 
tray.on('click', function () {
	win.show();
	win.restore();
});

var menu = new gui.Menu();
menu.append(new gui.MenuItem(
	{
		type: 'normal',
		label: 'Show',
		click: function () {
			win.show();
			win.restore();
		}
	}));
menu.append(new gui.MenuItem(
	{
		type: 'normal',
		label: 'Exit',
		click: function () {
			gui.App.closeAllWindows();
			gui.App.quit();
			tray = null;
		}
	}));
tray.menu = menu;
// end - code to control the window and the tray icon



function hideWin() {
	win.hide()
}

function processMessage(ws, message){
	try {

		var postObj = JSON.parse(message);

		if (postObj.hasOwnProperty('key') && postObj.key == mySettings.securityKey) {

			if (postObj.func == "connect") {
				window.setTimeout(hideWin, 3000);
				sockets[ws.socketId].send("CONNECTED");
			}

			if (postObj.func == "writeCode" && postObj.code && postObj.code != "") {
				pasteCode(decodeURIComponent(escape(atob(unescape(postObj.code)))));
				sockets[ws.socketId].send("OK");
			}

		}else{
			console.log("security key did not match");
			sockets[ws.socketId].send("security key did not match");
		}

	} catch (err) {
		console.log("Could not decode posted data");
		sockets[ws.socketId].send("Could not decode posted data");
	}

}


function pasteCode(code_string) {

	if (os.platform() == "darwin") {
		pasteCodeMac(code_string);
	} else {
		pasteCodeWin(code_string);
	}

}

function pasteCodeWin(code_string) {
	var clipboard = gui.Clipboard.get();
	clipboard.set(code_string, 'text');

	var exec = require('child_process').exec;
	exec("start paste.vbs");
}

function pasteCodeMac(code_string) {

	var clipboard = gui.Clipboard.get();
	clipboard.set(code_string, 'text');

	//script to write char by char (problem with accents, must turn accent char into two strokes and accents into one stroke and a space)
	//var script = 'set texttowrite to "'+ code_string.replace(/"/g, '\\\\"').replace(/\\/g, '\\\\') +'"\ntell application "System Events"\nrepeat with i from 1 to count characters of texttowrite\nkeystroke (character i of texttowrite)\ndelay 0.005\nend repeat\nend tell';				

	//script using clipboard and paste
	var script = 'tell application "System Events"\nkeystroke "v" using {command down}\nend tell';

	var applescript = require('applescript');
	applescript.execString(script, function (err, rtn) {
		if (err) {
			console.log(err);
		}
	});

}

function createQrCode() {

	var ifaces = os.networkInterfaces();
	var qr = require('node-qr-image');

	Object.keys(ifaces).forEach(function (ifname) {

		ifaces[ifname].forEach(function (iface) {

			if (iface.family !== 'IPv4' || iface.internal !== false) {
				// skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
				return;
			}

			var svg_string = qr.imageSync('{"key": "' + mySettings.securityKey + '", "address": "' + iface.address + ":" + portaServidor + '"}', { type: 'svg' });
			$("#qrCode").html(svg_string);

		});

	});

}

function saveSettings(settings, callback) {

	var filePath = path.join(gui.App.dataPath, settingsFile);
	fs.writeFile(filePath, settings, function (err) {
		if (err) {
			console.info("There was an error attempting to save the settings.");
			console.warn(err.message);
			return;
		} else if (callback) {
			callback();
		}
	});
}

function loadSettings(callback) {

	var filePath = path.join(gui.App.dataPath, settingsFile);
	fs.readFile(filePath, "utf8", function (err, data) {
		if (err) {
			mySettings = {
				"securityKey": Math.floor((Math.random() * 9999999) + 1)
			};

			saveSettings(JSON.stringify(mySettings));

			callback();
		} else if (callback) {
			mySettings = JSON.parse(data);
			callback();
		}
	});
}




function handleRequest(request, response) {
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

	response.writeHead(501);
	response.end("Not Implemented!");
};



var server = http.createServer(handleRequest);

console.log('trying to Open: ' + portaServidor);
server
	.listen(portaServidor, function () {
		console.log('HTTP listening: ' + portaServidor);
		
			loadSettings(createQrCode);

		wss = new WebSocket.Server({ server });

		wss.on('connection', function connection(ws) {

			ws.socketId = socketsId++; 
			sockets.push(ws);

			ws.on('message', function incoming(message) {
				processMessage(ws, message);
			});

			ws.on('close', function close() {
				if (wss.clients.size <= 0){
					$("#phoneConnected").hide();
					$("#phoneNotConnected").show();
				}
			});

			$("#phoneNotConnected").hide();
			$("#phoneConnected").show();

		});

	})
	.on('error', function (err) {
		if (err.code === 'EADDRINUSE') {
			portaServidor++;
			console.log('Address in use, retrying on port ' + portaServidor);
			setTimeout(function () {
				server.listen(portaServidor);
			}, 250);
		}
	});