const { collections } = require('../config/firebase');

// GET /api/trends/regional
exports.getRegionalTrends = async (req, res, next) => {
  try {
    const { region } = req.query;
    // Return pre-seeded trend data
    const defaultTrends = {
      Punjab: [
        { disease: "Dengue", diseaseUrdu: "ڈینگی", cases: 1250, trend: "rising", severity: "high" },
        { disease: "Typhoid", diseaseUrdu: "ٹائیفائیڈ", cases: 890, trend: "stable", severity: "moderate" },
        { disease: "Gastroenteritis", diseaseUrdu: "پیٹ کی خرابی", cases: 2100, trend: "rising", severity: "moderate" },
        { disease: "Respiratory Infections", diseaseUrdu: "سانس کی بیماری", cases: 1800, trend: "falling", severity: "low" },
      ],
      Sindh: [
        { disease: "Malaria", diseaseUrdu: "ملیریا", cases: 950, trend: "rising", severity: "high" },
        { disease: "Hepatitis", diseaseUrdu: "ہیپاٹائٹس", cases: 670, trend: "stable", severity: "high" },
        { disease: "Heat Stroke", diseaseUrdu: "لو لگنا", cases: 340, trend: "rising", severity: "moderate" },
      ],
      KPK: [
        { disease: "TB", diseaseUrdu: "ٹی بی", cases: 450, trend: "falling", severity: "high" },
        { disease: "Diarrhea", diseaseUrdu: "دست", cases: 1200, trend: "stable", severity: "moderate" },
      ],
      Balochistan: [
        { disease: "Malaria", diseaseUrdu: "ملیریا", cases: 780, trend: "rising", severity: "high" },
        { disease: "Leishmaniasis", diseaseUrdu: "کالا آزار", cases: 320, trend: "stable", severity: "moderate" },
      ],
    };

    const data = region ? (defaultTrends[region] || []) : defaultTrends;
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

// GET /api/trends/seasonal
exports.getSeasonalTrends = async (req, res) => {
  const month = new Date().getMonth();
  let season, diseases;
  if (month >= 2 && month <= 4) {
    season = "Spring"; diseases = ["Allergies", "Flu", "Measles"];
  } else if (month >= 5 && month <= 7) {
    season = "Summer"; diseases = ["Heat Stroke", "Gastro", "Dehydration", "Malaria"];
  } else if (month >= 8 && month <= 10) {
    season = "Monsoon/Fall"; diseases = ["Dengue", "Malaria", "Typhoid", "Skin Infections"];
  } else {
    season = "Winter"; diseases = ["Flu", "Pneumonia", "Smog Effects", "Respiratory"];
  }
  res.json({ success: true, data: { season, diseases } });
};
