'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const DATA = [
  { day: 'Mon', lessons: 2, minutes: 25 },
  { day: 'Tue', lessons: 4, minutes: 45 },
  { day: 'Wed', lessons: 1, minutes: 15 },
  { day: 'Thu', lessons: 3, minutes: 35 },
  { day: 'Fri', lessons: 5, minutes: 60 },
  { day: 'Sat', lessons: 2, minutes: 30 },
  { day: 'Sun', lessons: 6, minutes: 80 },
];

export default function ProgressChart() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-[0_4px_24px_rgba(15,23,42,0.07)] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-primary text-lg">Learning Metrics</h2>
          <p className="text-xs text-muted">Weekly study duration and completed lessons overview</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-primary">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
            <span>Time Spent (min)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            <span>Lessons Completed</span>
          </div>
        </div>
      </div>

      <div className="h-[260px] w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={DATA}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0D9488" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0D9488" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="colorLessons" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="day"
              stroke="#94A3B8"
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#94A3B8"
              tickLine={false}
              axisLine={false}
              dx={-5}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(15,23,42,0.08)',
              }}
              labelStyle={{ fontWeight: 'bold', color: '#0F172A', marginBottom: '4px' }}
            />
            <Area
              type="monotone"
              dataKey="minutes"
              name="Minutes Spent"
              stroke="#0D9488"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMinutes)"
            />
            <Area
              type="monotone"
              dataKey="lessons"
              name="Lessons Practiced"
              stroke="#6366F1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorLessons)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
