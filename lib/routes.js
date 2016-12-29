Router.configure({
  layoutTemplate: 'PagesLayout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound',
   waitOn: function () {

      Session.equals("selectedPost", this._id)

      //Scroll top
      if($('.content-nav').length){
         $('.content-nav').scrollTop(0);
      }
     
      //Opcional, testear
        Session.set("showLoadingIndicator", true);

        TAPi18n.setLanguage(getUserLanguage()).done(function () {
          Session.set("showLoadingIndicator", false);
        })
        .fail(function (error_message) {
          // Handle the situation
          console.log(error_message);
        });

   },
   onBeforeAction : function(){

    // if (Session.equals("gamePlaying", false) || !Meteor.userId() || Session.equals("gamePlaying", this.url)) {
    //   this.next();
    // } else {
    //   this.redirect(Session.get('gamePlaying'));
    // }

    this.next();

   }

});

var mustBeSignedIn = function(pause) {
  if (!(Meteor.user() || Meteor.loggingIn())) {
    this.redirect('/login');
  } else {
    this.next();
  }
};

var goToAdmin = function(pause) {
  if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
    Router.go('home');
  } else {
    this.next();
  }
};

var goToHome = function(pause) {
  if (Meteor.user()) {
    Router.go('home');
  } else {
    this.next();
  }
};

Router.onBeforeAction(mustBeSignedIn, {except: ['login']});

Router.route('/', {
  layoutTemplate: 'PagesLayout',
  name: 'home',
  controller: 'HomeController',
  where: 'client'
});

Router.route('chat', {
  layoutTemplate: 'PagesLayout',
  name: 'chat',
  controller: 'ChatController',
  where: 'client',
  data: function () {
    return Chats.find({}, {sort: {lastUpdateAt: -1}}).fetch();
  },
});


Router.route('chat/new', {
  layoutTemplate: 'MasterLayout',
  name: 'chat.new',
  controller: 'ChatController',
  where: 'client'
});

Router.route('chat/room/:_id', {
  layoutTemplate: 'MasterLayout',
  name: 'chat.room',
  where: 'client',
  controller: 'ChatController',
  data: function () {
    return Chats.findOne({_id : this.params._id});
  },
});

Router.route('loading', {
  layoutTemplate: 'Loading',
  name: 'Loading',
  where: 'client'
});

Router.route('ranking', {
  layoutTemplate: 'PagesLayout',
  name: 'ranking',
  controller: 'RankingController',
  where: 'client'
});

// Menu

Router.route('menu', {
  layoutTemplate: 'PagesLayout',
  name: 'menu',
  controller: 'MenuController',
  where: 'client'
});

  Router.route('menu/profile', {
    layoutTemplate: 'PagesLayout',
    name: 'menu.profile',
    controller: 'MenuController',
    where: 'client'
  });

  Router.route('menu/perfil', {
    layoutTemplate: 'PagesLayout',
    name: 'menu.perfil',
    controller: 'MenuController',
    where: 'client'
  });

  // Perfil

  Router.route('menu/perfil/cuenta', {
    layoutTemplate: 'PagesLayout',
    name: 'menu.perfil.cuenta',
    controller: 'MenuController',
    where: 'client'
  });

  Router.route('menu/perfil/rendimiento', {
    layoutTemplate: 'PagesLayout',
    name: 'menu.perfil.rendimiento',
    controller: 'MenuController',
    where: 'client'
  });

  Router.route('menu/perfil/nacionalidad', {
    layoutTemplate: 'PagesLayout',
    name: 'menu.perfil.nacionalidad',
    controller: 'MenuController',
    where: 'client'
  });


  // Perfil end

  Router.route('menu/preferencias', {
    layoutTemplate: 'PagesLayout',
    name: 'menu.preferencias',
    controller: 'MenuController',
    where: 'client'
  });

  Router.route('menu/tienda', {
    layoutTemplate: 'PagesLayout',
    name: 'menu.tienda',
    controller: 'MenuController',
    where: 'client'
  });

  Router.route('menu/coupons', {
    layoutTemplate: 'PagesLayout',
    name: 'menu.coupons',
    controller: 'MenuController',
    where: 'client'
  });

  Router.route('menu/sugerir', {
    layoutTemplate: 'PagesLayout',
    name: 'menu.sugerir',
    controller: 'MenuController',
    where: 'client'
  });

  Router.route('menu/sugerir/nueva', {
    layoutTemplate: 'PagesLayout',
    name: 'menu.sugerir.nueva',
    controller: 'QuestionsController',
    where: 'client'
  });

  Router.route('menu/sugerir/mis', {
    layoutTemplate: 'PagesLayout',
    name: 'menu.sugerir.mis',
    controller: 'MenuController',
    where: 'client'
  });


  Router.route('menu/mensajes', {
    layoutTemplate: 'PagesLayout',
    name: 'menu.mensajes',
    controller: 'MenuController',
    where: 'client'
  });

  Router.route('menu/facebook', {
    layoutTemplate: 'PagesLayout',
    name: 'menu.facebook',
    controller: 'MenuController',
    where: 'client'
  });

  Router.route('menu/twitter', {
    layoutTemplate: 'PagesLayout',
    name: 'menu.twitter',
    controller: 'MenuController',
    where: 'client'
  });

  Router.route('menu/categorias', {
    layoutTemplate: 'PagesLayout',
    name: 'menu.categorias',
    controller: 'MenuController',
    where: 'client'
  });

  Router.route('menu/ayuda', {
    layoutTemplate: 'PagesLayout',
    name: 'menu.ayuda',
    controller: 'MenuController',
    where: 'client'
  });

  Router.route('menu/ayuda/reglamento', {
    layoutTemplate: 'PagesLayout',
    name: 'menu.ayuda.reglamento',
    controller: 'MenuController',
    where: 'client'
  });

  Router.route('menu/ayuda/soporte', {
    layoutTemplate: 'PagesLayout',
    name: 'menu.ayuda.soporte',
    controller: 'MenuController',
    where: 'client'
  });

  Router.route('menu/ayuda/terminos', {
    layoutTemplate: 'PagesLayout',
    name: 'menu.ayuda.terminos',
    controller: 'MenuController',
    where: 'client'
  });

  Router.route('menu/ayuda/politica', {
    layoutTemplate: 'PagesLayout',
    name: 'menu.ayuda.politica',
    controller: 'MenuController',
    where: 'client'
  });

  Router.route('menu/ayuda/acerca', {
    layoutTemplate: 'PagesLayout',
    name: 'menu.ayuda.acerca',
    controller: 'MenuController',
    where: 'client'
  });

