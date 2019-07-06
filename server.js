console.log("server.js ran!!");

let pixel = require("node-pixel");
var firmata = require('firmata');
 
var board = new firmata.Board('/dev/ttyUSB0',function(){
 
    strip = new pixel.Strip({
        pin: 6, // this is still supported as a shorthand
        length: 144,
        firmata: board,
        controller: "FIRMATA",
 
    });
 
    strip.on("ready", function() {
        console.log("Strip ready, let's go");
        strip.color("rgb(0, 255, 0)")
        strip.show();
    });
});

setInterval(()=>{
    console.log('still running...')
},60000);
