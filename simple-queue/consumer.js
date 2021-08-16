const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, connection) => {
    if (err) {
        throw err;
    }

    connection.createChannel((err, channel) => {
        if (err) {
            throw err;
        }

        const queue = 'hello';

        channel.assertQueue(queue, {
            durable: true,
        });

        channel.prefetch(1); // limit 1 message is consumed at a time
        console.log(' [x] Waiting for message in %s. To exit press Ctrl + C', queue);
        channel.consume(queue, msg => {
            const secs = msg.content.toString().split('.').length - 1;
            console.log(' [x] Receive %s', msg.content.toString());

            setTimeout(function () {
                console.log(" [x] Done");
                channel.ack(msg);
            }, secs * 1000);
        }, {
            noAck: false,
        });
    });
})
