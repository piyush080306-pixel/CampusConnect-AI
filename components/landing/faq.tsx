'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Is CampusConnect AI free to use?',
    answer: 'Yes! The Free plan lets you browse and download resources, join up to 3 communities, post in Q&A forums, and use the basic AI study assistant. You can upgrade to Pro for unlimited AI features and advanced analytics.',
  },
  {
    question: 'How does the skill credit exchange work?',
    answer: 'Every user starts with 50 skill credits. You earn credits by offering skills (e.g., tutoring someone in React) and spend credits to request skills from others. It is completely payment-free — just peer-to-peer knowledge exchange.',
  },
  {
    question: 'Can I use CampusConnect AI for my university?',
    answer: 'Absolutely. The Campus plan supports multi-university workspaces with isolated data, admin panels, content moderation, and placement cell dashboards. Contact our sales team to set up your institution.',
  },
  {
    question: 'What does the AI study assistant do?',
    answer: 'It can summarize PDFs, generate flashcards and quizzes, create mind maps, explain difficult topics, translate notes, generate learning paths, and plan your exam preparation schedule — all powered by GPT and Gemini.',
  },
  {
    question: 'How do project teams work?',
    answer: 'You can create a project, specify the roles you need (frontend, backend, AI, UI/UX, etc.), and recruit teammates. Each project has a Kanban board for task management, GitHub integration, file sharing, and milestone tracking.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. We use JWT authentication, role-based authorization, row-level security on all data, input validation, and audit logs. Your profile and data are only visible to you and the people you choose to share them with.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-jakarta text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about the platform.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass rounded-2xl p-2"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="px-4">
                <AccordionTrigger className="text-left font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
