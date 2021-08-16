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
        const message = process.argv.slice(2).join(' ') || "Hello World!";

        channel.assertQueue(queue, {
            durable: true,
        });

        channel.sendToQueue(queue, Buffer.from(message), {
            persistent: true,
        });
        console.log(' [x] Send %s', message);

        setTimeout(function () {
            connection.close();
            process.exit(0)
        }, 500);
    });
});
