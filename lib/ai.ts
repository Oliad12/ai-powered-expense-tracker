import OpenAI from 'openai';
import type { ChatCompletion } from 'openai/resources/chat/completions';

interface RawInsight {
  type?: string;
  title?: string;
  message?: string;
  action?: string;
  confidence?: number;
}

const MODELS = [
  'openai/gpt-oss-20b:free',
  'openai/gpt-oss-120b:free',
  'stepfun/step-3.5-flash:free',
  'google/gemma-4-27b-it:free',
];

type ChatParams = Parameters<InstanceType<typeof OpenAI>['chat']['completions']['create']>[0];

async function chatWithFallback(params: Omit<ChatParams, 'model'>): Promise<ChatCompletion> {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'placeholder') {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  // Re-create client with current env var (not build-time placeholder)
  const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey,
    defaultHeaders: {
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'ExpenseTracker AI',
    },
  });

  let lastError: unknown;
  for (const model of MODELS) {
    try {
      const result = await client.chat.completions.create({ ...params, model, stream: false } as ChatParams);
      return result as ChatCompletion;
    } catch (err: unknown) {
      lastError = err;
      const status = (err as { status?: number })?.status;
      console.warn(`Model ${model} failed (status: ${status}):`, (err as Error)?.message);
      if (status === 401) throw err;
      continue;
    }
  }
  throw lastError ?? new Error('All AI models unavailable');
}

export interface ExpenseRecord {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'info' | 'success' | 'tip';
  title: string;
  message: string;
  action?: string;
  confidence: number;
}

