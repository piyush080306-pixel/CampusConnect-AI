'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card } from '@/components/ui/card';

const testimonials = [
  {
    name: 'Aarav Sharma',
    role: 'CS Student, IIT Bombay',
    avatar: 'AS',
    color: 'bg-blue-500',
    content: 'Found my hackathon team through CampusConnect in under an hour. We won first place. The skill matching is unreal.',
    rating: 5,
  },
  {
    name: 'Sara Chen',
    role: 'Data Science, Stanford',
    avatar: 'SC',
    color: 'bg-violet-500',
    content: 'The AI study assistant summarized my entire ML textbook into flashcards and quizzes. Saved me weeks of prep before finals.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Software Engineering, MIT',
    avatar: 'MJ',
    color: 'bg-emerald-500',
    content: 'I offered React tutoring and earned enough credits to get help with algorithms. The credit-based exchange just works.',
    rating: 5,
  },
  {
    name: 'Priya Patel',
    role: 'AI & Robotics, NUS',
    avatar: 'PP',
    color: 'bg-pink-500',
    content: 'The project collaboration board helped me recruit a 5-person team for our capstone. Kanban + GitHub integration is seamless.',
    rating: 5,
  },
  {
    name: 'David Kim',
    role: 'Cybersecurity, Berkeley',
    avatar: 'DK',
    color: 'bg-orange-500',
    content: 'Got my resume reviewed through the AI analyzer — went from 62 to 89 ATS score. Landed two internship interviews.',
    rating: 5,
  },
  {
    name: 'Fatima Al-Zahra',
    role: 'UI/UX Design, Oxford',
    avatar: 'FA',
    color: 'bg-teal-500',
    content: 'The Q&A forums are like Stack Overflow but actually for my courses. Got help with a thesis problem in minutes.',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium text-muted-foreground mb-4">
            Loved by students
          </div>
          <h2 className="font-jakarta text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            What students are <span className="gradient-text">saying</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.1 }}
            >
              <Card className="p-6 border-border/50 h-full flex flex-col">
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <p className="text-sm text-foreground/90 leading-relaxed mb-6 flex-1">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${t.color} text-white text-sm font-semibold`}>
                    {t.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5 fill-warning text-warning" />
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
