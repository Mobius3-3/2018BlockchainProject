process:

1.define a Blockchain class - Blockchain

2.run constructor()
    'height':0
    0:genesis Block
    blockHeightList = [0]
    blockList = [{genesis Block}]

3.run addBlock(new Block("test"+i))
    height = 0
    newBlock.height = 1

    function addDataToLevelDB(value) {
        let i = 0;
        db.createReadStream().on('data', function(data) {
              i++;
            }).on('error', function(err) {
                return console.log('Unable to read data stream!', err)
            }).on('close', function() {
              console.log('Block #' + i);
              addLevelDBData(i, value);
            });
    }

    (function theLoop (i) {
        setTimeout(function () {
          addDataToLevelDB('Testing data');
          if (--i) theLoop(i);
        }, 100);
      })(10);