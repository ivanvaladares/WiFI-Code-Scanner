var NwBuilder = require('nw-builder');
var nw = new NwBuilder({
    files: '../App/**/**', // use the glob format
    macIcns: '_installation-files/icon.icns',
    platforms: ['osx64','win64'],
    version: '0.20.3'
});

//Log stuff you want

nw.on('log',  console.log);

// Build returns a promise
nw.build().then(function () {
   console.log('all done!');
}).catch(function (error) {
    console.error(error);
});