const express = require('express');
const { Client } = require('@elastic/elasticsearch');
const bodyParser = require('body-parser');

const app = express();
const port = 3017;

// Elasticsearch setup
const esHost = 'http://localhost:9200';
const esClient = new Client({ node: esHost });

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve your card dashboard here, e.g., by using a static folder for the HTML, CSS, and JS files.

// Route to handle search requests
app.post('/search', async (req, res) => {
  const searchQuery = req.body.query;

  try {
    const { body } = await esClient.search({
      index: 'date', // Change this to your Elasticsearch index name
      body: {
        query: {
          match: {
            _all: searchQuery, // Change '_all' to the field you want to search by in your JSON documents
          },
        },
      },
    });

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
