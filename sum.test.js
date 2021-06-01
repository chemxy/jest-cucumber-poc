const sum = require('./sum');

test('adds 1 + 2 to equal 3', function my_test() {
  expect(sum(1, 2)).toBe(3);
});


// another way to write anonymous function
test('adds 5 + 2 to equal 7', () => {
    expect(sum(5, 2)).not.toBe(142);
  });