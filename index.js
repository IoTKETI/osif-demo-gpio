var GPIO = require('onoff').Gpio;
const ketiCiotClient = require('./lib/keti.ciot.client.js');

var ledPin = 18;
var buttonPin = 17;

var led = new GPIO(ledPin, 'out');
var button = new GPIO(buttonPin, 'in', 'both');

function light(err, state) {
    if (state == 1) {
        led.writeSync(1);
        console.log('light on');
    }
    else {
        led.writeSync(0);
        console.log('light off');
    }
}



var listener = {
    'updated': function(arg1, arg2, arg3){
        console.log( arguments );

        ketiCiotClient.getValue(ketiCiotClient.KEYS.CIOT_DEMO_SWITCH, arg1)
            .then(function(value){
                if (value == 'on') {
                    led.writeSync(1);
                    console.log('light on');
                }
                else {
                    led.writeSync(0);
                    console.log('light off');
                }            })
            .catch(function(err){
                console.log( err );
            });

    }
}


ketiCiotClient.setEventListener(ketiCiotClient.KEYS.CIOT_DEMO_SWITCH, 'state', listener)
    .then(function(result){
        console.log( 'evnet listener result: ', result );
    })



console.log('start');
button.watch(light);



function serviceShutdown() {
    server.close(function () {
        ketiCiotClient.setValue(ketiCiotClient.KEYS.CIOT_PROCESS, 'demo-seqgen', {state: 'stop', instanceid: '383f327dd3'})
            .then(function(value){
                console.log( value );
                process.exit(0);
            })
            .catch(function(err){
                console.log( err );
                process.exit(0);
            });
    });
}

process.on('SIGINT', function () {
    serviceShutdown();
});
process.on('SIGTERM', function () {
    serviceShutdown();
});
