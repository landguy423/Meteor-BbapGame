var FB = require('fb');

Template.GameFriends.events({
   'click #user-list a' : function (e,template) {
      e.preventDefault();
      var friend = e.currentTarget;
      const maxFriends = Session.get("gameType") == 2 ? 1 : 3;
      var selectedFriends = template.selectedFriends.get();
      

      if((maxFriends -1) >= selectedFriends.length && !friend.classList.contains('active')) {
      	friend.classList.add('active');
      	selectedFriends.push({id: friend.dataset.fbId,name:friend.dataset.fbName})
      }
      template.selectedFriends.set(selectedFriends);
    },

    'click #players a[data-remove]' : function (e,template) {
      e.preventDefault();
      var friend = e.currentTarget;
      var selectedFriends = template.selectedFriends.get();

      var deletedFriend = selectedFriends.splice(friend.dataset.id, 1);
      document.querySelector('#user-list a[data-fb-id="'+deletedFriend[0].id+'"]').classList.remove('active');
      
      template.selectedFriends.set(selectedFriends);
    },
    'click a.accept' : function (e,template) {
      e.preventDefault();

      if (e.currentTarget.classList.contains('active')){
      	var selectedFriends = template.selectedFriends.get();
      	Meteor.call('getFriendByFacebookId',selectedFriends,function(error,players){
  			 	var users = [];
  				users.push({
  				  _id : Meteor.userId(),
  				  status : 1,
  				  correctas : 0,
            firstPlay : true
  				});

          // If 1vs1, the behaviour is different, we have to wait that the user finish the game
          var opponentsStatus = players.length === 1 ? 0 : 1;
  				players.map(function(player){
  					users.push({
  						_id : player._id,
  				  	status : opponentsStatus,
  				  	correctas : 0
  					})
  				});

          Meteor.call('isNotAlreadyAGame',players,function(error, response){
            if(response) {
              Games.insert({type: Session.get("gameType"), createdAt: new Date(), users:users }, function(error, gameId) {

                if(error){console.log(error)}
                var game =  Games.findOne({_id: gameId });
                Meteor.call('decrementVv');
                Session.set("gameObject", game);
                Session.set("gamePlaying", '/game/start');
                Router.go('game.start');
              });
            }
            else {
              document.querySelector(".modal.has-game").classList.add('open');
            }
          })
      	})
      }
    },
    'click .modal' : function(){
      document.querySelector(".modal").classList.remove('open');
    },
    'input .search input': function (event, template) {
      var search = event.currentTarget.value;
      $('.name').each(function(index,el){
        var text = $(el).text();
        if(text.toLowerCase().match(search)){
          $(el).parents('.column').show();
        }
        else{
          $(el).parents('.column').hide();
        }
      })
    } 

});

var getFriend = function(pos){
	var friends = Template.instance().selectedFriends.get();
  if(friends[pos]){
  	return friends[pos]
  }
  else {
  	return;
  }
} 

Template.GameFriends.helpers({
  friendsList :function(){
  		return Template.instance().friendsList.get();
  },
  players :function () {
      return Session.get("gameType") == 2 ? false : true;
  },
  friendsReady :function () {
  		var friends = Template.instance().selectedFriends.get();
      var players = Session.get("gameType") == 2 ? 1 : 3;
      return friends.length == players ? 'active' : '';
  },
  friendOne : function(){
  	return getFriend(0)
  },
  friendTwo : function(){
  	return getFriend(1)
  },  
  friendThree : function(){
  	return getFriend(2)
  }
});


Template.GameFriends.onCreated(function () {
	var friendlist = this.friendsList = new ReactiveVar;
	this.selectedFriends = new ReactiveVar([]);

	Meteor.call('getFriendList',function(error, response){
  		if(!error){
  			friendlist.set(response.data);
  		}  		
  });
});



