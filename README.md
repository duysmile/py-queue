# Usage with RabbitMQ

1. Simple message broker
- Có thể sử dụng như message broker bình thường, với provider và consumer.
- Consumer có thể config để xử lý message liên tục, không cần quan tâm message được xử lý xong chưa `noAck: true`
- Consumer có thể dùng cơ chế `prefetch` để config số lượng message được xử lý đồng thời.
- Bản chất provider sẽ không trực tiếp đẩy message vào queue mà sẽ thông quan một component gọi là `exchange`
- Mặc định chúng ta không chỉ định `exchange` nào thì sẽ sử dụng `exchange ''` với type `direct`, là khi có 1 message gửi đến exchange này nó sẽ gửi đến 1 queue được chỉ định.
- Source: `./simple-queue`


2. Simple pub/sub
- Bản chất Rabbit sẽ không có pub/sub system, nó sẽ dựa vào 1 exchange type `fanout`.
- Exchange này có vai trò sẽ send message tới tất cả các queue được binding với nó.
- Source: `./simple-pubsub`

3. Binding key
- Binding thể hiện một quan hệ giữa queue và exchange. Có thể hiểu là queue sẽ thích thú với message từ exchange này
- Binding key có ý nghĩa thế nào phụ thuộc vào tùy loại exchange
    - `fanout` thì sẽ ko quan tâm tới binding key
    - `direct` message sẽ dùng binding key như là 1 routing key

### Rabbit commands:
```
# list all queues
rabbitmqctl list_queues name messages_ready messages_unacknowledged

# list all exchanges
rabbitmqctl list_exchanges

# list all bindings
rabbitmqctl list_bindings
```