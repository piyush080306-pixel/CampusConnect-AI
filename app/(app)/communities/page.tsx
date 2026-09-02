'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Users,
  Plus,
  Loader2,
  Search,
  Code,
  Trophy,
  Music,
  Cpu,
  BookOpen,
  Palette,
  Lock,
  Unlock,
  UserPlus,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/components/providers/auth-provider';
import { Community } from '@/lib/database.types';
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
import { Switch } from '@/components/ui/switch';

const communityTypes = {
  coding: { label: 'Coding', icon: Code, color: 'bg-blue-500/10 text-blue-500' },
  sports: { label: 'Sports', icon: Trophy, color: 'bg-emerald-500/10 text-emerald-500' },
  cultural: { label: 'Cultural', icon: Music, color: 'bg-pink-500/10 text-pink-500' },
  tech: { label: 'Tech', icon: Cpu, color: 'bg-violet-500/10 text-violet-500' },
  academic: { label: 'Academic', icon: BookOpen, color: 'bg-amber-500/10 text-amber-500' },
  creative: { label: 'Creative', icon: Palette, color: 'bg-teal-500/10 text-teal-500' },
};

export default function CommunitiesPage() {
  const { profile } = useAuth();
  const [communities, setCommunities] = useState<(Community & { profiles?: { full_name: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());

  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'coding' as Community['type'],
    is_private: false,
  });

  const fetchCommunities = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('communities')
      .select('*, profiles!communities_user_id_fkey(full_name)')
      .order('created_at', { ascending: false });
    if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    const { data, error } = await query.limit(50);
    if (error) toast.error('Failed to load communities');
    setCommunities(data || []);

    if (profile) {
      const { data: members } = await supabase
        .from('community_members')
        .select('community_id')
        .eq('user_id', profile.id);
      setJoinedIds(new Set(members?.map((m) => m.community_id) || []));
    }
    setLoading(false);
  }, [search, profile]);

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const { data, error } = await supabase.from('communities').insert({
        name: form.name,
        description: form.description,
        type: form.type,
        is_private: form.is_private,
      }).select().single();
      if (error) throw error;

      // Auto-join as admin
      if (data && profile) {
        await supabase.from('community_members').insert({
          community_id: data.id,
          user_id: profile.id,
          role: 'admin',
        });
      }

      toast.success('Community created!');
      setCreateOpen(false);
      setForm({ name: '', description: '', type: 'coding', is_private: false });
      fetchCommunities();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create community');
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = async (community: Community) => {
    if (!profile) return;
    if (joinedIds.has(community.id)) {
      try {
        await supabase.from('community_members').delete().eq('community_id', community.id).eq('user_id', profile.id);
        await supabase.from('communities').update({ member_count: Math.max(0, community.member_count - 1) }).eq('id', community.id);
        setJoinedIds((s) => { const ns = new Set(s); ns.delete(community.id); return ns; });
        toast.success('Left community');
        fetchCommunities();
      } catch (err) {
        toast.error('Failed to leave community');
      }
    } else {
      try {
        await supabase.from('community_members').insert({ community_id: community.id, user_id: profile.id });
        await supabase.from('communities').update({ member_count: community.member_count + 1 }).eq('id', community.id);
        setJoinedIds((s) => new Set(s).add(community.id));
        toast.success('Joined community!');
        fetchCommunities();
      } catch (err: any) {
        toast.error(err.message || 'Failed to join');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-jakarta text-2xl font-bold">Clubs & Communities</h1>
          <p className="text-sm text-muted-foreground">Join coding, sports, cultural, and tech clubs</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Community
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create a Community</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Community Name</Label>
                <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="AI Builders Club" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What is your community about?" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as Community['type'] })}
                >
                  {Object.entries(communityTypes).map(([key, cfg]) => (
                    <option key={key} value={key}>{cfg.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <Label htmlFor="private">Private Community</Label>
                  <p className="text-xs text-muted-foreground">Only members can see posts</p>
                </div>
                <Switch id="private" checked={form.is_private} onCheckedChange={(c) => setForm({ ...form, is_private: c })} />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={creating}>
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Community'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search communities..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 max-w-md" />
      </div>

      {/* Communities */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : communities.length === 0 ? (
        <Card className="p-12 text-center border-border/50">
          <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-medium mb-1">No communities found</h3>
          <p className="text-sm text-muted-foreground">Create the first community on your campus!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {communities.map((community, i) => {
            const cfg = communityTypes[community.type];
            const Icon = cfg.icon;
            const isOwn = community.user_id === profile?.id;
            const isJoined = joinedIds.has(community.id);
            return (
              <motion.div
                key={community.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card className="group p-5 border-border/50 hover:shadow-lg hover:border-primary/30 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${cfg.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex gap-1.5">
                      {community.is_private ? (
                        <Badge variant="secondary" className="text-xs">
                          <Lock className="h-3 w-3 mr-1" /> Private
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          <Unlock className="h-3 w-3 mr-1" /> Public
                        </Badge>
                      )}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1">{community.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{community.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      {community.member_count} {community.member_count === 1 ? 'member' : 'members'}
                    </div>
                    {!isOwn && (
                      <Button
                        size="sm"
                        variant={isJoined ? 'secondary' : 'outline'}
                        onClick={() => handleJoin(community)}
                      >
                        {isJoined ? 'Joined' : (
                          <>
                            <UserPlus className="h-3.5 w-3.5 mr-1" />
                            Join
                          </>
                        )}
                      </Button>
                    )}
                    {isOwn && <Badge variant="secondary" className="text-xs">Owner</Badge>}
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
