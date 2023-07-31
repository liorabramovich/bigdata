const { Kafka } = require('kafkajs');

const kafkaBrokers = ['localhost:9092'];
const kafka = new Kafka({ brokers: kafkaBrokers });
const producer = kafka.producer();
const topic = 'your_topic_name'; // Change this to your Kafka topic

const initProducer = async () => {
  try {
    await producer.connect();
    console.log('Connected to Kafka');
  } catch (error) {
    console.error('Error connecting to Kafka:', error);
  }
};

// Initialize the Kafka producer
initProducer();

const generateJson = () => {
  // Your logic to generate the JSON data goes here
  // Replace this with your actual data generation logic
  return {
    "id": 1,
    "name": "John Doe",
    "age": 30,
    "email": "john.doe@example.com",
    "date": "2023-07-30T12:34:56"
  };
};

const sendJsonToKafka = async () => {
  try {
    const json = generateJson(); // Generate your JSON data here
    console.log('Generated JSON:', json);

    // Sending the JSON data to Kafka
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(json) }],
    });

    console.log('JSON sent to Kafka:', json);
  } catch (error) {
    console.error('Error sending message to Kafka:', error);
  }
};

// Sending JSON to Kafka every 5 seconds (for demonstration purposes)
setInterval(sendJsonToKafka, 5000);
