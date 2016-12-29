var getUser = function(pos){
  var users = Session.get("gameObject").users;
  // remove the current user from the list
  // Need to be cached or something
  var opponents = []
  users.forEach(function(user){
    if(user._id !== Meteor.userId()){
      opponents.push(user);
    }
  });

  return Meteor.users.findOne({_id : opponents[pos]._id});
}


Template.GameStart.events({
  'click .modal' : function(){
    document.querySelector(".modal").classList.remove('open');
  }
});

Template.GameStart.helpers({
  firstTime : function(){
    return Meteor.user().data.totalPlayed ? '' : 'open';
  },
  isFree4All : function(){
    return Session.get("gameObject").type === 3;
  },
  is1vs1 : function(){
    return Session.get("gameObject").type === 2;
  },
  isInd : function(){
    return Session.get("gameObject").type === 1;
  },
  classType : function(){
    if(Session.get("gameObject").type === 1) {
      return "individual"
    }
    else {
      return Session.get("gameObject").type === 3 ? 'free' : 'versus';
    }
    
  },
  nbr : function(){
    return Meteor.settings.public.gameSettings.nbrRound
  },
  playedGames : function(){
    return Session.get("gameObject").users.find(function(user){return user._id === Meteor.userId()}).played + 1
  },
  percentGame : function(pos){
    var uid;
    if(pos !== 0) {
        uid = getUser(pos-1)._id;
    }
    else {
        uid = Meteor.userId();
    }
    var game = Session.get("gameObject");
    if(uid){
      return (game.users.find(function(user){return user._id === uid }).correctas)*5
    }

    
  },
  firstUser : function(){
    return getUser(0)
  },
  secondUser : function(){
    return getUser(1)
  },
  thirdUser : function(){
    return getUser(2)
  },

});
Template.GameStart.onDestroyed(function(){
  clearTimeout(ballSelector);
});
Template.GameStart.onRendered(function(){
  var ballsMp = [];
  var bubble = document.querySelector('.bubble');
  var stage = bubble.parentNode;
  var wWidth = window.innerWidth;
  var wHeight = window.innerHeight;
  var currentBall;
  var seletedBall = false;
  var categories = Categories.find({}).fetch(); 

  categories = categories.concat(categories, categories, categories);
  //categories = categories.concat(categories);

  document.querySelector('.bubble').addEventListener('click', function() {
      document.querySelector('#explode-sound').play();

      bubble.style.display = "none";
      window.requestAnimationFrame(function(){
        ballsMp.forEach(function(ball){
          ball.move();
          ball.ball.classList.add('grow');
        });
      })
      stage.addEventListener('click',function(){
        if(!seletedBall && typeof currentBall == 'object') {
          currentBall.selected();
        }
        
      });
      ballSelector = setTimeout(function(){ 
        if(!seletedBall) {
          currentBall.selected();
        }
      }, 10000);
  });

  var Ball = function(item){
    //console.log(item.category)
    this.ball = document.createElement('figure');
    this.item = item;
    this.ball.classList.add('ball');
    this.category = this.item.category;
    this.ball.classList.add(this.item.color);
    this.ball.style.transform = "translate(0,0)";
    this.posx = 0;
    this.posy = 0;
    this.out = false;
    this.counter = 0;
    this.size = 80;
    this.isSelected = false;
    this.direction = this.generateRandomDirection();
    this.ball.addEventListener('click',this.selected.bind(this));
    stage.insertBefore(this.ball,bubble);
    this.randomPosition();
  }
  Ball.prototype.selected = function(){
    this.ball.classList.remove('grow');
    seletedBall = true;
    this.ball.style.zIndex = 150;
    this.isSelected = true;
  }
  Ball.prototype.fullSize = function(){
      var x = parseInt(this.ball.style.left,10);
      var y = parseInt(this.ball.style.top,10);
      var w = parseInt(this.ball.style.width,10) || this.size;
      var h = parseInt(this.ball.style.height,10) || this.size;
      var r = parseInt(this.ball.style.borderRadius,10) || this.size;
      var speed = 12;
      var remainingFrame = x/speed;
      this.ball.style.left = x - speed +"px";
      this.ball.style.top = y - y/remainingFrame +"px";
      this.ball.style.borderRadius = r - (r / remainingFrame) + "px";
      this.ball.style.width = w + ((wWidth - w)/remainingFrame) +"px";
      this.ball.style.height = h + ((wHeight - h)/remainingFrame) +"px";

      if( remainingFrame > 0 ){
        window.requestAnimationFrame(this.fullSize.bind(this));
      }
      else {
        var game = Session.get("gameObject");
        //console.log(this.item)
        game.category = this.item;
        Session.set("gameObject", game);
        Session.set("gamePlaying", '/game/category');
        Router.go('game.category');
      }
  }
  Ball.prototype.randomPosition = function(){
    var size = (stage.offsetWidth-this.size)/4;
    var sizeD = size*2;
    var t = 2 * Math.PI * (Math.random()*size);
    var u = (Math.random()*size)+(Math.random()*size);
    var r = u>sizeD ? sizeD-u : u;
    var x = r*Math.cos(t)
    var y = r*Math.sin(t);
    this.ball.style.left = stage.offsetLeft + sizeD+"px";
    this.ball.style.top = stage.offsetTop + sizeD+"px";
    this.ball.style.transform = 'translate('+x+'px,'+y+'px)';
  }
  Ball.prototype.generateRandomDirection = function(){
    var x = Math.random() > 0.5 ? (Math.random() +0.1)*20 : -(Math.random() +0.1)*20;
    var y = Math.random() > 0.5 ? (Math.random() +0.1)*20 : -(Math.random() +0.1)*20;
    return {x : x ,y :y}
  }
  Ball.prototype.move = function(){
    this.posx = this.posx + this.direction.x;
    this.posy = this.posy + this.direction.y;
    this.counter = this.counter + 1;
    this.ball.style.transform = 'translate('+this.posx+'px,'+this.posy+'px)';
    if(this.counter % 5 == 0) {
      if (
        (this.posx - this.ball.offsetWidth) > wWidth || 
        (this.posx + (this.size*2) + this.ball.offsetWidth) < 0 || 
        (this.posy - this.ball.offsetHeight) > wHeight || 
        (this.posy + (this.size*2) + this.ball.offsetHeight) < 0){
            this.resetPosition();
        }
    }

    if(!this.isSelected){
      if (!seletedBall){
        window.requestAnimationFrame(this.move.bind(this));
      }
      
    }
    else {
      window.requestAnimationFrame(this.fullSize.bind(this));
    }
    
  };
  Ball.prototype.resetPosition = function(){
    // Trash the element.

    if(!this.out) {
      var item = this.item;
      this.ball.remove();
      this.out = true;
      var newBall = new Ball(item);
      newBall.move(); 
      newBall.ball.classList.add('grow');
      ballsMp.push(newBall);
      currentBall = newBall;
    }
  }
  var generateBalls = function(balls){
    ballsMp =  balls.map(function(item){
      return new Ball(item)
    })
  }

  generateBalls(categories);

 
  // Meteor.call('generateCategoriesArray',function(error, result){
  //   generateBalls(result);
  //   console.log(result);
  // });
  
});
