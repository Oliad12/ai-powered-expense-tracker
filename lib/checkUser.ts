import { currentUser } from '@clerk/nextjs/server';

import { db } from './db';

const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining', icon: '🍔', color: '#10b981' },
  { name: 'Transportation', icon: '🚗', color: '#3b82f6' },
  { name: 'Shopping', icon: '🛒', color: '#f59e0b' },
  { name: 'Entertainment', icon: '🎬', color: '#8b5cf6' },
  { name: 'Bills & Utilities', icon: '💡', color: '#ef4444' },
  { name: 'Healthcare', icon: '🏥', color: '#06b6d4' },
  { name: 'Education', icon: '📚', color: '#f97316' },
  { name: 'Other', icon: '📦', color: '#6b7280' },
];

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const loggedInUser = await db.user.findUnique({
    where: {
      clerkUserId: user.id,
    },
  });

  if (loggedInUser) {
    // Seed default categories if user has none
    const count = await db.category.count({ where: { userId: user.id } });
    if (count === 0) {
      await db.category.createMany({
        data: DEFAULT_CATEGORIES.map((c) => ({ ...c, userId: user.id })),
        skipDuplicates: true,
      });
    }
    return loggedInUser;
  }

  const newUser = await db.user.create({
    data: {
      clerkUserId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0]?.emailAddress,
    },
  });

  // Seed default categories for new user
  await db.category.createMany({
    data: DEFAULT_CATEGORIES.map((c) => ({
      ...c,
      userId: user.id,
    })),
    skipDuplicates: true,
  });

  return newUser;
};
