//for test
var level = require('level')

var db = level('./db',{ valueEncoding: 'json'})
/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');


/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
  constructor(){
    this.chain = [];
    this.addBlock(new Block("First block in the chain - Genesis block"));
    db.put('block'+'0',thi.chain[0]);

  }

 
  addBlock(newBlock){

    newBlock.height = this.chain.length;

    newBlock.time = new Date().getTime().toString().slice(0,-3);

    if(this.chain.length>0){
      newBlock.previousBlockHash = this.chain[this.chain.length-1].hash;
    }

    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

  	db.put('block'+'newBlock.height',this.chain[newBlock.height], function (err) {
      if (err) return console.log('Block ' + key + ' submission failed', err);
    })
  }
}
