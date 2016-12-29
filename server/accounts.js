Accounts.onCreateUser(function(options, user) {

  var lang = user.services.facebook.locale;

  lang = lang.split('_');
  lang = lang[0] == 'es' ? lang[0] : 'en';
  user.lang = lang;
  user.lastAccessAt = new Date();
  //Meteor.call('updateRoles', user._id, 'admin');
  //Roles.setUserRoles(user._id, 'admin', Roles.GLOBAL_GROUP)

  return user;
});

Accounts.onLogin(function(){

	// If it's more than 24 hours that the user is loggout we reward him 3VP and set the lastAccess
	if(moment(Meteor.user().lastAccessAt).add(1, 'days').isBefore(new Date()) || Meteor.user().lastAccessAt == undefined ) {
		Meteor.users.update({_id : Meteor.userId()}, 
			{$set : {lastAccessAt : new Date()},$inc : {"data.vp" : 3,"data.vv" : 3}});
	}
})