const FormData = require('form-data');
const fs = require('fs');

/**
 * Build FormData object
 * @private
 */
class CRXPayload {
  constructor() {
    this.data = [];
    this.formData = new FormData();
  }

  createNode(path, primaryType='nt:unstructured') {
    if (!path) {
      throw new TypeError('path required as first argument');
    }

    const description = JSON.stringify({ 'jcr:primaryType': primaryType });

    this.data.push(`+${path} : ${description}`);
    return this;
  }

  moveNode(path, destination) {
    if (!path) {
      throw new TypeError('current path required as first argument');
    }

    if (!destination) {
      throw new TypeError('destination path required as second argument');
    }

    this.data.push(`>${path} : ${destination}`);
    return this;
  }

  removeNode(path) {
    if (!path) {
      throw new TypeError('path required as first argument');
    }

    this.data.push(`-${path} : `);
    return this;
  }

  setProperty(path, property, value='') {
    if (!path) {
      throw new TypeError('path required as first argument');
    }

    if (!property) {
      throw new TypeError('property name required as second argument');
    }

    let description = '';
    if (value instanceof Date) {
      this.formData.append(`${path}/${property}`, Buffer.from(value.toISOString(), 'utf8'), { contentType: 'jcr-value/date' });
    } else if (value instanceof Buffer || value instanceof fs.ReadStream) {
      this.formData.append(`${path}/${property}`, value, { contentType: 'jcr-value/binary' });
    } else {
      description = JSON.stringify(value);
    }

    this.data.push(`^${path}/${property} : ${description}`);
    return this;
  }

  removeProperty(path, property) {
    if (!path) {
      throw new TypeError('path required as first argument');
    }

    if (!property) {
      throw new TypeError('property name required as second argument');
    }

    this.data.push(`-${path}/${property} : `);
    return this;
  }

  getFormData() {
    this.formData.append(':diff', this.data.join('\n'));
    return this.formData;
  }

  toString() {
    return this.data.join('\n');
  }
}

module.exports = CRXPayload;