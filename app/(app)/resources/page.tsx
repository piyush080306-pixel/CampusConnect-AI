'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  BookOpen,
  FileText,
  FlaskConical,
  BookMarked,
  FileQuestion,
  Presentation,
  ScrollText,
  Search,
  Download,
  Upload,
  Loader2,
  Filter,
  Star,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/components/providers/auth-provider';
import type { Resource } from '@/lib/database.types';
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

const categoryConfig: Record<string, { label: string; icon: any; color: string }> = {
  notes: { label: 'Notes', icon: BookOpen, color: 'bg-blue-500/10 text-blue-500' },
  assignments: { label: 'Assignments', icon: FileText, color: 'bg-violet-500/10 text-violet-500' },
  lab_manuals: { label: 'Lab Manuals', icon: FlaskConical, color: 'bg-emerald-500/10 text-emerald-500' },
  books: { label: 'Books', icon: BookMarked, color: 'bg-amber-500/10 text-amber-500' },
  previous_papers: { label: 'Previous Papers', icon: FileQuestion, color: 'bg-pink-500/10 text-pink-500' },
  presentations: { label: 'Presentations', icon: Presentation, color: 'bg-cyan-500/10 text-cyan-500' },
  research_papers: { label: 'Research Papers', icon: ScrollText, color: 'bg-teal-500/10 text-teal-500' },
};

export default function ResourcesPage() {
  const { profile } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'notes',
    semester: 1,
    department: '',
    subject: '',
    tags: '',
    file_url: '',
  });

  const fetchResources = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('resources').select('*').order('created_at', { ascending: false });
    if (category !== 'all') query = query.eq('category', category);
    if (search) query = query.or('title.ilike.%' + search + '%,subject.ilike.%' + search + '%');
    const { data, error } = await query.limit(50);
    if (error) toast.error('Failed to load resources');
    setResources(data || []);
    setLoading(false);
  }, [category, search]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
      const { error } = await supabase.from('resources').insert({
        title: form.title,
        description: form.description,
        category: form.category,
        semester: form.semester,
        department: form.department || profile?.department || '',
        subject: form.subject,
        tags,
        file_url: form.file_url || null,
      });
      if (error) throw error;
      toast.success('Resource uploaded successfully!');
      setUploadOpen(false);
      setForm({ title: '', description: '', category: 'notes', semester: 1, department: '', subject: '', tags: '', file_url: '' });
      fetchResources();
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (resource: Resource) => {
    try {
      await supabase.from('resources').update({ downloads: resource.downloads + 1 }).eq('id', resource.id);
      if (resource.file_url) {
        window.open(resource.file_url, '_blank');
      } else {
        toast.success('Resource marked as downloaded');
      }
      fetchResources();
    } catch (err) {
      toast.error('Failed to download');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-jakarta text-2xl font-bold">Academic Resource Exchange</h1>
          <p className="text-sm text-muted-foreground">Discover and share notes, papers, and study materials</p>
        </div>
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Upload a Resource</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Data Structures - Linked Lists Notes" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description of the resource..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryConfig).map(([key, cfg]) => (
                        <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Select value={String(form.semester)} onValueChange={(v) => setForm({ ...form, semester: parseInt(v) })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="Computer Science" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Data Structures" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input id="tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="algorithms, trees, graphs" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file_url">File URL (optional)</Label>
                <Input id="file_url" value={form.file_url} onChange={(e) => setForm({ ...form, file_url: e.target.value })} placeholder="https://..." />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={uploading}>
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Upload Resource'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(categoryConfig).map(([key, cfg]) => (
              <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : resources.length === 0 ? (
        <Card className="p-12 text-center border-border/50">
          <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-medium mb-1">No resources found</h3>
          <p className="text-sm text-muted-foreground">Be the first to upload a resource for your campus!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource, i) => {
            const cfg = categoryConfig[resource.category] || categoryConfig.notes;
            const Icon = cfg.icon;
            return (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card className="group p-5 border-border/50 hover:shadow-lg hover:border-primary/30 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className={'flex h-10 w-10 items-center justify-center rounded-xl ' + cfg.color}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary" className="text-xs">Sem {resource.semester}</Badge>
                  </div>
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">{resource.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{resource.description || resource.subject}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {resource.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs font-normal">{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {resource.downloads}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {resource.rating || 'New'}
                      </span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleDownload(resource)}>
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Download
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
