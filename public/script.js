let timerInterval;
let elapsedSeconds = 0;
let isRunning = false;

const startStopBtn = document.getElementById('startStopBtn');
const resetBtn = document.getElementById('resetBtn');
const hoursDisplay = document.getElementById('hours');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const historyList = document.getElementById('historyList');

startStopBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);
window.addEventListener('load', loadHistory);

function toggleTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        startStopBtn.textContent = 'Start';
        saveTime();
        loadHistory();
    } else {
        isRunning = true;
        startStopBtn.textContent = 'Stop';
        timerInterval = setInterval(updateTimer, 1000);
    }
}

function updateTimer() {
    elapsedSeconds++;
    let hours = Math.floor(elapsedSeconds / 3600);
    let minutes = Math.floor((elapsedSeconds % 3600) / 60);
    let seconds = elapsedSeconds % 60;

    hoursDisplay.textContent = padZero(hours);
    minutesDisplay.textContent = padZero(minutes);
    secondsDisplay.textContent = padZero(seconds);
}

function resetTimer() {
    clearInterval(timerInterval);
    elapsedSeconds = 0;
    isRunning = false;
    hoursDisplay.textContent = '00';
    minutesDisplay.textContent = '00';
    secondsDisplay.textContent = '00';
    startStopBtn.textContent = 'Start';
}

function padZero(num) {
    return num.toString().padStart(2, '0');
}

function saveTime() {
    let date = new Date().toISOString().split('T')[0];

    fetch('/save-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: date, seconds: elapsedSeconds })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Time saved:', data);
        elapsedSeconds = 0;
    })
    .catch(error => console.error('Error:', error));
}

function loadHistory() {
    fetch('/get-history')
        .then(response => response.json())
        .then(data => {
            historyList.innerHTML = '';
            data.forEach(record => {
                let totalSeconds = record.total_seconds;
                let hours = Math.floor(totalSeconds / 3600);
                let minutes = Math.floor((totalSeconds % 3600) / 60);
                let seconds = totalSeconds % 60;

                let listItem = document.createElement('li');
                listItem.textContent = `${record.date}: ${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
                historyList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error:', error));
}
