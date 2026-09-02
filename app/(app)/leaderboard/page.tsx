'use client';

import { motion } from 'framer-motion';
import { Trophy, Flame, Star, TrendingUp, Award, Crown, Medal } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const leaderboard = [
  { name: 'Aarav Sharma', university: 'IIT Bombay', department: 'Computer Science', xp: 12450, streak: 45, initials: 'AS', color: 'bg-blue-500', contributions: 89 },
  { name: 'Sara Chen', university: 'Stanford', department: 'Data Science', xp: 11200, streak: 38, initials: 'SC', color: 'bg-violet-500', contributions: 76 },
  { name: 'Marcus Johnson', university: 'MIT', department: 'Software Engineering', xp: 9800, streak: 31, initials: 'MJ', color: 'bg-emerald-500', contributions: 65 },
  { name: 'Priya Patel', university: 'NUS', department: 'AI & Robotics', xp: 8650, streak: 28, initials: 'PP', color: 'bg-pink-500', contributions: 54 },
  { name: 'David Kim', university: 'Berkeley', department: 'Cybersecurity', xp: 7400, streak: 22, initials: 'DK', color: 'bg-orange-500', contributions: 43 },
  { name: 'Fatima Al-Zahra', university: 'Oxford', department: 'UI/UX Design', xp: 6800, streak: 19, initials: 'FA', color: 'bg-teal-500', contributions: 38 },
  { name: 'Liam O\'Brien', university: 'Cambridge', department: 'Systems Engineering', xp: 5900, streak: 15, initials: 'LO', color: 'bg-cyan-500', contributions: 31 },
  { name: 'Yuki Tanaka', university: 'Tsinghua', department: 'Blockchain', xp: 5200, streak: 12, initials: 'YT', color: 'bg-amber-500', contributions: 27 },
];

const rankIcons = [
  { icon: Crown, color: 'text-amber-500' },
  { icon: Medal, color: 'text-slate-400' },
  { icon: Award, color: 'text-orange-600' },
];

const weeklyChallenges = [
  { title: 'Share 3 Resources', desc: 'Upload notes or study materials', xp: 150, progress: 67 },
  { title: 'Answer 5 Questions', desc: 'Help peers in the Q&A forum', xp: 200, progress: 40 },
  { title: 'Complete a Quiz', desc: 'Take an AI-generated quiz', xp: 100, progress: 100 },
  { title: 'Join a Project', desc: 'Collaborate on a team project', xp: 250, progress: 0 },
];

export default function LeaderboardPage() {
  const maxXP = leaderboard[0].xp;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-jakarta text-2xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6 text-warning" />
          Leaderboard
        </h1>
        <p className="text-sm text-muted-foreground">Top contributors across all campuses this semester</p>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leaderboard.slice(0, 3).map((entry, i) => {
          const RankIcon = rankIcons[i]?.icon || Trophy;
          return (
            <motion.div
              key={entry.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className={`p-6 text-center border-border/50 ${i === 0 ? 'border-warning/30 shadow-lg shadow-warning/10' : ''}`}>
                <div className="flex justify-center mb-3">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${i === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600' : i === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500' : 'bg-gradient-to-br from-orange-400 to-orange-600'} text-white`}>
                    <RankIcon className="h-7 w-7" />
                  </div>
                </div>
                <Avatar className="h-16 w-16 mx-auto mb-3">
                  <AvatarFallback className={`${entry.color} text-white text-lg`}>{entry.initials}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">{entry.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{entry.university}</p>
                <div className="font-jakarta text-2xl font-bold">{entry.xp.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">XP</div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Full leaderboard */}
      <Card className="border-border/50 overflow-hidden">
        <div className="p-4 border-b border-border/50">
          <h2 className="font-jakarta text-lg font-semibold">Global Rankings</h2>
        </div>
        <div className="divide-y divide-border/30">
          {leaderboard.map((entry, i) => (
            <motion.div
              key={entry.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold shrink-0 ${
                i < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {i + 1}
              </div>
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback className={`${entry.color} text-white text-sm`}>{entry.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{entry.name}</div>
                <div className="text-xs text-muted-foreground">{entry.department} • {entry.university}</div>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Flame className="h-3.5 w-3.5 text-orange-500" />
                  {entry.streak} days
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5 text-accent" />
                  {entry.contributions}
                </span>
              </div>
              <div className="text-right">
                <div className="font-jakarta font-bold">{entry.xp.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">XP</div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Weekly Challenges */}
      <Card className="p-6 border-border/50">
        <div className="flex items-center gap-2 mb-5">
          <Star className="h-5 w-5 text-primary" />
          <h2 className="font-jakarta text-lg font-semibold">Weekly Challenges</h2>
          <Badge variant="secondary" className="text-xs ml-2">Resets in 3 days</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {weeklyChallenges.map((challenge) => (
            <div key={challenge.title} className="rounded-xl border border-border/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">{challenge.title}</h3>
                <Badge variant="secondary" className="text-xs">
                  <Star className="h-3 w-3 mr-1 text-amber-500" />
                  {challenge.xp} XP
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{challenge.desc}</p>
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: challenge.progress + '%' }} />
                </div>
                <span className="text-xs text-muted-foreground">{challenge.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
