/*****************************************************************************/
/* Ranking: Event Handlers */
/*****************************************************************************/
Template.Ranking.events({
   'click [data-action=back]' : function (e) {
      e.preventDefault();
      history.back();
    }
});

/*****************************************************************************/
/* Ranking: Helpers */
/*****************************************************************************/
Template.Ranking.helpers({
  indent : function(num){
    return num+1
  },
  friendlist :function () {
      return Template.instance().friendsList.get();
  },
  goBack : function(){
    if("game.ranking" === Router.current().route.getName() ){
      return '/game/start'
    }
    else {
      return '/'
    }
  }
});

/*****************************************************************************/
/* Ranking: Lifecycle Hooks */
/*****************************************************************************/
Template.Ranking.onCreated(function () {
  var friendlist = this.friendsList = new ReactiveVar;

  Meteor.call('getFriendList',function(error, response){
    Meteor.call('getRankingByFacebookId',response.data,function(error,users){
      friendlist.set(users);
    })
  }); 

});

Template.Ranking.onRendered(function () {
});

Template.Ranking.onDestroyed(function () {
});
