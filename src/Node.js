class Node {
  /**
   * Node class, shouldn't be instantiate manually.
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
    [
      'setProperties',
      'setProperty',
      'removeProperties',
      'removeProperty',
    ].forEach(fn => {
      this[fn] = aem[fn].bind(aem, path);
    });
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
   * @returns {Promise.<Response,Error>}
   */
  createChild(path, type = 'nt:unstructured', props = {}) {
    return this._config.aem.createNode(this.relativeToAbsolute(path), type, props);
  }

  /**
   * Moves a child node
   * @param path
   * @param destination
   * @returns {Promise.<Response,Error>}
   */
  moveChild(path, destination) {
    return this._config.aem.moveNode(this.relativeToAbsolute(path), this.relativeToAbsolute(destination, -1));
  }

  /**
   * Removes a child node
   * @param path
   * @returns {Promise.<Response,Error>}
   */
  removeChild(path) {
    return this._config.aem.removeNode(this.relativeToAbsolute(path));
  }

  /**
   * Creates a file relative to current node
   * @param path
   * @param file
   * @param encoding
   * @param mimeType
   * @returns {Promise.<Response,Error>}
   */
  createFile(path, file, encoding, mimeType = 'application/octet-stream') {
    return this._config.aem.createFile(this.relativeToAbsolute(path), file, encoding, mimeType);
  }

  /**
   * Updates a file relative to current node
   * @param path
   * @param file
   * @param encoding
   * @param mimeType
   * @returns {Promise.<Response,Error>}
   */
  updateFile(path, file, encoding, mimeType = 'application/octet-stream') {
    return this._config.aem.updateFile(this.relativeToAbsolute(path), file, encoding, mimeType);
  }

  /**
   * Removes a file relative to current node
   * @param path
   * @returns {Promise.<Response,Error>}
   */
  removeFile(path) {
    return this._config.aem.removeFile(this.relativeToAbsolute(path));
  }

  /**
   * Moves current node
   * @param destination
   * @returns {Promise.<Response,Error>}
   */
  move(destination) {
    return this._config.aem.moveNode(this._config.path, this.relativeToAbsolute(destination, -1));
  }

  /**
   * Removes current node from repo
   * @returns {Promise.<Response,Error>}
   */
  remove() {
    return this._config.aem.removeNode(this._config.path);
  }

  /**
   * Activates node to pub instance
   * @param [treeActivation=false]
   * @param [onlyModified=true]
   * @param [ignoreDeactivated=true]
   * @returns {Promise.<Response,Error>}
   */
  activate(...args) {
    return this._config.aem.activateNode(this._config.path, ...args);
  }

  /**
   * Deactivates node
   * @returns {Promise.<Response,Error>}
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