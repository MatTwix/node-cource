// у меня проблема с цветами (мне сложно отличить желтый от зеленого), поэтому я буду использовать вместо зеленого цвета синий
// также не совсем понял задание с интервалом, я так понимаю, должна вылетать ошибка, если разника между числами < 3
const colors = require('colors/safe');

const [num1, num2] = process.argv.splice(2);


const getInterval = (a, b) => {
    if (isNaN(+a) || isNaN(+b)){
        console.log(colors.red('Введено не число'))
    } else if(a % 1 || b % 1) {
        console.log(colors.red('Введено некорректное число'))
    } else if (b - a + 1 < 3){
        console.log(colors.red('Интревал меньше 3-ех'))
    } else {
        let prevColor = 0;
        for(let i = a; i <= b; i++) {
            prevColor === 0 ? console.log(colors.red(i)) : prevColor === 1 ? console.log(colors.yellow(i)) : console.log(colors.blue(i))

            prevColor+=1;
            prevColor=prevColor % 3;
        }
    }
}


getInterval(num1, num2);