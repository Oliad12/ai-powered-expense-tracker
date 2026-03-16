export interface Expense {
  date: Date;
  id: string;
  description: string | null;
  amount: number;
  categoryId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  category?: { id: string; name: string; color?: string | null; icon?: string | null } | null;
}
