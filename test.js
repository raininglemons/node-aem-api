const AEM = require('./index');

/**
 * Tests, we will get round to unit tests at some point :D
 */

const aem = new AEM('http://localhost', 4502, 'admin', 'admin');
/*
aem
//.createNode('/etc/designs/clientlibs/sites/foxybingocom/img', 'nt:folder')
//.then(_ => aem.createFile('/etc/designs/clientlibs/sites/foxybingocom/img/test.png', './L_C24E.tmp.PNG'))
//.then(_ => aem.createFile('/etc/designs/clientlibs/sites/foxybingocom/img/test.jpg', './baby octopus.jpg'))
//.createFile('/etc/designs/clientlibs/sites/foxybingocom/test2.js', fs.readFileSync('./index.js'))
//.updateFile('/etc/designs/clientlibs/sites/foxybingocom/test2.js', './aem.js')
//.removeFile('/etc/designs/clientlibs/sites/foxybingocom/test2.js')
//.createFile('/etc/designs/clientlibs/sites/foxybingocom/img/test.png', './L_C24E.tmp.PNG')
//  .updateFile('/etc/designs/clientlibs/sites/foxybingocom/img/aem.js', './test.js')
//  .moveFile('/etc/designs/clientlibs/sites/bwining2.jpg', '/etc/designs/clientlibs/sites/bwining.jpg')
  .getNode('/')
  .then(node => node.getChild('etc'))
  .then(node => {
    //console.log('Awesome success', node);
    return node.getChild('designs/clientlibs/sites');
  })
  .then(node => {
    //console.log('Awesome success', node);
    return node.getChild('bwining.jpg');
  })
  /*.then(node => {
    //console.log('Awesome success', node);
    return node.updateFile('test.js', './test.js');
  })*//*
  .then(node => node.move('test.jpg'))
  .then(children => console.log('Awesome success'/*, children*//*))
  .catch(e => console.error(e));*/

  aem.getNode('/content/dam/catalogs')
    .then(node => node.activate(true, false, false))
    .then(_ => console.log('success'))
    .catch(e => console.error(e));