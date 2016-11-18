# node-aem-api

> Warning this is under development. Tests are sparse or incomplete. Use at your own peril.

## Installation

```bash
npm install --save-dev aem-api
```

## Usage

Initialize and instance of `aem-api` with you credentials, then call any of the listed methods. They
will all return a promise.

```javascript
const AEM = require('aem-api');

const aem = new AEM('http://localhost', 4502, 'admin', 'admin');

aem.createNode('/tmp/myNode')
  .then(_ => {
    console.log('Node successfully created')
  })
  .catch(e => {
    console.error('Problem creating node', e);
  })
```

## Best Practises

This api returns promises by design even a synchronous response would suffice for ease of use, mainly with generators in
mind. With this, it is recommended to use generators where possible for cleaner more readable code.

```javascript
const AEM = require('aem-api');

const aem = new AEM('http://localhost', 4502, 'admin', 'admin');

const runner = function *() {
  const myNode = yield aem.createNode('/tmp/myNode');
  
  yield myNode.activate;
  
  console.warn(`Created my node and activated it, yay, pub o'clock?`);
}
```

## Todo

1. ~~Change almost all response that return a promise to the http response. They're pretty much useless and should
remain "behind closed doors". You only want a node object to mess with or an error. Then promise chaining becomes
a lot more viable.~~
1. Tests
1. Economise on http requests where possible (Node#getProperties i'm looking at you...)
1. Ability to lock and unlock nodes

## API

> HTML documentation can be [viewed here](https://cdn.rawgit.com/raininglemons/node-aem-api/3cae74082f172e62b5e70f5f0be94899038e4b8d/documentation/index.html)
