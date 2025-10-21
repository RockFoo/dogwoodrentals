import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  // One-time import script - password protected
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme123";
  
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  
  try {
    const body = await req.json();
    const { password } = body;
    
    // Check password
    if (password !== ADMIN_PASSWORD) {
      return new Response(JSON.stringify({
        error: "Invalid password"
      }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Initial equipment data from your CSV
    const initialEquipment = [
      {sku: "DR1", name: "Heron 100' Interface Probe", category: "Environmental Testing Equipment", dailyRate: 50, weeklyRate: 150, specSheet: "https://heroninstruments.com/wp-content/uploads/2024/04/A-825-1602-001-Rev-1-H.OIL_Brochure-2024.pdf"},
      {sku: "DR2", name: "TSI VelociCalc Meter", category: "Environmental Testing Equipment", dailyRate: 40, weeklyRate: 125, specSheet: ""},
      {sku: "DR3", name: "Mini Rae 3000 PID", category: "Environmental Testing Equipment", dailyRate: 75, weeklyRate: 225, specSheet: ""},
      {sku: "DR4", name: "QREA 3 (4-Gas Monitor)", category: "Environmental Testing Equipment", dailyRate: 50, weeklyRate: 150, specSheet: ""},
      {sku: "DR22", name: "BW Clip Gas Detector", category: "Environmental Testing Equipment", dailyRate: 25, weeklyRate: 75, specSheet: ""},
      {sku: "DR10", name: "Horiba U-52 Water Quality Meter", category: "Water Quality & Monitoring", dailyRate: 120, weeklyRate: 360, specSheet: ""},
      {sku: "DR17", name: "YSI 55 DO Meter", category: "Water Quality & Monitoring", dailyRate: 40, weeklyRate: 100, specSheet: ""},
      {sku: "DR24", name: "pH/Temperature Meter", category: "Water Quality & Monitoring", dailyRate: 20, weeklyRate: 60, specSheet: ""},
      {sku: "DR18", name: "Heron 500' Water Level", category: "Water Quality & Monitoring", dailyRate: 75, weeklyRate: 225, specSheet: "https://heroninstruments.com/wp-content/uploads/2024/04/A-825-1602-001-Rev-1-H.OIL_Brochure-2024.pdf"},
      {sku: "DR21", name: "Level Loggers", category: "Water Quality & Monitoring", dailyRate: 150, weeklyRate: 450, specSheet: ""},
      {sku: "DR9", name: "Complete Low Flow Sampling Kit", category: "Groundwater Sampling Equipment", dailyRate: 325, weeklyRate: 975, specSheet: ""},
      {sku: "DR7", name: "QED Low Flow Bladder Pump", category: "Groundwater Sampling Equipment", dailyRate: 80, weeklyRate: 240, specSheet: ""},
      {sku: "DR6", name: "QED MP 10 Low Flow Controller", category: "Groundwater Sampling Equipment", dailyRate: 80, weeklyRate: 240, specSheet: ""},
      {sku: "DR5", name: "Puma 3 Gallon DC Air Compressor", category: "Groundwater Sampling Equipment", dailyRate: 35, weeklyRate: 75, specSheet: ""},
      {sku: "DR11", name: "SS Mega-Monsoon Pump", category: "Groundwater Sampling Equipment", dailyRate: 110, weeklyRate: 330, specSheet: ""},
      {sku: "DR19", name: "Pegasus Peristaltic Pump", category: "Groundwater Sampling Equipment", dailyRate: 75, weeklyRate: 225, specSheet: ""},
      {sku: "DR20", name: "Waterra Hydrolift with Valve", category: "Groundwater Sampling Equipment", dailyRate: 170, weeklyRate: 510, specSheet: ""},
      {sku: "DR14", name: "Yamaha Viking UTV", category: "Field Equipment & Vehicles", dailyRate: 250, weeklyRate: 750, specSheet: ""},
      {sku: "DR23", name: "Steiner 450 Rough Cut Mower", category: "Field Equipment & Vehicles", dailyRate: 500, weeklyRate: 1500, specSheet: ""},
      {sku: "DR15", name: "Stihl Chainsaw", category: "Field Equipment & Vehicles", dailyRate: 50, weeklyRate: 150, specSheet: ""},
      {sku: "DR16", name: "Stihl Multi-Tool", category: "Field Equipment & Vehicles", dailyRate: 50, weeklyRate: 150, specSheet: ""},
      {sku: "DR13", name: "Utility Trailer (6'×12' 3500 lbs)", category: "Trailers & Transport", dailyRate: 60, weeklyRate: 180, specSheet: ""},
      {sku: "DR25", name: "Equipment Trailer (16'×82\" 7000 lbs)", category: "Trailers & Transport", dailyRate: 70, weeklyRate: 210, specSheet: ""},
      {sku: "DR26", name: "Heavy Equipment Trailer (14000 lbs)", category: "Trailers & Transport", dailyRate: 150, weeklyRate: 400, specSheet: ""},
      {sku: "DR27", name: "Dump Trailer (14000 lbs)", category: "Trailers & Transport", dailyRate: 150, weeklyRate: 400, specSheet: ""},
      {sku: "DR12", name: "CO2 Tank with Regulator (5 lb)", category: "Specialty Items", dailyRate: 40, weeklyRate: null, specSheet: ""},
      {sku: "DRS1", name: "Polyethylene Bladder", category: "Disposable Supplies", dailyRate: 15, weeklyRate: null, specSheet: ""},
      {sku: "DRS2", name: "SS Grab Plates", category: "Disposable Supplies", dailyRate: 10, weeklyRate: null, specSheet: ""},
      {sku: "DRS3", name: ".17\" ID × 1/4\" OD LDPE Tubing", category: "Disposable Supplies", dailyRate: 0.30, weeklyRate: null, specSheet: ""},
      {sku: "DRS4", name: "1/4\" Bonded Tubing (500' roll)", category: "Disposable Supplies", dailyRate: 0.90, weeklyRate: null, specSheet: ""},
      {sku: "DRS5", name: "3/8\" ID × 1/2\" OD LPDE Tubing", category: "Disposable Supplies", dailyRate: 0.35, weeklyRate: null, specSheet: ""},
      {sku: "DRS7", name: "1.5\"×36\" Poly Bailer SW", category: "Disposable Supplies", dailyRate: 7, weeklyRate: null, specSheet: ""},
      {sku: "DRS12", name: ".75\"×36\" PVC Bailers", category: "Disposable Supplies", dailyRate: 7, weeklyRate: null, specSheet: ""},
      {sku: "DRS54", name: "3.5\"×36\" PVC Bailers", category: "Disposable Supplies", dailyRate: 24, weeklyRate: null, specSheet: ""},
      {sku: "DRS13", name: "Paracord 250' Spool", category: "Disposable Supplies", dailyRate: 24, weeklyRate: null, specSheet: ""},
      {sku: "DRS15", name: "Liquinox Quart", category: "Disposable Supplies", dailyRate: 25.50, weeklyRate: null, specSheet: ""},
      {sku: "DRS16", name: "1 Gallon Zip Lock Bags (Box of 250)", category: "Disposable Supplies", dailyRate: 40, weeklyRate: null, specSheet: ""},
      {sku: "DRS58", name: "Quart Zip Lock Bags (Box of 500)", category: "Disposable Supplies", dailyRate: 48, weeklyRate: null, specSheet: ""},
      {sku: "DRS17", name: "2 Gallon Zip Lock Bags (Box of 100)", category: "Disposable Supplies", dailyRate: 40, weeklyRate: null, specSheet: ""},
      {sku: "DRS26", name: ".45 Micron Filter", category: "Disposable Supplies", dailyRate: 20, weeklyRate: null, specSheet: ""},
      {sku: "DRS38", name: "3/8\" ID × 1/2\" OD HDPE Tubing", category: "Disposable Supplies", dailyRate: 0.50, weeklyRate: null, specSheet: ""},
      {sku: "DRS41", name: "5lbs CO2 Tank", category: "Disposable Supplies", dailyRate: 40, weeklyRate: null, specSheet: ""},
      {sku: "DRS43", name: "1/4\" ID × 3/8\" OD LDPE Tubing", category: "Disposable Supplies", dailyRate: 0.30, weeklyRate: null, specSheet: ""},
      {sku: "DRS44", name: "1/4\" ID × .438\" OD Silicone Tubing", category: "Disposable Supplies", dailyRate: 1.80, weeklyRate: null, specSheet: ""},
      {sku: "DRS45", name: "3/8\" ID × 5/8\" OD Silicone Tubing", category: "Disposable Supplies", dailyRate: 2.70, weeklyRate: null, specSheet: ""},
      {sku: "DRS48", name: ".81\" ID × 1\" OD HDPE Tubing", category: "Disposable Supplies", dailyRate: 1.25, weeklyRate: null, specSheet: ""},
      {sku: "DRS49", name: "1/2\" ID × 5/8\" OD LDPE Tubing", category: "Disposable Supplies", dailyRate: 0.45, weeklyRate: null, specSheet: ""},
      {sku: "DRS50", name: "1/2\" ID × 5/8\" OD HDPE Tubing", category: "Disposable Supplies", dailyRate: 0.70, weeklyRate: null, specSheet: ""},
      {sku: "DRS51", name: "1/4\" ID × 3/8\" HDPE Tubing", category: "Disposable Supplies", dailyRate: 0.45, weeklyRate: null, specSheet: ""},
      {sku: "DRS52", name: ".17\" ID × 1/4\" OD HDPE Tubing", category: "Disposable Supplies", dailyRate: 0.35, weeklyRate: null, specSheet: ""},
      {sku: "DRS53", name: ".17\" ID Teflon Tubing (100' roll)", category: "Disposable Supplies", dailyRate: 170, weeklyRate: null, specSheet: ""},
      {sku: "DRS55", name: "Nitrile Gloves - Large (5 mil box)", category: "Disposable Supplies", dailyRate: 14, weeklyRate: null, specSheet: ""},
      {sku: "DRS56", name: "Nitrile Gloves - XL (5 mil box)", category: "Disposable Supplies", dailyRate: 14, weeklyRate: null, specSheet: ""},
      {sku: "DRS57", name: "Nitrile Gloves - XXL (5 mil box)", category: "Disposable Supplies", dailyRate: 18, weeklyRate: null, specSheet: ""}
    ];
    
    // Save to blob storage
    const store = getStore("equipment");
    await store.setJSON("all-equipment", initialEquipment);
    
    return new Response(JSON.stringify({
      success: true,
      message: `Successfully imported ${initialEquipment.length} items`,
      count: initialEquipment.length
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error("Error importing:", error);
    return new Response(JSON.stringify({
      error: "Failed to import data",
      details: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
