To build this desktop app, follow the instructions bellow.
Step 1,2 and 3 only on OSX. Step 4 only on Windows

1 - run npm-install
    to get the node modules required to build this app [nw-builder and appdmg]

2 - node build-app.js 
    to build the desktop app for windows and mac to ./build/WiFi Code Scanner/

3 - node build-dmg.js
    to build the dmg to distribute this app to ./WiFi Code Scanner.dmg

4 - run win-installer.iss using Inno Setup 
	to create a windows installation file for this app as Output/WiFi Code Scanner.exe