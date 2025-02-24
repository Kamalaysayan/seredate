exports.handler = async (event) => {
    try {
        const data = [{ link: "https://www.example.com" }]; // Placeholder data for now

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
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