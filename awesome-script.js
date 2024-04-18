const fs = require("fs");

function parseNumbers(filename) {
  try {
    const data = fs.readFileSync(filename, "utf8");
    const nums = data
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "")
      .map(Number);
    return nums;
  } catch (err) {
    console.error("Error reading file:", err);
    return [];
  }
}

function computeSum(nums) {
  return nums.reduce((acc, curr) => acc + curr, 0);
}

function computeAverage(nums) {
  if (nums.length === 0) return 0;
  return calculateSum(nums) / nums.length;
}

function main() {
  const nums = parseNumbers("numbers.txt");
  const total = computeSum(nums);
  const average = computeAverage(nums);

  console.log(`Sum: ${total}`);
  console.log(`Average: ${average}`);
}

main();
