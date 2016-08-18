class Node {
  constructor(aem, path, config) {
    this._config = { path, aem };

    if (config) {
      Object.assign(this._config, parseProps(config));
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

  listProperties() {
    return new Promise((res, rej) => {
      this.initializeNode()
        .then(node => res(Object.keys(node._config.props)))
        .catch(rej);
    })
  }

  listChildren() {
    return new Promise((res, rej) => {
      this.initializeNode()
        .then(node => res(Object.keys(node._config.children)))
        .catch(rej);
    })
  }

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
          child = new Node(this._config.aem, `${this._config.path}/${directChild}`, child);

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
      return this._config.aem.getNode(this._config.path + '/' + path);
    }
  }

  createChild(path, type = 'nt:unstructured', props = {}) {
    return this._config.aem.createNode(this._config.path + '/' + path, type, props);
  }

  moveChild(path, destination) {
    return this._config.aem.moveNode(this._config.path + '/' + path, destination);
  }

  removeChild(path) {
    return this._config.aem.removeNode(this._config.path + '/' + path);
  }

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