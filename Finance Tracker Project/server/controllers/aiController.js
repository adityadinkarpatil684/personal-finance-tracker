const axios = require('axios');
const config = require('../config');
const transactionModel = require('../models/transactionModel');

// Builds a compact prompt from transactions and analytics-like summary
function buildPrompt(transactions) {
  const recentTransactions = Array.isArray(transactions)
    ? transactions.slice(0, 120)
    : [];

  // Create a compact JSON-like snapshot to keep token usage low
  const simplified = recentTransactions.map((t) => ({
    date: t.date,
    type: t.category_type,
    category: t.category_name,
    amount: t.amount,
    description: t.description || ''
  }));

  return `You are a personal finance assistant. Analyze the user's recent transactions and provide:
- A concise summary of their spending and income patterns
- 5 actionable, personalized tips to improve budgeting and reduce unnecessary expenses
- If possible, call out 1-2 categories where overspending is likely

IMPORTANT: Return ONLY valid JSON with no additional text, markdown, or code blocks. Use this exact format:
{
  "summary": "Your analysis summary here",
  "tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"],
  "riskCategories": ["Category 1", "Category 2"]
}

RecentTransactionsJSON = ${JSON.stringify(simplified)}`;
}

exports.getAdvice = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY || config.gemini?.apiKey;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'Gemini API key is not configured on the server.'
      });
    }

    const transactions = await transactionModel.getTransactionsByUser(req.user.id);
    const prompt = buildPrompt(transactions);

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey
        },
        timeout: 20000
      }
    );

    // Gemini returns candidates -> content.parts[].text
    const candidates = response.data?.candidates || [];
    const firstText = candidates[0]?.content?.parts?.[0]?.text || '';

    // Clean and parse the response
    let advicePayload;
    try {
      // Remove any markdown code blocks and extra whitespace
      let cleanedText = firstText.trim();
      cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/```\s*/g, '');

      // Try to parse as JSON
      advicePayload = JSON.parse(cleanedText);

      // Validate the structure
      if (!advicePayload.summary) advicePayload.summary = '';
      if (!Array.isArray(advicePayload.tips)) advicePayload.tips = [];
      if (!Array.isArray(advicePayload.riskCategories)) advicePayload.riskCategories = [];

    } catch (parseError) {
      console.warn('Failed to parse AI response as JSON:', parseError.message);

      // Try to extract JSON from the text if it's embedded
      const jsonMatch = firstText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          advicePayload = JSON.parse(jsonMatch[0]);
          // Validate the structure
          if (!advicePayload.summary) advicePayload.summary = '';
          if (!Array.isArray(advicePayload.tips)) advicePayload.tips = [];
          if (!Array.isArray(advicePayload.riskCategories)) advicePayload.riskCategories = [];
        } catch (secondParseError) {
          // If all parsing fails, create a structured response with the raw text
          advicePayload = {
            summary: firstText,
            tips: [],
            riskCategories: []
          };
        }
      } else {
        // No JSON found, wrap the text
        advicePayload = {
          summary: firstText,
          tips: [],
          riskCategories: []
        };
      }
    }

    res.json({ success: true, advice: advicePayload });
  } catch (error) {
    console.error('AI advice error:', error?.response?.data || error.message || error);
    res.status(500).json({ success: false, message: 'Failed to generate advice' });
  }
};

