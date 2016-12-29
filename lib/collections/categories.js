Categories =  new  TAPi18n.Collection('categories', {
  languages: [ 'es', 'en' ],
  base_language: 'es'
});

/*
1 = Geography = GPS
2 = Characters =  = F2F
3 = History = Time Machine
4 = Jesus  Lessons = J12
5 = Words  and  Concepts = Dictionary
*/
Categories.attachI18nSchema({
    category: {
        type: String,        
        i18n: true
    },
    description: {
        type: String,        
        i18n: true
    },
    short: {
        type: String,        
        i18n: true,
        optional : true
    },
    code: {
        type: Number,
    },
    icon: {
        type: String,        
    },
    color: {
        type: String,     
        optional : true   
    }    
});
 

if (Meteor.isServer) {

  Categories.allow({
    insert: function (userId, doc) {

      // if(Roles.userIsInRole(Meteor.userId(), ['admin'])){
      //   return true;
      // }

      return false;
    },

    update: function (userId, doc, fieldNames, modifier) {

      if(Roles.userIsInRole(Meteor.userId(), ['admin'])){
        return true;
      }

      return false;
    },

    remove: function (userId, doc) {

      // if(Roles.userIsInRole(Meteor.userId(), ['admin'])){
      //   return true;
      // }

      return false;
    }
  });


}
