//
// Cloudant Node.js Example
//

var start_server = require('voxel-deathmatch')
var Cloudant = require('cloudant')

console.log('Connect to Cloudant')
Cloudant({account:'jhs', password:process.env.pw}, function(er, cloudant) {
  if (er)
    throw er

  console.log('Connected to cloudant')
  DB = cloudant.use('deathmatch')
  DB.list({include_docs:true}, function(er, body) {

    // TODO: Change this to a query!
    var score = {}
    body.rows.forEach(function(row) {
      var doc = row.doc
      if (doc.points) {
        console.log('Add to score: %j', doc)
        score[doc._id] = doc.points
      }
    })

    var game = start_server(score)
    game.on('point', function(winner) {
      DB.get(winner, function(er, doc, headers) {
        if (er && er.status_code == 404)
          doc = {_id:winner}
        else if (er)
          return console.log('Get %s: %s', winner, er.message)

        // Give the winner a point!
        doc.points = 1 + (doc.points || 0)

        DB.insert(doc, doc._id, function(er, body) {
          if (er)
            console.log('Put %s: %s', winner, er.message)
          else
            console.log('Stored %s: %j', winner, Body)
        })
      })
    })
  })
})
