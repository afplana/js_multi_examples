#!/usr/bin/env node

let amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err_0, connection) => {
    if (err_0) {
        throw err_0;
    }

    connection.createChannel((err_1, channel) => {
        if (err_1) {
            throw err_1;
        }

        var queue = 'rpc_queue';


        channel.assertQueue(queue, { durable: false });
        channel.prefetch(1);

        console.log('[!] Awaiting RPC requests');

        channel.consume(queue,function replay(msg) {
            var n = parseInt(msg.content.toString());
            console.log('[!] fib(%d)', n);

            var r = fibonacci(n);

            channel.sendToQueue(msg.properties.replyTo, Buffer.from(r.toString()), {
                correlationId: msg.properties.correlationId
            });

            channel.ack(msg);
        });
    });
});

function fibonacci(n){
    if(n == 0 || n == 1){
        return n;
    } else {
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}