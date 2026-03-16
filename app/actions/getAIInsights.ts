'use server';

import { checkUser } from '@/lib/checkUser';
import { db } from '@/lib/db';
import { generateExpenseInsights, AIInsight, ExpenseRecord } from '@/lib/ai';

// How old a cached insight can be before regenerating (1 hour)
const CACHE_TTL_MS = 60 * 60 * 1000;

export async function getAIInsights(): Promise<AIInsight[]> {
  try {
    const user = await checkUser();
    if (!user) throw new Error('User not authenticated');

    // 1. Check for recent cached insights in DB
    const oneHourAgo = new Date(Date.now() - CACHE_TTL_MS);
    const cached = await db.aIInsight.findMany({
      where: { userId: user.clerkUserId, createdAt: { gte: oneHourAgo } },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });

    if (cached.length > 0) {
      // Return from DB cache — no AI call needed
      return cached.map((row) => ({
        id: row.id,
        type: row.type as AIInsight['type'],
        title: (row.metadata as Record<string, string>)?.title ?? 'Insight',
        message: row.message,
        action: (row.metadata as Record<string, string>)?.action,
        confidence: parseFloat((row.metadata as Record<string, string>)?.confidence ?? '0.8'),
      }));
    }

    // 2. No fresh cache — fetch expenses and generate new insights
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const expenses = await db.expense.findMany({
      where: { userId: user.clerkUserId, createdAt: { gte: thirtyDaysAgo } },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { category: true },
    });

    if (expenses.length === 0) {
      return [
        {
          id: 'welcome-1',
          type: 'info',
          title: 'Welcome to ExpenseTracker AI!',
          message: 'Start adding your expenses to get personalized AI insights about your spending patterns.',
          action: 'Add your first expense',
          confidence: 1.0,
        },
        {
          id: 'welcome-2',
          type: 'tip',
          title: 'Track Regularly',
          message: 'For best results, try to log expenses daily. This helps our AI provide more accurate insights.',
          action: 'Set daily reminders',
          confidence: 1.0,
        },
      ];
    }

    const expenseData: ExpenseRecord[] = expenses.map((e) => ({
      id: e.id,
      amount: e.amount,
      category: e.category?.name || 'Other',
      description: e.description || '',
      date: e.date.toISOString(),
    }));

    // 3. Generate fresh insights from AI
    const insights = await generateExpenseInsights(expenseData);

    // 4. Delete old insights for this user and save new ones to DB
    await db.aIInsight.deleteMany({ where: { userId: user.clerkUserId } });

    await db.aIInsight.createMany({
      data: insights.map((insight) => ({
        userId: user.clerkUserId,
        message: insight.message,
        type: insight.type,
        metadata: {
          title: insight.title,
          action: insight.action ?? null,
          confidence: String(insight.confidence),
        },
      })),
    });

    return insights;
  } catch (error) {
    console.error('Error getting AI insights:', error);
    return [
      {
        id: 'error-1',
        type: 'warning',
        title: 'Insights Temporarily Unavailable',
        message: "We're having trouble analyzing your expenses right now. Please try again in a few minutes.",
        action: 'Retry analysis',
        confidence: 0.5,
      },
    ];
  }
}

// Force regenerate — bypasses cache, used by the refresh button
export async function refreshAIInsights(): Promise<AIInsight[]> {
  try {
    const user = await checkUser();
    if (!user) throw new Error('User not authenticated');

    // Delete all existing insights to force regeneration
    await db.aIInsight.deleteMany({ where: { userId: user.clerkUserId } });

    return getAIInsights();
  } catch (error) {
    console.error('Error refreshing AI insights:', error);
    return [];
  }
}

// Get insight history from DB (all time, not just recent)
export async function getInsightHistory(): Promise<AIInsight[]> {
  try {
    const user = await checkUser();
    if (!user) return [];

    const rows = await db.aIInsight.findMany({
      where: { userId: user.clerkUserId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return rows.map((row) => ({
      id: row.id,
      type: row.type as AIInsight['type'],
      title: (row.metadata as Record<string, string>)?.title ?? 'Insight',
      message: row.message,
      action: (row.metadata as Record<string, string>)?.action,
      confidence: parseFloat((row.metadata as Record<string, string>)?.confidence ?? '0.8'),
    }));
  } catch {
    return [];
  }
}
