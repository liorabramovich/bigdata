const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.spaceweatherlive.com/en/solar-activity.html';

async function scrapeSpaceWeatherFacts() {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // Replace the following selector with the relevant selector for the space weather facts section on the website
    const spaceWeatherFacts = $(/* Your selector here */).text().trim();

    return spaceWeatherFacts;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

module.exports = scrapeSpaceWeatherFacts;
