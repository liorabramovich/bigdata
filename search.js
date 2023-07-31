const { Client } = require('@elastic/elasticsearch');

const elasticsearchNode = 'http://localhost:9200'; // Replace with your Elasticsearch node address

const client = new Client({ node: elasticsearchNode });

const runSearch = async () => {
  try {
    const searchQuery = {
      index: 'your_index_name', // Replace with the name of the index you used in the consumer
      body: {
        query: {
          match: {
            // Replace 'foo' with the field you want to search in
            // Replace 'bar' with the value you want to search for
            'foo': 'bar',
          },
        },
      },
    };

    const { body } = await client.search(searchQuery);

    const searchResults = body.hits.hits.map((hit) => hit._source);

    console.log('Search results:', searchResults);
  } catch (error) {
    console.error('Error searching data:', error);
  }
};

runSearch();
