#!/usr/bin/env node

let amqp = require('amqplib/callback_api');
let args = process.argv.slice(2);

if (args.length == 0) {
    console.log("Usage: receive_logs_topic.js <facility>.<severity>");
    process.exit(1);
}

amqp.connect("amqp://localhost", function (err_0, connection) {
    if (err_0) {
        throw err_0;
    }

    connection.createChannel(function (err_1, channel) {
        if (err_1) {
            throw err_1;
        }


        let exchange = "topic.logs";

        channel.assertExchange(exchange, 'topic', { durable: false });
        channel.assertQueue('', {exclusive: true}, function(err_2, q) {
            if(err_2) {
                throw err_2;
            }
            console.log("[!] Waiting for logs. To exit press CTRL+C");
            args.forEach(function(key) {
                channel.bindQueue(q.queue, exchange, key);
            });

            channel.consume(q.queue, function(msg) {
                console.log("[!] %s -> '%s'", msg.fields.routingKey, msg.content.toString());
            }, {
                noAck: true
            });

        });
    });
});

