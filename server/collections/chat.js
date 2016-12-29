  Chats.allow({
    update: function (userId, doc, fieldNames, modifier) {
      // Test if the user is in the chat room
      var isUserInRoom = doc.users.some(function(user){
        return user._id == Meteor.userId()
      })
      if(Meteor.userId() && isUserInRoom){
        return true;
      }
      return false;
    }
  })