Chats = new Mongo.Collection('chats');

var Schema = {};

Schema.Users = new SimpleSchema({
    _id: {
        type: String,
    },
});

Schema.Message = new SimpleSchema({
  createdAt : {
    type : Date
  },
  message : {
    type : String
  },
  userId : {
    type : String
  }
});

Schema.Chats = new SimpleSchema({
  createdAt : {
    type : Date
  },
  lastUpdateAt : {
    type : Date
  },
  messages : {
    type : [Schema.Message],
    optional: true,
  },
  users : {
    type: [Schema.Users]
  }
});

Chats.attachSchema(Schema.Chats);

