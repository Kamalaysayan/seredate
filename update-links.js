const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  if (event.httpMethod === 'POST') {
    try {
      const data = JSON.parse(event.body);
      const link = data.link;

      const dataPath = path.join(__dirname, '../data.json');
      let existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

      const newEntry = {
        "link": link,
        "password": String(existingData.length + 1).padStart(3, '0')
      };
      existingData.push(newEntry);

      fs.writeFileSync(dataPath, JSON.stringify(existingData, null, 2));

      return {
        statusCode: 200,
        body: JSON.stringify(newEntry)
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to update links' })
      };
    }
  } else if (event.httpMethod === 'GET') {
    try {
      const dataPath = path.join(__dirname, '../data.json');
      const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      return {
          statusCode: 200,
          body: JSON.stringify(existingData)
      };
    } catch (error) {
      console.error("Error reading data.json:", error);
      return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to fetch links' })
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Only POST and GET requests allowed' })
    };
  }
};
