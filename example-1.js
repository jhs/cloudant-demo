//
// Cloudant Node.js Example
//

var start_server = require('voxel-deathmatch')

var game = start_server()
game.on('point', function(winner) {
  console.log('Point: %s', winner)
})
