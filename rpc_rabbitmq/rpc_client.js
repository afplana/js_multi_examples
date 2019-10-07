#!/usr/bin/env node

let amqp = require('amqplib/callback_api');

var args = process.argv.slice(2);

if (args.length == 0) {
    console.log("Usage: rpc_client.js num");
    process.exit(1);
}

amqp.connect('amqp://localhost', (err_0, connection) => {
    if (err_0) {
        throw err_0;
    }

    connection.createChannel((err_1, channel) => {
        if (err_1) {
            throw err_1;
        }

        channel.assertQueue('', {
            exclusive: true
        }, (err_2, q) => {
            if (err_2) {
                throw err_2;
            }

            var correlationId = generateUuid();
            var num = parseInt(args[0]);

            console.log(' [x] Requesting fib(%d)', num);

            channel.consume(q.queue, (msg) => {
                if (msg.properties.correlationId == correlationId) {
                    console.log(' [.] Got %s', msg.content.toString());
                    setTimeout(() => {
                        connection.close();
                        process.exit(0)
                    }, 500);
                }
            }, {
                noAck: true
            });

            channel.sendToQueue('rpc_queue', Buffer.from(num.toString()), { correlationId: correlationId, replyTo: q.queue });
        });
    });
});

function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}