'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Building2, Award } from 'lucide-react';

const stats = [
  { icon: Building2, label: 'Universities', value: '250+', sublabel: 'Partnered campuses' },
  { icon: BarChart3, label: 'Resources Shared', value: '120K+', sublabel: 'Notes, papers, manuals' },
  { icon: TrendingUp, label: 'Skill Sessions', value: '45K+', sublabel: 'Peer-to-peer exchanges' },
  { icon: Award, label: 'Projects Completed', value: '8K+', sublabel: 'Student-built teams' },
];

const partners = [
  'Stanford', 'MIT', 'IIT Bombay', 'Harvard', 'NUS', 'Oxford',
  'Tsinghua', 'ETH Zurich', 'Berkeley', 'Cambridge', 'Caltech', 'CMU',
];

export function Stats() {
  return (
    <section id="stats" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 dot-pattern opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-jakarta text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Trusted by students at <span className="gradient-text">top universities</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join a growing ecosystem of learners, builders, and mentors.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass rounded-2xl p-6 text-center"
            >
              <div className="flex justify-center mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="font-jakarta text-3xl sm:text-4xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-foreground">{stat.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.sublabel}</div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-60">
          {partners.map((p) => (
            <span key={p} className="font-jakarta text-lg font-semibold text-muted-foreground">
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
