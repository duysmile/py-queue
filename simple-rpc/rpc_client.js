const amqp = require('amqplib/callback_api');

const args = process.argv.slice(2);

if (args.length == 0) {
    console.log("Usage: rpc_client.js num");
    process.exit(1);
}

amqp.connect('amqp://localhost', (err, connection) => {
    if (err) {
        throw err;
    }

    connection.createChannel((err, channel) => {
        if (err) {
            throw err;
        }

        channel.assertQueue('', {
            exclusive: true,
        }, (err, q) => {
            if (err) {
                throw err;
            }

            const correlationId = generateUuid();
            const num = parseInt(args[0]);

            console.log(' [x] Requesting fib(%d)', num);

            channel.consume(q.queue, (msg) => {
                if (msg.properties.correlationId == correlationId) {
                    console.log(' [.] Got %s', msg.content.toString());
                    setTimeout(function () {
                        connection.close();
                        process.exit(0)
                    }, 500);
                }
            }, {
                noAck: true,
            });

            channel.sendToQueue('rpc_queue', Buffer.from(num.toString()), {
                correlationId,
                replyTo: q.queue,
            });
            console.log(' [x] Send %s', num.toString());
        });
    });
});

function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}
