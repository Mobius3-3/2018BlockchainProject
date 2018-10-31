const SHA256 = require('crypto-js/sha256')

// Configure LevelDB to persist data
const db = require('level')('./chaindata')

// import block class
const Block = require('./Block')

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain {
  constructor () {
    this.getBlockHeight().then((height) => {
      // console.log(height)  // DEBUG
      if (height === -1) this.addBlock(new Block('Genesis block')).then(() => console.log('Genesis block stored!'))
    })
  }

  // Add new block
  async addBlock (newBlock) {
    // previous block height
    let previousBlockHeight = parseInt(await this.getBlockHeight())
    // Block height
    newBlock.height = previousBlockHeight + 1
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0, -3)
    // previous block hash
    if (newBlock.height > 0) {
      let previousBlock = await this.getBlock(previousBlockHeight)
      newBlock.previousBlockHash = previousBlock.hash
    }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString()

    // Adding block object to levelDB
    await this.addLevelDBData(newBlock.height, JSON.stringify(newBlock))
  }

  // Get block height
  // CRITERION: Modify getBlockHeight() function to retrieve current block height within the LevelDB chain.
  async getBlockHeight () {
    return await this.getBlockHeightLevel()
  }

  // get block
  // CRITERION: Modify getBlock() function to retrieve a block by it's block heigh within the LevelDB chain.
  async getBlock (blockHeight) {
    // return object as a single string
    return JSON.parse(await this.getLevelDBData(blockHeight))
  }

  // validate block
  async validateBlock (blockHeight) {
    // get block object
    let block = await this.getBlock(blockHeight)
    // get block hash
    let blockHash = block.hash
    // remove block hash to test block integrity
    block.hash = ''

    // generate block hash
    let validBlockHash = SHA256(JSON.stringify(block)).toString()

    // Compare
    if (blockHash === validBlockHash) {
      // return true if block is valid
      return true
    } else {
      console.log('Block #' + blockHeight + ' invalid hash:\n' + blockHash + '<>' + validBlockHash)
      return false
    }
  }

  // Validate blockchain
  async validateChain () {
    let errorLog = []
    let blockChainHeight = await this.getBlockHeight()

    for (let i = 0; i < blockChainHeight; i++) {

      // validate a single block
      if (!(await this.validateBlock(i))) errorLog.push(i)

      // compare blocks hash link
      let blockHash = this.getBlock(i).hash
      let previousHash = this.getBlock(i + 1).previousBlockHash
      if (blockHash !== previousHash) {
        errorLog.push(i)
      }

    }

    if (!(await this.validateBlock(blockChainHeight))) errorLog.push(blockChainHeight)

    if (errorLog.length > 0) {
      console.log('Block errors = ' + errorLog.length)
      console.log('Blocks: ' + errorLog)
    } else {
      console.log('No errors detected')
    }

  }

  // levelDB method
  getBlockHeightLevel () {
    return new Promise((resolve, reject) => {
      let height = -1
      db.createReadStream().on('data', (data) => {
        height++
      }).on('error', (err) => {
        console.log('Unable to read data stream!', err)
        reject(err)
      }).on('close', () => {
        resolve(height)
      })
    })
  }

  // Add data to levelDB with key/value pair
  addLevelDBData (key, value) {
    return new Promise((resolve, reject) => {
      db.put(key, value, (err) => {
        if (err) {
          console.log('Block ' + key + ' submission failed', err)
          reject(err)
        }
        else {
          console.log('Block ' + key + ' stored')
          resolve(value)
        }
      })
    })
  }

  // Get data from levelDB with key
  getLevelDBData (key) {
    return new Promise((resolve, reject) => {
      db.get(key, (err, value) => {
        if (err) {
          console.log('Not found!', err)
          reject(err)
        } else {
          resolve(value)
        }
      })
    })
  }

}

//test
let blockchain = new Blockchain();

// add 10 blocks in blockchain
(function theLoop (i) {
  setTimeout(() => {
    blockchain.addBlock(new Block(`Block # ${i}`)).then(() => {
      if (--i) theLoop(i)
    })
  }, 100)
})(10)

// validate blockchain
blockchain.validateChain()