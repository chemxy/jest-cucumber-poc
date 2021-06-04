const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require('assert');

const sum = require('../../src/sum');

let result = 0;

Given('I have some numbers', function () {
    //true
});
When('I calculate the sum of {int} and {int}', function (num1, num2) {

    result = sum(num1, num2);
});
Then('I get {int}', function (expected) {
    assert.equal(result, expected);
});
