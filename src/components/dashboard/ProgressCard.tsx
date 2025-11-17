'use client';

import { motion } from 'framer-motion';

interface ProgressCardProps {
  completedToday: number;
  totalToday: number;
  weekProgress: {
    day: string;
    completed: number;
    total: number;
  }[];
}

export const ProgressCard = ({ completedToday, totalToday, weekProgress }: ProgressCardProps) => {
  const completionRate = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 text-white rounded-2xl p-6 shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">
            {completedToday === totalToday && totalToday > 0
              ? "Perfect Day! 🎉"
              : "Today's Progress"
            }
          </h2>
          <p className="text-orange-100">
            {completedToday} of {totalToday} habits completed
          </p>
        </div>

        <div className="text-right">
          <div className="text-5xl font-bold">{Math.round(completionRate)}%</div>
        </div>
      </div>

      <div className="bg-white/20 rounded-full h-3 overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${completionRate}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="bg-white h-full rounded-full"
        />
      </div>

      <div className="flex justify-between gap-1">
        {weekProgress.map((day, i) => {
          const dayRate = day.total > 0 ? (day.completed / day.total) * 100 : 0;
          return (
            <div key={i} className="flex-1 text-center">
              <div className="text-xs text-orange-100 mb-1">{day.day}</div>
              <div className="h-12 bg-white/20 rounded-lg relative overflow-hidden">
                <div
                  className="absolute bottom-0 left-0 right-0 bg-white transition-all"
                  style={{ height: `${dayRate}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
