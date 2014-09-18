//
// Cloudant Node.js Example
//

var start_server = require('voxel-deathmatch')
var Cloudant = require('cloudant')

console.log('Connect to Cloudant')
Cloudant({account:'jhs', password:process.env.pw}, function(er, cloudant) {
  if (er)
    throw er

  console.log('Connected to Cloudant')

  var game = start_server()

  game.on('Point: ', function(winner) {
    console.log('Point! %s', winner)
  })
})
