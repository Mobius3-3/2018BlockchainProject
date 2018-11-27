// CRITERION: Configure private blockchain project to include a RESTful API with

// import dependencies
const Blockchain = require('./Blockchain')
const blockchain = new Blockchain()
const Block = require('./Block')
const util = require('./util')
const bodyParser = require('body-parser')
const path = require('path')

// Creates an Express application. The express() function is a top-level function exported by the express module.
const express = require('express')
const app = express()

// CRITERION: Node.js framework running on port 8000.
app.listen(8000, () => console.log('Example app listening on port 8000!'))

// Bind application-level middleware to an instance of the app object
// @express.json():parses incoming requests with JSON payloads and is based on body-parser
// @urlencoded:用来解析 request 中 body的 urlencoded字符;返回的对象是一个键值对，当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型。
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Return the doc
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/README.md'))
})

// CRITERION: GET Block endpoint using URL path with block height parameter.
// Preferred URL path http://localhost:8000/block/{BLOCK_HEIGHT}
app.get('/block/:blockHeight', (req, res) => {
  blockchain.getBlock(req.params.blockHeight).then(success => {
    // The block contents must respond to GET request with block contents in JSON format
    res.send(success)
  }).catch(error => {
    res.send(res.send('error:the height parameter is out of bounds'))
  })
})

// CRITERION: POST Block endpoint using key/value pair within request body.
app.post('/block', (req, res) => {
  // verify if the request ins't empty
  if (!util.empty(req.body.body)) {
    let block = new Block(req.body.body)
    blockchain.addBlock(block).then(success => {
      // CRITERION: The block contents must respond to POST request with block contents in JSON format
      // Note: addBlock method was modified to return the block created
      res.send(block)
    }).catch(() => {
      // return an error message 
      res.send('error: There was an error generating a new block')
    })

  } else {
    // return parameter error message
    res.status(400).send('wrong type of parameters')
  }

})