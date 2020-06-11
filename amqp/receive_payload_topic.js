"use strict";

var amqp = require('amqplib/callback_api');


function receiveMessage(routingKey) {
    amqp.connect('amqp://'.concat(process.env.BROKER_IP), function(error0, connection) {
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            var exchange = 'webhook_messages';

            channel.assertExchange(exchange, 'topic', {
                durable: true
            });

            channel.assertQueue('webhook_api', {
                exclusive: true
            }, function(error2, q) {
                if (error2) {
                    throw error2;
                }
                console.log(' [*] Waiting for logs. To exit press CTRL+C');

                // Binds queue to exchange
                channel.bindQueue(q.queue, exchange, routingKey);

                channel.consume(q.queue, function(msg) {
                    console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
                }, {
                    noAck: true
                });
            });
        });
    });
}

module.exports = receiveMessage;
