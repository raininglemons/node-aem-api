# node-aem-api

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

## Todo

Change almost all response that return a promise to the http response. They're pretty much useless and should
remain "behind closed doors". You only want a node object to mess with or an error. Then promise chaining becomes
a lot more viable.