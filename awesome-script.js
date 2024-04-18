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

function calculateSum(numbers) {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

function calculateAverage(numbers) {
  if (numbers.length === 0) return 0;
  return calculateSum(numbers) / numbers.length;
}

function main() {
  const numbers = readNumbers("numbers.txt");
  const total = calculateSum(numbers);
  const average = calculateAverage(numbers);

  console.log(`Sum: ${total}`);
  console.log(`Average: ${average}`);
}

main();
