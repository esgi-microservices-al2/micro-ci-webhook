"use strict";

var amqp = require('amqplib/callback_api');

function sendMessage(rountingKey, payload, callback) {
    let err = null;
    let res = null;
    let callbackCalled = false;
    amqp.connect('amqp://'.concat(process.env.BROKER_IP), function (error0, connection) {
        try {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1;
                }

                let exchange = 'amq.topic';
                channel.assertExchange(exchange, 'topic', {
                    durable: true
                });

                let queue = "al2.payload.q";
                channel.assertQueue(queue, {
                    durable: true
                }, function(error2, q) {
                    if (error2) {
                        throw error2;
                    }
                    channel.bindQueue(q.queue, exchange, "webhook.payload");
                    channel.publish(exchange, rountingKey, Buffer.from(JSON.stringify(payload)));
                    res = "[x] Sent %s:'%s'" + rountingKey + ":" + payload;

                    callbackCalled = callback(null, res);
                });


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
