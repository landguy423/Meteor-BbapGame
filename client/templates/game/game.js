/*****************************************************************************/
/* Game: Event Handlers */
/*****************************************************************************/

// Session.setDefault("gameType", 0);
// Session.setDefault("gameVs", 0);
// Session.setDefault("gameReady", false);
// Session.setDefault("friendsVs", []);

var contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};





Template.GameFeed.events({

    'click a[data-continue]': function(e){
        var old_game = Session.get("gameObject");
        if(old_game.type == 2){
          var played = old_game.users.find(function(user){return user._id == Meteor.userId()}).correctas;
        }
        else {
          var played = old_game.users.find(function(user){return user._id == Meteor.userId()}).played;
        }
        if((old_game.isCorrect || old_game.type != 2) && played < 11 ){
          var game = Games.findOne({_id : old_game._id});
          Session.set("gameObject", game);
          Session.set("gamePlaying", '/game/start');
          Router.go('game.start');


        }else{
           Session.set("gameObject", {});
           Session.set("gamePlaying",false);
           Router.go('home');

        }
       
    },

    'click a[data-dislike]': function(e){
        var old_game = Session.get("gameObject");
        Meteor.call('rateQuestion',"old_game.category._id",false);
        $('a[data-continue]').trigger('click');
    },
    'click a[data-like]': function(e){
        var old_game = Session.get("gameObject");
        Meteor.call('rateQuestion',"old_game.category._id",true);
        $('a[data-continue]').trigger('click');
    }
  });

Template.Game.events({
    'click .type .select': function(e){
      // Type 1 = Individual
      // Type 2 = 1 vs 1
      // Type 3 = All vs All

      var $this = $(e.currentTarget),
          gameType = $this.data('type');

      

      $('.type .select').removeClass('active');
      $this.addClass('active');
      Session.set("gameType", gameType);
      Session.set("friendsVs", []);
      Session.set("gameVs", 0);

      if(gameType == 1)
        Session.set("gameReady", true);
      else
        Session.set("gameReady", false);

      if(gameType == 3)
        return;

      $('.vs').find('.select').removeClass('active');

  },
  'click .vs .select': function(e){
      var $this = $(e.currentTarget),
          data = $this.data('vs');

      $('.vs .select').removeClass('active');
      $this.addClass('active');
      Session.set("gameReady", true);

      // Why ?
      Session.set("gameVs", data);
  },

 'click a[data-start]': function(e){
    e.preventDefault();
    var $this = $(e.currentTarget);

    // Get the info about what kind of game is selected 
    // Game type
    var gameType = $('.type .circle .active').data('type');
    // Challengers
    var challengers = $('.vs .circle .active').data('vs');

    if((gameType == 2 || gameType == 3) && challengers == 1){
        Router.go('game.friends');
    }
    else {
        var users = [];
        Meteor.call('decrementVv');
        users.push({
          _id : Meteor.userId(),
          status : 1,
          correctas : 0,
          played : 0
        });
        if(gameType == 1) {
          Games.insert({type: gameType, createdAt: new Date(), users:users }, function(error, gameId) {
            var game =  Games.findOne({_id: gameId });

            Session.set("gameObject", game);
            Session.set("gamePlaying", '/game/start');
            Router.go('game.start');
          });
        }
        else if(gameType == 2){
          Meteor.call('randomUserId', 1,  function(error, playerId) {
              users.push({
                _id : playerId[0],
                status : 3,
                correctas : 0
              });

              Games.insert({type: gameType, createdAt: new Date(), users:users }, function(error, gameId) {
                var game =  Games.findOne({_id: gameId });

                Session.set("gameObject", game);
                Session.set("gamePlaying", '/game/start');
                Router.go('game.start');
              });
          })
        }
        else {
          Meteor.call('randomUserId', 3,  function(error, playersId) {
            playersId.forEach(function(id){
              users.push({
                _id : id,
                status : 3,
                correctas : 0,
                played : 0,
              });
            });

            Games.insert({type: gameType, createdAt: new Date(), users:users }, function(error, gameId) {
              var game =  Games.findOne({_id: gameId });

              Session.set("gameObject", game);
              Session.set("gamePlaying", '/game/start');
              Router.go('game.start');
            });

          })
        }
    }  
 }

});



/*****************************************************************************/
/* Game: Helpers */
/*****************************************************************************/



Template.Game.helpers({
  gameType :function () {
      var type = Session.get("gameType");
      return type == 2 || type == 3;
  },

  gameReady :function () {
      return Session.get("gameReady") ? 'active' : '';
  },
  friends :function () {
      var users = Session.get("friendsVs"),
          friends = []; 

      for (var i = users.length - 1; i >= 0; i--) {
        friends.push({'id' : users[i], 'firstName' : 'Ezequiel', 'lastName' : 'Ojeda', 'avatar' : '10917055_10205920929486048_1249910919075684414_n.jpg' });
      }
      return friends;
  },
  typeVs :function () {
      return Session.get("gameType") === 2 ? 'active' : '';
  },
  typeVsAll :function () {
      return Session.get("gameType") === 3 ? 'active' : '';
  },
  vsFriends :function () {
      return Session.get("friendsVs").length !== 0;
  }
});



/*****************************************************************************/
/* Game: Lifecycle Hooks */
/*****************************************************************************/
Template.Game.onCreated(function () {

});



