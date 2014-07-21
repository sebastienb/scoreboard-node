var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    colors = require('colors');

server.listen(3000);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});


app.get('/newgame', function(req, res) {
    res.sendfile(__dirname + '/game.html');
});

// Initial var values
var bluepoints = "00",
    redpoints = "00",
    round = "1",
    currTime = Date.now();

var round1,
    round2,
    round3;


function millisecondsToStr (milliseconds) {
    // TIP: to find current time in milliseconds, use:
    // var  current_time_milliseconds = new Date().getTime();

    function numberEnding (number) {
        return (number > 1) ? 's' : '';
    }

    var temp = Math.floor(milliseconds / 1000);
    var years = Math.floor(temp / 31536000);
    if (years) {
        return years + ' year' + numberEnding(years);
    }
    //TODO: Months! Maybe weeks? 
    var days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
        return days + ' day' + numberEnding(days);
    }
    var hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
        return hours + ' hour' + numberEnding(hours);
    }
    var minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
        return minutes + ' minute' + numberEnding(minutes);
    }
    var seconds = temp % 60;
    if (seconds) {
        return seconds + ' second' + numberEnding(seconds);
    }
    return 'less than a second'; //'just now' //or other string you like;
}




function addpoint(data){

    var currentBP = Number(bluepoints),
        currentRP = Number(redpoints),
        pointTime =     millisecondsToStr(Date.now() - currTime);

    
    console.log(pointTime);

    switch (data)
        {
           case "blueplus":
                console.log('blue team plus 1');
                // var current = Number(bluepoints);
                bluepoints = currentBP+1;
                console.log(bluepoints);
            break;
           
           case "redplus":
                console.log('Red team plus 1');
                //var current = Number(redpoints);
                redpoints = currentRP+1;
                console.log(redpoints);
            break;

           case "bluemin":
                console.log('blue team minus 1');
                //var current = Number(bluepoints);
                bluepoints = currentBP-1;
                console.log(bluepoints);
            break;

           case "redmin":
                console.log('Red team minus 1');
                //var current = Number(redpoints);
                redpoints = currentRP-1;
                console.log(redpoints);
            break;

           default: 
                console.log('unknown message received:'+data);
            break;
        };
    io.emit('score-update', {blue: bluepoints, red: redpoints, currentround: round, time : pointTime});
    console.log('Score '+pointTime+' !'.blue);
    io.emit('status', 'Score '+pointTime+' !');
};

console.log('Server listening on port 3000'.green);

// On first client connection start a new game
io.sockets.on('connection', function(socket){

// Game round score keeper
    

    console.log('New device connected'.green);
    
    io.emit('status', 'New device connected!');

// Send score update to all devices on new connection
    io.emit('score-update', {blue: bluepoints, red: redpoints, currentround: round});

// Receiving info from remote page        
        socket.on('score', function(data){
            
            console.log('score received from Remote'.green)
            // io.emit('score-update', data);
            addpoint(data);
        });

        socket.on('status', function(data){
            switch (data)
            { case "newGame": 
                    bluepoints = "00"
                    redpoints = "00"
                    round = "1"
                    currTime = Date.now();
                    io.emit('score-update', {blue: bluepoints, red: redpoints, currentround: round});
                    console.log('New Game Starting');
                    io.emit('status', "Starting new Game...");
            break;
            };
        });

}); //end socket connection



// Johnny-five starts here

// var five = require("johnny-five"),
//     // or "./lib/johnny-five" when running from the source
//     board = new five.Board();

// board.on("ready", function() {

//    var laserBlue;
//     var laserRed;

//     var sensorBlue = new five.Button(8);
//     var sensorRed = new five.Button(7); 

//   // Create an Led on pin 13 and strobe it on/off
//   // Optionally set the speed; defaults to 100ms
//   (new five.Led(13)).strobe();

// });


// Johnny-five dies here





