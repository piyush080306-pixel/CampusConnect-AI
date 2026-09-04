'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      'Browse & download resources',
      'Join up to 3 communities',
      'Post in Q&A forums',
      'Basic AI study assistant (10 queries/day)',
      'Skill marketplace access',
      'Join 1 project team',
    ],
    cta: 'Start Free',
    href: '/register',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    description: 'For serious students & builders',
    features: [
      'Everything in Free, plus:',
      'Unlimited AI study assistant',
      'AI resume analyzer & career coach',
      'Create unlimited projects',
      'Priority skill matching',
      'Peer tutoring with whiteboard',
      'Advanced analytics & insights',
      'Unlimited community membership',
    ],
    cta: 'Start 14-Day Trial',
    href: '/register',
    highlighted: true,
  },
  {
    name: 'Campus',
    price: '$4',
    period: '/student/month',
    description: 'For universities & placement cells',
    features: [
      'Everything in Pro, plus:',
      'Multi-university workspace isolation',
      'Admin panel & content moderation',
      'Placement cell dashboard',
      'Event approval workflows',
      'Broadcast messaging',
      'Analytics & reporting',
      'Dedicated support',
    ],
    cta: 'Contact Sales',
    href: '/register',
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-jakarta text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Simple, <span className="gradient-text">transparent pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free. Upgrade when you need more. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative"
            >
              <Card
                className={`relative h-full p-8 flex flex-col ${
                  plan.highlighted
                    ? 'border-primary shadow-xl shadow-primary/10 glow-primary'
                    : 'border-border/50'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-secondary px-3 py-1 text-xs font-medium text-white shadow-lg">
                      <Sparkles className="h-3 w-3" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-jakarta text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="font-jakarta text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.href} className="block">
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
