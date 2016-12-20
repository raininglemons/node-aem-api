// en_US/include/terms.html
const AEM = require('./index');
const fetch = require('isomorphic-fetch');
const exec = require('./generatorExec');
require('colors');

const findString = /com_blueprint/g;
const replaceString = 'thinkbingocom';

const aem = new AEM('http://ref.aem.bwinparty.corp', 4502, 'cashcadeuser', 'Ca$hcad3');

exec(function *() {
  const termsPath = '/content/bingo/thinkbingocom/en_US/include/terms/jcr:content/include';

  const termsNode = yield aem.getNode(termsPath);
  const childNodes = yield termsNode.getChildren();
  const childPaths = Object.keys(childNodes);

  for (let i = 0; i < childPaths.length; i++) {
    const currentPath = childPaths[i];
    const currentChild = childNodes[currentPath];
    const props = yield currentChild.getProperties();

    const keys = Object.keys(props);
    const changes = {};
    for (let ii = 0; ii < keys.length; ii++) {
      const key = keys[ii];
      const oldValue = props[key];

      if (!oldValue || typeof oldValue !== 'string') {
        continue;
      }

      const newValue = oldValue.replace(findString, replaceString);
      if (newValue != oldValue) {
        // console.log(` - ${key}: ${newValue}`.yellow);
        changes[key] = newValue.replace(/£/g, '&pound;');
      }
    }

    if (Object.keys(changes).length !== 0) {
      console.log(`Current Child: ${currentPath}`.blue);
      console.log(changes);
      yield currentChild.setProperties(changes);
      console.log(` - saved ${Object.keys(changes).length} properties`.green);
    } else {
      console.log(`Skipping Child: ${currentPath}`.yellow);
    }


    /* console.log('Props', props); /* */

    // throw new Error('die');
  }
});