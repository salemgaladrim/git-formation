const fs = require("fs");

function readNumbers(filename) {
  try {
    const data = fs.readFileSync(filename, "utf8");
    const numbers = data
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "")
      .map(Number);
    return numbers;
  } catch (err) {
    console.error("Error reading file:", err);
    return [];
  }
}

function calculateSumWithLoop(numbers) {
  let total = 0;
  numbers.foreach((num) => {
    total += num;
  });
  return total;
}

function calculateAverageInAStupidWay(numbers) {
  let average = 0;
  numbers.foreach((num) => {
    average += num / numbers.length;
  });
  return average;
}

function main() {
  const numbers = readNumbers("numbers.txt");
  const total = calculateSumWithLoop(numbers);
  const average = calculateAverageInAStupidWay(numbers);

  console.log(`Sum: ${total}`);
  console.log(`Average: ${average}`);
}

main();
