"use strict";

var consul = require('consul')();

function consul_register(){
    const CONSUL_ID = require('uuid').v4();
    const HOST =  process.env.CONSUL_HOST;
    const PORT = process.env.CONSUL_PORT;
    
    let details = {
      name: 'webhook',
      address: HOST,
      port: PORT,
      id: CONSUL_ID,
      check: {
        ttl: '10s',
        deregister_critical_service_after: '1m',
        deregistercriticalserviceafter: '1m',
        tcp: `${HOST}:${PORT}`,
        timeout: '3s',
        interval: '1s'
      }
    };

    let details2 = {
      name: 'webhook',
      id: CONSUL_ID,
      address: HOST,
      port: PORT,
      check: {
        deregistercriticalserviceafter: '1m',
        tcp: `${HOST}:${PORT}`,
        timeout: '3s',
        interval: '1s'
      }
    }
    
    //console.log(`${CONSUL_ID}`);
    console.log(details);
    
    consul.agent.service.register(details2, err => {
      if (err) throw new Error(err);
      console.log('told Consul that we are healthy');
    });

    /*consul.agent.service.register({
      id: CONSUL_ID,
      name: 'webhook',
      address: '${HOST}',
      port: PORT,
      tags: ['webhook'],
      check: {
        deregistercriticalserviceafter: '1m',
        tcp: `${HOST}:${PORT}`,
        timeout: '3s',
        interval: '1s'
      }
     }, () => {
    
      const unregisterService = (err) => {
       consul.agent.service.deregister(CONSUL_ID, () => {
        process.exit(err ? 1 : 0);
       });
      };
    });*/
    consul.agent.service.register(details, err => {
        setInterval(() => {
            consul.agent.check.pass({id:`service:${CONSUL_ID}`}, err => {
              if (err) throw new Error(err);
              console.log('told Consul that we are healthy');
            });
          }, 5 * 1000);
    });
  }

module.exports = consul_register;
//export default consul_register;