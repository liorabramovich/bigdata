let RAString; // Declare a variable to store the RA string
let DECString; // Declare a variable to store the DEC string

// Function to generate a random date within a specified date range
function getRandomDate(startDate, endDate) {
    const startTimestamp = startDate.getTime();
    const endTimestamp = endDate.getTime();
    const randomTimestamp = Math.random() * (endTimestamp - startTimestamp) + startTimestamp;
    return new Date(randomTimestamp);
  }
  
  // Example usage:
  const startDate = new Date('2023-01-01');
  const endDate = new Date('2023-12-31');
  
  const randomDate = getRandomDate(startDate, endDate);
  //console.log(randomDate.toISOString()); // Output the random date in ISO format

  function getRandomTelescopeName() {
    const telescopeNames = [
      "European Extremely Large Telescope",
      "Thirty Meter Telescope",
      "The Giant Magellan Telescope",
      "Gran Telescopio Canarias",
      "Hobby-Eberly Telescope",
      "Keck 1 and 2",
      "Southern African Large Telescope",
      "Large Binocular Telescope",
      "Subaru Telescope",
      "Very Large Telescope",
      "Gemini Observatory Telescopes",
      "MMT",
    ];
  
    const randomIndex = Math.floor(Math.random() * telescopeNames.length);
    return telescopeNames[randomIndex];
  }
  

  // Example usage:
  const randomTelescopeName = getRandomTelescopeName();
  //console.log(randomTelescopeName);
  
  const Redis = require('ioredis');




// Function to get a random key from the JSON stored in Redis and extract RA and DEC elements
async function getRandomRADECFromJSON() {
  const redis = new Redis();

  try {
    // Get all keys from Redis (assuming all keys represent JSON lines)
    const allKeys = await redis.keys('*');

    if (allKeys.length === 0) {
      console.log('No keys found in Redis.');
      return null;
    }

    // Select a random key from the available keys
    const randomKey = allKeys[Math.floor(Math.random() * allKeys.length)];

    // Retrieve the JSON line associated with the random key
    const jsonLine = await redis.get(randomKey);

    if (!jsonLine) {
      console.log('JSON line not found for the selected key.');
      return null;
    }

    // Parse the JSON line to an object
    const jsonObject = JSON.parse(jsonLine);

    // Extract the "RA" and "DEC" elements
    const RA = jsonObject.RA;
    const DEC = jsonObject.DEC;

    RAString = RA;
    DECString = DEC;

    return { RA, DEC };
  } catch (error) {
    console.error('Error retrieving data from Redis:', error);
    return null;
  } finally {
    redis.disconnect(); // Close the Redis connection
  }
}




  
  
  function getRandomNameFromList(namesList) {
    if (!Array.isArray(namesList) || namesList.length === 0) {
      return null; // Return null if the input is not a non-empty array
    }
  
    const randomIndex = Math.floor(Math.random() * namesList.length);
    return namesList[randomIndex];
  }
  
  
  // Example usage:
  const namesList = [
    "GRB",
    "Apparent Brightness Rise",
    "UV Rise",
    "X-Ray Rise",
    "Comet"
  ];
  const randomName = getRandomNameFromList(namesList);
  //console.log(randomName);
  
  function getRandomUrgency() {
    const randomNumber = Math.floor(Math.random() * 5) + 1;
    return randomNumber;
  }
  
  
  const Urgency = getRandomUrgency();
  //console.log(Urgency);

  
  //counter = 0;
  
  async function main() {
    try {
      const randomRADECObject = await getRandomRADECFromJSON();
  
      if (randomRADECObject) {
        // Use the RA and DEC strings from the object
        RAString = randomRADECObject.RA;
        DECString = randomRADECObject.DEC;
  
        //console.log('RA:', RAString);
        //console.log('DEC:', DECString);
  
        // Now you can use RAString and DECString in the rest of your code
        // For example, you can pass them as arguments to other functions or use them in different parts of your application.
        return randomRADECObject; // Return the object from the function
      } else {
        console.log('Error retrieving random RA and DEC from JSON in Redis.');
        return null; // Return null in case of error
      }
    } catch (error) {
      console.error('Error:', error);
      return null; // Return null in case of error
    }
  }

  (async () => {
    const randomRADECObject = await main();
    if (randomRADECObject) {
    // RAString and DECString have been updated in the main() function, so you can use them directly here
    //console.log('RA outside of main:', RAString);
    //console.log('DEC outside of main:', DECString);
    raa = RAString;
    decc = DECString;
    function getRandomEventJSON() {
        const startDate = new Date('2023-01-01');
        const endDate = new Date('2023-12-31');
        //const { RA, DEC } = getRandomRADECFromJSON();
        
        // Call the main function and use async/await to access the values of RAString and DECString
        
        const eventJSON = {
          date: getRandomDate(startDate, endDate),
          observer: getRandomTelescopeName(),
    
          ra: raa,
          dec: decc,
          eventType: getRandomNameFromList([
            "GRB",
            "Apparent Brightness Rise",
            "UV Rise",
            "X-Ray Rise",
            "Comet"
          ]),
          severityLevel: getRandomUrgency(),
        };
        
        //console.log("counter = ",counter++);
        return eventJSON;
      }
      theJSON = getRandomEventJSON();
      console.log(theJSON);
      
      // Example usage:
      //const randomEventJSON = getRandomEventJSON();
      //console.log(randomEventJSON);
    } else {
    console.log('Error retrieving random RA and DEC from JSON in Redis.');
    }
})();