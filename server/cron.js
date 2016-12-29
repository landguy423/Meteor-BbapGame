SyncedCron.add({
  name: 'Remove games after 3 days if not all user are playing',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 15 mins');
  },
  job: function() {
    var games = Games.find( {createdAt : { $lte : moment().subtract(3, 'days').toDate() } ,users : {$elemMatch : {played : 0}} }).fetch();
    games.forEach(function(game){
    	game.users.forEach(function(user){
    		user.status = 4
    	});
    	// Totally not optimised but not have the time to find a better way
    	Games.update({_id : game._id},{$set : game});
    });


  }
});
