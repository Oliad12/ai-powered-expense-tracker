import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'ET AI Tracker <onboarding@resend.dev>';

export async function sendBudgetWarningEmail({
  to, name, budgetName, pct, spent, limit,
}: { to: string; name: string; budgetName: string; pct: number; spent: number; limit: number }) {
  const isOver = pct >= 100;
  await resend.emails.send({
    from: FROM,
    to,
    subject: isOver ? `🚨 Budget Exceeded: ${budgetName}` : `⚠️ Budget Warning: ${budgetName}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#f9fafb;border-radius:12px;">
        <h2 style="color:${isOver ? '#dc2626' : '#d97706'};margin-bottom:8px;">
          ${isOver ? '🚨 Budget Exceeded' : '⚠️ Budget Warning'}
        </h2>
        <p style="color:#374151;">Hi ${name},</p>
        <p style="color:#374151;">Your budget <strong>${budgetName}</strong> is at <strong>${pct}%</strong>.</p>
        <div style="background:#fff;border-radius:8px;padding:16px;margin:16px 0;border:1px solid #e5e7eb;">
          <p style="margin:0;color:#6b7280;font-size:14px;">Spent</p>
          <p style="margin:4px 0 12px;font-size:20px;font-weight:700;color:#111827;">ETB ${spent.toFixed(2)}</p>
          <p style="margin:0;color:#6b7280;font-size:14px;">Limit</p>
          <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#111827;">ETB ${limit.toFixed(2)}</p>
        </div>
        <div style="background:#e5e7eb;border-radius:999px;height:8px;overflow:hidden;">
          <div style="background:${isOver ? '#dc2626' : '#d97706'};width:${Math.min(pct, 100)}%;height:100%;border-radius:999px;"></div>
        </div>
        <p style="color:#6b7280;font-size:13px;margin-top:20px;">
          ${isOver ? 'You have exceeded your budget limit.' : `You have ETB ${(limit - spent).toFixed(2)} remaining.`}
        </p>
      </div>
    `,
  });
}

export async function sendLargeExpenseEmail({
  to, name, amount, category, description,
}: { to: string; name: string; amount: number; category: string; description?: string | null }) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `💸 Large Expense Recorded: ETB ${amount.toFixed(2)}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#f9fafb;border-radius:12px;">
        <h2 style="color:#ea580c;margin-bottom:8px;">💸 Large Expense Recorded</h2>
        <p style="color:#374151;">Hi ${name},</p>
        <p style="color:#374151;">A large expense was just added to your account.</p>
        <div style="background:#fff;border-radius:8px;padding:16px;margin:16px 0;border:1px solid #e5e7eb;">
          <p style="margin:0;color:#6b7280;font-size:14px;">Amount</p>
          <p style="margin:4px 0 12px;font-size:24px;font-weight:700;color:#111827;">ETB ${amount.toFixed(2)}</p>
          <p style="margin:0;color:#6b7280;font-size:14px;">Category</p>
          <p style="margin:4px 0 ${description ? '12px' : '0'};font-size:16px;font-weight:600;color:#111827;">${category}</p>
          ${description ? `<p style="margin:0;color:#6b7280;font-size:14px;">Note</p><p style="margin:4px 0 0;font-size:14px;color:#374151;">${description}</p>` : ''}
        </div>
        <p style="color:#6b7280;font-size:13px;">If this wasn't you, please review your account.</p>
      </div>
    `,
  });
}
