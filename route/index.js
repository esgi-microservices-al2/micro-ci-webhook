"use strict";
var consul_register = require("../consul/consul");

class RouterBuilder {
    build(app) {

        app.use(function (req, res, next) {


            consul_register();
            // Website you wish to allow to connect
            /*res.setHeader('Access-Control-Allow-Origin', '*');
      
            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      
            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,X-Requested-With,content-type, x-request-id');
      
            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            res.setHeader('Access-Control-Allow-Credentials', true);*/
      
            // Pass to next layer of middleware
            next();
          });
        app.use('/', require('./hook_endpoint'));
        app.use('/doc', require('./doc_endpoint'));
    }
}

module.exports = new RouterBuilder();