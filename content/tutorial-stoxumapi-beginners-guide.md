# StoxumAPI Beginners Guide

This tutorial guides you through the basics of building an STM Ledger-connected application using [Node.js](http://nodejs.org/) and [StoxumAPI](reference-stoxumapi.html), a JavaScript API for accessing the STM Ledger.

The scripts and configuration files used in this guide are [available in the Stoxum Dev Portal GitHub Repository](https://github.com/stoxum/stoxum-dev-portal/tree/master/content/code_samples/stoxumapi_quickstart).

# Environment Setup

The first step to using StoxumAPI is setting up your development environment.

## Install Node.js and npm

StoxumAPI is built as an application for the Node.js runtime environment, so the first step is getting Node.js installed. StoxumAPI requires Node.js version 0.12, version 4.x, or higher.

This step depends on your operating system. We recommend [the official instructions for installing Node.js using a package manager](https://nodejs.org/en/download/package-manager/) for your operating system. If the packages for Node.js and `npm` (Node Package Manager) are separate, install both. (This applies to Arch Linux, CentOS, Fedora, and RHEL.)

After you have installed Node.js, you can check the version of the `node` binary from a command line:

```
node --version
```

On some platforms, the binary is named `nodejs` instead:

```
nodejs --version
```

## Use NPM to install StoxumAPI and dependencies

StoxumAPI uses the newest version of JavaScript, ECMAScript 6 (also known as ES2015). To use the new features of ECMAScript 6, StoxumAPI depends on [Babel-Node](https://babeljs.io) and its ES2015 presets. You can use `npm` to install StoxumAPI and these dependencies together.

#### 1. Create a new directory for your project

Create a folder called (for example) `my_stoxum_experiment`:

```
mkdir my_stoxum_experiment && cd my_stoxum_experiment
```

Optionally, start a [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) repository in that directory so you can track changes to your code.

```
git init
```

Alternatively, you can [create a repo on GitHub](https://help.github.com/articles/create-a-repo/) to version and share your work. After setting it up, [clone the repo](https://help.github.com/articles/cloning-a-repository/) to your local machine and `cd` into that directory.

#### 2. Create a new `package.json` file for your project.

Use the following template, which includes:

* StoxumAPI itself (`stoxum-libjs`)
* Babel (`babel-cli`)
* The ECMAScript 6 presets for Babel (`babel-preset-es2015`)
* (Optional) [ESLint](http://eslint.org/) (`eslint`) for checking code quality.

```
{% include 'code_samples/stoxumapi_quickstart/package.json' %}
```


#### 3. Use NPM to install the dependencies.

```
npm install
```

This automatically installs all the dependencies defined in the `package.json` into the local folder `node_modules/`. (We recommend _not_ using `npm -g` to install the dependencies globally.)

The install process may take a while and end with a few warnings. You may safely ignore the following warnings:

```
npm WARN optional Skipping failed optional dependency /chokidar/fsevents:
npm WARN notsup Not compatible with your operating system or architecture: fsevents@1.0.6
npm WARN ajv@1.4.10 requires a peer of ajv-i18n@0.1.x but none was installed.
```

# First StoxumAPI Script

This script, `get-account-info.js`, fetches information about a hard-coded account. Use it to test that StoxumAPI works:

```
{% include 'code_samples/stoxumapi_quickstart/get-account-info.js' %}
```

## Running the script

StoxumAPI and the script both use the ECMAScript 6 version of JavaScript. That's why we installed Babel earlier. The easiest way to run ECMAScript 6 is to use the `babel-node` binary, which NPM installs in the `node_modules/.bin/` directory of your project. Thus, running the script looks like this:

```
./node_modules/.bin/babel-node get-account-info.js
```

Output:

```
getting account info for cDarPNJEpCnpBZSfmcquydockkePkjPGA2
{ sequence: 359,
  stmBalance: '75.181663',
  ownerCount: 4,
  previousInitiatedTransactionID: 'E5C6DD25B2DCF534056D98A2EFE3B7CFAE4EBC624854DE3FA436F733A56D8BD9',
  previousAffectingTransactionID: 'E5C6DD25B2DCF534056D98A2EFE3B7CFAE4EBC624854DE3FA436F733A56D8BD9',
  previousAffectingTransactionLedgerVersion: 18489336 }
getAccountInfo done
done and disconnected.
```

## Understanding the script

In addition to StoxumAPI-specific code, this script uses syntax and conventions that are recent developments in JavaScript. Let's divide the sample code into smaller chunks to explain each one.

### Script opening

```
'use strict';
const StoxumAPI = require('stoxum-libjs').StoxumAPI;
```

The opening line enables [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode). This is purely optional, but it helps you avoid some common pitfalls of JavaScript. See also: [Restrictions on Code in Strict Mode](https://msdn.microsoft.com/library/br230269%28v=vs.94%29.aspx#Anchor_1).

The second line imports StoxumAPI into the current scope using Node.js's require function. StoxumAPI is one of [the modules `stoxum-libjs` exports](https://github.com/stoxum/stoxum-libjs/blob/develop/src/index.ts).

### Instantiating the API

```
const api = new StoxumAPI({
  server: 'wss://s1.stoxum.com', // Public stoxumd server
  port: 51231
});
```

This section creates a new instance of the StoxumAPI class, assigning it to the variable `api`. (The [`const` keyword](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) means you can't reassign the value `api` to some other value. The internal state of the object can still change, though.)

The one argument to the constructor is an options object, which has [a variety of options](reference-stoxumapi.html#parameters). The `server` parameter tells it where it should connect to a `stoxumd` server.

* The example `server` setting uses a secure WebSocket connection to connect to one of the public servers that Stoxum (the company) operates.
* If you don't include the `server` option, StoxumAPI runs in [offline mode](reference-stoxumapi.html#offline-functionality) instead, which only provides methods that don't need network connectivity.
* You can specify a [Stoxum Test Net](https://stoxum.org/build/stoxum-test-net/) server instead to connect to the parallel-world Test Network instead of the production STM Ledger.
* If you [run your own `stoxumd`](tutorial-stoxumd-setup.html), you can instruct it to connect to your local server. For example, you might say `server: 'ws://localhost:5005'` instead.

### Connecting and Promises

```
api.connect().then(() => {
```

The [connect() method](reference-stoxumapi.html#connect) is one of many StoxumAPI methods that returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), which is a special kind of JavaScript object. A Promise is designed to do an asynchronous operation that returns a value later, such as querying the STM Ledger.

When you get a Promise back from some expression (like `api.connect()`), you call the Promise's `then` method and pass in a callback function. Passing a function as an argument is conventional in JavaScript, taking advantage of how JavaScript functions are [first-class objects](https://en.wikipedia.org/wiki/First-class_function).

When a Promise finishes with its asynchronous operations, the Promise runs the callback function you passed it. The return value from the `then` method is another Promise object, so you can "chain" that into another `then` method, or the Promise's `catch` method, which also takes a callback. The callback you pass to `catch` gets called if something goes wrong.

Finally, we have more new ECMAScript 6 syntax - an [arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions). Arrow functions are a shorter way of defining anonymous functions. This is convenient for defining lots of one-off functions as callbacks. The syntax `()=> {...}` is mostly equivalent to `function() {...}`. If you want an anonymous function with one parameter, you can use a syntax like `info => {...}` instead, which is almost the same as `function(info) {...}` syntax.

### Custom code

```
  /* begin custom code ------------------------------------ */
  const myAddress = 'cDarPNJEpCnpBZSfmcquydockkePkjPGA2';

  console.log('getting account info for', myAddress);
  return api.getAccountInfo(myAddress);

}).then(info => {
  console.log(info);
  console.log('getAccountInfo done');

  /* end custom code -------------------------------------- */
```

This is the part that you change to do whatever you want the script to do.

The example code looks up an STM Ledger account by its address. Try running the code with different addresses to see different results.

The `console.log()` function is built into both Node.js and web browsers, and writes out to the console. This example includes lots of console output to make it easier to understand what the code is doing.

Keep in mind that the example code starts in the middle of a callback function (called when StoxumAPI finishes connecting). That function calls StoxumAPI's [`getAccountInfo`](reference-stoxumapi.html#getaccountinfo) method, and returns the results.

The `getAccountInfo` API method returns another Promise, so the line `}).then( info => {` defines another anonymous callback function to run when this Promise's asynchronous work is done. Unlike the previous case, this callback function takes one argument, called `info`, which holds the asynchronous return value from the `getAccountInfo` API method. The rest of this callback function outputs that return value to the console.

### Cleanup

```
}).then(() => {
  return api.disconnect();
}).then(() => {
  console.log('done and disconnected.');
}).catch(console.error);
```

The rest of the sample code is mostly more [boilerplate code](reference-stoxumapi.html#boilerplate). The first line ends the previous callback function, then chains to another callback to run when it ends. That method disconnects cleanly from the STM Ledger, and has yet another callback which writes to the console when it finishes. If your script waits on [StoxumAPI events](reference-stoxumapi.html#api-events), do not disconnect until you are done waiting for events.

The `catch` method ends this Promise chain. The callback provided here runs if any of the Promises or their callback functions encounters an error. In this case, we pass the standard `console.error` function, which writes to the console, instead of defining a custom callback. You could define a smarter callback function here to intelligently catch certain error types.

# Waiting for Validation

One of the biggest challenges in using the STM Ledger (or any decentralized system) is knowing the final, immutable transaction results. Even if you [follow the best practices](tutorial-reliable-transaction-submission.html) you still have to wait for the [consensus process](https://stoxum.org/build/stoxum-ledger-consensus-process/) to finally accept or reject your transaction. The following example code demonstrates how to wait for the final outcome of a transaction:

```
{% include 'code_samples/stoxumapi_quickstart/submit-and-verify.js' %}
```

This code creates and submits an order transaction, although the same principles apply to other types of transactions as well. After submitting the transaction, the code uses a new Promise, which queries the ledger again after using setTimeout to wait a fixed amount of time, to see if the transaction has been verified. If it hasn't been verified, the process repeats until either the transaction is found in a validated ledger or the returned ledger is higher than the LastLedgerSequence parameter.

In rare cases (particularly with a large delay or a loss of power), the `stoxumd` server may be missing a ledger version between when you submitted the transaction and when you determined that the network has passed the `maxLedgerVersion`. In this case, you cannot be definitively sure whether the transaction has failed, or has been included in one of the missing ledger versions. StoxumAPI returns `MissingLedgerHistoryError` in this case.

If you are the administrator of the `stoxumd` server, you can [manually request the missing ledger(s)](reference-stoxumd.html#ledger-request). Otherwise, you can try checking the ledger history using a different server. (Stoxum runs a public full-history server at `ws01.stoxum.org` for this purpose.)

See [Reliable Transaction Submission](tutorial-reliable-transaction-submission.html) for a more thorough explanation.

# StoxumAPI in Web Browsers

StoxumAPI can also be used in a web browser if you compile a browser-compatible version and include [lodash](https://www.npmjs.com/package/lodash) as a dependency before the StoxumAPI script.

## Build Instructions

To use StoxumAPI in a browser, you need to build a browser-compatible version. The following process compiles StoxumAPI into a single JavaScript file you can include in a webpage.

#### 1. Download a copy of the StoxumAPI git repository.

If you have [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) installed, you can clone the repository and check out the **master** branch, which always has the latest official release:

```
git clone https://github.com/stoxum/stoxum-libjs.git
cd stoxum-libjs
git checkout master
```

Alternatively, you can download an archive (.zip or .tar.gz) of a specific release from the [StoxumAPI releases page](https://github.com/stoxum/stoxum-libjs/releases) and extract it.

#### 2. Install dependencies using NPM

You need to have [NPM (Node.js Package Manager) installed](#install-nodejs-and-npm) first.

Then, from within the `stoxum-libjs` directory, you can use NPM to install all the necessary dependencies:

```
npm install
```

(We recommend _not_ using `npm -g` to install dependencies globally.)

This can take a while, and may include some warnings. The following warnings are benign and do not indicate a problem:

```
npm WARN optional Skipping failed optional dependency /chokidar/fsevents:
npm WARN notsup Not compatible with your operating system or architecture: fsevents@1.0.6
```

#### 3. Use Gulp to build a single JavaScript output

StoxumAPI comes with code to use the [gulp](http://gulpjs.com/) package to compile all its source code into browser-compatible JavaScript files. Gulp is automatically installed as one of the dependencies, so all you have to do is run it. StoxumAPI's configuration makes this easy:

```
npm run build
```

Output:

```
> stoxum-libjs@0.16.5 build /home/username/stoxum-libjs
> gulp

[15:22:30] Using gulpfile /home/username/stoxum-libjs/Gulpfile.js
[15:22:30] Starting 'build'...
[15:22:30] Starting 'build-debug'...
[15:22:42] Finished 'build' after 12 s
[15:22:42] Starting 'build-min'...
[15:22:42] Finished 'build-debug' after 12 s
[15:22:51] Finished 'build-min' after 9.83 s
[15:22:51] Starting 'default'...
[15:22:51] Finished 'default' after 4.58 μs
```

This may take a while. At the end, the build process creates a new `build/` folder, which contains the files you want.

The file `build/stoxum-<VERSION NUMBER>.js` is a straight export of StoxumAPI (whatever version you built) ready to be used in browsers. The file ending in `-min.js` is the same thing, but with the content [minified](https://en.wikipedia.org/wiki/Minification_%28programming%29) for faster loading.

## Example Browser Usage

The following HTML file demonstrates basic usage of the browser version of StoxumAPI to connect to a public `stoxumd` server and report information about that server. Instead of using Node.js's "require" syntax, the browser version creates a global variable named `stoxum`, which contains the `StoxumAPI` class.

To use this example, you must first [build StoxumAPI](#build-instructions) and then copy one of the resulting output files to the same folder as this HTML file. (You can use either the minified or full-size version.) Change the first `<script>` tag in this example to use the correct file name for the version of StoxumAPI you built.

[**browser-demo.html:**](https://github.com/stoxum/stoxum-dev-portal/blob/master/content/code_samples/stoxumapi_quickstart/browser-demo.html "Source on GitHub")

```
{% include 'code_samples/stoxumapi_quickstart/browser-demo.html' %}
```
