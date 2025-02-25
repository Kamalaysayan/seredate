const fs = require('fs');
const path = require('path'); // Import the path module

exports.handler = async (event) => {
    try {
        const method = event.httpMethod;
        const filePath = path.join(__dirname, 'data.json'); // Construct path using path.join and __dirname

        if (method === 'GET') {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            };
        } else if (method === 'POST') {
            const { link } = JSON.parse(event.body);
            let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            data.push({ link });
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

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