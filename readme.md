# Table of Content

- [Before: Jest vs Cucumber.js](#Before: Jest vs Cucumber.js) 
- [Before: Create a function to be tested](#Before: Create a function to be tested)
- [Set Up a Pure Jest Test (without Cucumber):](#Set Up a Pure Jest Test (without Cucumber):)
  - [Install Jest](#Install Jest)
  - [Create a test](#Create a test)
  - [Configuration file](#Configuration file)
  - [Run tests](#Run tests)
  - [Test Asynchronous Code](#Test Asynchronous Code)
  - [Setup & Teardown](#Setup & Teardown)
  - [Order of Execution](#Order of Execution of  and  blocks)
- [Set up a Pure Cucumber.js test](#Set up a Pure Cucumber.js test)
  - [Install cucumber.js](#Install cucumber.js)
  - [Create features and step definitions](#Create features and step definitions)
  - [Run tests](#Run tests)



#  Before: Jest vs Cucumber.js

Both are testing JavaScript code. 

But:

- `Jest`: more like a JUnit testing (aimed for unit testing).

- `Cucumber.js`: more like an end-to-end / acceptance testing with test scenarios.

- `jest-cucumber` & `cucumber-jest` are open-source packages on GitHub - should be careful when we use them. may need to ask for Jason.

we could use combination of Jest and Cucumber, or directly use Cucumber.js.



# Before: Create a function to be tested

 Create a `sum.js` file:

``` javascript
function sum(a, b) {
    return a + b;
}  
  
module.exports = sum;
```

**Note**: Personally I think it is essential to export the function you want to test as a module so the function can be reached by a file outside.



# Set Up a Pure Jest Test (without Cucumber):

This document was mostly following this tutorial ( https://jestjs.io/docs/getting-started ). The tutorial is very complete and worth reading.  



btw I changed the code and the test a bit just for fun.



## Install Jest

Open a console and `cd` to the desired directory.



Install Jest  [`npm`](https://www.npmjs.com/package/jest) in the directory:

````
npm install --save-dev jest
````

Or install Jest globally:

```
npm install jest --global
```

**Note**: if we need to install cucumber AND jest in the same root, we might need to install them globally; otherwise somehow one of them will fail.



## Create a test

Create a file named `sum.test.js`. This will contain our actual test:

```javascript
const sum = require('./sum');

test('adds 1 + 2 to equal 3', function my_test() {
  expect(sum(1, 2)).toBe(3);
});


// another way to write anonymous function
test('adds 5 + 2 not to equal 142', () => {
    expect(sum(5, 2)).not.toBe(142);
  });
```

This test used `expect` and `toBe` to test that two values were exactly identical. To learn about the other things that Jest can test, see [Using Matchers](https://jestjs.io/docs/using-matchers).



## Configuration file

Create a file named `package.json` and add the following section:

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

**Note**: Do not change anything in the `package-lock.json`.



## Run tests

Run `npm run test` in the console. Or if you are using *Visual Studio Code IDE*, there could be a `Debug` button shown above your code in the `package.json` file. Click that `Debug` button will automatically run `npm run test`in the console.

Running the tests will result in the following output:

```javascript
> @ test E:\Github\jest-cucumber-poc
> jest

Debugger attached.
 PASS  ./sum.test.js
  √ adds 1 + 2 to equal 3 (3 ms)
  √ adds 5 + 2 to equal 7 (1 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        2.168 s
Ran all test suites.
```

You just successfully wrote your first test using Jest!



## Test Asynchronous Code

I believe we will have to test lots of asynchronous code as we will be dealing with API requests and responses. So this section might be helpful. And using `promises` probably is better than using `callbacks`.

*link: https://jestjs.io/docs/asynchronous.*



to be continued



## Setup & Teardown

This is necessary when we have massive tests.



### Notations:

- `beforeEach` and `afterEach` will be called before/after each test.
- `beforeAll` and `afterAll` will be called before/after all tests, only once.
- `describe`: By default, the `before` and `after` blocks apply to every test in a file. You can also group tests together using a `describe` block. When they are inside a `describe` block, the `before` and `after` blocks only apply to the tests within that `describe` block. 

```javascript
// Applies to all tests in this file
beforeEach(() => {
  return initializeCityDatabase();
});

test('adds 5 + 2 to equal 7', () => {
    expect(sum(5, 2)).toBe(7);
  });

test('adds 5 + 2 not to equal 142', () => {
    expect(sum(5, 2)).not.toBe(142);
  });



// Applies only to tests in this describe block
describe('matching cities to foods', () => {

  beforeEach(() => {
    return initializeFoodDatabase();
  });

  test('adds 4 + 4 to equal 8', () => {
    expect(sum(4, 4)).toBe(8);
  });

test('adds 4 + 4 not to equal 14', () => {
    expect(sum(4, 4)).not.toBe(14);
  });
});
```



### Order of Execution of `describe` and `test` blocks

**Note** : the top-level `beforeEach` is executed before the `beforeEach` inside the `describe`block. 

```javascript
beforeAll(() => console.log('1 - beforeAll'));
afterAll(() => console.log('1 - afterAll'));
beforeEach(() => console.log('1 - beforeEach'));
afterEach(() => console.log('1 - afterEach'));
test('', () => console.log('1 - test'));
describe('Scoped / Nested block', () => {
  beforeAll(() => console.log('2 - beforeAll'));
  afterAll(() => console.log('2 - afterAll'));
  beforeEach(() => console.log('2 - beforeEach'));
  afterEach(() => console.log('2 - afterEach'));
  test('', () => console.log('2 - test'));
});

// 1 - beforeAll
// 1 - beforeEach
// 1 - test
// 1 - afterEach
// 2 - beforeAll
// 1 - beforeEach
// 2 - beforeEach
// 2 - test
// 2 - afterEach
// 1 - afterEach
// 2 - afterAll
// 1 - afterAll
```



Jest executes all describe handlers in a test file *before* it executes any of the actual tests. This is another reason to do setup and teardown inside `before*` and `after*` handlers rather than inside the describe blocks. Once the describe blocks are complete, by default Jest runs all the tests serially in the order they were encountered in the collection phase, waiting for each to finish and be tidied up before moving on.



```javascript
describe('outer', () => {
  console.log('describe outer-a');

  describe('describe inner 1', () => {
    console.log('describe inner 1');
    test('test 1', () => {
      console.log('test for describe inner 1');
      expect(true).toEqual(true);
    });
  });

  console.log('describe outer-b');

  test('test 1', () => {
    console.log('test for describe outer');
    expect(true).toEqual(true);
  });

  describe('describe inner 2', () => {
    console.log('describe inner 2');
    test('test for describe inner 2', () => {
      console.log('test for describe inner 2');
      expect(false).toEqual(false);
    });
  });

  console.log('describe outer-c');
});

// describe outer-a
// describe inner 1
// describe outer-b
// describe inner 2
// describe outer-c
// test for describe inner 1
// test for describe outer
// test for describe inner 2
```



# Set up a Pure Cucumber.js test



## Install cucumber.js

install cucumber framework using `npm`:

```
npm i -D @cucumber/cucumber
```



or 

````
npm install cucumber --global
````



## Create features and step definitions

create a folder named `features` to contain out feature files. 



go to the `features` folder and create a feature file named `sample-test.feature`



add the following scenario:

```gherkin
Feature: addition
    this is a sample test

Scenario: 1 + 2
    Given I have some numbers
    When I calculate the sum of 1 and 2
    Then I get 3
```



return to the root folder and create a folder named `stepdefs` to contain out step definitions.



go to the `stepdefs`folder and create a javascript file named `stepdef.js` and add the following code:

```javascript
const { Given, When, Then } = require("@cucumber/cucumber"); // import gherkin
const assert = require('assert');	//import assertion

const sum = require('../sum');	//import the function we want to test

let result = 0;	//init a global variable to store result

Given('I have some numbers', function () {
    //always true
});
When('I calculate the sum of {int} and {int}', function (num1, num2) {
    result = sum(num1, num2);
});
Then('I get {int}', function (expected) {
    assert.equal(result, expected);
});
```



## Run tests

we can directly run tests on command line, or we can include the command in the script like this:

add the script in your `package.json` configuration file:

```json
"scripts": {
  "cucumber": "cucumber.js ./myFeatures -r ./mySteps"
}
```



then we can run the command `npm run cucumber` on the console and this will result in the following result:

```bash
PS E:\Github\jest-cucumber-poc> npm run cucumber

> @ cucumber E:\Github\jest-cucumber-poc
> cucumber-js ./features -r ./stepdefs  

...

1 scenario (1 passed)
3 steps (3 passed)
0m00.010s (executing steps: 0m00.003s)
┌──────────────────────────────────────────────────────────────────────────┐
│ Share your Cucumber Report with your team at https://reports.cucumber.io │
│                                                                          │
│ Command line option:    --publish                                        │
│ Environment variable:   CUCUMBER_PUBLISH_ENABLED=true                    │
│                                                                          │
│ More information at https://reports.cucumber.io/docs/cucumber-js         │
│                                                                          │
│ To disable this message, add this to your ./cucumber.js:                 │
│ module.exports = { default: '--publish-quiet' }                          │
└──────────────────────────────────────────────────────────────────────────┘
```



## Some tutorials

Tutorial for non-web app testing : 

https://www.sitepoint.com/bdd-javascript-cucumber-gherkin/

https://stackoverflow.com/questions/46898573/using-cucumber-js-with-jest

https://github.com/cucumber/cucumber-js/blob/main/docs/nodejs_example.md



Tutorial for web app testing : 

https://www.testim.io/blog/cucumber-js-for-bdd-an-introductory-tutorial-with-examples/





