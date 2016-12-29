

Template.Chat.helpers({
	chats : function(){
		return this.map(function(chat){
			var otherUserId = chat.users.find(function(user){
				return user._id !== Meteor.userId()
			})._id;
			var otherUser = Meteor.users.findOne({_id : otherUserId});
			return {
				_id : chat._id,
				lastUpdateAt : chat.lastUpdateAt,
				fullname : otherUser.services.facebook.first_name+' '+otherUser.services.facebook.last_name,
				fbId : otherUser.services.facebook.id
			}
		})
	}
});

/*****************************************************************************/
/* Chat: Event Handlers */
/*****************************************************************************/
Template.Chat.events({
   'click [data-action=back]' : function (e) {
      e.preventDefault();
      history.back();
    },
    'input .search input': function (event, template) {
    	var search = event.currentTarget.value;
    	$('.user-name').each(function(index,el){
    		var text = $(el).text();
    		if(text.toLowerCase().match(search)){
    			$(el).parents('li').show();
    		}
    		else{
    			$(el).parents('li').hide();
    		}
    	})
  	}	
});




/*****************************************************************************/
/* Chat: Lifecycle Hooks */
/*****************************************************************************/


Template.Chat.onRendered(function () {

});



Template.Chat.onDestroyed(function () {
});
