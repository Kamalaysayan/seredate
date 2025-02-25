const { NetlifyDB } = require('@netlify/db')

const db = new NetlifyDB({
  // Your Netlify site ID is automatically detected in production.
  // In development, you can provide it:
  // siteId: 'YOUR_SITE_ID'
})

exports.handler = async (event) => {
    try {
        const method = event.httpMethod;

        if (method === 'GET') {
            const links = await db.collection('links').list() // Use list() for all items
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(links)
            };
        } else if (method === 'POST') {
            const { link } = JSON.parse(event.body);

            const newLink = await db.collection('links').create({
                link: link
            })
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newLink)
            };
        } else if (method === 'DELETE') {
            const { id } = JSON.parse(event.body); // Get the ID to delete
            await db.collection('links').delete(id); // Delete the link by ID
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: "Link deleted successfully" })
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