import EventEmitter from "events";

//формат таймера: час-день-месяц-год

const pointTime = process.argv[2].split`-`.reverse().map(item => +item);
pointTime[1] -= 1;

const getDateInHumanForm = date => [
    Math.floor(date / (1000 * 3600 * 24)),
    Math.floor((date / (1000 * 3600)) % 60),
    Math.floor((date / (1000 * 60)) % 60),
    Math.floor((date / 1000) % 60)
].map(item => item.toString().length < 2 ? `0${item}` : item).join`:`

let timeLeft = new Date(...pointTime) - new Date();

if(timeLeft < 0) throw 'Incorrect value of date'

const requestTypes = [
    {
        type: 'startTimer',
        payload: 'Start timer'
    },
    {
        type: 'timeIsUp',
        payload: 'Time is up!'
    }
];

class Timer {
    constructor(params) {
        this.type = params.type;
        this.payload = params.payload
    }
}

const delay = ms => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms)
    })
}

const generateNewTime = () => delay(1000).then(() => new Timer(requestTypes[timeLeft > 0 ? 0 : 1]));

class Handler {
    static startTimer() {
        console.log(getDateInHumanForm(timeLeft));
        timeLeft = new Date(...pointTime) - new Date();
    }
    static timeIsUp(payload) {
        console.log(payload);
        throw 'Time is up!'; //лучше способа прервать выполнение скрипта не нашел
    }
}

const Emitter = new class extends EventEmitter {}

Emitter.on('startTimer', Handler.startTimer);
Emitter.on('timeIsUp', Handler.timeIsUp);

const run = async () => {
    const timer = await generateNewTime();
    Emitter.emit(timer.type, timer.payload);

    run()
}
run()