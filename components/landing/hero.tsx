'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Users, BookOpen, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primary/20 blur-[120px] animate-pulse-glow" />
      <div className="absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-secondary/20 blur-[120px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/4 left-1/3 h-72 w-72 rounded-full bg-accent/20 blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm font-medium text-muted-foreground mb-8 animate-fade-up">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-Powered Campus Collaboration Platform
            <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">New</span>
          </div>

          <h1 className="font-jakarta text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            Learn Together.
            <br />
            Build Together.
            <br />
            <span className="gradient-text">Grow Together.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10">
            The all-in-one platform where college students exchange knowledge, skills,
            projects, and mentorship. Resources, skill marketplace, project teams,
            Q&A forums, AI study assistant — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="group h-12 px-8 text-base glow-primary">
                Start for Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base glass">
                Sign in to Dashboard
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
            {[
              { icon: Users, label: 'Active Students', value: '50K+' },
              { icon: BookOpen, label: 'Resources Shared', value: '120K+' },
              { icon: Code2, label: 'Projects Built', value: '8K+' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-2">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="font-jakarta text-2xl sm:text-3xl font-bold">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
