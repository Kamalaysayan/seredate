const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    try {
        const method = event.httpMethod;
        const data = require('./data.json'); // Load data.json using require

        if (method === 'GET') {
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            };
        } else if (method === 'POST') {
            const { link } = JSON.parse(event.body);

            data.push({ link });

            fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(data, null, 2)); // Write back to data.json

            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ link })
            };
        } else {
            return {
                statusCode: 405,
                body: "Method Not Allowed"
            };
        }
    } catch (error) {
        console.error("Error in function:", error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: error.message }) 
        };
    }
};