const zmq = require('zeromq');

// Create a publisher socket
const publisher = zmq.socket('pub');

const bindAddress = 'tcp://127.0.0.1:3000'; // Binding address for publisher

// Bind the publisher to the address
publisher.bindSync(bindAddress);

console.log(`Publisher bound to ${bindAddress}`);

// Simulate sending messages every 1000ms
setInterval(() => {
  const topic = 'myTopic'; // Add a topic here
  const message = `Message from publisher: ${new Date().toISOString()}`;
  console.log('Publishing:', message);
  publisher.send([topic, message]); // Send the topic along with the message
}, 1000);

// Create a subscriber socket
const subscriber = zmq.socket('sub');

const connectAddress = 'tcp://127.0.0.1:3000'; // Connection address for subscriber

// Connect the subscriber to the address and subscribe to the topic
subscriber.connect(connectAddress);
const topic = 'myTopic'; // Subscribe to the same topic as the publisher
subscriber.subscribe(topic);

console.log(`Subscriber connected to ${connectAddress}`);

// Listen for incoming messages
subscriber.on('message', (topic, message) => {
  console.log(`Received: ${topic.toString()} - ${message.toString()}`);
});

process.on('SIGINT', () => {
  console.log('\nClosing sockets...');
  publisher.close();
  subscriber.close();
});