// End menu

Router.route('game', {
  layoutTemplate: 'GameLayout',
  name: 'game',
  controller: 'GameController',
  where: 'client'
});

Router.route('game/friends', {
  layoutTemplate: 'GameLayout',
  name: 'game.friends',
  controller: 'GameController',
  where: 'client'
});

Router.route('game/start', {
  layoutTemplate: 'GameLayout',
  name: 'game.start',
  controller: 'GameController',
  where: 'client'
});

Router.route('game/category', {
  layoutTemplate: 'GameLayout',
  name: 'game.category',
  controller: 'GameController',
  where: 'client'
});


Router.route('game/play', {
  layoutTemplate: 'GameLayout',
  name: 'game.play',
  controller: 'GameController',
  where: 'client'
});



Router.route('game/feed', {
  layoutTemplate: 'GameLayout',
  name: 'game.feed',
  controller: 'GameController',
  where: 'client'
});

Router.route('game/score', {
  layoutTemplate: 'GameLayout',
  name: 'game.score',
  controller: 'GameController',
  where: 'client'
});

Router.route('game/stats', {
  layoutTemplate: 'GameLayout',
  template: 'MenuPerfilRendimiento',
  name: 'game.stats',
  controller: 'GameController',
  where: 'client'
});

Router.route('game/ranking', {
  layoutTemplate: 'GameLayout',
  template: 'Ranking',
  name: 'game.ranking',
  controller: 'GameController',
  where: 'client'
});

Router.route('game/categories', {
  layoutTemplate: 'GameLayout',
  template: 'MenuCategorias',
  name: 'game.categories',
  controller: 'GameController',
  where: 'client'
});

Router.route('login', {
  layoutTemplate: 'MasterLayout',
  name: 'login',
  controller: 'LoginController',
  where: 'client',
  onBeforeAction : goToHome
});

Router.route('admin', {
  name: 'admin',
  controller: 'AdminController',
  where: 'client',
  onBeforeAction : goToAdmin
});

// Router.route('admin/usuarios', {
//   name: 'admin.usuarios',
//   controller: 'UsersController',
//   where: 'client',
//   onBeforeAction : goToAdmin
// });

Router.route('admin/preguntas/editar/:_id', {
  name: 'admin.preguntas.editar',
  controller: 'QuestionsController', //QuestionsController
  where: 'client',
  onBeforeAction : goToAdmin
});

Router.route('admin/categorias', {
  name: 'admin.categorias',
  controller: 'CategoriesController',
  where: 'client',
  onBeforeAction : goToAdmin
});

Router.route('admin/coupons', {
  name: 'admin.coupons',
  controller: 'CategoriesController',
  where: 'client',
  onBeforeAction : goToAdmin
});

Router.route('admin/preguntas', {
  name: 'admin.preguntas',
  controller: 'QuestionsController',
  where: 'client',
  onBeforeAction : goToAdmin
});


Router.route('admin/categorias/editar/:_id', {
  name: 'admin.categorias.editar',
  controller: 'CategoriesController',
  where: 'client',
  onBeforeAction : goToAdmin
});