#!/usr/bin/env node
var amqp = require('amqplib/callback_api');
amqp.connect('amqp://localhost', function (err_0, connection) {
    if (err_0) {
        throw err_0;
    }
    connection.createChannel(function (err_1, channel) {
        if (err_1) {
            throw err_1;
        }
        var exchange = "topic.logs";
        var args = process.argv.slice(2);
        var key = (args.length > 0) ? args[0] : 'anonymus.info';
        var text = args.slice(1).join(' ') || "readline from some source and send";
        channel.assertExchange(exchange, 'topic', {
            durable: false
        });
        channel.publish(exchange, key, Buffer.from(text));
        console.log("[!] Sent -> %s", text);
    });
    setTimeout(function () {
        connection.close();
        process.exit(0);
    }, 500);
});
