var appdmg = require('appdmg');

var ee = appdmg({ source: './_installation-files/appdmg.json', target: 'WiFi Code Scanner.dmg' });

ee.on('progress', function (info) {

    console.log("step " + info.current + " of " + info.total);
    
    // info.current is the current step 
    // info.total is the total number of steps 
    // info.type is on of 'step-begin', 'step-end' 

    // 'step-begin' 
    // info.title is the title of the current step 

    // 'step-end' 
    // info.status is one of 'ok', 'skip', 'fail' 

});

ee.on('finish', function () {
    // There now is a `test.dmg` file 
    console.log('all done!');
});

ee.on('error', function (err) {
    console.log(err);
    // An error occurred 
});
