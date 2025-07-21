export const QUESTION_POOL = [
  {
    id: 'q1',
    title: 'Factorial of a Number',
    description: 'Write a program to calculate the factorial of a given number n.',
    sampleInput: '5',
    sampleOutput: '120',
    plagiarism: 80,
    hiddenTests: [
      { input: '0', expected: '1' },
      { input: '1', expected: '1' },
      { input: '3', expected: '6' },
      { input: '7', expected: '5040' },
      { input: '10', expected: '3628800' }
    ]
  },
  {
    id: 'q2',
    title: 'Check if a String is a Palindrome',
    description: 'Determine whether a given string is a palindrome (reads the same forward and backward).',
    sampleInput: 'madam',
    sampleOutput: 'Yes',
    plagiarism: 75,
    hiddenTests: [
      { input: 'racecar', expected: 'Yes' },
      { input: 'level', expected: 'Yes' },
      { input: 'hello', expected: 'No' },
      { input: 'noon', expected: 'Yes' },
      { input: 'python', expected: 'No' }
    ]
  },
  {
    id: 'q3',
    title: 'Fibonacci Series',
    description: 'Generate the Fibonacci series up to n terms. The first two terms are 0 and 1.',
    sampleInput: '5',
    sampleOutput: '0 1 1 2 3',
    plagiarism: 85,
    hiddenTests: [
      { input: '1', expected: '0' },
      { input: '2', expected: '0 1' },
      { input: '3', expected: '0 1 1' },
      { input: '7', expected: '0 1 1 2 3 5 8' },
      { input: '10', expected: '0 1 1 2 3 5 8 13 21 34' }
    ]
  },
  {
    id: 'q4',
    title: 'Prime Number Checker',
    description: 'Check whether a given number is a prime or not.',
    sampleInput: '7',
    sampleOutput: 'Prime',
    plagiarism: 90,
    hiddenTests: [
      { input: '1', expected: 'Not Prime' },
      { input: '2', expected: 'Prime' },
      { input: '9', expected: 'Not Prime' },
      { input: '17', expected: 'Prime' },
      { input: '20', expected: 'Not Prime' }
    ]
  },
  {
    id: 'q5',
    title: 'Reverse a Linked List',
    description: 'Write code to reverse a singly linked list and print the reversed list.',
    sampleInput: '1 2 3 4 5',
    sampleOutput: '5 4 3 2 1',
    plagiarism: 80,
    hiddenTests: [
      { input: '10 20 30', expected: '30 20 10' },
      { input: '1', expected: '1' },
      { input: '1 2', expected: '2 1' },
      { input: '5 4 3 2 1', expected: '1 2 3 4 5' },
      { input: '7 14 21 28', expected: '28 21 14 7' }
    ]
  }
];
