/**
 * AI Service — Using Groq API (groq.com)
 * Fast, free LLaMA models via Groq
 * All responses include Urdu + English and medical disclaimer
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL   = 'llama-3.3-70b-versatile'; // free & fast

const DISCLAIMER = '\n\nYeh AI suggestion hai, final diagnosis ke liye doctor se consult karein.\n⚕️ یہ AI مشورہ ہے، حتمی تشخیص کے لیے ڈاکٹر سے ضرور ملیں۔';

class GrokService {
  constructor() {
    this.apiKey = process.env.GROK_API_KEY;
  }

  async _callGrok(systemPrompt, userMessage, maxTokens = 1200) {
    if (!this.apiKey || this.apiKey === 'your_grok_api_key_here') {
      throw new Error('Groq API key not configured. Set GROK_API_KEY in .env');
    }

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: maxTokens,
        messages: [
          { role: 'system', content: systemPrompt },
          ...(Array.isArray(userMessage) ? userMessage : [{ role: 'user', content: userMessage }]),
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      const reason = data?.error?.message || data?.message || 'Grok API error';
      throw new Error(`Grok API error (${response.status}): ${reason}`);
    }
    if (data.error) {
      throw new Error(`Grok API error: ${data.error.message || 'Unknown provider error'}`);
    }
    return (data.choices?.[0]?.message?.content || '') + DISCLAIMER;
  }

  // ─── SYMPTOM ANALYSIS ───
  async analyzeSymptoms(symptoms, history = [], language = 'both') {
    const langInstruction = language === 'urdu' 
      ? 'Respond ONLY in Urdu Nastaliq script.'
      : language === 'english' 
        ? 'Respond ONLY in English.'
        : 'Respond in BOTH Urdu (Nastaliq) first, then ────── divider, then English.';

    const systemPrompt = `You are Sehat Saathi, a compassionate AI health advisor for Pakistani patients.

KNOWLEDGE BASE — Pakistani Medical Guidelines:
- Fever <38°C: No medicine. Fluids, rest. Fever 38-39°C: Paracetamol (Panadol) 10-15mg/kg.
- Fever >40°C or 103°F >3 days: HOSPITAL IMMEDIATELY.
- Dengue: NO aspirin/Brufen. Only Panadol. Hospital if platelets <100,000.
- Typhoid: Prolonged fever + stomach pain. Ceftriaxone/Azithromycin 7-14 days.
- Gastroenteritis: ORS immediately (1L water + 6 tsp sugar + ½ tsp salt).
- TB: Cough >3 weeks + night sweats → FREE DOTS at govt hospitals.
- Common Pakistan remedies: Adrak chai, haldi doodh, shahad nimbu, ajwain.

RESPONSE FORMAT: ${langInstruction}

Structure:
- ممکنہ وجہ / Possible Cause
- گھریلو علاج / Home Remedies (Pakistan-specific)
- دوائی / Medicine (Pakistani brand names + doses)
- ڈاکٹر کب ملیں / When to See Doctor
- فوری خطرہ / URGENT (if serious)

Use simple language. Always mention 1122 for emergencies.`;

    const messages = history.length > 0 
      ? history 
      : [{ role: 'user', content: symptoms }];

    return this._callGrok(systemPrompt, messages, 1500);
  }

  // ─── DISEASE PROBABILITY ───
  async getDiseaseProbability(symptoms) {
    const systemPrompt = `You are a medical AI for Pakistani patients. Given symptoms, return possible diseases with probability percentages.

RESPOND IN THIS EXACT JSON FORMAT:
{
  "diseases": [
    {"name": "Disease Name", "nameUrdu": "بیماری کا نام", "probability": 45, "severity": "moderate", "description": "Brief description", "descriptionUrdu": "مختصر وضاحت"},
    ...
  ],
  "urgency": "low|moderate|high|emergency",
  "recommendedTests": ["Test 1", "Test 2"],
  "recommendedTestsUrdu": ["ٹیسٹ 1", "ٹیسٹ 2"]
}

Consider Pakistani-prevalent diseases (dengue, typhoid, malaria, hepatitis, TB).
Probabilities must sum to approximately 100%.
Return 3-5 most likely diseases.`;

    const result = await this._callGrok(systemPrompt, `Patient symptoms: ${symptoms}`, 800);
    try {
      const jsonMatch = result.match(/\{[\s\S]*"diseases"[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch (e) {}
    return { raw: result };
  }

  // ─── RECOVERY PREDICTION ───
  async predictRecovery(disease, patientAge, patientGender) {
    const systemPrompt = `You are a medical AI. Predict recovery time for a Pakistani patient.

RESPOND IN JSON:
{
  "disease": "name",
  "recoveryDays": {"min": 3, "max": 7},
  "recoveryUrdu": "3 سے 7 دن",
  "tips": ["Tip 1", "Tip 2"],
  "tipsUrdu": ["ٹپ 1", "ٹپ 2"],
  "warningSignsUrdu": ["خطرے کی نشانی"]
}`;

    const msg = `Disease: ${disease}, Patient age: ${patientAge || 'unknown'}, Gender: ${patientGender || 'unknown'}`;
    const result = await this._callGrok(systemPrompt, msg, 600);
    try {
      const jsonMatch = result.match(/\{[\s\S]*"disease"[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch (e) {}
    return { raw: result };
  }

  // ─── HEALTH RISK SCORE ───
  async calculateRiskScore(profileData, habits, healthHistory) {
    const systemPrompt = `You are a health risk calculator for Pakistani patients.

Given patient data, calculate a health risk score from 0-100 (0=excellent, 100=critical).

RESPOND IN JSON:
{
  "score": 35,
  "level": "low|moderate|high|critical",
  "levelUrdu": "کم خطرہ",
  "factors": [
    {"name": "Blood Pressure", "nameUrdu": "بلڈ پریشر", "status": "normal|warning|danger", "detail": "..."}
  ],
  "recommendations": ["Recommendation 1"],
  "recommendationsUrdu": ["مشورہ 1"]
}`;

    const msg = `Patient Profile: ${JSON.stringify(profileData)}
Health History: ${JSON.stringify(healthHistory)}
Daily Habits: ${JSON.stringify(habits)}`;

    const result = await this._callGrok(systemPrompt, msg, 800);
    try {
      const jsonMatch = result.match(/\{[\s\S]*"score"[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch (e) {}
    return { score: 50, level: 'moderate', levelUrdu: 'درمیانہ', raw: result };
  }

  // ─── AI HEALTH REPORT ───
  async generateReport(profileData, symptoms, healthRecords) {
    const systemPrompt = `Generate a comprehensive health report for a Pakistani patient. Include both Urdu and English.

RESPOND IN JSON:
{
  "title": "Health Report / صحت رپورٹ",
  "date": "today's date",
  "patientSummary": "...",
  "patientSummaryUrdu": "...",
  "symptoms": ["symptom1"],
  "possibleConditions": [{"name": "...", "probability": 40}],
  "riskScore": 35,
  "recommendations": ["..."],
  "recommendationsUrdu": ["..."],
  "dietAdvice": "...",
  "dietAdviceUrdu": "...",
  "followUp": "...",
  "followUpUrdu": "..."
}`;

    const msg = `Profile: ${JSON.stringify(profileData)}, Symptoms: ${symptoms}, Health Records: ${JSON.stringify(healthRecords)}`;
    const result = await this._callGrok(systemPrompt, msg, 1500);
    try {
      const jsonMatch = result.match(/\{[\s\S]*"title"[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch (e) {}
    return { raw: result };
  }

  // ─── LAB TEST INTERPRETER ───
  async interpretLabTest(labResults) {
    const systemPrompt = `You are a lab test interpreter for Pakistani patients. Explain lab results in SIMPLE Urdu and English.

For each value, indicate if it's normal, high, or low. Use ✅ ⚠️ 🚨 indicators.
Explain what abnormal values mean in very simple language (like explaining to a village person).

RESPOND IN JSON:
{
  "results": [
    {"test": "Test Name", "testUrdu": "ٹیسٹ کا نام", "value": "result", "normalRange": "range", "status": "normal|high|low", "explanation": "...", "explanationUrdu": "..."}
  ],
  "overallSummary": "...",
  "overallSummaryUrdu": "...",
  "actionNeeded": "...",
  "actionNeededUrdu": "..."
}`;

    return this._callGrok(systemPrompt, `Lab Results:\n${labResults}`, 1200);
  }

  // ─── DESI DOCTOR MODE ───
  async explainDesi(medicalText) {
    const systemPrompt = `You are a friendly village doctor in Pakistan. Convert medical text into VERY SIMPLE Urdu that even an uneducated person can understand. 

Rules:
- Use everyday Urdu/Roman Urdu
- Use analogies from daily Pakistani life
- No English medical terms
- Be warm and reassuring
- Example: Instead of "hypertension", say "خون کا دباؤ زیادہ ہے — جیسے نل میں پانی کا پریشر بڑھ جائے"`;

    return this._callGrok(systemPrompt, medicalText, 800);
  }

  // ─── DAILY HEALTH TIP ───
  async getDailyTip(season, region) {
    const systemPrompt = `Generate a short, practical health tip for Pakistani people based on current season and region.
Keep it under 3 sentences. Include both Urdu and English.

RESPOND IN JSON:
{"tip": "English tip", "tipUrdu": "اردو ٹپ", "category": "hydration|diet|exercise|prevention|hygiene"}`;

    return this._callGrok(systemPrompt, `Season: ${season}, Region: ${region}`, 300);
  }

  // ─── DIET & NUTRITION ───
  async getDietSuggestion(condition, preferences = '') {
    const systemPrompt = `You are a Pakistani nutritionist. Suggest desi meals for health conditions.

Include foods like: roti, daal, chawal, sabzi, lassi, nimbu pani, fruits.
Consider Pakistani cooking style and affordable ingredients.

RESPOND IN JSON:
{
  "condition": "...",
  "meals": {
    "breakfast": {"name": "...", "nameUrdu": "...", "ingredients": [], "benefit": "..."},
    "lunch": {"name": "...", "nameUrdu": "...", "ingredients": [], "benefit": "..."},
    "dinner": {"name": "...", "nameUrdu": "...", "ingredients": [], "benefit": "..."},
    "snacks": {"name": "...", "nameUrdu": "...", "ingredients": [], "benefit": "..."}
  },
  "avoid": ["..."],
  "avoidUrdu": ["..."],
  "tips": ["..."],
  "tipsUrdu": ["..."]
}`;

    return this._callGrok(systemPrompt, `Condition: ${condition}. Preferences: ${preferences}`, 1000);
  }

  // ─── MEDICINE INFO ───
  async analyzeMedicine(medicineName) {
    const systemPrompt = `You are a medicine information assistant for Pakistani patients.

RESPOND IN JSON:
{
  "name": "Generic (Brand)",
  "nameUrdu": "...",
  "use": "What it treats",
  "useUrdu": "...",
  "dose": "Typical dose",
  "price": "PKR range",
  "warnings": ["warning1"],
  "warningsUrdu": ["..."],
  "alternatives": [{"name": "...", "price": "PKR ..."}],
  "prescriptionRequired": true,
  "availableInPakistan": true
}`;

    return this._callGrok(systemPrompt, `Medicine: ${medicineName}`, 600);
  }

  // ─── HABIT FEEDBACK ───
  async getHabitFeedback(habits) {
    const systemPrompt = `You are a health coach for Pakistani people. Analyze daily habits and give practical feedback.

RESPOND IN JSON:
{
  "score": 75,
  "feedback": "English feedback",
  "feedbackUrdu": "اردو فیڈبیک",
  "improvements": ["suggestion1"],
  "improvementsUrdu": ["مشورہ 1"],
  "encouragement": "...",
  "encouragementUrdu": "..."
}`;

    return this._callGrok(systemPrompt, `Today's habits: ${JSON.stringify(habits)}`, 500);
  }

  // ─── FOLLOW-UP ───
  async generateFollowUp(previousSymptoms, daysSince) {
    const systemPrompt = `You are Sehat Saathi follow-up assistant. Ask the patient how they're feeling in warm Urdu + English.

RESPOND IN JSON:
{
  "question": "How are you feeling now?",
  "questionUrdu": "آپ اب کیسا محسوس کر رہے ہیں؟",
  "context": "You reported [symptoms] [days] ago",
  "contextUrdu": "...",
  "options": ["Better / بہتر", "Same / ویسا ہی", "Worse / بدتر"]
}`;

    return this._callGrok(systemPrompt, `Previous symptoms: ${previousSymptoms}, Days since: ${daysSince}`, 400);
  }

  // ─── MENTAL HEALTH ───
  async mentalHealthChat(messages) {
    const systemPrompt = `You are a warm, empathetic mental health companion for Pakistani people called Sehat Saathi.

Rules:
1. Respond in BOTH Urdu (Nastaliq) AND English
2. Format: Urdu first, then "──────", then English
3. Be gentle, non-judgmental, culturally sensitive to Pakistani context
4. Never diagnose. Focus on listening, validating feelings, practical coping
5. If person mentions self-harm or suicide, provide Umang helpline: 0317-4288665
6. Suggest culturally relevant coping: family support, prayer, nature walks
7. Remember the entire conversation`;

    return this._callGrok(systemPrompt, messages, 800);
  }
}

module.exports = new GrokService();
