const { getStore } = require("@netlify/blobs");

exports.handler = async (event, context) => {
  const store = getStore("equipment");
  
  try {
    // Get all equipment data
    const equipmentData = await store.get("all-equipment", { type: "json" });
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        equipment: equipmentData || []
      })
    };
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        error: "Failed to load equipment",
        equipment: []
      })
    };
  }
};
