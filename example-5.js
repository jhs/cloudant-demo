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

  var leaderboard = { name: 'leaderboard'
                    , type: 'json'
                    , index: {fields:['points']}
                    }

  DB.index(leaderboard, function(er, response) {
    if (er)
      return console.log('Error making index: %s', er.message)

    var selector = {points:{'$gt':0}}
    var sort     = [{points:'desc'}]
    DB.find({selector:selector, sort:sort}, function(er, result) {
      if (er)
        return console.log('Score lookup error: %s', er.message)

      var scores = []
      for (var i = 0; i < result.docs.length; i++) {
        console.log('Add to score: %j', result.docs[i])
        scores.push({name:result.docs[i]._id, points:result.docs[i].points})
      }

      var game = start_server(scores)
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
              console.log('Stored %s: %j', winner, body)
          })
        })
      })
    })
  })
})
