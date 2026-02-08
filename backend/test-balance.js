// Test balance calculation
console.log('=== Balance Calculation Test ===\n');

// Test 1: Starting with 0
let balance = 0;
console.log('Starting balance:', balance);

// Add income
const income = 45000;
balance = parseFloat(balance) + parseFloat(income);
console.log('After income +₹45,000:', balance);

// Add expense
const expense = 45000;
balance = parseFloat(balance) - parseFloat(expense);
console.log('After expense -₹45,000:', balance);

console.log('\nExpected: 0');
console.log('Actual:', balance);
console.log('Match:', balance === 0 ? '✅' : '❌');

// Test 2: Check if string concatenation issue
console.log('\n=== String Concatenation Test ===\n');
let balance2 = 0;
balance2 = balance2 + '45000'; // Wrong way
console.log('Wrong (concatenation):', balance2, typeof balance2);

let balance3 = 0;
balance3 = parseFloat(balance3) + parseFloat('45000'); // Right way
console.log('Right (parseFloat):', balance3, typeof balance3);
