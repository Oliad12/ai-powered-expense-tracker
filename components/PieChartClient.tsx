'use client';

import { CategoryBreakdown } from '@/app/actions/getCategoryBreakdown';

export default function PieChartClient({ data }: { data: CategoryBreakdown[] }) {
  const total = data.reduce((s, d) => s + d.total, 0);

  // Build SVG pie chart
  let cumulative = 0;
  const slices = data.map((d) => {
    const pct = d.total / total;
    const start = cumulative;
    cumulative += pct;
    return { ...d, pct, start };
  });

  const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const describeArc = (cx: number, cy: number, r: number, startPct: number, endPct: number) => {
    const start = polarToCartesian(cx, cy, r, endPct * 360);
    const end = polarToCartesian(cx, cy, r, startPct * 360);
    const largeArc = endPct - startPct > 0.5 ? 1 : 0;
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
  };

  return (
    <div className='flex flex-col sm:flex-row items-center gap-4'>
      <div className='relative flex-shrink-0'>
        <svg width='140' height='140' viewBox='0 0 140 140'>
          {slices.map((s, i) => (
            <path
              key={i}
              d={describeArc(70, 70, 60, s.start, s.start + s.pct)}
              fill={s.color}
              stroke='white'
              strokeWidth='2'
              className='hover:opacity-80 transition-opacity cursor-pointer'
            />
          ))}
          {/* Center hole */}
          <circle cx='70' cy='70' r='30' fill='white' className='dark:fill-gray-900' />
          <text x='70' y='66' textAnchor='middle' className='text-xs font-bold fill-gray-700 dark:fill-gray-300' fontSize='10'>Total</text>
          <text x='70' y='80' textAnchor='middle' className='font-bold fill-gray-900 dark:fill-gray-100' fontSize='11'>ETB {total.toFixed(0)}</text>
        </svg>
      </div>

      <div className='flex-1 space-y-2 w-full'>
        {data.slice(0, 6).map((d) => (
          <div key={d.name} className='flex items-center gap-2'>
            <div className='w-2.5 h-2.5 rounded-full flex-shrink-0' style={{ backgroundColor: d.color }} />
            <span className='text-xs text-gray-600 dark:text-gray-400 flex-1 truncate'>{d.name}</span>
            <span className='text-xs font-semibold text-gray-800 dark:text-gray-200'>{d.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
