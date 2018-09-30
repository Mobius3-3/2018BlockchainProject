const level = require('level');
const chainDB = './testdata';
const db = level(chainDB,{valueEncoding:'json'});

function addLevelDBData(key,value){
    db.put(key, value, function(err) {
      if (err) return console.log('Block ' + key + ' submission failed', err);
    })
  }
  
  // Get data from levelDB with key
  function getLevelDBData(key){
    db.get(key, function(err, value) {
      if (err) return console.log('Not found!', err);
      console.log('Value = ' + value);
    })
  }
  