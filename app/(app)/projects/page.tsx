'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Code2,
  Plus,
  Loader2,
  Search,
  Github,
  Users,
  Target,
  TrendingUp,
  KanbanSquare,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/components/providers/auth-provider';
import { Project } from '@/lib/database.types';
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
import { Textarea } from '@/components/ui/textarea';

const statusConfig = {
  recruiting: { label: 'Recruiting', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  in_progress: { label: 'In Progress', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  completed: { label: 'Completed', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  on_hold: { label: 'On Hold', color: 'bg-muted text-muted-foreground' },
};

const roleOptions = ['Frontend', 'Backend', 'AI/ML', 'UI/UX', 'Research', 'Testing', 'DevOps', 'Mobile'];

export default function ProjectsPage() {
  const { profile } = useAuth();
  const [projects, setProjects] = useState<(Project & { profiles?: { full_name: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [view, setView] = useState<'grid' | 'kanban'>('grid');

  const [form, setForm] = useState({
    title: '',
    description: '',
    roles_needed: [] as string[],
    tags: '',
    github_url: '',
  });

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('projects')
      .select('*, profiles!projects_user_id_fkey(full_name)')
      .order('created_at', { ascending: false });
    if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    const { data, error } = await query.limit(50);
    if (error) toast.error('Failed to load projects');
    setProjects(data || []);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
      const { error } = await supabase.from('projects').insert({
        title: form.title,
        description: form.description,
        roles_needed: form.roles_needed,
        tags,
        github_url: form.github_url || null,
      });
      if (error) throw error;
      toast.success('Project created! Start recruiting your team.');
      setCreateOpen(false);
      setForm({ title: '', description: '', roles_needed: [], tags: '', github_url: '' });
      fetchProjects();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const toggleRole = (role: string) => {
    setForm((f) => ({
      ...f,
      roles_needed: f.roles_needed.includes(role)
        ? f.roles_needed.filter((r) => r !== role)
        : [...f.roles_needed, role],
    }));
  };

  const kanbanColumns = [
    { key: 'recruiting', label: 'Recruiting', projects: projects.filter((p) => p.status === 'recruiting') },
    { key: 'in_progress', label: 'In Progress', projects: projects.filter((p) => p.status === 'in_progress') },
    { key: 'completed', label: 'Completed', projects: projects.filter((p) => p.status === 'completed') },
    { key: 'on_hold', label: 'On Hold', projects: projects.filter((p) => p.status === 'on_hold') },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-jakarta text-2xl font-bold">Project Collaboration Hub</h1>
          <p className="text-sm text-muted-foreground">Recruit teammates, manage tasks, and build together</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <Button
              variant={view === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('grid')}
              className="rounded-none"
            >
              <Target className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'kanban' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('kanban')}
              className="rounded-none"
            >
              <KanbanSquare className="h-4 w-4" />
            </Button>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create a Project</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input id="title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Campus Event Management System" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your project, goals, and what you're building..." />
                </div>
                <div className="space-y-2">
                  <Label>Roles Needed</Label>
                  <div className="flex flex-wrap gap-2">
                    {roleOptions.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => toggleRole(role)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          form.roles_needed.includes(role)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input id="tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="react, nextjs, postgres" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github_url">GitHub URL (optional)</Label>
                  <Input id="github_url" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} placeholder="https://github.com/..." />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={creating}>
                    {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Project'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 max-w-md" />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : view === 'grid' ? (
        projects.length === 0 ? (
          <Card className="p-12 text-center border-border/50">
            <Code2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-medium mb-1">No projects found</h3>
            <p className="text-sm text-muted-foreground">Create a project and start recruiting your team!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, i) => {
              const cfg = statusConfig[project.status];
              const isOwn = project.user_id === profile?.id;
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Card className="group p-5 border-border/50 hover:shadow-lg hover:border-primary/30 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={`text-xs ${cfg.color}`}>{cfg.label}</Badge>
                      {project.github_url && <Github className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <h3 className="font-semibold mb-1">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                    {project.roles_needed.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.roles_needed.map((role) => (
                          <Badge key={role} variant="outline" className="text-xs font-normal">{role}</Badge>
                        ))}
                      </div>
                    )}
                    {project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs font-normal">{tag}</Badge>
                        ))}
                      </div>
                    )}
                    <div className="space-y-2 pt-3 border-t border-border/50">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: project.progress + '%' }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        {isOwn ? 'You' : project.profiles?.full_name || 'Unknown'}
                      </div>
                      {!isOwn && project.status === 'recruiting' && (
                        <Button size="sm" variant="outline">Join Team</Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kanbanColumns.map((col) => (
            <div key={col.key} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold">{col.label}</h3>
                <Badge variant="secondary" className="text-xs">{col.projects.length}</Badge>
              </div>
              <div className="space-y-3 min-h-[200px]">
                {col.projects.map((project) => (
                  <Card key={project.id} className="p-4 border-border/50 hover:shadow-md transition-all cursor-pointer">
                    <h4 className="text-sm font-medium mb-1">{project.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{project.description}</p>
                    {project.roles_needed.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.roles_needed.slice(0, 3).map((role) => (
                          <Badge key={role} variant="outline" className="text-xs font-normal">{role}</Badge>
                        ))}
                      </div>
                    )}
                    <div className="mt-2">
                      <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: project.progress + '%' }} />
                      </div>
                    </div>
                  </Card>
                ))}
                {col.projects.length === 0 && (
                  <div className="text-center py-8 text-xs text-muted-foreground">No projects</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
