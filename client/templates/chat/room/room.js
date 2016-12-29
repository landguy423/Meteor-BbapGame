Template.ChatRoom.helpers({
	messages : function(){	
		// Run this after all the data get rendered 
		Tracker.afterFlush(function () {
			goToBottom();
		})
		if(typeof this.messages == 'object'){
			var cleanedMessages = [];
			var messagesArray = [].slice.call(this.messages)
			messagesArray.forEach(function(message,index,array){
				if(index != 0 && message.userId == array[index-1].userId ) {
					var duration = moment(message.createdAt).diff(moment(array[index-1].createdAt));
					if(moment.duration(duration).asMinutes() < 5){
						cleanedMessages[cleanedMessages.length - 1].message += '\r\n' + message.message;
					}
					else {
						cleanedMessages.push(message);
					}
				}
				else {
					cleanedMessages.push(message);
				}
			
			})
		}
		
		return cleanedMessages || []

	},
	friend: function(){
		if(this.users){
			var friendId = this.users.find(function(user){
				return user._id != Meteor.userId()
			});
			var friend = Meteor.users.findOne({_id: friendId._id})
			return friend
		}

	},
	getUser : function(message){
		var user = Meteor.users.findOne({_id : message.userId})
		user.currentUser = message.userId === Meteor.userId();
		return user
	},
	sent : function(message){
		return message.userId === Meteor.userId() ? 'sent' : ''
	}
})

var goToBottom = function(){
	document.querySelector('.content').scrollTop = document.querySelector('#chat').scrollHeight+1000;
}


Template.ChatRoom.events({
   'click [data-action=back]' : function (e) {
      e.preventDefault();
      history.back();
    },
    'click [data-send]' : function (e) {
    	var messageBox = document.querySelector('#msj');
		e.preventDefault();
		var message = document.querySelector('#msj').value;
		Chats.update({_id : this._id},{$set: { lastUpdateAt : Date.now() }, $push: { messages: { createdAt : Date.now() , message : message , userId : Meteor.userId() }}})
		messageBox.value = '';
		messageBox.focus();
    }
});

Template.ChatRoom.onCreated(function(){

})

Template.ChatRoom.onRendered(function () {
	goToBottom();

	// Don't like , but impossible to subscribe to keypress with blaze, seems to be a bug...
	$('#msj').on('keypress',function(e){
		if(e.keyCode == 13){
			$('[data-send]').trigger('click');
		}
	});
});