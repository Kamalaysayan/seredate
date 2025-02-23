const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  const dataPath = path.join(__dirname, '../data.json');

  switch (event.httpMethod) {
    case 'POST':  // Add new link
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
    case 'GET': // Fetch all links
      try {
        const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        return { statusCode: 200, body: JSON.stringify(existingData) };
      } catch (error) {
        console.error("GET Error:", error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
      }
    case 'DELETE': // Delete a link
      try {
        const { index } = JSON.parse(event.body); // Get index to delete
        let existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        if (index >= 0 && index < existingData.length) {
          existingData.splice(index, 1); // Remove link at index
        } else {
          return { statusCode: 400, body: "Invalid index" };
        }

        fs.writeFileSync(dataPath, JSON.stringify(existingData, null, 2));
        return { statusCode: 200, body: "Link deleted" };
      } catch (error) {
        console.error("DELETE Error:", error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
      }

    default:
      return { statusCode: 405, body: 'Method Not Allowed' };
  }
};