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

## Todo

1. Change almost all response that return a promise to the http response. They're pretty much useless and should
remain "behind closed doors". You only want a node object to mess with or an error. Then promise chaining becomes
a lot more viable.
1. Tests

## API

> HTML documentation can be [viewed here](https://cdn.rawgit.com/raininglemons/node-aem-api/master/documentation/index.html)

# AEM

## constructor

Primes the AEM object for instance manipulation

**Parameters**

-   `host`  
-   `port`  
-   `username`  
-   `password`  

## createNode

Creates a node at a given path

**Parameters**

-   `path`  
-   `type`  
-   `props`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling), [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## moveNode

Move node to a new path

**Parameters**

-   `path`  
-   `destination`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling), [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## removeNode

Removes a node at a given path

**Parameters**

-   `path`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;null, [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## getNode

Fetchs a node from the repo

**Parameters**

-   `path`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling), [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## setProperties

Sets properties on a node

**Parameters**

-   `path`  
-   `props`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling), [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## setProperty

Sets a property on a given node

**Parameters**

-   `path`  
-   `prop`  
-   `val`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling), [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## removeProperties

Removes properties from a node

**Parameters**

-   `path`  
-   `props` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** 

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling), [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## removeProperty

Removes a property from a node

**Parameters**

-   `path`  
-   `prop`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling), [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## createFile

Creates an nt:file

**Parameters**

-   `path` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `file` **([String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Buffer](https://nodejs.org/api/buffer.html) | fs.ReadStream)** 
-   `encoding` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `mimeType` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]**  (optional, default `application/octet-stream`)

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling), [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## updateFile

Updates an nt:file

**Parameters**

-   `path` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `file` **([String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Buffer](https://nodejs.org/api/buffer.html) | fs.ReadStream)** 
-   `encoding` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `mimeType` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]**  (optional, default `application/octet-stream`)
-   `createMode` **\[[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)](default false)** are we creating a file, or just updating

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling), [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## moveFile

Move file to new destination

**Parameters**

-   `path`  
-   `destination`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling), [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## removeFile

Removes an nt:file at a given path

**Parameters**

-   `path`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;null, [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## activateNode

Activates a node to pub instance

**Parameters**

-   `path`  
-   `treeActivation`   (optional, default `false`)
-   `onlyModified`   (optional, default `true`)
-   `ignoreDeactivated`   (optional, default `true`)

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling), [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## deactivateNode

Deactivates a node

**Parameters**

-   `path`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling), [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

# Node

## setProperties

Sets properties on a node

**Parameters**

-   `props`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling), [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## setProperty

Sets a property on a given node

**Parameters**

-   `prop`  
-   `val`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling), [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## removeProperties

Removes properties from a node

**Parameters**

-   `props` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** 

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling), [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## removeProperty

Removes a property from a node

**Parameters**

-   `prop`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling), [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## getProperties

Returns an object of properties

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## getChildren

Returns an object of child nodes

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## getChild

Returns a child node

**Parameters**

-   `path`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling), [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## createChild

Creates a child node

**Parameters**

-   `path`  
-   `type`  
-   `props`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling), [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## moveChild

Moves a child node, returns the child node

**Parameters**

-   `path`  
-   `destination`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling), [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## removeChild

Removes a child node

**Parameters**

-   `path`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;null, [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## createFile

Creates a file relative to current node, returns new nt:file node

**Parameters**

-   `path`  
-   `file`  
-   `encoding`  
-   `mimeType`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling), [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## updateFile

Updates a file relative to current node, returns nt:file node

**Parameters**

-   `path`  
-   `file`  
-   `encoding`  
-   `mimeType`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling), [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## removeFile

Removes a file relative to current node

**Parameters**

-   `path`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;null, [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## move

Moves current node, returns updated node

**Parameters**

-   `destination`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling), [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## remove

Removes current node from repo

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;null, [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## activate

Activates node to pub instance

**Parameters**

-   `treeActivation`   (optional, default `false`)
-   `onlyModified`   (optional, default `true`)
-   `ignoreDeactivated`   (optional, default `true`)
-   `args` **...Any** 

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling), [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 

## deactivate

Deactivates node

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling), [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)>** 
