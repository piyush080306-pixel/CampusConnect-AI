'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Repeat2,
  Code,
  Palette,
  Mic,
  Scissors,
  Video,
  BrainCircuit,
  Cloud,
  Shield,
  Database,
  Smartphone,
  PenTool,
  Boxes,
  Cpu,
  Bot,
  Search,
  Plus,
  Loader2,
  Coins,
  ArrowLeftRight,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/components/providers/auth-provider';
import type { SkillListing } from '@/lib/database.types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const skillCategories: Record<string, { label: string; icon: any; color: string }> = {
  programming: { label: 'Programming', icon: Code, color: 'bg-blue-500/10 text-blue-500' },
  design: { label: 'Design', icon: Palette, color: 'bg-violet-500/10 text-violet-500' },
  public_speaking: { label: 'Public Speaking', icon: Mic, color: 'bg-amber-500/10 text-amber-500' },
  editing: { label: 'Editing', icon: Scissors, color: 'bg-pink-500/10 text-pink-500' },
  video_editing: { label: 'Video Editing', icon: Video, color: 'bg-rose-500/10 text-rose-500' },
  ai: { label: 'AI', icon: BrainCircuit, color: 'bg-cyan-500/10 text-cyan-500' },
  cloud: { label: 'Cloud', icon: Cloud, color: 'bg-sky-500/10 text-sky-500' },
  cybersecurity: { label: 'Cybersecurity', icon: Shield, color: 'bg-red-500/10 text-red-500' },
  data_science: { label: 'Data Science', icon: Database, color: 'bg-emerald-500/10 text-emerald-500' },
  mobile: { label: 'Mobile Dev', icon: Smartphone, color: 'bg-indigo-500/10 text-indigo-500' },
  ui_ux: { label: 'UI/UX', icon: PenTool, color: 'bg-teal-500/10 text-teal-500' },
  blockchain: { label: 'Blockchain', icon: Boxes, color: 'bg-orange-500/10 text-orange-500' },
  iot: { label: 'IoT', icon: Cpu, color: 'bg-green-500/10 text-green-500' },
  robotics: { label: 'Robotics', icon: Bot, color: 'bg-purple-500/10 text-purple-500' },
};

const proficiencyLevels: Record<string, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: 'bg-green-500/10 text-green-500' },
  intermediate: { label: 'Intermediate', color: 'bg-blue-500/10 text-blue-500' },
  advanced: { label: 'Advanced', color: 'bg-violet-500/10 text-violet-500' },
  expert: { label: 'Expert', color: 'bg-amber-500/10 text-amber-500' },
};

type SkillWithProfile = SkillListing & { profiles?: { full_name: string } };

export default function SkillsPage() {
  const { profile } = useAuth();
  const [skills, setSkills] = useState<SkillWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'programming',
    type: 'offer',
    proficiency: 'intermediate',
    credit_cost: 1,
  });

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('skill_listings')
      .select('*, profiles!skill_listings_user_id_fkey(full_name)')
      .order('created_at', { ascending: false });
    if (typeFilter !== 'all') query = query.eq('type', typeFilter);
    if (categoryFilter !== 'all') query = query.eq('category', categoryFilter);
    if (search) query = query.or('title.ilike.%' + search + '%,description.ilike.%' + search + '%');
    const { data, error } = await query.limit(50);
    if (error) toast.error('Failed to load skills');
    setSkills(data || []);
    setLoading(false);
  }, [typeFilter, categoryFilter, search]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const { error } = await supabase.from('skill_listings').insert({
        title: form.title,
        description: form.description,
        category: form.category,
        type: form.type,
        proficiency: form.proficiency,
        credit_cost: form.credit_cost,
      });
      if (error) throw error;
      toast.success('Skill listing created!');
      setUploadOpen(false);
      setForm({ title: '', description: '', category: 'programming', type: 'offer', proficiency: 'intermediate', credit_cost: 1 });
      fetchSkills();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create listing');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-jakarta text-2xl font-bold">Skill Exchange Marketplace</h1>
          <p className="text-sm text-muted-foreground">Offer and request skills through a credit-based exchange</p>
        </div>
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              List a Skill
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>List a Skill</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Skill Title</Label>
                <Input id="title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="React.js Tutoring" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What can you teach or what do you want to learn?" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="offer">Offering</SelectItem>
                      <SelectItem value="request">Requesting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(skillCategories).map(([key, cfg]) => (
                        <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Proficiency</Label>
                  <Select value={form.proficiency} onValueChange={(v) => setForm({ ...form, proficiency: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(proficiencyLevels).map(([key, cfg]) => (
                        <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credit_cost">Credit Cost</Label>
                  <Input id="credit_cost" type="number" min={1} max={10} value={form.credit_cost} onChange={(e) => setForm({ ...form, credit_cost: parseInt(e.target.value) || 1 })} />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={uploading}>
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Listing'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-4 flex items-center gap-3 border-border/50 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Coins className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="text-sm font-medium">Your Credit Balance</div>
          <div className="text-xs text-muted-foreground">{profile?.credits || 0} credits available</div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search skills..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="offer">Offering</SelectItem>
            <SelectItem value="request">Requesting</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(skillCategories).map(([key, cfg]) => (
              <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : skills.length === 0 ? (
        <Card className="p-12 text-center border-border/50">
          <Repeat2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-medium mb-1">No skill listings found</h3>
          <p className="text-sm text-muted-foreground">Be the first to list a skill!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill, i) => {
            const cfg = skillCategories[skill.category] || skillCategories.programming;
            const Icon = cfg.icon;
            const profCfg = proficiencyLevels[skill.proficiency] || proficiencyLevels.intermediate;
            const isOwn = skill.user_id === profile?.id;
            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card className="group p-5 border-border/50 hover:shadow-lg hover:border-primary/30 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className={'flex h-10 w-10 items-center justify-center rounded-xl ' + cfg.color}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex gap-1.5">
                      <Badge variant={skill.type === 'offer' ? 'default' : 'secondary'} className="text-xs">
                        {skill.type === 'offer' ? 'Offering' : 'Requesting'}
                      </Badge>
                      <Badge className={'text-xs ' + profCfg.color}>{profCfg.label}</Badge>
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{skill.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{skill.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-muted text-xs">
                          {(skill.profiles?.full_name || 'U').split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        {isOwn ? 'You' : skill.profiles?.full_name || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium">
                      <Coins className="h-3.5 w-3.5 text-amber-500" />
                      {skill.credit_cost} credits
                    </div>
                  </div>
                  {!isOwn && (
                    <Button size="sm" variant="outline" className="w-full mt-3">
                      <ArrowLeftRight className="h-3.5 w-3.5 mr-1.5" />
                      {skill.type === 'offer' ? 'Book Session' : 'Offer Help'}
                    </Button>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
