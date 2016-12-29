
var isEnoughVp = function(amount){
  return Meteor.user().data.vp > amount
}

Template.GameCategory.helpers({
  category :function () {
      return Session.get("gameCategory");
  },
  isFirstTime : function(){
      var game = Session.get("gameObject");
      return typeof Meteor.user() === 'object' && typeof Meteor.user().data.stats[game.category._id]  === 'object' && Meteor.user().data.stats[game.category._id].played != 0      
  },
  stats : function(){
      var game = Session.get("gameObject");
      if(typeof Meteor.user() === 'object' && typeof Meteor.user().data.stats[game.category._id]  === 'object'){
        var stats = Meteor.user().data.stats[game.category._id];
        return Math.ceil((100/stats.played)*(stats.win || 0))
      }
  },
  isFreeForAll : function(){
      return Session.get("gameObject").type === 3;
  },

  playedGames : function(){
    return Session.get("gameObject").users.find(function(user){return user._id === Meteor.userId()}).played + 1
  },
  nbr : function(){
    return Meteor.settings.public.gameSettings.nbrRound
  }

});

Template.GameCategory.events({
   'click a[data-play]' : function (e) {

        var game = Session.get("gameObject");
        var cat = Categories.findOne({_id : game.category._id});
        Meteor.call('randomQuestion', cat.code,function(error, result) {

          if (error) {
            console.log(error);
          }

          game.question = result;

          Session.set("gameObject", game);
          Session.set("gamePlaying", '/game/play');
          Router.go('game.play');

      });

   },

   'click a[data-back]' : function (e) {
        var amount = 2;
        if(isEnoughVp(amount)) {
          Meteor.call('decrementVp',amount);
          Router.go('game.start');
        }
        else {
          document.querySelector(".modal").classList.add('open');
        }

        Session.set("gamePlaying", '/game/start');
        Router.go('game.start');

   }

});



Template.GameCategory.onRendered(function(){
  // Set the anination
  console.log(Session.get("gameObject").category);
})