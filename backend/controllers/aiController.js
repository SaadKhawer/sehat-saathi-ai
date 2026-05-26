const grokService = require('../services/grokService');

const dietFallbacks = {
  diabetes: {
    condition: 'Diabetes',
    meals: {
      breakfast: { name: 'Besan chilla + sugar-free chai', nameUrdu: 'بیسن چیلا + بغیر چینی چائے', ingredients: ['besan', 'palak', 'hari mirch'], benefit: 'Low glycemic start' },
      lunch: { name: '2 chapati + daal + salad', nameUrdu: '2 روٹی + دال + سلاد', ingredients: ['chapati', 'masoor daal', 'kheera'], benefit: 'Fiber helps sugar control' },
      dinner: { name: 'Grilled chicken + sabzi', nameUrdu: 'گرِل چکن + سبزی', ingredients: ['chicken', 'lauki', 'tori'], benefit: 'Light protein dinner' },
      snacks: { name: 'Roasted chana', nameUrdu: 'بھنا چنا', ingredients: ['chana'], benefit: 'Healthy snack' },
    },
    avoid: ['Sugary drinks', 'Mithai', 'White bread'],
    avoidUrdu: ['میٹھی بوتلیں', 'مٹھائی', 'سفید بریڈ'],
    tips: ['Walk 20-30 min daily', 'Eat at fixed times'],
    tipsUrdu: ['روزانہ 20-30 منٹ چلیں', 'کھانا وقت پر کھائیں'],
  },
  'high bp': {
    condition: 'High BP',
    meals: {
      breakfast: { name: 'Oats + fruit', nameUrdu: 'اوٹس + پھل', ingredients: ['oats', 'apple'], benefit: 'Low salt, heart friendly' },
      lunch: { name: 'Brown rice + daal + sabzi', nameUrdu: 'براؤن چاول + دال + سبزی', ingredients: ['brown rice', 'moong daal'], benefit: 'Balanced meal' },
      dinner: { name: 'Fish + steamed vegetables', nameUrdu: 'مچھلی + بھاپ والی سبزیاں', ingredients: ['fish', 'broccoli'], benefit: 'Supports heart health' },
      snacks: { name: 'Unsalted nuts', nameUrdu: 'بغیر نمک میوہ', ingredients: ['almonds', 'walnuts'], benefit: 'Healthy fats' },
    },
    avoid: ['Extra salt', 'Pickles', 'Namakin snacks'],
    avoidUrdu: ['زیادہ نمک', 'اچار', 'نمکین اسنیکس'],
    tips: ['Reduce tea salt snacks', 'Drink enough water'],
    tipsUrdu: ['نمک کم کریں', 'پانی مناسب پئیں'],
  },
  'general health': {
    condition: 'General Health',
    meals: {
      breakfast: { name: 'Egg + paratha (less oil) + doodh', nameUrdu: 'انڈا + کم تیل پراٹھا + دودھ', ingredients: ['egg', 'atta', 'milk'], benefit: 'Energy + protein' },
      lunch: { name: 'Roti + daal + sabzi + dahi', nameUrdu: 'روٹی + دال + سبزی + دہی', ingredients: ['roti', 'daal', 'dahi'], benefit: 'Complete desi meal' },
      dinner: { name: 'Chicken pulao + salad', nameUrdu: 'چکن پلاؤ + سلاد', ingredients: ['rice', 'chicken', 'salad'], benefit: 'Balanced dinner' },
      snacks: { name: 'Fruit chaat', nameUrdu: 'فروٹ چاٹ', ingredients: ['seasonal fruits'], benefit: 'Vitamins' },
    },
    avoid: ['Too much fried food'],
    avoidUrdu: ['بہت زیادہ تلا ہوا کھانا'],
    tips: ['Sleep 7-8 hours', 'Daily 20 min walk'],
    tipsUrdu: ['7-8 گھنٹے نیند', 'روزانہ 20 منٹ واک'],
  },
};

const getFallbackDiet = (condition) => {
  const key = String(condition || '').toLowerCase();
  return dietFallbacks[key] || dietFallbacks['general health'];
};

