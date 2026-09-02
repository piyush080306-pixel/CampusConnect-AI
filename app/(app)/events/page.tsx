'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  CalendarDays,
  Plus,
  Loader2,
  Search,
  MapPin,
  Users,
  Clock,
  Trophy,
  Wrench,
  MonitorPlay,
  Presentation,
  PartyPopper,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/components/providers/auth-provider';
import { EventItem } from '@/lib/database.types';
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

const eventTypes = {
  technical_event: { label: 'Technical Event', icon: Trophy, color: 'bg-blue-500/10 text-blue-500' },
  workshop: { label: 'Workshop', icon: Wrench, color: 'bg-violet-500/10 text-violet-500' },
  seminar: { label: 'Seminar', icon: Presentation, color: 'bg-emerald-500/10 text-emerald-500' },
  webinar: { label: 'Webinar', icon: MonitorPlay, color: 'bg-cyan-500/10 text-cyan-500' },
  hackathon: { label: 'Hackathon', icon: PartyPopper, color: 'bg-pink-500/10 text-pink-500' },
};

export default function EventsPage() {
  const { profile } = useAuth();
  const [events, setEvents] = useState<(EventItem & { profiles?: { full_name: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());

  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'workshop' as EventItem['type'],
    event_date: '',
    location: '',
    capacity: 50,
  });

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('events')
      .select('*, profiles!events_user_id_fkey(full_name)')
      .order('event_date', { ascending: true });
    if (typeFilter !== 'all') query = query.eq('type', typeFilter);
    if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    const { data, error } = await query.limit(50);
    if (error) toast.error('Failed to load events');
    setEvents(data || []);

    // Fetch user's registrations
    if (profile) {
      const { data: regs } = await supabase
        .from('event_registrations')
        .select('event_id')
        .eq('user_id', profile.id);
      setRegisteredIds(new Set(regs?.map((r) => r.event_id) || []));
    }
    setLoading(false);
  }, [typeFilter, search, profile]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const { error } = await supabase.from('events').insert({
        title: form.title,
        description: form.description,
        type: form.type,
        event_date: new Date(form.event_date).toISOString(),
        location: form.location,
        capacity: form.capacity,
      });
      if (error) throw error;
      toast.success('Event created!');
      setCreateOpen(false);
      setForm({ title: '', description: '', type: 'workshop', event_date: '', location: '', capacity: 50 });
      fetchEvents();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create event');
    } finally {
      setCreating(false);
    }
  };

  const handleRegister = async (event: EventItem) => {
    if (!profile) return;
    if (registeredIds.has(event.id)) {
      // Unregister
      try {
        await supabase.from('event_registrations').delete().eq('event_id', event.id).eq('user_id', profile.id);
        await supabase.from('events').update({ registrations: Math.max(0, event.registrations - 1) }).eq('id', event.id);
        setRegisteredIds((s) => { const ns = new Set(s); ns.delete(event.id); return ns; });
        toast.success('Unregistered from event');
        fetchEvents();
      } catch (err) {
        toast.error('Failed to unregister');
      }
    } else {
      try {
        await supabase.from('event_registrations').insert({ event_id: event.id });
        await supabase.from('events').update({ registrations: event.registrations + 1 }).eq('id', event.id);
        setRegisteredIds((s) => new Set(s).add(event.id));
        toast.success('Registered successfully!');
        fetchEvents();
      } catch (err: any) {
        toast.error(err.message || 'Failed to register');
      }
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-jakarta text-2xl font-bold">Events & Hackathons</h1>
          <p className="text-sm text-muted-foreground">Browse, register, and create campus events</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create an Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="AI Workshop: Building with GPT" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your event..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as EventItem['type'] })}
                  >
                    {Object.entries(eventTypes).map(([key, cfg]) => (
                      <option key={key} value={key}>{cfg.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event_date">Date & Time</Label>
                  <Input id="event_date" type="datetime-local" required value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Auditorium A / Online" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input id="capacity" type="number" min={1} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 50 })} />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={creating}>
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Event'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          {Object.entries(eventTypes).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>
      </div>

      {/* Events */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : events.length === 0 ? (
        <Card className="p-12 text-center border-border/50">
          <CalendarDays className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-medium mb-1">No events found</h3>
          <p className="text-sm text-muted-foreground">Create an event and get your campus involved!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event, i) => {
            const cfg = eventTypes[event.type];
            const Icon = cfg.icon;
            const isOwn = event.user_id === profile?.id;
            const isRegistered = registeredIds.has(event.id);
            const isFull = event.registrations >= event.capacity;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card className="group p-5 border-border/50 hover:shadow-lg hover:border-primary/30 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${cfg.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge className={`text-xs ${cfg.color}`}>{cfg.label}</Badge>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{event.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{event.description}</p>
                  <div className="space-y-1.5 mb-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDate(event.event_date)} at {formatTime(event.event_date)}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {event.location}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      {event.registrations} / {event.capacity} registered
                    </div>
                  </div>
                  {!isOwn && (
                    <Button
                      size="sm"
                      variant={isRegistered ? 'secondary' : 'default'}
                      className="w-full"
                      disabled={isFull && !isRegistered}
                      onClick={() => handleRegister(event)}
                    >
                      {isRegistered ? 'Unregister' : isFull ? 'Event Full' : 'Register Now'}
                    </Button>
                  )}
                  {isOwn && (
                    <Badge variant="secondary" className="w-full justify-center py-1.5">Your Event</Badge>
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
