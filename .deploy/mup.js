module.exports = {
  servers: {
    one: {
      host: '159.203.89.18',
      username: 'root',
      pem: "/Users/gilles/.ssh/digital_rsa",
    },
  },

  meteor: {
    name: 'b12',
    path: '../',
    servers: {
      one: {},
    },
    env: {
      ROOT_URL: 'http://app.triviab12.com',
      MONGO_URL: 'mongodb://localhost/meteor'
    },
    dockerImage: 'abernix/meteord:base', //optional
    deployCheckWaitTime: 60 //default 10

  },

  mongo: {
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};
