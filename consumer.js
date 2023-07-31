const { Kafka } = require('kafkajs');
const { Client } = require('@elastic/elasticsearch');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 4000;

// Kafka setup
const kafkaBrokers = ['localhost:9092'];
const kafka = new Kafka({
  clientId: 'my-kafka-consumer',
  brokers: kafkaBrokers,
});
const consumer = kafka.consumer({ groupId: 'my-group' });
const topic = 'your_topic_name'; // Change this to your Kafka topic

// Elasticsearch setup
const esHost = 'http://localhost:9200';
const esClient = new Client({ node: esHost });

const initConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const json = JSON.parse(message.value.toString());
      await indexToElasticsearch(json);
    },
  });
};

const indexToElasticsearch = async (json) => {
  try {
    await esClient.index({
      index: 'date', // Change this to your Elasticsearch index name
      body: json,
    });
    console.log('JSON data indexed to Elasticsearch:', json);
  } catch (error) {
    console.error('Error indexing data to Elasticsearch:', error);
  }
};

// Initialize the Kafka consumer
initConsumer();

app.use(bodyParser.json());

// Route to search JSON data in Elasticsearch
app.post('/search', async (req, res) => {
  const searchQuery = req.body.query; // The search query provided from the dashboard
  console.log("here1");
  try {
    const { body } = await esClient.search({
      index: 'date', // Change this to your Elasticsearch index name
      
      body: {
        query: {
          
          match: {
            
            date: searchQuery, // Change 'date' to the key you want to search by in your JSON documents
          },
        },
      },
    });
    console.log("here2");
    const searchResults = body.hits.hits.map((hit) => hit._source);
    res.json({ results: searchResults });
  } catch (error) {
    console.error('Error searching data in Elasticsearch:', error);
    res.status(500).json({ error: 'Error searching data in Elasticsearch' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});