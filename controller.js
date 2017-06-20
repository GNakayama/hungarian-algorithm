var PLAYING = 0;
var PAUSED = 1;
var STOPPED = 2;
var state = STOPPED;
var playButton = document.getElementById('play');
var stopButton = document.getElementById('stop');
var forwardButton = document.getElementById('forward');
var backwardButton = document.getElementById('backward');


function play() {
    switch (state) {
        case PLAYING:
            clearTimeout(token);
            state = PAUSED;
            backwardButton.disabled = true;
            playButton.childNodes[0].className = "fa fa-play";
            break;
        default:
            state = PLAYING;
            token = setTimeout(function(){drawStep(result[2]);}, speed);
            stopButton.disabled = false;
            backwardButton.disabled = false;
            playButton.childNodes[0].className = "fa fa-pause";
            break;
    }
}

function stop() {
    clearTimeout(token);
    step = 0;
    state = STOPPED;
    resetGraph();
    speed = 10;
    backwardButton.disabled = true;
    stopButton.disabled = true;
    playButton.childNodes[0].className = "fa fa-play";
}

function backward() {
    switch (state) {
        case PLAYING:
            speed += 10;
            break;
        default:
            break;
    }
}

function forward() {
    switch (state) {
        case PLAYING:
            if (speed >= 20) {
                speed -= 10;
            }
            break;
        default:
            if (step < result[2].length - 1) {
                updateGraph(result[2][step][0], result[2][step][1], result[2][step][2]);
                step += 1;

                if (result[2][step -1][2] === 2) {
                    updateGraph(result[2][step][0], result[2][step][1], result[2][step][2]);
                    step += 1;
                }
            }
            break;
    }
}
