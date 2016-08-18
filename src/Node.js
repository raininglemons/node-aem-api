class Node {
  constructor(aem, path, config) {
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
        if (config[item]['jcr:primaryType'] !== undefined || (config[item] instanceof Object && !(config[item] instanceof Array))) {
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
  relativeToAbsolute(path) {
    const parts = (this._config.path + '/' + path).replace(/\/\//g, '/').split('/').filter(part => part !== '.');
    let i = 0;
    for (i = 0; i < parts.length; i++) {
      while (parts[i + 1] === '..') {
        parts.splice(i, 2);
      }
    }
    return parts.join('/');
  }

  /**
   * Returns an object of properties
   * @returns {Promise}
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
   * @returns {Promise}
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
   * @returns {*}
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
   * @returns {Promise|*}
   */
  createChild(path, type = 'nt:unstructured', props = {}) {
    return this._config.aem.createNode(this.relativeToAbsolute(path), type, props);
  }

  /**
   * Moves a child node
   * @todo fix destination...
   * @param path
   * @param destination
   * @returns {*|Promise}
   */
  moveChild(path, destination) {
    return this._config.aem.moveNode(this.relativeToAbsolute(path), this.relativeToAbsolute(destination));
  }

  /**
   * Removes a child node
   * @param path
   * @returns {Promise|*}
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
   * @returns {*|Promise}
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
   * @returns {*|Promise}
   */
  updateFile(path, file, encoding, mimeType = 'application/octet-stream') {
    return this._config.aem.updateFile(this.relativeToAbsolute(path), file, encoding, mimeType);
  }

  /**
   * Removes a file relative to current node
   * @param path
   * @returns {*|Promise}
   */
  removeFile(path) {
    return this._config.aem.removeFile(this.relativeToAbsolute(path));
  }

  /**
   * Moves current node
   * @todo fix destination
   * @param destination
   * @returns {*|Promise}
   */
  move(destination) {
    if (destination.substr(0, 1) !== '/') {
      /*const pathParts = this._config.path.split('/');
      pathParts.splice(pathParts.length - 1);

      destination = `${pathParts.join('/')}/${destination}`;*/
      destination = this.relativeToAbsolute('../' + destination);
    }
    return this._config.aem.moveNode(this._config.path, destination);
  }

  /**
   * Removes current node from repo
   * @returns {Promise|*}
   */
  remove() {
    return this._config.aem.removeNode(this._config.path);
  }

  /**
   * Initializes the node with props (some nodes can be constructed without props for an efficient "lazyload"). May
   * be called on construct if config is provided, else is populated on demand.
   * @private
   * @returns {Promise}
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

/**
 * Parses props and children config
 * @private
 * @param config
 * @returns {{props: {}, children: {}}}
 */
function parseProps(config) {
  const props = {};
  const children = {};

  Object.keys(config)
    .filter(item => item.substr(0, 1) !== ':')
    .forEach(item => {
      if (config[item]['jcr:primaryType'] !== undefined || (config[item] instanceof Object && !(config[item] instanceof Array))) {
        /*
        Item is node
         */
        children[item] = config[item];
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

  return { props, children };
}

module.exports = Node;