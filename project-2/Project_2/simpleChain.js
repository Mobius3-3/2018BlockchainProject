/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/
const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB, {valueEncoding: 'json'});
const SHA256 = require('crypto-js/sha256');
//include level library 


/* ===== Block Class ==============================
|  Class with a constructor for block  			   |
|  ===============================================*/

// store current value of block height and block temporarily 
var blockHeightList = [];
var blockList = [];
// Add data to levelDB with key/value pair
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
    console.log('Database:');
    console.log('typeof value = ',typeof value);
    if (typeof value === 'number') {
      blockHeightList.push(value);
    } else {
      blockList.push(value);
    }  
  })
}

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
    // this.chain = [];
    addLevelDBData("height", 0);
    let genesisBlock = new Block("First block in the chain - genesis block");
    // this.chain.push(new Block("First block in the chain - Genesis block"));
    addLevelDBData(0, JSON.stringify(genesisBlock));
  }

  // Add new block
  addBlock(newBlock){
    let height = this.getBlockHeight();// Block height
    console.log(height);
    newBlock.height = height+1; 
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    // previous block hash
    if(height > 0){
      newBlock.previousBlockHash = this.getBlock(height).hash;
    }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    // store newBlock within levelDB
    addLevelDBData(newBlock.height, JSON.stringify(newBlock));
    console.log(newBlock);
    addLevelDBData("height", newBlock.height);
    // Adding block object to chain
  	// this.chain.push(newBlock);
  }

  // Get block height
    a() {
      getLevelDBData("height");
      blockHeightList;
    }
    getBlockHeight(){
      this.a();
      let blockHeight = blockHeightList[blockHeightList.length-1];
      console.log("blockHeight: "+blockHeight);
      return blockHeight;
    }

    // get block
    b(blockHeight) {
      getLevelDBData(blockHeight);
      blockList;
    }
    getBlock(blockHeight){
      this.b(blockHeight);
      let block = blockList[blockList.length-1];// return object as a single string
      return JSON.parse(block);
    }

    // validate block
    validateBlock(blockHeight){
      // get block object
      let block = this.getBlock(blockHeight);
      // get block hash
      let blockHash = block.hash;
      // remove block hash to test block integrity
      block.hash = '';
      // generate block hash
      let validBlockHash = SHA256(JSON.stringify(block)).toString();
      // Compare
      if (blockHash===validBlockHash) {
          return true;
        } else {
          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          return false;
        }
    }

   // Validate blockchain
    validateChain(){
      let errorLog = [];
      let blockHeight = this.getBlockHeight();
      for (var i = 0; i < blockHeight; i++) {
        // validate block
        if (!this.validateBlock(i))errorLog.push(i);
        // compare blocks hash link
        let block = this.getBlock(i);
        let blockHash = block.hash;
        let previousHash = block.previousBlockHash;
        if (blockHash!==previousHash) {
          errorLog.push(i);
        }
      }
      if (errorLog.length>0) {
        console.log('Block errors = ' + errorLog.length);
        console.log('Blocks: '+errorLog);
      } else {
        console.log('No errors detected');
      }
    }  
}
