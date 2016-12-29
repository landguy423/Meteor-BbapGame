var FB = require('fb');

getUserLanguage = function () {
  // Put here the logic for determining the user language
    return Meteor.user() && Meteor.user().lang !== undefined ? Meteor.user().lang : 'es'
};

getLocalPath = function(file) {
    return cordova.file.applicationDirectory.replace('file://', '') + 'www/application/app/' + file;
};

Meteor.subscribe('categories');

Meteor.subscribe('allUsers');



Handlebars.registerHelper('toLowerCase', function(str) {
  return str.toLowerCase();
});

Handlebars.registerHelper('publicSettings', function () {
  return Meteor.settings.public;
});

Handlebars.registerHelper('parseDate', function(str) {
  return moment(str).fromNow();
});


Template.registerHelper('gameObject',function(input){
  return Session.get("gameObject");
});

Template.registerHelper("log", function(something) {
  console.log(something);
});

Template.registerHelper('breaklines', function(text) {
    text = Blaze._escape(text);
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
    return new Spacebars.SafeString(text);
});

Handlebars.registerHelper('getCategoryName', function(id) {

  if ( id === undefined || id.length < 1 ){
      return "undefined";
  } 

  var catgory = Categories.findOne({_id:id});

  if ( catgory === undefined){
      return "undefined";
  } 

  return catgory.category;

});

Handlebars.registerHelper('userAvatar', function(id) {

  return 'http://graph.facebook.com/'+id+'/picture/?width=300&height=300';

});

Handlebars.registerHelper('getUserName', function(id) {

  if ( id === undefined || id.length < 1 ){
      return "undefined";
  } 

  var user = Meteor.users.findOne({_id: id});
  //console.log(user);

  if ( user === undefined){
      return "undefined";
  } 

  return user.services.facebook.first_name +" "+ user.services.facebook.last_name;

});

Handlebars.registerHelper('getQuestionStatus', function(id){

  var text = ''

  if(id === 0){
    text = 'pendiente';
  }

  else if(id === 1){
    text = 'publicada';
  }

  else if(id === 2){
    text = 'rechazada';
  }

  else{
    text = 'undefined';
  }

  return TAPi18n.__(text)

});

Handlebars.registerHelper('getQuestionLevel', function(id){

  var text = ''

  if(id === 0){
    text = 'facil';
  }

  else if(id === 1){
     text = 'medio';
  }

  else if(id === 2){
     text = 'dificil';
  }

  else{
     text = 'undefined';
  }

  return TAPi18n.__(text)

});


Handlebars.registerHelper('getLevel', function(level){

var text = ''
switch (level) {
  case 1: // no break statement in 'case 0:' so this case will run as well
    text = 'Aluminium'
    break; // it encounters this break so will not continue into 'case 2:'
  case 2:
    text = 'Bronze'
    break;
  case 3:
    text = 'Silver'
    break;
  case 4:
    text = 'Gold'
    break;
  case 5:
    text = 'Platinium'
    break;
  case 6:
    text = 'Super Platinium'
    break;
  default:
    text = 'Rookie'
}

  return TAPi18n.__(text)

});


Meteor.startup(function () {

  Session.set("showLoadingIndicator", true);
  //Session.set("gamePlaying", false);

  Session.setDefault("gamePlaying", false);

  $('html').css('font-size', parseInt((62.5*$(window).width())/640)+'%');


});
 