const getFallbackMedicine = (name) => ({
  name: `${name} (basic info)`,
  nameUrdu: `${name} (بنیادی معلومات)`,
  use: 'General pain/fever support (verify before use)',
  useUrdu: 'عام درد/بخار میں استعمال (استعمال سے پہلے تصدیق کریں)',
  dose: 'As advised by doctor or label',
  price: 'PKR 80-450 (approx)',
  warnings: ['Do not self-medicate for severe symptoms', 'Check allergies before use'],
  warningsUrdu: ['شدید علامات میں خود دوائی نہ لیں', 'الرجی پہلے چیک کریں'],
  alternatives: [{ name: 'Generic alternative', price: 'PKR 60-250' }],
  prescriptionRequired: false,
  availableInPakistan: true,
});

// POST /api/ai-analysis/disease-probability
exports.diseaseProbability = async (req, res, next) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms) return res.status(400).json({ success: false, message: 'Symptoms required' });
    const result = await grokService.getDiseaseProbability(symptoms);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

// POST /api/ai-analysis/recovery-prediction
exports.recoveryPrediction = async (req, res, next) => {
  try {
    const { disease, age, gender } = req.body;
    if (!disease) return res.status(400).json({ success: false, message: 'Disease name required' });
    const result = await grokService.predictRecovery(disease, age, gender);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

// POST /api/ai-analysis/risk-score
exports.riskScore = async (req, res, next) => {
  try {
    const { profile, habits, healthHistory } = req.body;
    const result = await grokService.calculateRiskScore(profile || {}, habits || {}, healthHistory || []);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

// POST /api/ai-analysis/explain-desi
exports.explainDesi = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Text required' });
    const result = await grokService.explainDesi(text);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

// POST /api/ai-analysis/lab-interpret
exports.labInterpret = async (req, res, next) => {
  try {
    const { labResults } = req.body;
    if (!labResults) return res.status(400).json({ success: false, message: 'Lab results required' });
    const result = await grokService.interpretLabTest(labResults);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

// POST /api/ai-analysis/daily-tip
exports.dailyTip = async (req, res, next) => {
  try {
    const { season, region } = req.body;
    const result = await grokService.getDailyTip(season || 'summer', region || 'Punjab');
    res.json({ success: true, data: result });
  } catch (error) {
    res.json({
      success: true,
      fallback: true,
      data: {
        tip: 'Stay hydrated, wash hands regularly, and avoid street food in peak heat.',
        tipUrdu: 'پانی زیادہ پئیں، ہاتھ صاف رکھیں، اور سخت گرمی میں باہر کے کھانے سے پرہیز کریں۔',
        category: 'prevention',
      },
    });
  }
};

// POST /api/ai-analysis/diet-suggestion
exports.dietSuggestion = async (req, res, next) => {
  try {
    const { condition, preferences } = req.body;
    if (!condition) return res.status(400).json({ success: false, message: 'Condition required' });
    const result = await grokService.getDietSuggestion(condition, preferences);
    res.json({ success: true, data: result });
  } catch (error) {
    // Graceful fallback so UI remains usable if Grok is unavailable.
    const fallback = getFallbackDiet(req.body.condition);
    res.json({
      success: true,
      fallback: true,
      message: 'AI unavailable, serving local diet plan',
      data: fallback,
    });
  }
};

// POST /api/ai-analysis/medicine-info
exports.medicineInfo = async (req, res, next) => {
  try {
    const { medicineName } = req.body;
    if (!medicineName) return res.status(400).json({ success: false, message: 'Medicine name required' });
    const result = await grokService.analyzeMedicine(medicineName);
    res.json({ success: true, data: result });
  } catch (error) {
    res.json({
      success: true,
      fallback: true,
      message: 'AI unavailable, serving basic medicine guidance',
      data: getFallbackMedicine(req.body.medicineName || 'Medicine'),
    });
  }
};

// POST /api/ai-analysis/mental-health
exports.mentalHealthChat = async (req, res, next) => {
  try {
    const { messages } = req.body;
    if (!messages || messages.length === 0) return res.status(400).json({ success: false, message: 'Messages required' });
    const result = await grokService.mentalHealthChat(messages);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

// POST /api/ai-analysis/habit-feedback
exports.habitFeedback = async (req, res, next) => {
  try {
    const { habits } = req.body;
    const result = await grokService.getHabitFeedback(habits);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};
