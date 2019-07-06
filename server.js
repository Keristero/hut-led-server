console.log("server.js ran!!");

const pixel = require("node-pixel");
const five = require("johnny-five");
 
const opts = {};
const board = new five.Board(opts);
 
board.on("ready", function() {
    strip = new pixel.Strip({
        board: this,
        controller: "I2CBACKPACK",
        strips: [143], // 1 strip on pin 0 with length 143
    });
 
    strip.on("ready", function() {
        // do stuff with the strip here.
        console.log("Strip ready, let's go");
        strip.color("rgb(0, 255, 0)")
        strip.show();
    });
});

setInterval(()=>{
    console.log('still running...')
},60000);