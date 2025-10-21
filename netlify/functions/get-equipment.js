import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const store = getStore("equipment");
  
  try {
    // Get all equipment data
    const equipmentData = await store.get("all-equipment", { type: "json" });
    
    return new Response(JSON.stringify({
      equipment: equipmentData || []
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return new Response(JSON.stringify({
      error: "Failed to load equipment",
      equipment: []
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
