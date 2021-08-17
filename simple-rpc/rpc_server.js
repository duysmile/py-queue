const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, connection) => {
    if (err) {
        throw err;
    }

    connection.createChannel((err, channel) => {
        if (err) {
            throw err;
        }

        const queue = 'rpc_queue';

        channel.assertQueue(queue, {
            durable: true,
        });

        channel.prefetch(1); // limit 1 message is consumed at a time
        console.log(' [x] Awaiting RPC requests');
        channel.consume(queue, msg => {
            const n = parseInt(msg.content.toString());

            console.log(" [.] fib(%d)", n);
            const r = fibonacci(n);
            channel.sendToQueue(
                msg.properties.replyTo,
                Buffer.from(r.toString()),
                {
                    correlationId: msg.properties.correlationId,
                },
            );

            channel.ack(msg);
        }, {
            noAck: false,
        });
    });
});

function fibonacci(n) {
    if (n == 0 || n == 1)
        return n;
    else
        return fibonacci(n - 1) + fibonacci(n - 2);
}
