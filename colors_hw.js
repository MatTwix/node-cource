// у меня проблема с цветами (мне сложно отличить желтый от зеленого), поэтому я буду использовать вместо зеленого цвета синий
const colors = require('colors/safe');

const [num1, num2] = process.argv.splice(2);
let currentNumber = 0;
let arrOfNums = [];

const getInterval = (a, b) => {
    if (isNaN(+a) || isNaN(+b)){
        console.log(colors.red('Введено не число'))
    } else if(a % 1 || b % 1) {
        console.log(colors.red('Введено некорректное число'))
    } else {
        let prevColor = 0;
        for(let i = a; i <= b; i++) {
            for(let n = 2; n < i; n++) arrOfNums.push(n);

            if(arrOfNums.every(item => i % item)) prevColor === 0 ? console.log(colors.red(i)) : prevColor === 1 ? console.log(colors.yellow(i)) : console.log(colors.blue(i))

            prevColor+=1;
            prevColor=prevColor % 3;
        }
    }
}


getInterval(num1, num2);