/**
 * @class
 */
class Node {
  /**
   * Node class, shouldn't be instantiate manually.
   * @private
   * @param aem instance of aem object
   * @param path path of node
   * @param [config=null] config for node
   */
  constructor(aem, path, config=null) {
    this._config = { path, aem };

    if (config) {
      this.parseProps(config);
    }

    /*
    Add all useful fns from aem object
     */
    /*[
      'setProperties',
      'setProperty',
      'removeProperties',
      'removeProperty',
    ].forEach(fn => {
      this[fn] = aem[fn].bind(aem, path);
    });*/
  }

  /**
   * Parse props and children config
   * @private
   * @param config
   */
  parseProps(config) {
    const props = {};
    const children = {};

    Object.keys(config)
      .filter(item => item.substr(0, 1) !== ':')
      .forEach(item => {
        if (config[item]['jcr:primaryType'] !== undefined
          || (config[item] instanceof Object && !(config[item] instanceof Array))) {
          /*
           Item is node
           */
          children[item] = /*config[item]*/ new Node(
            this._config.aem,
            this.relativeToAbsolute(item),
            config[item]['jcr:primaryType'] !== undefined ? config[item] : undefined
          );
        } else {
          /*
           Item is prop
           */
          switch (config[':' + item]) {
            case 'Date':
              props[item] = new Date(config[item]);

            default:
              props[item] = config[item];
          }
        }
      });

    Object.freeze(props);
    Object.freeze(children);

    Object.assign(this._config, { props, children });
  }

