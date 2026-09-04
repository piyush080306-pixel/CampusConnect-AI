'use client';

import { motion } from 'framer-motion';
import {
  BookOpen,
  Repeat2,
  Code2,
  MessagesSquare,
  Bot,
  CalendarDays,
  Trophy,
  Users,
  Briefcase,
  GraduationCap,
  Brain,
  ShieldCheck,
} from 'lucide-react';
import { Card } from '@/components/ui/card';

const features = [
  {
    icon: BookOpen,
    title: 'Resource Exchange',
    description: 'Upload and discover notes, lab manuals, previous papers, and research across departments and semesters.',
    color: 'from-blue-500/20 to-blue-600/5',
    iconColor: 'text-blue-500',
  },
  {
    icon: Repeat2,
    title: 'Skill Marketplace',
    description: 'Offer and request skills through a credit-based exchange — programming, design, AI, cloud, and more.',
    color: 'from-violet-500/20 to-violet-600/5',
    iconColor: 'text-violet-500',
  },
  {
    icon: Code2,
    title: 'Project Collaboration',
    description: 'Recruit teammates by role, manage tasks on a Kanban board, and track milestones with GitHub integration.',
    color: 'from-emerald-500/20 to-emerald-600/5',
    iconColor: 'text-emerald-500',
  },
  {
    icon: MessagesSquare,
    title: 'Q&A Forums',
    description: 'Ask questions, earn reputation through accepted answers, and browse topic channels across campus.',
    color: 'from-orange-500/20 to-orange-600/5',
    iconColor: 'text-orange-500',
  },
  {
    icon: Bot,
    title: 'AI Study Assistant',
    description: 'Summarize PDFs, generate flashcards and quizzes, create mind maps, and get a personalized learning path.',
    color: 'from-cyan-500/20 to-cyan-600/5',
    iconColor: 'text-cyan-500',
  },
  {
    icon: CalendarDays,
    title: 'Events & Hackathons',
    description: 'Browse and register for workshops, seminars, and hackathons. Build teams and track results.',
    color: 'from-pink-500/20 to-pink-600/5',
    iconColor: 'text-pink-500',
  },
  {
    icon: Trophy,
    title: 'Gamification',
    description: 'Earn XP, unlock badges, climb leaderboards, maintain learning streaks, and complete weekly challenges.',
    color: 'from-amber-500/20 to-amber-600/5',
    iconColor: 'text-amber-500',
  },
  {
    icon: Users,
    title: 'Clubs & Communities',
    description: 'Join coding, sports, cultural, and tech clubs. Post announcements and manage membership.',
    color: 'from-indigo-500/20 to-indigo-600/5',
    iconColor: 'text-indigo-500',
  },
  {
    icon: Briefcase,
    title: 'Internship & Placement Hub',
    description: 'Browse listings, track applications, get resume reviews, and schedule mock interviews.',
    color: 'from-rose-500/20 to-rose-600/5',
    iconColor: 'text-rose-500',
  },
  {
    icon: Brain,
    title: 'AI Career Coach',
    description: 'Career roadmaps, skill gap analysis, recommended courses, and interview prep tailored to you.',
    color: 'from-teal-500/20 to-teal-600/5',
    iconColor: 'text-teal-500',
  },
  {
    icon: GraduationCap,
    title: 'Peer Tutoring',
    description: 'Find tutors, book sessions, and join group study with shared notes and a virtual whiteboard.',
    color: 'from-sky-500/20 to-sky-600/5',
    iconColor: 'text-sky-500',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Verified',
    description: 'Role-based access, JWT auth, and verified student profiles keep the ecosystem trusted.',
    color: 'from-green-500/20 to-green-600/5',
    iconColor: 'text-green-500',
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium text-muted-foreground mb-4">
            Everything you need
          </div>
          <h2 className="font-jakarta text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            One platform. <span className="gradient-text">Every workflow.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            CampusConnect AI combines the best of LinkedIn, Discord, GitHub, Coursera,
            and Stack Overflow into a single, unified campus ecosystem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.1 }}
            >
              <Card className="group relative overflow-hidden border-border/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                <div className="relative p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mb-4 transition-colors group-hover:bg-background">
                    <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className="font-jakarta text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
