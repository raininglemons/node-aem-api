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

## API Usage

### constructor

Primes the AEM object for instance manipulation

**Parameters**

-   `host`  
-   `port`  
-   `username`  
-   `password`  

### createNode

Creates a node at a given path

**Parameters**

-   `path`  
-   `type`  
-   `props`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

### moveNode

Move node to a new path

**Parameters**

-   `path`  
-   `destination`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

### removeNode

Removes a node at a given path

**Parameters**

-   `path`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

### setProperties

Sets properties on a node

**Parameters**

-   `path`  
-   `props`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

### setProperty

Sets a property on a given node

**Parameters**

-   `path`  
-   `prop`  
-   `val`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

### removeProperties

Removes properties from a node

**Parameters**

-   `path`  
-   `props`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

### removeProperty

Removes a property from a node

**Parameters**

-   `path`  
-   `prop`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

### createFile

Creates an nt:file

**Parameters**

-   `path` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `file` **([String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Buffer](https://nodejs.org/api/buffer.html) | fs.ReadStream)** 
-   `encoding` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `mimeType` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]**  (optional, default `application/octet-stream`)

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

### updateFile

Updates an nt:file

**Parameters**

-   `path` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `file` **([String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Buffer](https://nodejs.org/api/buffer.html) | fs.ReadStream)** 
-   `encoding` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `mimeType` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]**  (optional, default `application/octet-stream`)
-   `createMode` **\[[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)](default false)** are we creating a file, or just updating

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

### moveFile

Move file to new destination

**Parameters**

-   `path`  
-   `destination`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

### removeFile

Removes an nt:file at a given path

**Parameters**

-   `path`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

### postRequest

Send request to crx

**Parameters**

-   `formData`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

### getRequest

Get node info form crx

**Parameters**

-   `path`  

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

### getProperties

Returns an object of properties

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

### getChildren

Returns an object of child nodes

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

### getChild

Returns a child node

**Parameters**

-   `path`  

Returns **Any** 

### createChild

Creates a child node

**Parameters**

-   `path`  
-   `type`  
-   `props`  

Returns **([Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | Any)** 

### moveChild

Moves a child node

**Parameters**

-   `path`  
-   `destination`  

Returns **(Any | [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise))** 

### removeChild

Removes a child node

**Parameters**

-   `path`  

Returns **([Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | Any)** 

### createFile

Creates a file relative to current node

**Parameters**

-   `path`  
-   `file`  
-   `encoding`  
-   `mimeType`  

Returns **(Any | [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise))** 

### updateFile

Updates a file relative to current node

**Parameters**

-   `path`  
-   `file`  
-   `encoding`  
-   `mimeType`  

Returns **(Any | [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise))** 

### removeFile

Removes a file relative to current node

**Parameters**

-   `path`  

Returns **(Any | [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise))** 

### move

Moves current node

**Parameters**

-   `destination`  

Returns **(Any | [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise))** 

### remove

Removes current node from repo

Returns **([Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | Any)** 
