const fs = require('fs'); // Import the file system module

exports.handler = async (event) => {
    try {
        const method = event.httpMethod;

        if (method === 'GET') {
            // Read data from data.json
            const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            };
        } else if (method === 'POST') {
            // Add new link to data.json
            const {
                link
            } = JSON.parse(event.body);
            const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

            data.push({
                link
            });
            fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));

            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    link
                })
            };
        } else {
            return {
                statusCode: 405, // Method Not Allowed
                body: "Method Not Allowed"
            };
        }
    } catch (error) {
        console.error("Error in function:", error);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                error: "An error occurred"
            })
        };
    }
};