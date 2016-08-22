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

## API

## Classes

<dl>
<dt><a href="#AEM">AEM</a></dt>
<dd></dd>
<dt><a href="#Node">Node</a></dt>
<dd></dd>
</dl>

<a name="AEM"></a>

## AEM
**Kind**: global class  

* [AEM](#AEM)
    * [new AEM(host, port, username, password)](#new_AEM_new)
    * [.createNode(path, type, props)](#AEM+createNode) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
    * [.moveNode(path, destination)](#AEM+moveNode) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
    * [.removeNode(path)](#AEM+removeNode) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
    * [.getNode(path)](#AEM+getNode) ⇒ <code>Promise.&lt;Node, Error&gt;</code>
    * [.setProperties(path, props)](#AEM+setProperties) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
    * [.setProperty(path, prop, val)](#AEM+setProperty) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
    * [.removeProperties(path, props)](#AEM+removeProperties) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
    * [.removeProperty(path, prop)](#AEM+removeProperty) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
    * [.createFile(path, file, encoding, [mimeType])](#AEM+createFile) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
    * [.updateFile(path, file, encoding, [mimeType], createMode)](#AEM+updateFile) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
    * [.moveFile(path, destination)](#AEM+moveFile) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
    * [.removeFile(path)](#AEM+removeFile) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
    * [.activateNode(path, [treeActivation], [onlyModified], [ignoreDeactivated])](#AEM+activateNode) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
    * [.deactivateNode(path)](#AEM+deactivateNode) ⇒ <code>Promise.&lt;Response, Error&gt;</code>

<a name="new_AEM_new"></a>

### new AEM(host, port, username, password)
Primes the AEM object for instance manipulation


| Param |
| --- |
| host | 
| port | 
| username | 
| password | 

<a name="AEM+createNode"></a>

### AEM.createNode(path, type, props) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
Creates a node at a given path

**Kind**: instance method of <code>[AEM](#AEM)</code>  

| Param | Default |
| --- | --- |
| path |  | 
| type | <code>nt:unstructured</code> | 
| props |  | 

<a name="AEM+moveNode"></a>

### AEM.moveNode(path, destination) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
Move node to a new path

**Kind**: instance method of <code>[AEM](#AEM)</code>  

| Param |
| --- |
| path | 
| destination | 

<a name="AEM+removeNode"></a>

### AEM.removeNode(path) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
Removes a node at a given path

**Kind**: instance method of <code>[AEM](#AEM)</code>  

| Param |
| --- |
| path | 

<a name="AEM+getNode"></a>

### AEM.getNode(path) ⇒ <code>Promise.&lt;Node, Error&gt;</code>
Fetchs a node from the repo

**Kind**: instance method of <code>[AEM](#AEM)</code>  

| Param |
| --- |
| path | 

<a name="AEM+setProperties"></a>

### AEM.setProperties(path, props) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
Sets properties on a node

**Kind**: instance method of <code>[AEM](#AEM)</code>  

| Param |
| --- |
| path | 
| props | 

<a name="AEM+setProperty"></a>

### AEM.setProperty(path, prop, val) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
Sets a property on a given node

**Kind**: instance method of <code>[AEM](#AEM)</code>  

| Param |
| --- |
| path | 
| prop | 
| val | 

<a name="AEM+removeProperties"></a>

### AEM.removeProperties(path, props) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
Removes properties from a node

**Kind**: instance method of <code>[AEM](#AEM)</code>  

| Param |
| --- |
| path | 
| props | 

<a name="AEM+removeProperty"></a>

### AEM.removeProperty(path, prop) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
Removes a property from a node

**Kind**: instance method of <code>[AEM](#AEM)</code>  

| Param |
| --- |
| path | 
| prop | 

<a name="AEM+createFile"></a>

### AEM.createFile(path, file, encoding, [mimeType]) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
Creates an nt:file

**Kind**: instance method of <code>[AEM](#AEM)</code>  

| Param | Type | Default |
| --- | --- | --- |
| path | <code>String</code> |  | 
| file | <code>String</code> &#124; <code>Buffer</code> &#124; <code>fs.ReadStream</code> |  | 
| encoding | <code>String</code> |  | 
| [mimeType] | <code>String</code> | <code>application/octet-stream</code> | 

<a name="AEM+updateFile"></a>

### AEM.updateFile(path, file, encoding, [mimeType], createMode) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
Updates an nt:file

**Kind**: instance method of <code>[AEM](#AEM)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| path | <code>String</code> |  |  |
| file | <code>String</code> &#124; <code>Buffer</code> &#124; <code>fs.ReadStream</code> |  |  |
| encoding | <code>String</code> |  |  |
| [mimeType] | <code>String</code> | <code>application/octet-stream</code> |  |
| createMode | <code>Boolean</code> | <code>false</code> | are we creating a file, or just updating |

<a name="AEM+moveFile"></a>

### AEM.moveFile(path, destination) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
Move file to new destination

**Kind**: instance method of <code>[AEM](#AEM)</code>  

| Param |
| --- |
| path | 
| destination | 

<a name="AEM+removeFile"></a>

### AEM.removeFile(path) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
Removes an nt:file at a given path

**Kind**: instance method of <code>[AEM](#AEM)</code>  

| Param |
| --- |
| path | 

<a name="AEM+activateNode"></a>

### AEM.activateNode(path, [treeActivation], [onlyModified], [ignoreDeactivated]) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
Activates a node to pub instance

**Kind**: instance method of <code>[AEM](#AEM)</code>  

| Param | Default |
| --- | --- |
| path |  | 
| [treeActivation] | <code>false</code> | 
| [onlyModified] | <code>true</code> | 
| [ignoreDeactivated] | <code>true</code> | 

<a name="AEM+deactivateNode"></a>

### AEM.deactivateNode(path) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
Deactivates a node

**Kind**: instance method of <code>[AEM](#AEM)</code>  

| Param |
| --- |
| path | 

<a name="Node"></a>

## Node
**Kind**: global class  

* [Node](#Node)
    * [new Node(aem, path, [config])](#new_Node_new)
    * [.getProperties()](#Node+getProperties) ⇒ <code>Promise.&lt;Object, Error&gt;</code>
    * [.getChildren()](#Node+getChildren) ⇒ <code>Promise.&lt;Object, Error&gt;</code>
    * [.getChild(path)](#Node+getChild) ⇒ <code>Promise.&lt;Node, Error&gt;</code>
    * [.createChild(path, type, props)](#Node+createChild) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
    * [.moveChild(path, destination)](#Node+moveChild) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
    * [.removeChild(path)](#Node+removeChild) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
    * [.createFile(path, file, encoding, mimeType)](#Node+createFile) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
    * [.updateFile(path, file, encoding, mimeType)](#Node+updateFile) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
    * [.removeFile(path)](#Node+removeFile) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
    * [.move(destination)](#Node+move) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
    * [.remove()](#Node+remove) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
    * [.activate([treeActivation], [onlyModified], [ignoreDeactivated])](#Node+activate) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
    * [.deactivate()](#Node+deactivate) ⇒ <code>Promise.&lt;Response, Error&gt;</code>

<a name="new_Node_new"></a>

### new Node(aem, path, [config])
Node class, shouldn't be instantiate manually.


| Param | Default | Description |
| --- | --- | --- |
| aem |  | instance of aem object |
| path |  | path of node |
| [config] | <code></code> | config for node |

<a name="Node+getProperties"></a>

### node.getProperties() ⇒ <code>Promise.&lt;Object, Error&gt;</code>
Returns an object of properties

**Kind**: instance method of <code>[Node](#Node)</code>  
<a name="Node+getChildren"></a>

### node.getChildren() ⇒ <code>Promise.&lt;Object, Error&gt;</code>
Returns an object of child nodes

**Kind**: instance method of <code>[Node](#Node)</code>  
<a name="Node+getChild"></a>

### node.getChild(path) ⇒ <code>Promise.&lt;Node, Error&gt;</code>
Returns a child node

**Kind**: instance method of <code>[Node](#Node)</code>  

| Param |
| --- |
| path | 

<a name="Node+createChild"></a>

### node.createChild(path, type, props) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
Creates a child node

**Kind**: instance method of <code>[Node](#Node)</code>  

| Param | Default |
| --- | --- |
| path |  | 
| type | <code>nt:unstructured</code> | 
| props |  | 

<a name="Node+moveChild"></a>

### node.moveChild(path, destination) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
Moves a child node

**Kind**: instance method of <code>[Node](#Node)</code>  

| Param |
| --- |
| path | 
| destination | 

<a name="Node+removeChild"></a>

### node.removeChild(path) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
Removes a child node

**Kind**: instance method of <code>[Node](#Node)</code>  

| Param |
| --- |
| path | 

<a name="Node+createFile"></a>

### node.createFile(path, file, encoding, mimeType) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
Creates a file relative to current node

**Kind**: instance method of <code>[Node](#Node)</code>  

| Param | Default |
| --- | --- |
| path |  | 
| file |  | 
| encoding |  | 
| mimeType | <code>application/octet-stream</code> | 

<a name="Node+updateFile"></a>

### node.updateFile(path, file, encoding, mimeType) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
Updates a file relative to current node

**Kind**: instance method of <code>[Node](#Node)</code>  

| Param | Default |
| --- | --- |
| path |  | 
| file |  | 
| encoding |  | 
| mimeType | <code>application/octet-stream</code> | 

<a name="Node+removeFile"></a>

### node.removeFile(path) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
Removes a file relative to current node

**Kind**: instance method of <code>[Node](#Node)</code>  

| Param |
| --- |
| path | 

<a name="Node+move"></a>

### node.move(destination) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
Moves current node

**Kind**: instance method of <code>[Node](#Node)</code>  

| Param |
| --- |
| destination | 

<a name="Node+remove"></a>

### node.remove() ⇒ <code>Promise.&lt;Response, Error&gt;</code>
Removes current node from repo

**Kind**: instance method of <code>[Node](#Node)</code>  
<a name="Node+activate"></a>

### node.activate([treeActivation], [onlyModified], [ignoreDeactivated]) ⇒ <code>Promise.&lt;Response, Error&gt;</code>
Activates node to pub instance

**Kind**: instance method of <code>[Node](#Node)</code>  

| Param | Default |
| --- | --- |
| [treeActivation] | <code>false</code> | 
| [onlyModified] | <code>true</code> | 
| [ignoreDeactivated] | <code>true</code> | 

<a name="Node+deactivate"></a>

### node.deactivate() ⇒ <code>Promise.&lt;Response, Error&gt;</code>
Deactivates node

**Kind**: instance method of <code>[Node](#Node)</code>  
