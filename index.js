const timer = document.getElementById("time");
let time = 25 * 60;

function decrementTime() {
    let minutes = parseInt(time / 60, 10)
    let seconds = parseInt(time % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timer.innerText = `${minutes}:${seconds}`;

    time -= 1;

    if (time < 0) {
        clearInterval()
    }
}

setInterval(decrementTime, 1000);