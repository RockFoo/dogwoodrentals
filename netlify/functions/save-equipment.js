const { getStore } = require("@netlify/blobs");

exports.handler = async (event, context) => {
  // Simple password protection
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme123";
  
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method not allowed"
    };
  }
  
  try {
    const body = JSON.parse(event.body);
    const { password, equipment } = body;
    
    // Check password
    if (password !== ADMIN_PASSWORD) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Invalid password"
        })
      };
    }
    
    // Save equipment data
    const store = getStore("equipment");
    await store.setJSON("all-equipment", equipment);
    
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        message: "Equipment saved successfully"
      })
    };
    
  } catch (error) {
    console.error("Error saving equipment:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Failed to save equipment",
        details: error.message
      })
    };
  }
};
