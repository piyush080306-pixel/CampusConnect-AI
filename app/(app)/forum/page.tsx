'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  MessagesSquare,
  Plus,
  Loader2,
  Search,
  ThumbsUp,
  Eye,
  MessageCircle,
  CheckCircle2,
  ChevronUp,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/components/providers/auth-provider';
import { ForumPost, ForumAnswer } from '@/lib/database.types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const channels = [
  { key: 'general', label: 'General', color: 'bg-blue-500' },
  { key: 'programming', label: 'Programming', color: 'bg-violet-500' },
  { key: 'math', label: 'Mathematics', color: 'bg-emerald-500' },
  { key: 'ai_ml', label: 'AI & ML', color: 'bg-cyan-500' },
  { key: 'systems', label: 'Systems', color: 'bg-orange-500' },
  { key: 'career', label: 'Career', color: 'bg-pink-500' },
];

export default function ForumPage() {
  const { profile } = useAuth();
  const [posts, setPosts] = useState<(ForumPost & { profiles?: { full_name: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [channel, setChannel] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [answers, setAnswers] = useState<(ForumAnswer & { profiles?: { full_name: string } })[]>([]);
  const [answerBody, setAnswerBody] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  const [form, setForm] = useState({
    title: '',
    body: '',
    tags: '',
    channel: 'general',
  });

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('forum_posts')
      .select('*, profiles!forum_posts_user_id_fkey(full_name)')
      .order('created_at', { ascending: false });
    if (channel !== 'all') query = query.eq('channel', channel);
    if (search) query = query.or(`title.ilike.%${search}%,body.ilike.%${search}%`);
    const { data, error } = await query.limit(50);
    if (error) toast.error('Failed to load posts');
    setPosts(data || []);
    setLoading(false);
  }, [channel, search]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const fetchAnswers = useCallback(async (postId: string) => {
    const { data, error } = await supabase
      .from('forum_answers')
      .select('*, profiles!forum_answers_user_id_fkey(full_name)')
      .eq('post_id', postId)
      .order('is_accepted', { ascending: false })
      .order('votes', { ascending: false });
    if (!error && data) setAnswers(data);
  }, []);

  useEffect(() => {
    if (selectedPost) fetchAnswers(selectedPost);
  }, [selectedPost, fetchAnswers]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
      const { error } = await supabase.from('forum_posts').insert({
        title: form.title,
        body: form.body,
        tags,
        channel: form.channel,
      });
      if (error) throw error;
      toast.success('Question posted!');
      setCreateOpen(false);
      setForm({ title: '', body: '', tags: '', channel: 'general' });
      fetchPosts();
    } catch (err: any) {
      toast.error(err.message || 'Failed to post');
    } finally {
      setCreating(false);
    }
  };

  const handleAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost) return;
    setSubmittingAnswer(true);
    try {
      const { error } = await supabase.from('forum_answers').insert({
        post_id: selectedPost,
        body: answerBody,
      });
      if (error) throw error;
      await supabase.from('forum_posts')
        .update({ answer_count: (posts.find((p) => p.id === selectedPost)?.answer_count || 0) + 1 })
        .eq('id', selectedPost);
      setAnswerBody('');
      fetchAnswers(selectedPost);
      fetchPosts();
      toast.success('Answer posted!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to post answer');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleVote = async (post: ForumPost) => {
    try {
      await supabase.from('forum_posts').update({ votes: post.votes + 1 }).eq('id', post.id);
      fetchPosts();
    } catch (err) {
      toast.error('Failed to vote');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-jakarta text-2xl font-bold">Q&A Discussion Forum</h1>
          <p className="text-sm text-muted-foreground">Ask questions, share knowledge, earn reputation</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ask a Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Ask a Question</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="How do I implement a balanced BST in Python?" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Details</Label>
                <Textarea id="body" required value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Describe your question in detail..." className="min-h-[120px]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Channel</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={form.channel}
                    onChange={(e) => setForm({ ...form, channel: e.target.value })}
                  >
                    {channels.map((ch) => (
                      <option key={ch.key} value={ch.key}>{ch.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input id="tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="python, trees, algorithms" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={creating}>
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Post Question'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Channel filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setChannel('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            channel === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          All Channels
        </button>
        {channels.map((ch) => (
          <button
            key={ch.key}
            onClick={() => setChannel(ch.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              channel === ch.key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {ch.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search questions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 max-w-md" />
      </div>

      {/* Posts */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : posts.length === 0 ? (
        <Card className="p-12 text-center border-border/50">
          <MessagesSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-medium mb-1">No questions found</h3>
          <p className="text-sm text-muted-foreground">Be the first to ask a question!</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {posts.map((post, i) => {
            const isOwn = post.user_id === profile?.id;
            const ch = channels.find((c) => c.key === post.channel) || channels[0];
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
              >
                <Card
                  className="p-5 border-border/50 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
                  onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                >
                  <div className="flex gap-4">
                    {/* Vote column */}
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleVote(post); }}
                        className="p-1 rounded hover:bg-muted transition-colors"
                      >
                        <ChevronUp className="h-5 w-5 text-muted-foreground hover:text-primary" />
                      </button>
                      <span className="text-sm font-semibold">{post.votes}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${ch.color} text-white`}>{ch.label}</Badge>
                          {post.answer_count > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {post.answer_count} answers
                            </Badge>
                          )}
                        </div>
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{post.title}</h3>
                      {selectedPost !== post.id && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.body}</p>
                      )}

                      {selectedPost === post.id && (
                        <div className="mt-4 space-y-3 animate-fade-up">
                          <p className="text-sm text-foreground whitespace-pre-wrap">{post.body}</p>
                          <div className="border-t border-border/50 pt-4">
                            <h4 className="text-sm font-semibold mb-3">{answers.length} Answer{answers.length !== 1 ? 's' : ''}</h4>
                            {answers.map((ans) => (
                              <div key={ans.id} className="flex gap-3 py-3 border-b border-border/30 last:border-0">
                                <Avatar className="h-8 w-8 shrink-0">
                                  <AvatarFallback className="bg-muted text-xs">
                                    {(ans.profiles?.full_name || 'U').split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium">{ans.profiles?.full_name || 'Unknown'}</span>
                                    {ans.is_accepted && (
                                      <Badge className="text-xs bg-emerald-500/10 text-emerald-500">
                                        <CheckCircle2 className="h-3 w-3 mr-1" /> Accepted
                                      </Badge>
                                    )}
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <ThumbsUp className="h-3 w-3" /> {ans.votes}
                                    </span>
                                  </div>
                                  <p className="text-sm text-foreground/90 whitespace-pre-wrap">{ans.body}</p>
                                </div>
                              </div>
                            ))}
                            <form onSubmit={handleAnswer} className="mt-4 space-y-2">
                              <Textarea
                                placeholder="Write your answer..."
                                value={answerBody}
                                onChange={(e) => setAnswerBody(e.target.value)}
                                required
                                className="min-h-[80px]"
                              />
                              <Button type="submit" size="sm" disabled={submittingAnswer || !answerBody.trim()}>
                                {submittingAnswer ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Post Answer'}
                              </Button>
                            </form>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs font-normal">{tag}</Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" /> {post.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" /> {post.answer_count}
                          </span>
                          <span>{isOwn ? 'You' : post.profiles?.full_name || 'Unknown'}</span>
                        </div>
                      </div>
                    </div>
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
