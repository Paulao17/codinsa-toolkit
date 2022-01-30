// This part deals with reading the input
process.stdin.resume();
process.stdin.setEncoding('utf-8');
let lines = [];

process.stdin.on('data', function (data) {
  data.split('\n').forEach(element => element ? lines.push(element) : undefined);
});

process.stdin.on('end', main);

// Different ways of parsing input
let parse = {};

// Parse line by line, splitting into arrays and converting to number when possible
parse.split = (separator = ' ') => {
  lines.forEach((line, index) => {
    lines[index] = line.split(separator).map(string => isNaN(string) ? string : Number(string));
  });
}

// Commonly used input methods
let read = {};
let lineIndex = 0;
let index = 0; 

// Returns next word, increment indexes
read.one = () => {
  index++;
  return lines[lineIndex][index - 1];
}

// Increments lineIndex, returns self
read.nextLine = () => {
  index = 0;
  lineIndex++;
  return read;
}

// Returns next line, increment indexes
read.line = () => {
  index = 0;
  lineIndex++;
  return lines[lineIndex - 1];
}

// Parses the lines between index a and b (inclusive) into nice objects with readable strings (specified in array).
read.linesToObj = (names, a = LineIndex, b = lines.length - 1) => {
  return lines.slice(a,b).map(line => {
    let obj = {};
    line.forEach((word, index) => obj[names[index]] = word);
  });
}

// Aliases
let r = read.one;

