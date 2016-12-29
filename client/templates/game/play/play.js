
// Check if there is enough credit and open the popup if not
// decrement the credit is yes and return true

var isEnoughVp = function(amount){
  return Meteor.user().data.vp > amount
}

var setInactive = function(){
  document.querySelectorAll('#play aside a').forEach(function(item){
    item.classList.add('inactive')
  });
}
var sec,timer;

Template.GamePlay.helpers({
  timeLeft :function(){
      return Template.instance().timeLeft.get();
  },
  timeLeftInPercent : function(){
      var mult = 100/Template.instance().timeLeftTotal.get();
      var perc = Template.instance().timeLeft.get() * mult;
      return 100-perc;
  }
})

Template.GamePlay.events({
  // Trigger this event when the user select one of the answers
  'click #answers li:not(.inactive)' : function (e) {
      e.preventDefault();
      clearInterval(timer);
      var $this = $(e.currentTarget),
          status = $('#status'),
          answer = $this.data('answer'),
          game =  Session.get("gameObject"),
          gameId = game.category._id;

      //console.log(game.feed);
      if (typeof  game.feed == "undefined") {

        // Respond the correct answer
        if($this.data('answer') == 'correcta'){

          // Update the users counters
          var win = "data.stats."+gameId+".win";
          var played = "data.stats."+gameId+".played";
          var update = {};
          update[win] = 1;
          update[played] = 1;

          //@TODO Move these stats in the method update game
          // Update the consecutive and counter
          Meteor.users.update({"_id" : Meteor.userId()},{ $inc: {'data.consecutiveWin' : 1,'data.totalWin' : 1 ,'data.totalPlayed' : 1}},{validate: false});
          
          document.querySelector('#win-sound').play();

          Meteor.call('updateGame',game._id,game.type,true);

          // Set to correct
          game.isCorrect = true;
          game.answerImg = "/img/wss_b12-13.png";
          $this.addClass('correct').text(TAPi18n.__('correcto'));
          status.html('<img src="/img/wss_b12-13.png"/>');

        }
        // Respond incorrect answer
        else{
          document.querySelector('#lose-sound').play();


          // Update the users counters
          var played = "data.stats."+gameId+".played";
          var update = {};
          update[played] = 1;

          //@TODO Move these stats in the method update game
          Meteor.users.update({"_id" : Meteor.userId()},{ $set: {'data.consecutiveWin' : 0}},{validate: false});
          Meteor.users.update({"_id" : Meteor.userId()},{ $inc : {'data.totalPlayed' : 1}},{validate: false});

          Meteor.call('updateGame',game._id,game.type,false);

          game.isCorrect = false;
          game.answerImg = "/img/wss_b12-13b.png";
          $this.addClass('wrong').text(TAPi18n.__('incorrecto'));
          status.html('<img src="/img/wss_b12-13b.png"/>');
        }

        // Update Users stats 
        //@TODO Move these stats in the method update game
        Meteor.users.update({"_id" : Meteor.userId()},{ $inc: update},{validate: false});

        Session.set("gameObject", game);
        $('#answers > li').addClass('inactive');
       

        setTimeout(function(){
          Meteor.call('isChangingLevel',function(error, reward){
            
            if(reward){
              Session.set("gamePlaying", '/game/score');
              Router.go('game.score');
            }
            else {
              Session.set("gamePlaying", '/game/feed');
              Router.go('game.feed');
            }


          })

        }, 2000);

      }
    },


    'click a[data-action="clue"]:not(.inactive)' : function (e) {
      e.preventDefault();
      var amount = 2;
      if(isEnoughVp(amount)) {
        Meteor.call('decrementVp',amount);
        Math.ceil(Math.random()*3)
        // Generate the incorrect error that will be set as incorrect
        var incorrect = new Array(1,2,3);
        incorrect.splice(Math.ceil(Math.random()*3)-1,1);
        incorrect.forEach(function(item){
          document.querySelector(".incorrecta"+item).classList.add('inactive');
        });
        setInactive();
      }
      else {
        document.querySelector(".modal").classList.add('open');
      }


    },
    'click a[data-action="answer"]:not(.inactive)' : function (e) {
      e.preventDefault();
      var amount = 3;
      if(isEnoughVp(amount)) {
        Meteor.call('decrementVp',amount);
        var incorrect = new Array(1,2,3); 
        incorrect.forEach(function(item){
          document.querySelector(".incorrecta"+item).classList.add('inactive');
        });
        setInactive();
      }
      else {
        document.querySelector(".modal").classList.add('open');
      }

    },
    'click a[data-action="time"]:not(.inactive)' : function (e) {
      e.preventDefault();
      var amount = 1;
      if(isEnoughVp(amount)) {
        Meteor.call('decrementVp',amount);
        sec = sec + 10;
        Template.instance().timeLeftTotal.set(Template.instance().timeLeftTotal.get()+10);
        setInactive();
      }
      else {
        document.querySelector(".modal").classList.add('open');
      }
    },
    'click a[data-action="retry"]:not(.inactive)' : function (e) {
      e.preventDefault();
      var amount = 2;
      if(isEnoughVp(amount)) {
        Meteor.call('decrementVp',amount);
        Router.go('game.start');
      }
      else {
        document.querySelector(".modal").classList.add('open');
      }
    },
    'click .modal' : function(){
      document.querySelector(".modal").classList.remove('open');
    }
});



Template.GamePlay.onRendered(function () {
  _self = this;
  var sel = $('#timer'),
  timeout = $('#timeout');
  sec = 20;
  this.timeLeft.set(sec);
  this.timeLeftTotal.set(sec);
  timer = setInterval(function(){
     sec = sec - 1;
     _self.timeLeft.set(sec);
     if(sec == 0){
        clearInterval(timer);
        document.querySelector('#lose-sound').play();

        var game =  Session.get("gameObject"),
          gameId = game.category._id;
        // Update the users counters
        var played = "data.stats."+gameId+".played";
        var update = {};
        update[played] = 1;

        //@TODO Move these stats in the method update game
        Meteor.users.update({"_id" : Meteor.userId()},{ $set: {'data.consecutiveWin' : 0}},{validate: false});
        Meteor.users.update({"_id" : Meteor.userId()},{ $inc : {'data.totalPlayed' : 1}},{validate: false});

        Meteor.call('updateGame',game._id,game.type,false);

        game.isCorrect = false;
        game.isTimeout = true;
        game.answerImg = "/img/wss_b12-13b.png";
        Session.set("gameObject",game);
        document.querySelector('#status').html = '<img src="/img/wss_b12-13b.png"/>';

        setTimeout(function(){
          if(Session.equals("gamePlaying",'/game/play' )){
            Session.set("gamePlaying", '/game/feed');
            Router.go('game.feed');
          }
  
        }, 2000);

      }

  }, 1000);

  sel.addClass('rotate');

  setTimeout(function(){
     sel.addClass('rotate2');
  }, 7500);


 
});

Template.GamePlay.onCreated(function(){
  this.timeLeft = new ReactiveVar;
  this.timeLeftTotal = new ReactiveVar;
})


Template.GamePlay.onDestroyed(function(){
  clearInterval(timer);
})


