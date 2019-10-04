
var amqp = require('amqplib/callback_api');
amqp.connect('amqp://localhost', function(err_0, connection){
    if (err_0) {
        throw err_0;
      }
      connection.createChannel(function(err_1, channel) {
          if(err_1){
              throw err_1
          }

          let queue = "basic";
          let text = "readline from some source and send";
          
          channel.assertQueue(queue, {
              durable: false
          });

          channel.sendToQueue(queue, Buffer.from(text));
          console.log("[!] Sent %s", text);
      });
      setTimeout(function(){
          connection.close();
         process.exit(0);}, 500);
});
