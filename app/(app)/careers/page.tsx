'use client';

import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  DollarSign,
  FileText,
  Star,
  TrendingUp,
  Upload,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

const internships = [
  { company: 'Google', role: 'Software Engineering Intern', location: 'Mountain View, CA', type: 'Summer 2026', stipend: '$8,000/mo', logo: 'G', color: 'bg-blue-500' },
  { company: 'Microsoft', role: 'AI Research Intern', location: 'Redmond, WA', type: 'Summer 2026', stipend: '$7,500/mo', logo: 'M', color: 'bg-cyan-500' },
  { company: 'Meta', role: 'Frontend Engineering Intern', location: 'Remote', type: 'Spring 2026', stipend: '$7,000/mo', logo: 'M', color: 'bg-violet-500' },
  { company: 'Amazon', role: 'Cloud DevOps Intern', location: 'Seattle, WA', type: 'Summer 2026', stipend: '$6,500/mo', logo: 'A', color: 'bg-amber-500' },
  { company: 'Nvidia', role: 'ML Systems Intern', location: 'Santa Clara, CA', type: 'Fall 2026', stipend: '$8,500/mo', logo: 'N', color: 'bg-emerald-500' },
  { company: 'Stripe', role: 'Backend Engineering Intern', location: 'Remote', type: 'Summer 2026', stipend: '$9,000/mo', logo: 'S', color: 'bg-purple-500' },
];

const atsResults = [
  { label: 'ATS Score', value: 72, icon: Star, color: 'text-amber-500', status: 'Good' },
  { label: 'Keyword Match', value: 85, icon: CheckCircle2, color: 'text-emerald-500', status: 'Strong' },
  { label: 'Format Check', value: 90, icon: CheckCircle2, color: 'text-emerald-500', status: 'Passed' },
  { label: 'Missing Skills', value: 3, icon: AlertCircle, color: 'text-orange-500', status: 'Review' },
];

export default function CareersPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
      toast.success('Resume analysis complete!');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-jakarta text-2xl font-bold">Internship & Placement Hub</h1>
        <p className="text-sm text-muted-foreground">Browse listings, track applications, and get AI resume reviews</p>
      </div>

      {/* AI Resume Analyzer */}
      <Card className="p-6 border-border/50 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="font-jakarta text-lg font-semibold">AI Resume Analyzer</h2>
          <Badge variant="secondary" className="text-xs ml-2">ATS Score</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Upload your resume to get an ATS score, keyword suggestions, missing skills, and industry matching.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleAnalyze} disabled={analyzing}>
            {analyzing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
            {analyzing ? 'Analyzing...' : 'Analyze My Resume'}
          </Button>
          {analyzed && (
            <Button variant="outline">Download Optimized Resume</Button>
          )}
        </div>

        {analyzed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5"
          >
            {atsResults.map((res) => (
              <div key={res.label} className="rounded-xl border border-border/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <res.icon className={`h-4 w-4 ${res.color}`} />
                  <Badge variant="secondary" className="text-xs">{res.status}</Badge>
                </div>
                <div className="font-jakarta text-xl font-bold">{res.value}{res.label.includes('Score') || res.label.includes('Match') || res.label.includes('Format') ? '%' : ''}</div>
                <div className="text-xs text-muted-foreground">{res.label}</div>
              </div>
            ))}
          </motion.div>
        )}
      </Card>

      {/* Internship Listings */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="h-5 w-5 text-primary" />
          <h2 className="font-jakarta text-lg font-semibold">Active Listings</h2>
          <Badge variant="secondary" className="text-xs">{internships.length} open</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {internships.map((job, i) => (
            <motion.div
              key={job.role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card className="p-5 border-border/50 hover:shadow-lg hover:border-primary/30 transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${job.color} text-white font-bold text-lg`}>
                    {job.logo}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{job.role}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Building2 className="h-3 w-3" />
                      {job.company}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {job.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" /> {job.stipend}
                  </span>
                </div>
                <Button size="sm" variant="outline" className="w-full">Apply Now</Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Placement Stats */}
      <Card className="p-6 border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-accent" />
          <h2 className="font-jakarta text-lg font-semibold">Placement Statistics</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Placement Rate', value: '94%', progress: 94 },
            { label: 'Avg. Package', value: '12.5 LPA', progress: 78 },
            { label: 'Companies Visited', value: '120+', progress: 85 },
            { label: 'Offers Made', value: '450', progress: 65 },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{stat.label}</span>
                <span className="text-sm font-bold">{stat.value}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary" style={{ width: stat.progress + '%' }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
