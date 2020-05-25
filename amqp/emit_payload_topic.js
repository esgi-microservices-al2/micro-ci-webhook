"use strict";

var amqp = require('amqplib/callback_api');

function sendMessage(rountingKey, message, callback) {
    let err = null;
    let res = null;
    let callbackCalled = false;
    amqp.connect('amqp://'.concat(process.env.BROKER_URL), function (error0, connection) {
        try {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1;
                }

                let exchange = 'webhook_messages';
                channel.assertExchange(exchange, 'topic', {
                    durable: true
                });
                channel.publish(exchange, rountingKey, Buffer.from(message));
                res = "[x] Sent %s:'%s'" + rountingKey + ":" + message;

                callbackCalled = callback(null, res);
            });
        } catch (e) {
            //TODO: Log the error, console.log for the moment
            console.log(e);
            callbackCalled = callback(e);
        }



        setTimeout(function () {
            if(!callbackCalled) {
                connection.close();
                return callback(err="Timeout")
            }
        }, 2000);
    });
}

module.exports = sendMessage;