  /**
   * Converts a link relative to the node to an absolute path
   * @private
   * @param path
   * @returns {string}
   */
  relativeToAbsolute(path, depth = 0) {
    if (path.substr(0, 1) === '/') {
      /*
        Already an absolute link
         */
      return path;
    }

    let prepend = '';
    for (let i = 0; i > depth; i--) {
      prepend += '../';
    }

    const parts = (this._config.path + '/' + prepend + path).replace(/\/\//g, '/').split('/').filter(part => part !== '.');
    for (let i = 0; i < parts.length; i++) {
      while (parts[i + 1] === '..') {
        parts.splice(i, 2);
      }
    }
    return parts.join('/');
  }

  /**
   * Sets properties on a node
   * @param props
   * @returns {Promise.<Node,Error>}
   */
  setProperties(props) {
    return this._config.aem.setProperties(this._config.path, props);
  }

  /**
   * Sets a property on a given node
   * @param prop
   * @param val
   * @returns {Promise.<Node,Error>}
   */
  setProperty(prop, val) {
    return this._config.aem.setProperty(this._config.path, prop, val);
  }

  /**
   * Removes properties from a node
   * @param {Array<String>} props
   * @returns {Promise.<Node,Error>}
   */
  removeProperties(props) {
    return this._config.aem.removeProperties(this._config.path, props);
  }

  /**
   * Removes a property from a node
   * @param prop
   * @returns {Promise.<Node,Error>}
   */
  removeProperty(prop) {
    return this._config.aem.removeProperty(this._config.path, prop);
  }

  /**
   * Returns an object of properties
   * @returns {Promise.<Object,Error>}
   */
  getProperties() {
    return new Promise((res, rej) => {
      this.initializeNode()
        .then(node => res(node._config.props))
        .catch(rej);
    })
  }

  /**
   * Returns an object of child nodes
   * @returns {Promise.<Object,Error>}
   */
  getChildren() {
    return new Promise((res, rej) => {
      this.initializeNode()
        .then(node => res(node._config.children))
        .catch(rej);
    })
  }

  /**
   * Returns a child node
   * @param path
   * @returns {Promise.<Node,Error>}
   */
  getChild(path) {
    /*
    See if we already have the meta data for this child...
     */
    const levels = path.split('/');

    const directChild = levels.splice(0, 1)[0];
    const relativePath = levels.join('/');

    let child = this._config.children[directChild];
    if (child && child['jcr:primaryType'] !== undefined) {
      return new Promise((res, rej) => {
        if (!(child instanceof Node)) {
          /*
          We have a config
           */
          child = new Node(this._config.aem, this.relativeToAbsolute(directChild)/*`${this._config.path}/${directChild}`*/, child);

          const newChildren = {};
          newChildren[directChild] = child;

          this._config.children = Object.assign({}, this._config.children, newChildren);
        }

        if (relativePath) {
          res(child.getChild(relativePath));
        } else {
          res(child);
        }
      });
    } else {
      return this._config.aem.getNode(this.relativeToAbsolute(path)/*this._config.path + '/' + path*/);
    }
  }

  /**
   * Creates a child node
   * @param path
   * @param type
   * @param props
   * @returns {Promise.<Node,Error>}
   */
  createChild(path, type = 'nt:unstructured', props = {}) {
    return this._config.aem.createNode(this.relativeToAbsolute(path), type, props);
  }

  /**
   * Moves a child node, returns the child node
   * @param path
   * @param destination
   * @returns {Promise.<Node,Error>}
   */
  moveChild(path, destination) {
    return this._config.aem.moveNode(this.relativeToAbsolute(path), this.relativeToAbsolute(destination, -1));
  }

  /**
   * Removes a child node
   * @param path
   * @returns {Promise.<null,Error>}
   */
  removeChild(path) {
    return this._config.aem.removeNode(this.relativeToAbsolute(path));
  }

  /**
   * Creates a file relative to current node, returns new nt:file node
   * @param path
   * @param file
   * @param encoding
   * @param mimeType
   * @returns {Promise.<Node,Error>}
   */
  createFile(path, file, encoding, mimeType = 'application/octet-stream') {
    return this._config.aem.createFile(this.relativeToAbsolute(path), file, encoding, mimeType);
  }

  /**
   * Updates a file relative to current node, returns nt:file node
   * @param path
   * @param file
   * @param encoding
   * @param mimeType
   * @returns {Promise.<Node,Error>}
   */
  updateFile(path, file, encoding, mimeType = 'application/octet-stream') {
    return this._config.aem.updateFile(this.relativeToAbsolute(path), file, encoding, mimeType);
  }

  /**
   * Removes a file relative to current node
   * @param path
   * @returns {Promise.<null,Error>}
   */
  removeFile(path) {
    return this._config.aem.removeFile(this.relativeToAbsolute(path));
  }

  /**
   * Creates an asset relative to current node, returns new nt:file node
   * @param path
   * @param file
   * @param mimeType
   * @returns {Promise.<Node,Error>}
   */
  createAsset(path, file, mimeType) {
    return this._config.aem.createAsset(this.relativeToAbsolute(path), file, mimeType);
  }

  /**
   * Updates an asset relative to current node, returns nt:file node
   * @param path
   * @param file
   * @param mimeType
   * @returns {Promise.<Node,Error>}
   */
  updateAsset(path, file, mimeType) {
    return this._config.aem.updateAsset(this.relativeToAbsolute(path), file, mimeType);
  }

  /**
   * Removes an asset relative to current node
   * @param path
   * @returns {Promise.<null,Error>}
   */
  removeAsset(path) {
    return this._config.aem.removeAsset(this.relativeToAbsolute(path));
  }

  /**
   * Moves current node, returns updated node
   * @param destination
   * @returns {Promise.<Node,Error>}
   */
  move(destination) {
    return this._config.aem.moveNode(this._config.path, this.relativeToAbsolute(destination, -1));
  }

  /**
   * Removes current node from repo
   * @returns {Promise.<null,Error>}
   */
  remove() {
    return this._config.aem.removeNode(this._config.path);
  }

  /**
   * Activates node to pub instance
   * @param [treeActivation=false]
   * @param [onlyModified=true]
   * @param [ignoreDeactivated=true]
   * @returns {Promise.<Node,Error>}
   */
  activate(...args) {
    return this._config.aem.activateNode(this._config.path, ...args);
  }

  /**
   * Deactivates node
   * @returns {Promise.<Node,Error>}
   */
  deactivate() {
    return this._config.aem.deactivateNode(this._config.path);
  }

  /**
   * Initializes the node with props (some nodes can be constructed without props for an efficient "lazyload"). May
   * be called on construct if config is provided, else is populated on demand.
   * @private
   * @returns {Promise.<Node,Error>}
   */
  initializeNode() {
    if (this._config.props) {
      /*
      Already init'd
       */
      return new Promise(res => res(this));
    } else {
      /*
      Init with props
       */
      return new Promise((res, rej) => {
        this.aem.getNode(this._config.path)
          .then(node => {
            Object.assign(this._config, node._config);
            res(this);
          })
          .catch(rej);
      });
    }
  }
}

module.exports = Node;