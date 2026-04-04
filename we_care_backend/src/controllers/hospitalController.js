const hospitalModel = require("../models/hospitalModel");
const doctorModel = require("../models/doctorModel");

// ----------------- GET ALL HOSPITALS (Public) -----------------
exports.getAllHospitals = async (req, res) => {
  try {
    const { search, city, type, page = 1, limit = 20 } = req.query;

    let query = { isActive: true };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ];
    }
    if (city) query.city = { $regex: city, $options: "i" };
    if (type) query.type = type;

    const hospitals = await hospitalModel
      .find(query)
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await hospitalModel.countDocuments(query);

    res.json({
      success: true,
      message: "Hospitals fetched successfully",
      data: hospitals,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch hospitals",
      error: error.message,
    });
  }
};

// ----------------- GET SINGLE HOSPITAL (Public) -----------------
exports.getHospitalById = async (req, res) => {
  try {
    const hospital = await hospitalModel.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ success: false, message: "Hospital not found" });
    }

    // Also get doctors associated with this hospital
    const doctors = await doctorModel
      .find({ hospital: hospital.name })
      .populate("userId", "name email")
      .select("specialization experience fees verified profileImage userId");

    res.json({
      success: true,
      data: { hospital, doctors },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch hospital",
      error: error.message,
    });
  }
};

// ----------------- ADD HOSPITAL (Admin only) -----------------
exports.addHospital = async (req, res) => {
  try {
    const { name, address, city, phone, email, type, image, description } = req.body;

    if (!name || !address || !city) {
      return res.status(400).json({
        success: false,
        message: "Name, address, and city are required",
      });
    }

    const existing = await hospitalModel.findOne({ name: { $regex: `^${name}$`, $options: "i" }, city });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "A hospital with this name already exists in this city",
      });
    }

    const hospital = await hospitalModel.create({
      name,
      address,
      city,
      phone,
      email,
      type,
      image,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Hospital added successfully",
      data: hospital,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add hospital",
      error: error.message,
    });
  }
};

// ----------------- UPDATE HOSPITAL (Admin only) -----------------
exports.updateHospital = async (req, res) => {
  try {
    const { name, address, city, phone, email, type, image, description, isActive } = req.body;

    const hospital = await hospitalModel.findByIdAndUpdate(
      req.params.id,
      { name, address, city, phone, email, type, image, description, isActive },
      { new: true, runValidators: true }
    );

    if (!hospital) {
      return res.status(404).json({ success: false, message: "Hospital not found" });
    }

    res.json({ success: true, message: "Hospital updated successfully", data: hospital });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update hospital",
      error: error.message,
    });
  }
};

// ----------------- DELETE HOSPITAL (Admin only) -----------------
exports.deleteHospital = async (req, res) => {
  try {
    const hospital = await hospitalModel.findByIdAndDelete(req.params.id);
    if (!hospital) {
      return res.status(404).json({ success: false, message: "Hospital not found" });
    }
    res.json({ success: true, message: "Hospital deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete hospital",
      error: error.message,
    });
  }
};

// ----------------- GET HOSPITAL NAMES LIST (for doctor dropdown) -----------------
exports.getHospitalNames = async (req, res) => {
  try {
    const hospitals = await hospitalModel
      .find({ isActive: true })
      .select("name city")
      .sort({ name: 1 });

    res.json({ success: true, data: hospitals });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch hospital names", error: error.message });
  }
};
// =========================================================================
// ----------------- GET NEARBY HOSPITALS (GEOAPIFY PROXY) -----------------
// =========================================================================
exports.getNearbyHospitals = async (req, res) => {
  try {
    // 1. Get the address from the frontend request
    const { address } = req.body; 

    if (!address) {
      return res.status(400).json({ success: false, message: "Please provide an address to search." });
    }

    const apiKey = process.env.GEOAPIFY_API_KEY;
    if (!apiKey) {
      throw new Error("Geoapify API key is missing in .env file");
    }

    // 2. Geocoding Phase (Text -> Coordinates)
    const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&format=json&apiKey=${apiKey}`;
    
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();

    if (!geocodeData.results || geocodeData.results.length === 0) {
      return res.status(404).json({ success: false, message: "Could not find coordinates for this address." });
    }

    const { lat, lon } = geocodeData.results[0];

    // 3. Places API Phase (Radar Sweep for Hospitals - 5km radius)
    const radius = 5000;
    const placesUrl = `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${lon},${lat},${radius}&bias=proximity:${lon},${lat}&limit=10&apiKey=${apiKey}`;
    
    const placesResponse = await fetch(placesUrl);
    const placesData = await placesResponse.json();

    // 4. Clean up the massive Geoapify payload for React
    const nearbyHospitals = placesData.features.map(feature => ({
      name: feature.properties.name || "Unnamed Hospital/Clinic",
      address: feature.properties.formatted,
      distanceMeters: feature.properties.distance, 
      location: {
        lat: feature.properties.lat,
        lng: feature.properties.lon
      }
    }));

    // 5. Send back the clean data
    res.json({
      success: true,
      centerLocation: { lat, lng: lon }, // React needs this to center the map
      hospitals: nearbyHospitals
    });

  } catch (error) {
    console.error("Geoapify Proxy Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch nearby hospitals", 
      error: error.message 
    });
  }
};