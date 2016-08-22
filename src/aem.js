require('es6-promise').polyfill();
require('isomorphic-fetch');
const mime = require('mime-types');
const fs = require('fs');

const CRXPayload = require('./CRXPayload');
const Node = require('./Node');

const CRX_API_ENDPOINT = '/crx/server/crx.default/jcr%3aroot';
const TOKEN_API_ENDPOINT = '/libs/granite/csrf/token.json';
const CRX_REFERER = '/crx/de/index.jsp';
const ACTIVATION_TREE_API_ENDPOINT = '/etc/replication/treeactivation.html';
const REPLICATION_API_ENDPOINT = '/crx/de/replication.jsp';

/**
 * Verifies we have a successful response.
 * @private
 * @param response
 * @returns {*}
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

class AEM {
  /**
   * Primes the AEM object for instance manipulation
   * @param host
   * @param port
   * @param username
   * @param password
   */
  constructor(host, port, username, password) {
    Object.assign(this, {
      host,
      port,
      username,
      api: {
        crx: `${host}:${port}${CRX_API_ENDPOINT}`,
        token: `${host}:${port}${TOKEN_API_ENDPOINT}`,
        activate: {
          tree: `${host}:${port}${ACTIVATION_TREE_API_ENDPOINT}`,
        },
        replication: `${host}:${port}${REPLICATION_API_ENDPOINT}`,
      },
      referer: `${host}:${port}${CRX_REFERER}`,
      auth: new Buffer(`${username}:${password}`).toString('base64'),
      token: null,
    });
  }

  /**
   * Creates a node at a given path
   * @param path
   * @param type
   * @param props
   * @returns {Promise}
   */
  createNode(path, type = 'nt:unstructured', props = {}) {
    if (!path) {
      throw new TypeError('path required as first argument');
    }

    const payload = new CRXPayload()
      .createNode(path, type);

    Object.keys(props)
      .filter(prop => prop !== 'jcr:primaryType')
      .forEach(prop => {
        payload.setProperty(path, prop, props[prop])
      });

    // console.log(payload.toString());

    return this.postRequest(payload.getFormData());
  }

  /**
   * Move node to a new path
   * @param path
   * @param destination
   * @returns {Promise}
   */
  moveNode(path, destination) {
    if (!path) {
      throw new TypeError('current path required as first argument');
    }

    if (!destination) {
      throw new TypeError('destination path required as second argument');
    }

    const payload = new CRXPayload().moveNode(path, destination);

    // console.log(payload.toString());

    return this.postRequest(payload.getFormData());
  }

  /**
   * Removes a node at a given path
   * @param path
   * @returns {Promise}
   */
  removeNode(path) {
    if (!path) {
      throw new TypeError('path required as first argument');
    }

    const payload = new CRXPayload().removeNode(path);

    // console.log(payload.toString());

    return this.postRequest(payload.getFormData());
  }

  getNode(path) {
    if (!path) {
      throw new TypeError('path required as first argument');
    }

    return new Promise((res, rej) => {
      this.getRequest(path)
        .then(resp => resp.json())
        .then(config => res(new Node(this, path, config)))
        .catch(rej);
    })
  }

  /**
   * Sets properties on a node
   * @param path
   * @param props
   * @returns {Promise}
   */
  setProperties(path, props) {
    if (!path) {
      throw new TypeError('path required as first argument');
    }

    if (!props) {
      throw new TypeError('object of properties is required as second argument');
    }

    const payload = new CRXPayload();

    Object.keys(props).forEach(prop => {
      payload.setProperty(path, prop, props[prop])
    });

    // console.log(payload.toString())

    return this.postRequest(payload.getFormData());
  }

  /**
   * Sets a property on a given node
   * @param path
   * @param prop
   * @param val
   * @returns {Promise}
   */
  setProperty(path, prop, val) {
    if (!path) {
      throw new TypeError('path required as first argument');
    }

    if (!prop) {
      throw new TypeError('property name is required as second argument');
    }

    if (val === undefined) {
      throw new TypeError('property value cannot be undefined');
    }

    const props = {};
    props[prop] = val;

    return this.setProperties(path, props);
  }

  /**
   * Removes properties from a node
   * @param path
   * @param props
   * @returns {Promise}
   */
  removeProperties(path, props) {
    if (!path) {
      throw new TypeError('path required as first argument');
    }

    if (!props) {
      throw new TypeError('object of properties is required as second argument');
    }

    const payload = new CRXPayload();

    props.forEach(prop => {
      payload.removeProperty(path, prop)
    });

    // console.log(payload.toString());

    return this.postRequest(payload.getFormData());
  }

  /**
   * Removes a property from a node
   * @param path
   * @param prop
   * @returns {Promise}
   */
  removeProperty(path, prop) {
    if (!path) {
      throw new TypeError('path required as first argument');
    }

    if (!props) {
      throw new TypeError('object of properties is required as second argument');
    }

    return this.removeProperties(path, [prop]);
  }

  /**
   * Creates an nt:file
   * @param {String} path
   * @param {String | Buffer | fs.ReadStream} file
   * @param {String} encoding
   * @param {String} [mimeType=application/octet-stream]
   * @returns {Promise}
   */
  createFile(path, file, encoding, mimeType = 'application/octet-stream') {
    return this.updateFile(path, file, encoding, mimeType, true);
  }

  /**
   * Updates an nt:file
   * @param {String} path
   * @param {String | Buffer | fs.ReadStream} file
   * @param {String} encoding
   * @param {String} [mimeType=application/octet-stream]
   * @param {Boolean} createMode - are we creating a file, or just updating
   * @returns {Promise}
   */
  updateFile(path, file, encoding, mimeType = 'application/octet-stream', createMode = false) {
    if (!path) {
      throw new TypeError('path required as first argument');
    }

    if (!file) {
      throw new TypeError('file is required as second argument');
    }

    /*
     Treat strings as a path
     */
    if (typeof file === 'string') {
      return new Promise((res, rej) => {
        /*
         ReadStream is prefered, as Buffers can mess up images
         */
        const stream = fs.createReadStream(file, {encoding});
        /*
         Try and guess the mimetype
         */
        mimeType = mime.lookup(file) || mimeType;

        res(this.updateFile(path, stream, encoding, mimeType, createMode));
      })
    } else if (file instanceof Buffer || file instanceof fs.ReadStream) {
      /*
       First create the file
       */
      const jcrContentPath = `${path}/jcr:content`;
      const payload = new CRXPayload();

      if (createMode) {
        payload
          .createNode(path, 'nt:file')
          .createNode(jcrContentPath, 'nt:resource');
      }

      payload
        .setProperty(jcrContentPath, 'jcr:lastModified', new Date())
        .setProperty(jcrContentPath, 'jcr:lastModifiedBy', this.username)
        .setProperty(jcrContentPath, 'jcr:mimeType', mimeType)
        .setProperty(jcrContentPath, 'jcr:data', file);

      if (encoding) {
        payload.setProperty(jcrContentPath, 'jcr:encoding', encoding);
      }

      // console.log(payload.toString())

      return this.postRequest(payload.getFormData());
    } else {
      throw new TypeError('second argument must be either a path or a Buffer');
    }
  }

  /**
   * Move file to new destination
   * @param path
   * @param destination
   * @returns {Promise}
   */
  moveFile(path, destination) {
    return this.moveNode(path, destination);
  }

  /**
   * Removes an nt:file at a given path
   * @param path
   * @returns {Promise}
   */
  removeFile(path) {
    return this.removeNode(path);
  }

  /**
   * Retrieves a csfr token for a user
   * @private
   * @returns {Promise}
   */
  getToken() {
    return new Promise((res, rej) => {
      if (this.token) {
        res(this.token);
      } else {
        fetch(this.api.token, {headers: new Headers({'Authorization': `Basic ${this.auth}`})})
          .then(resp => resp.json())
          .then(resp => {
            if (resp.token) {
              res(this.token = resp.token);
            } else {
              rej(new Error('No token found from server response: ' + JSON.stringify(resp)));
            }
          })
          .catch(rej);
      }
    });
  }

  /**
   * Activates a node to pub instance
   * @param path
   * @param treeActivation
   * @param onlyModified
   * @param ignoreDeactivated
   * @returns {Promise}
   */
  activateNode(path, treeActivation=false, onlyModified=false, ignoreDeactivated=true) {
    return new Promise((res, rej) => {
      this.getToken()
        .then(TOKEN => {
          if (treeActivation) {
            /* Tree activation */

            const props = {
              path,
              _charset_: 'UTF-8',
              onlymodified: onlyModified,
              ignoredeactivated: ignoreDeactivated,
              cmd: 'activate',
              ':cq_csrf_token': TOKEN,
            };

            const body = Object.keys(props).map(key => {
              return encodeURIComponent(key) + '=' + encodeURIComponent(props[key]);
            }, {}).join('&');

            fetch(this.api.activate.tree, {
              method: 'POST',
              headers: new Headers({
                'Authorization': `Basic ${this.auth}`,
                'CSRF-Token': this.token,
                'Referer': this.referrer,
                'Content-Type': 'application/x-www-form-urlencoded',
              }),
              body: body,
            })
              .then(checkStatus)
              .then(res)
              .catch(rej);
          } else {
            /* Single node activation */

            const params = {
              path,
              _charset_: 'UTF-8',
              action: 'replicate',
            };

            this.replicationRequest(params)
              .then(checkStatus)
              .then(res)
              .catch(rej);
          }
        })
        .catch(rej);
    });
  }

  /**
   * Deactivates a node
   * @param path
   * @returns {Promise}
   */
  deactivateNode(path) {
    return new Promise((res, rej) => {
      const params = {
        path,
        _charset_: 'UTF-8',
        action: 'replicatedelete',
      };

      this.replicationRequest(params)
        .then(checkStatus)
        .then(res)
        .catch(rej);
    });
  }

  /**
   * Sends a replication request
   * @param params
   * @returns {Promise}
   */
  replicationRequest(params) {
    return new Promise((res, rej) => {
      this.getToken()
        .then(TOKEN => {
          params[':cq_csrf_token'] = TOKEN;

          const body = Object.keys(params).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
          }, {}).join('&');

          fetch(this.api.replication, {
            method: 'POST',
            headers: new Headers({
              'Authorization': `Basic ${this.auth}`,
              'CSRF-Token': this.token,
              'Referer': this.referrer,
              'Content-Type': 'application/x-www-form-urlencoded',
            }),
            body: body,
          })
            .then(checkStatus)
            .then(res)
            .catch(rej);
        })
        .catch(rej);
    });
  }

  /**
   * Send request to crx
   * @param formData
   * @returns {Promise}
   */
  postRequest(formData) {
    return new Promise((res, rej) => {
      this.getToken()
        .then(TOKEN => {
          fetch(this.api.crx, {
            method: 'POST',
            headers: new Headers({
              'Authorization': `Basic ${this.auth}`,
              'CSRF-Token': this.token,
              'Referer': this.referrer
            }),
            body: formData
          })
            .then(checkStatus)
            .then(res)
            .catch(rej);
        })
        .catch(rej);
    })
  }

  /**
   * Get node info form crx
   * @param path
   * @returns {Promise}
   */
  getRequest(path) {
    return new Promise((res, rej) => {
      this.getToken()
        .then(TOKEN => {
          fetch(this.api.crx + path + '.1.json', {
            method: 'GET',
            headers: new Headers({
              'Authorization': `Basic ${this.auth}`,
              'CSRF-Token': this.token,
              'Referer': this.referrer
            })
          })
            .then(checkStatus)
            .then(res)
            .catch(rej);
        })
        .catch(rej);
    })
  }
}

module.exports = AEM;
