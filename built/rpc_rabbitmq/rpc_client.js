#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var callback_api_1 = require("amqplib/callback_api");
var args = process.argv.slice(2);
if (args.length == 0) {
    console.log("Usage: rpc_client.js num");
    process.exit(1);
}
callback_api_1.connect('amqp://localhost', function (err_0, connection) {
    if (err_0) {
        throw err_0;
    }
    connection.createChannel(function (err_1, channel) {
        if (err_1) {
            throw err_1;
        }
        channel.assertQueue('', {
            exclusive: true
        }, function (err_2, q) {
            if (err_2) {
                throw err_2;
            }
            var correlationId = generateUuid();
            var num = parseInt(args[0]);
            console.log(' [x] Requesting fib(%d)', num);
            channel.consume(q.queue, function (msg) {
                if (msg.properties.correlationId == correlationId) {
                    console.log(' [.] Got %s', msg.content.toString());
                    setTimeout(function () {
                        connection.close();
                        process.exit(0);
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
