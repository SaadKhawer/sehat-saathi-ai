// Emergency controller
const HOSPITALS = {
  lahore: [
    { name: "Mayo Hospital", type: "Government", dist: "City Center", lat: 31.5580, lng: 74.3154, tags: ["free","emergency","24/7"], phone: "042-99211137" },
    { name: "Services Hospital", type: "Government", dist: "Shadman", lat: 31.5204, lng: 74.3587, tags: ["free","emergency","24/7"], phone: "042-99203402" },
    { name: "Jinnah Hospital", type: "Government", dist: "Allama Iqbal Town", lat: 31.4804, lng: 74.2731, tags: ["free","emergency"], phone: "042-99231401" },
  ],
  karachi: [
    { name: "Jinnah Hospital", type: "Government", dist: "Rafiqui Shaheed Rd", lat: 24.8607, lng: 67.0011, tags: ["free","emergency","24/7"], phone: "021-99201300" },
    { name: "Civil Hospital", type: "Government", dist: "Boulton Market", lat: 24.8556, lng: 67.0093, tags: ["free","emergency","24/7"], phone: "021-99215740" },
  ],
  islamabad: [
    { name: "PIMS", type: "Federal Govt", dist: "G-8", lat: 33.6938, lng: 73.0488, tags: ["free","emergency","24/7"], phone: "051-9261170" },
    { name: "Polyclinic Hospital", type: "Federal Govt", dist: "G-6", lat: 33.7133, lng: 73.0551, tags: ["free","emergency","24/7"], phone: "051-9218300" },
  ],
  rawalpindi: [
    { name: "Holy Family Hospital", type: "Government", dist: "Satellite Town", lat: 33.6007, lng: 73.0679, tags: ["free","emergency","24/7"], phone: "051-9290301" },
    { name: "Benazir Bhutto Hospital", type: "Government", dist: "Murree Road", lat: 33.5990, lng: 73.0485, tags: ["free","emergency","24/7"], phone: "051-9290101" },
  ],
  peshawar: [
    { name: "Lady Reading Hospital", type: "Government", dist: "Cantonment", lat: 34.0123, lng: 71.5789, tags: ["free","emergency","24/7"], phone: "091-9211430" },
  ],
  quetta: [
    { name: "Sandeman Hospital", type: "Government", dist: "City", lat: 30.1830, lng: 66.9750, tags: ["free","emergency","24/7"], phone: "081-9211200" },
  ],
  faisalabad: [
    { name: "Allied Hospital", type: "Government", dist: "D-Ground", lat: 31.4180, lng: 73.0758, tags: ["free","emergency","24/7"], phone: "041-9210079" },
  ],
  multan: [
    { name: "Nishtar Hospital", type: "Government", dist: "Nishtar Road", lat: 30.2039, lng: 71.4547, tags: ["free","emergency","24/7"], phone: "061-9210057" },
  ],
};

exports.getNearbyHospitals = async (req, res, next) => {
  try {
    const { city, lat, lng } = req.query;
    let results = [];
    if (city && HOSPITALS[city.toLowerCase()]) {
      results = HOSPITALS[city.toLowerCase()];
    } else if (lat && lng) {
      // Simple distance calc - return all sorted by distance
      const userLat = parseFloat(lat), userLng = parseFloat(lng);
      const all = Object.values(HOSPITALS).flat();
      results = all.map(h => ({
        ...h,
        distance: Math.sqrt((h.lat - userLat) ** 2 + (h.lng - userLng) ** 2) * 111,
      })).sort((a, b) => a.distance - b.distance).slice(0, 5);
    }
    res.json({ success: true, data: results });
  } catch (error) { next(error); }
};

exports.getEmergencyContacts = async (req, res) => {
  res.json({
    success: true,
    data: [
      { name: "Rescue", nameUrdu: "ریسکیو", number: "1122" },
      { name: "Edhi Ambulance", nameUrdu: "ایدھی ایمبولینس", number: "115" },
      { name: "Police", nameUrdu: "پولیس", number: "15" },
      { name: "Fire Brigade", nameUrdu: "فائر بریگیڈ", number: "16" },
      { name: "Sehat Sahulat", nameUrdu: "صحت سہولت", number: "0800-99000" },
      { name: "Umang Mental Health", nameUrdu: "امنگ ہیلپ لائن", number: "0317-4288665" },
    ],
  });
};

exports.shareLocation = async (req, res) => {
  const { lat, lng, contactNumbers } = req.body;
  const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
  const whatsappMsg = encodeURIComponent(`🚨 Emergency! My location: ${mapsUrl}`);
  res.json({
    success: true,
    data: {
      mapsUrl,
      whatsappUrl: `https://wa.me/?text=${whatsappMsg}`,
      smsBody: `Emergency! My location: ${mapsUrl}`,
    },
  });
};
