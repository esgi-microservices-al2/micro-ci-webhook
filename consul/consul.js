"use strict";

var consul = require('consul');

function consul_register(){
    const CONSUL_ID = require('uuid').v4();
    const HOST =  process.env.CONSUL_HOST;
    const PORT = process.env.CONSUL_PORT;

    let consulOptions = {
      host: HOST,
      port: PORT,
      secure: false,
      defaults: { token: process.env.CONSUL_TOKEN }
    };

    let consulClient = consul(consulOptions);

    let details = {
      name: 'webhook',
      id: CONSUL_ID,
      address: '127.0.0.1',
      port: +process.env.WEBHOOK_PORT,
      tags: ['traefik.enable=true',
        'traefik.frontend.entryPoints=http',
        'traefik.frontend.rule=PathPrefixStrip:/webhook/'],
      check: {
        deregistercriticalserviceafter: '1m',
        ttl: '10s'
      }
    };

    var isRegistered = false;

    consulClient.agent.service.register(details, err => {
	if (err) throw err;
	isRegistered = true;
	console.log(`Successfuly registered service with ID of ${CONSUL_ID}`);
	setInterval(() => {
            consulClient.agent.check.pass({id:`service:${CONSUL_ID}`}, err => {
                if (err) throw err;
                console.log('told Consul that we are healthy');
            });
        }, 5 * 1000);
    });

    process.on('SIGINT', () => {
        if (isRegistered) {
	    console.log(`De-registering service with ID of ${CONSUL_ID} from consul`);
            consulClient.agent.service.deregister(CONSUL_ID, (err) => {
      	        if (err) console.log("Error de§registering service from consul: " + err);
                if (!err) {
                isRegistered = false;
                    console.log(`De-registered service with ID of ${CONSUL_ID}`)
                }
	        });
	    }
    });
}

module.exports = consul_register;
