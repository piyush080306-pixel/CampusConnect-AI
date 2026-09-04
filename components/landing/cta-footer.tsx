'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, Github, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTA() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent p-12 sm:p-16 text-center"
        >
          <div className="absolute inset-0 dot-pattern opacity-20" />
          <div className="relative">
            <h2 className="font-jakarta text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Ready to transform your campus experience?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Join 50,000+ students already learning, building, and growing together.
              It is free to get started.
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="group bg-white text-foreground hover:bg-white/90 h-12 px-8 text-base">
                Get Started for Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  const sections = [
    {
      title: 'Platform',
      links: ['Features', 'Pricing', 'AI Assistant', 'Skill Exchange', 'Projects', 'Communities'],
    },
    {
      title: 'Resources',
      links: ['Documentation', 'API Reference', 'Guides', 'Blog', 'Changelog', 'Status'],
    },
    {
      title: 'Company',
      links: ['About', 'Careers', 'Partners', 'Contact', 'Press Kit', 'Brand Assets'],
    },
    {
      title: 'Legal',
      links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR', 'Security', 'Accessibility'],
    },
  ];

  return (
    <footer className="relative border-t border-border/50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-jakarta text-lg font-bold">
                CampusConnect<span className="text-primary"> AI</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs mb-4">
              Learn Together. Build Together. Grow Together. The all-in-one campus collaboration platform.
            </p>
            <div className="flex gap-3">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg glass hover:bg-muted transition-colors">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg glass hover:bg-muted transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg glass hover:bg-muted transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-jakarta text-sm font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CampusConnect AI. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with care for students worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
