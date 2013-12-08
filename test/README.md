This is an experimental change to our test suite to more easily
run tests in both browser + node, to run the current test suite

    $ node test/unit/merge_rev_tree_test.js

for node, and

    $ browserify test/unit/merge_rev_tree_test.js | ./node_modules/.bin/testling -u

for the browser.

    $ npm install -g testling
