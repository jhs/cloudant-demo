//
// Cloudant Node.js Example
//

var start_server = require('voxel-deathmatch')
var Cloudant = require('Cloudant')

console.log('Connect to Cloudant')
Cloudant({account:'jhs', password:process.env.pw}, function(er, cloudant) {
  if (er)
    throw er

  console.log('Connected to cloudant')
  DB = cloudant.use('deathmatch')
  DB.list({include_docs:true}, function(er, body) {
    var score = {}
    body.rows.forEach(function(row) {
      var doc = row.doc
      if (doc.points) {
        console.log('Add to score: %j', doc)
        score[doc._id] = doc.points
      }
    })

    var game = start_server(score)
    game.on('Point: ', function(winner) {
      console.log('Point! %s', winner)
    })
  })
})
