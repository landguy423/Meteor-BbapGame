
/*****************************************************************************/
/* Game: Helpers */
/*****************************************************************************/

Template.GameScore.helpers({
  level :function () {
  	if(Meteor.user()){
  		return Meteor.user().data.level
  	}
  },
});

Template.GameScore.events({
    'click a.continue': function(e){
    	e.preventDefault();
    	Session.set("gamePlaying", '/game/feed');
    	Router.go('game.feed');
    }
})
