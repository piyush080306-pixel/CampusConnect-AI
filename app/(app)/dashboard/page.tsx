'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  TrendingUp,
  BookOpen,
  Code2,
  Repeat2,
  Flame,
  Trophy,
  ArrowRight,
  CalendarDays,
  Users,
  Sparkles,
  Zap,
  Target,
  Award,
} from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { supabase } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type DashboardData = {
  resources: number;
  projects: number;
  skills: number;
  forumPosts: number;
  events: number;
  communities: number;
};

export default function DashboardPage() {
  const { profile } = useAuth();
  const [data, setData] = useState<DashboardData>({
    resources: 0,
    projects: 0,
    skills: 0,
    forumPosts: 0,
    events: 0,
    communities: 0,
  });

  useEffect(() => {
    (async () => {
      const counts = await Promise.all([
        supabase.from('resources').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('skill_listings').select('*', { count: 'exact', head: true }),
        supabase.from('forum_posts').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('communities').select('*', { count: 'exact', head: true }),
      ]);
      setData({
        resources: counts[0].count || 0,
        projects: counts[1].count || 0,
        skills: counts[2].count || 0,
        forumPosts: counts[3].count || 0,
        events: counts[4].count || 0,
        communities: counts[5].count || 0,
      });
    })();
  }, []);

  const stats = [
    { label: 'Resources', value: data.resources, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Projects', value: data.projects, icon: Code2, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { label: 'Skill Listings', value: data.skills, icon: Repeat2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Forum Posts', value: data.forumPosts, icon: Users, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  const quickActions = [
    { label: 'Upload Resource', href: '/resources', icon: BookOpen, desc: 'Share notes, papers, or study materials' },
    { label: 'Offer a Skill', href: '/skills', icon: Repeat2, desc: 'Help peers and earn credits' },
    { label: 'Create Project', href: '/projects', icon: Code2, desc: 'Recruit a team and start building' },
    { label: 'Ask a Question', href: '/forum', icon: Users, desc: 'Get help from the community' },
  ];

  const leaderboard = [
    { name: 'Aarav Sharma', xp: 12450, rank: 1, initials: 'AS', color: 'bg-blue-500' },
    { name: 'Sara Chen', xp: 11200, rank: 2, initials: 'SC', color: 'bg-violet-500' },
    { name: 'Marcus Johnson', xp: 9800, rank: 3, initials: 'MJ', color: 'bg-emerald-500' },
    { name: 'Priya Patel', xp: 8650, rank: 4, initials: 'PP', color: 'bg-pink-500' },
    { name: 'David Kim', xp: 7400, rank: 5, initials: 'DK', color: 'bg-orange-500' },
  ];

  const achievements = [
    { icon: Flame, title: '7-Day Streak', desc: 'Studied 7 days in a row', color: 'text-orange-500' },
    { icon: BookOpen, title: 'Resource Sharer', desc: 'Shared 10+ resources', color: 'text-blue-500' },
    { icon: Code2, title: 'Team Builder', desc: 'Created a project', color: 'text-violet-500' },
    { icon: Award, title: 'Top Contributor', desc: 'Earned 1000+ XP', color: 'text-amber-500' },
  ];

  const initials = profile?.full_name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || 'U';

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent p-6 sm:p-8"
      >
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-jakarta text-2xl sm:text-3xl font-bold text-white mb-1">
              Welcome back, {profile?.full_name?.split(' ')[0]}!
            </h1>
            <p className="text-white/80 text-sm">
              {profile?.university} • {profile?.department} • Year {profile?.year}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass-strong rounded-xl px-4 py-2 text-center">
              <div className="text-2xl font-bold text-white">{profile?.xp || 0}</div>
              <div className="text-xs text-white/70">Total XP</div>
            </div>
            <div className="glass-strong rounded-xl px-4 py-2 text-center">
              <div className="text-2xl font-bold text-white">{profile?.credits || 0}</div>
              <div className="text-xs text-white/70">Credits</div>
            </div>
            <div className="glass-strong rounded-xl px-4 py-2 text-center">
              <div className="flex items-center gap-1 text-2xl font-bold text-white">
                <Flame className="h-5 w-5 text-orange-300" />
                {profile?.learning_streak || 0}
              </div>
              <div className="text-xs text-white/70">Streak</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card className="p-5 border-border/50">
              <div className="flex items-center justify-between mb-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <TrendingUp className="h-4 w-4 text-accent" />
              </div>
              <div className="font-jakarta text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 border-border/50">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-jakarta text-lg font-semibold">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group flex items-start gap-3 rounded-xl border border-border/50 p-4 transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <action.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm flex items-center gap-1">
                      {action.label}
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{action.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="p-6 border-border/50">
            <div className="flex items-center gap-2 mb-5">
              <Trophy className="h-5 w-5 text-warning" />
              <h2 className="font-jakarta text-lg font-semibold">Leaderboard</h2>
            </div>
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div key={entry.rank} className="flex items-center gap-3">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    entry.rank === 1 ? 'bg-warning text-white' : entry.rank === 2 ? 'bg-muted-foreground text-white' : 'bg-muted'
                  }`}>
                    {entry.rank}
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={`${entry.color} text-white text-xs`}>
                      {entry.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{entry.name}</div>
                    <div className="text-xs text-muted-foreground">{entry.xp.toLocaleString()} XP</div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/leaderboard" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full">
                View Full Leaderboard
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 border-border/50">
            <div className="flex items-center gap-2 mb-5">
              <Award className="h-5 w-5 text-accent" />
              <h2 className="font-jakarta text-lg font-semibold">Your Achievements</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {achievements.map((ach) => (
                <div key={ach.title} className="flex flex-col items-center text-center p-4 rounded-xl border border-border/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mb-3">
                    <ach.icon className={`h-6 w-6 ${ach.color}`} />
                  </div>
                  <div className="text-sm font-medium">{ach.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{ach.desc}</div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* AI suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="p-6 border-border/50 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="flex items-center gap-2 mb-5">
              <Zap className="h-5 w-5 text-primary" />
              <h2 className="font-jakarta text-lg font-semibold">AI Suggestions</h2>
            </div>
            <div className="space-y-3">
              <div className="rounded-lg border border-border/50 p-3">
                <div className="text-sm font-medium mb-1">Recommended Tutor</div>
                <div className="text-xs text-muted-foreground">Aarav Sharma — React & Next.js expert matches your skill interests</div>
              </div>
              <div className="rounded-lg border border-border/50 p-3">
                <div className="text-sm font-medium mb-1">Upcoming Deadline</div>
                <div className="text-xs text-muted-foreground">Data Structures assignment due in 3 days</div>
              </div>
              <div className="rounded-lg border border-border/50 p-3">
                <div className="text-sm font-medium mb-1">Learning Path</div>
                <div className="text-xs text-muted-foreground">Complete "System Design Fundamentals" to advance your track</div>
              </div>
            </div>
            <Link href="/ai-assistant" className="block mt-4">
              <Button size="sm" className="w-full">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Open AI Assistant
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>

      {/* Study progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <Card className="p-6 border-border/50">
          <div className="flex items-center gap-2 mb-5">
            <Target className="h-5 w-5 text-accent" />
            <h2 className="font-jakarta text-lg font-semibold">Study Progress</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Data Structures', value: 75, color: 'bg-blue-500' },
              { label: 'Machine Learning', value: 45, color: 'bg-violet-500' },
              { label: 'System Design', value: 30, color: 'bg-emerald-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm text-muted-foreground">{item.value}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: item.value + '%' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
