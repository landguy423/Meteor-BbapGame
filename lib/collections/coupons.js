Coupons = new Mongo.Collection('coupons');

var Schema = {};

Schema.Coupons = new SimpleSchema({
  key : {
    type : String,
  },
  retry: {
    type: Number,
  },
  vv: {
    type: Number,
  },
  vp: {
    type: Number,
  },
  used : {
    type: Boolean
  }
});

Coupons.attachSchema(Schema.Coupons);