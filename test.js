const AEM = require('./index');

/**
 * Tests, we will get round to unit tests at some point :D
 */

/* Run code "synchronously" as a generator */
require('./generatorExec')(function *() {
  const aem = new AEM('http://localhost', 4502, 'admin', 'admin', { useToken: false });

  const dam = yield aem.getNode('/content/dam');

  console.log('got dam');

  const img1 = yield dam.createAsset('pokemon.png', 'pikachu.png');

  console.log('created first asset');

  yield img1.move('pokemon2.png');

  console.log('moved first asset');

  const img2 = yield dam.createAsset('pokemon.png', 'pikachu.png');

  console.log('made second asset');

  yield dam.updateAsset('pokemon.png', 'squirtle.png');

  console.log('updated second asset');

  yield dam.removeAsset('pokemon.png');
  yield dam.removeAsset('pokemon2.png');

  console.log('success');
});