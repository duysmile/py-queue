import pika
import sys
import os
import json
import requests

SERVER_API_KEY = 'wWPBZb7rKryrXLABP62cu2S6WqfSxcaQ'

def get_callback_url(callback_url):
    return callback_url + "/api/v1/outbound-calls"


def main():
    credentials = pika.PlainCredentials('admin', 'admin')
    parameters = pika.ConnectionParameters(
        'localhost', credentials=credentials)
    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()

    channel.queue_declare(queue='hello', durable=True)

    def callback(ch, method, properties, body):
        data = body.decode('utf-8')
        dict_data = json.loads(data)
        print(" [x] Received %r" % dict_data)

        callback_url = 'http://gateway-staging.vnlp.ai'
        r = requests.post(
            get_callback_url(callback_url),
            data=(dict_data),
            headers={'authorization': SERVER_API_KEY}
        )

        ch.basic_ack(delivery_tag=method.delivery_tag)

    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(
        queue='hello', on_message_callback=callback)

    print(' [*] Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
