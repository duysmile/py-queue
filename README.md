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
    - `direct` message sẽ dùng binding key như là 1 routing key, có thể dùng để phân loại message, message sẽ được đưa đến đúng những consumer cần.

4. Topic exchange
- Message được gửi tới topic exchange thì có một `routing_key` không phải là 1 từ bất kì, mà bắt buộc phải là một list các từ ngăn cách bởi dấu chấm, limit là 255 bytes.
- Với topic exchange thì message được route tương tự như với direct exchange, nhưng chúng ta có thể dùng wildcard thay vì phải chỉ định chính xác routing key
    - `*`: đại diện cho 1 từ bất kì (mỗi từ ngăn cách nhau bởi dấu chấm)
    - `#`: có thể đại diện cho 0 hoặc nhiều từ

5. Config auth cho RabbitMQ
- Mặc định thì rabbit chạy lên sẽ có user guest
- Nếu muốn đổi user default thì chỉnh sửa trong file /etc/rabbitmq/rabbitmq.conf
```
loopback_users.guest = true
listeners.tcp.default = 5672
management.tcp.port = 15672

default_user = <username>
# default is "guest"
default_pass = <password hashed in SHA512>
```

### Rabbit commands:
```
# list all queues
rabbitmqctl list_queues name messages_ready messages_unacknowledged

# list all exchanges
rabbitmqctl list_exchanges

# list all bindings
rabbitmqctl list_bindings

# add user
rabbitmqctl add_user "username"ơ

# set permissions
rabbitmqctl set_permissions -p "custom-vhost" "username" ".*" ".*" ".*"
```