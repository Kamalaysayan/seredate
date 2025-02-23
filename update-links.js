const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  const dataPath = path.join(__dirname, '../data.json'); // Correct path!

  switch (event.httpMethod) {
    case 'POST':
      try {
        const { link } = JSON.parse(event.body);
        let existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const newEntry = {
          link,
          password: String(existingData.length + 1).padStart(3, '0'),
        };
        existingData.push(newEntry);
        fs.writeFileSync(dataPath, JSON.stringify(existingData, null, 2));
        return { statusCode: 200, body: JSON.stringify(newEntry) };
      } catch (error) {
        console.error("POST Error:", error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
      }
    case 'GET':
      try {
        const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        return { statusCode: 200, body: JSON.stringify(existingData) };
      } catch (error) {
        console.error("GET Error:", error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
      }
    default:
      return { statusCode: 405, body: 'Method Not Allowed' };
  }
};