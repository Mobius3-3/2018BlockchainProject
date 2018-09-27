//the stream is going to do is emitting data event
//this data event will be each item(in key-value format) in our bears database here
/*server-side database code -> client-side like an off-line app
  same code can be run in the browser where instead of saving to this database
  folder here on the file system it will save in index dot or index DB and built 
  into chrome

  level package is for two packages: 
  	level up: provides us the API 
  	level down: handles all of the interfacing with the file system

  - npm i levelup leveldown --save to install these packages explicitly
  	instead of having it as a convenience thorugh just the package level 
*/

//prototype1
var level = require('level')

var db = level('./db',{ valueEncoding: 'json'})

db.put('animal',{type:'grizzly', name:'steve'}, function (err) {
	db.get('animal', function (err,name) {
		console.log(animal.name)
	})                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
})

//for addBlock(newBlock) to store new Block within levelDB
var level = require('level')

var db = level('./db',{ valueEncoding: 'json'})

db.put('block'+'newBlock.height',{hash: newBlock.hsah, height: newBlock.height, body: newBlock.body, time: newBlock.time, previousBlockHash: newBlock.previousBlockHash}, function (err) {
	db.get('block'+'newBlock.height', function (err,block) {
		console.log(block.hash)
	})
})

