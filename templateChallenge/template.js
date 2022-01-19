process.stdin.resume();
process.stdin.setEncoding('utf-8');
var input = [];

process.stdin.on('data', function (data) {
    data.split('\n').filter(el => el).forEach(element => {
        input.push(element);
    });
});

process.stdin.on('end', function () {
    main();
});

function main() {

    let [a, b] = [...input.shift().split(' ')];
    // console.log

}