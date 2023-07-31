const searchJson = () => {
    const searchDate = document.getElementById('searchDate').value;
  
    // Send a POST request to the backend server (Kafka consumer) with the search date
    fetch('http://localhost:4000/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: searchDate }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Display the JSON data in the dashboard
        const jsonContainer = document.getElementById('jsonContainer');
        jsonContainer.innerHTML = ''; // Clear previous data
  
        data.results.forEach((json) => {
          const jsonElement = document.createElement('pre');
          jsonElement.textContent = JSON.stringify(json, null, 2);
          jsonContainer.appendChild(jsonElement);
        });
      })
      .catch((error) => {
        console.error('Error searching data:', error);
      });
  };
  