export async function generateExpenseInsights(
  expenses: ExpenseRecord[]
): Promise<AIInsight[]> {
  try {
    // Prepare expense data for AI analysis
    const expensesSummary = expenses.map((expense) => ({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
    }));

    const prompt = `Analyze the following expense data and provide 3-4 actionable financial insights. 
    Return a JSON array of insights with this structure:
    {
      "type": "warning|info|success|tip",
      "title": "Brief title",
      "message": "Detailed insight message with specific numbers when possible",
      "action": "Actionable suggestion",
      "confidence": 0.8
    }

    Expense Data:
    ${JSON.stringify(expensesSummary, null, 2)}

    Focus on:
    1. Spending patterns (day of week, categories)
    2. Budget alerts (high spending areas)
    3. Money-saving opportunities
    4. Positive reinforcement for good habits

    IMPORTANT: Always use ETB as the currency symbol (e.g. ETB 500), never use $.
    Return only valid JSON array, no additional text.`;

    const completion = await chatWithFallback({
      messages: [
        {
          role: 'system',
          content:
            'You are a financial advisor AI that analyzes spending patterns and provides actionable insights. Always respond with valid JSON only. Always use ETB (Ethiopian Birr) as the currency symbol, never use $.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('No response from AI');
    }

    // Clean the response by removing markdown code blocks if present
    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse
        .replace(/^```json\s*/, '')
        .replace(/\s*```$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse
        .replace(/^```\s*/, '')
        .replace(/\s*```$/, '');
    }

    // Parse AI response
    const insights = JSON.parse(cleanedResponse);

    // Add IDs and ensure proper format
    const formattedInsights = insights.map(
      (insight: RawInsight, index: number) => ({
        id: `ai-${Date.now()}-${index}`,
        type: insight.type || 'info',
        title: insight.title || 'AI Insight',
        message: insight.message || 'Analysis complete',
        action: insight.action,
        confidence: insight.confidence || 0.8,
      })
    );

    return formattedInsights;
  } catch (error) {
    console.error('❌ Error generating AI insights:', error);

    // Fallback to mock insights if AI fails
    return [
      {
        id: 'fallback-1',
        type: 'info',
        title: 'AI Analysis Unavailable',
        message:
          'Unable to generate personalized insights at this time. Please try again later.',
        action: 'Refresh insights',
        confidence: 0.5,
      },
    ];
  }
}

export async function categorizeExpense(description: string, userCategories: string[]): Promise<string> {
  const categoryList = userCategories.length > 0
    ? userCategories
    : ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Education', 'Other'];

  const fallback = categoryList[categoryList.length - 1] ?? 'Other';
  const desc = description.toLowerCase();

  // Local keyword map — checked before hitting the AI
  const keywordMap: Record<string, string[]> = {
    'Food & Dining':     ['coffee', 'cafe', 'restaurant', 'food', 'lunch', 'dinner', 'breakfast', 'pizza', 'burger', 'tea', 'snack', 'meal', 'eat', 'drink', 'juice', 'bakery', 'sushi', 'sandwich', 'grocery', 'supermarket'],
    'Transportation':    ['uber', 'taxi', 'bus', 'train', 'fuel', 'gas', 'petrol', 'parking', 'metro', 'flight', 'airline', 'ticket', 'toll', 'lyft', 'ride', 'car wash'],
    'Shopping':          ['amazon', 'clothes', 'shirt', 'shoes', 'mall', 'store', 'shop', 'purchase', 'buy', 'market', 'fashion', 'dress', 'pants'],
    'Entertainment':     ['netflix', 'spotify', 'cinema', 'movie', 'game', 'concert', 'show', 'theater', 'youtube', 'subscription', 'streaming'],
    'Bills & Utilities': ['electricity', 'water', 'internet', 'phone', 'bill', 'utility', 'rent', 'insurance', 'wifi', 'mobile', 'broadband'],
    'Healthcare':        ['doctor', 'hospital', 'pharmacy', 'medicine', 'clinic', 'dental', 'health', 'drug', 'prescription', 'medical'],
    'Education':         ['book', 'course', 'school', 'university', 'tuition', 'class', 'training', 'study', 'exam', 'library'],
    'Other':             [''],
  };

  // Find best local match against user's actual category names
  for (const [keyword, terms] of Object.entries(keywordMap)) {
    if (terms.some((t) => desc.includes(t))) {
      // Find the user category that best matches this keyword group
      const match = categoryList.find((c) =>
        c.toLowerCase().includes(keyword.split(' ')[0].toLowerCase())
      );
      if (match) return match;
    }
  }

  // Fall back to AI for ambiguous descriptions
  try {
    const completion = await chatWithFallback({
      messages: [
        {
          role: 'system',
          content: `You are an expense categorization AI. You MUST pick EXACTLY one category from this list: ${categoryList.join(', ')}. Respond with only the category name, nothing else.`,
        },
        {
          role: 'user',
          content: `Which category fits this expense: "${description}"? Reply with only the category name.`,
        },
      ],
      temperature: 0,
      max_tokens: 20,
    });

    const raw = completion.choices[0].message.content?.trim() ?? '';
    const match = categoryList.find((c) => c.toLowerCase() === raw.toLowerCase());
    return match ?? fallback;
  } catch (error) {
    console.error('❌ Error categorizing expense:', error);
    return fallback;
  }
}

export async function generateAIAnswer(
  question: string,
  context: ExpenseRecord[]
): Promise<string> {
  try {
    const expensesSummary = context.map((expense) => ({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
    }));

    const prompt = `Based on the following expense data, provide a detailed and actionable answer to this question: "${question}"

    Expense Data:
    ${JSON.stringify(expensesSummary, null, 2)}

    Provide a comprehensive answer that:
    1. Addresses the specific question directly
    2. Uses concrete data from the expenses when possible
    3. Offers actionable advice
    4. Keeps the response concise but informative (2-3 sentences)
    
    Return only the answer text, no additional formatting.`;

    const completion = await chatWithFallback({
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful financial advisor AI that provides specific, actionable answers based on expense data. Be concise but thorough. Always use ETB (Ethiopian Birr) as the currency symbol, never use $.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('No response from AI');
    }

    return response.trim();
  } catch (error) {
    console.error('❌ Error generating AI answer:', error);
    return "I'm unable to provide a detailed answer at the moment. Please try refreshing the insights or check your connection.";
  }
}
