var FB = require('fb');


Template.ChatNew.events({
    'click .user-avatar-list a' : function (e,template) {
      fbId = e.currentTarget.dataset;
      Meteor.call('createOrJoinChat',fbId,function(error, response){
        Router.go('chat.room',{_id: response});
      });
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


/*****************************************************************************/
/* Chat: Helpers */
/*****************************************************************************/
Template.ChatNew.helpers({
  friendsList :function(){
      return Template.instance().friendsList.get();
  },
});


Template.ChatNew.onCreated(function () {
    console.log('created');
    var friendlist = this.friendsList = new ReactiveVar;
    this.selectedFriends = new ReactiveVar([]);
    this.friendOne = new ReactiveVar;

    var _self = this;
    Meteor.call('getFriendList',function(error, response){
        if(!error){
          friendlist.set(response.data);
        }     
    });
});