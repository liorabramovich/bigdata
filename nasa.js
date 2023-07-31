const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const { Client } = require('@elastic/elasticsearch');
const app = express();

const server = http.createServer((req, res) => {
  if (req.url === '/nasa') {
    // This is the code for fetching data from the NASA API
    const apiKey = 'tqZPBNrSbKGZLeeeh8qmXl57Hl4OExSauAGRvfA4';
    const startDate = '2023-01-07';
    const endDate = '2023-01-07';
    const apiUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;

    https.get(apiUrl, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        // Set the appropriate headers for the response
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);

        // Send the NASA API data as the response to the client
        res.end(data, 'utf-8');
      });
    }).on('error', (error) => {
      console.error('Error occurred:', error);
      // If there's an error fetching data from the NASA API, return an error response
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'An error occurred while fetching data from NASA API.' }));
    });
  } else {
    // Handle other requests as before
    let filePath = '.' + req.url;
    if (filePath === './') {
      filePath = './index.html'; // Replace 'index.html' with the entry point of your dashboard
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      // Add other content types if necessary
    };

    const contentTypeHeader = { 'Content-Type': contentType[extname] || 'text/plain' };

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404, contentTypeHeader);
        res.end('404 Not Found');
      } else {
        res.writeHead(200, contentTypeHeader);
        res.end(content, 'utf-8');
      }
    });
  }
  // Route to search JSON data in Elasticsearch
app.use(express.json());

app.post('/search', async (req, res) => {
  const searchQuery = req.body.query;

  try {
    const { body } = await esClient.search({
      index: 'date', // Replace this with your Elasticsearch index name
      body: {
        query: {
          match: {
            date: searchQuery, // Change 'date' to the key you want to search by in your JSON documents
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

});

const port = 3001; // Replace with the desired port number
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
