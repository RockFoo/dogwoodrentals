import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  // Simple password protection
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme123";
  
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  
  try {
    const body = await req.json();
    const { password, equipment } = body;
    
    // Check password
    if (password !== ADMIN_PASSWORD) {
      return new Response(JSON.stringify({
        error: "Invalid password"
      }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Save equipment data
    const store = getStore("equipment");
    await store.setJSON("all-equipment", equipment);
    
    return new Response(JSON.stringify({
      success: true,
      message: "Equipment saved successfully"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error("Error saving equipment:", error);
    return new Response(JSON.stringify({
      error: "Failed to save equipment"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
