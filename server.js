//LED dependencies
let five = require("johnny-five");
let pixel = require("node-pixel");
let Raspi = require("raspi-io").RaspiIO;

//Web dependencies
let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let path = require('path');

//LED
let opts = {};
opts.port = process.argv[2] || "";

let board = new five.Board({
  io: new Raspi(),
});
let strip = null;

let fps = 10; // how many frames per second do you want to try?

board.on("ready", function() {

    console.log("Board ready, lets add light");

    strip = new pixel.Strip({
        color_order: pixel.COLOR_ORDER.GRB,
        board: this,
        controller: "I2CBACKPACK",
        strips: [143],
    });

    strip.on("ready", function() {
        console.log("Strip ready, let's go");

        strip.color("black");
        strip.show();

        /*
        var blinker = setInterval(function() {
            strip.color("#000"); // blanks it out
            for (var i=0; i< current_pos.length; i++) {
                if (++current_pos[i] >= strip.length) {
                    current_pos[i] = 0;
                    if (++current_colors[i] >= colors.length) current_colors[i] = 0;
                }
                strip.pixel(current_pos[i]).color(colors[current_colors[i]]);
            }
            strip.show();
        }, 1000/fps);
        */
    });
});

//WEB
app.get('/', function(req, res){
  res.sendFile('client/index.html', { root: __dirname });
});

io.on('connection', function(socket){
  broadcastStripState()
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('setStripColor', function(stripColors){
    stripColors.forEach((hex,index)=>{
      strip.pixel(index).color(hex)
    })
    strip.show()
    broadcastStripState(stripColors)
  });

});

function broadcastStripState(pstripColors){
  if(pstripColors !== undefined){
    io.emit('stripColor',pstripColors);
  }else{
    let stripColors = []
    for(let i = 0; i < strip.length; i++){
      let color = strip.pixel(i).color()
      stripColors.push(color.hex)
    }
    io.emit('stripColor',stripColors);
  }
}

http.listen(80, function(){
  console.log('listening on *:80');
});