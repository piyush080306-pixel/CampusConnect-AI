'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import type { ChatCompletionMessageParam } from '@mlc-ai/web-llm';
import { useWebLLM } from '@/hooks/use-webllm';
import {
  Bot,
  Sparkles,
  FileText,
  Brain,
  ListChecks,
  Network,
  Languages,
  Lightbulb,
  Map,
  CalendarClock,
  Send,
  Loader2,
  Zap,
  BookOpen,
  GraduationCap,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Download,
  Trash2,
  ChevronDown,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type ToolMode = 'chat' | 'summarize' | 'flashcards' | 'quiz' | 'explain' | 'translate' | 'learning_path' | 'exam_plan';

const tools: { id: ToolMode; icon: any; label: string; desc: string; color: string; prompt: string }[] = [
  { id: 'chat', icon: Bot, label: 'Chat', desc: 'Ask anything about your studies', color: 'bg-blue-500/10 text-blue-500', prompt: '' },
  { id: 'summarize', icon: FileText, label: 'Summarize', desc: 'Extract key points from text', color: 'bg-violet-500/10 text-violet-500', prompt: 'Summarize the following text into clear, concise bullet points. Focus on the most important concepts:\n\n' },
  { id: 'flashcards', icon: Brain, label: 'Flashcards', desc: 'Create study flashcards', color: 'bg-emerald-500/10 text-emerald-500', prompt: 'Create 10 study flashcards from the following content. Format each as:\n**Q:** [question]\n**A:** [answer]\n\nContent:\n' },
  { id: 'quiz', icon: ListChecks, label: 'Quiz', desc: 'Generate a practice quiz', color: 'bg-amber-500/10 text-amber-500', prompt: 'Generate a 5-question multiple choice quiz based on the following topic. Format each question as:\n**Q:** [question]\nA) [option]\nB) [option]\nC) [option]\nD) [option]\n**Answer:** [correct letter]\n\nTopic/content:\n' },
  { id: 'explain', icon: Lightbulb, label: 'Explain', desc: 'Get simple explanations', color: 'bg-cyan-500/10 text-cyan-500', prompt: 'Explain the following topic in simple terms that a beginner can understand. Use analogies and examples:\n\n' },
  { id: 'translate', icon: Languages, label: 'Translate', desc: 'Translate study notes', color: 'bg-pink-500/10 text-pink-500', prompt: 'Translate the following text. If no target language is specified, translate to Spanish. Preserve formatting and meaning:\n\n' },
  { id: 'learning_path', icon: Map, label: 'Learning Path', desc: 'Generate a study roadmap', color: 'bg-teal-500/10 text-teal-500', prompt: 'Create a structured learning path for the following topic. Break it into phases with estimated time, key topics to learn, and recommended resources for each phase:\n\n' },
  { id: 'exam_plan', icon: CalendarClock, label: 'Exam Planner', desc: 'Plan your exam prep', color: 'bg-orange-500/10 text-orange-500', prompt: 'Create a detailed exam preparation plan. Include daily study goals, topics to cover, review sessions, and practice recommendations:\n\n' },
];

const sampleQuestions: Record<ToolMode, string[]> = {
  chat: [
    'Explain Big O notation with examples',
    'What is the difference between SQL and NoSQL?',
    'How do neural networks learn?',
    'Explain the CAP theorem in distributed systems',
  ],
  summarize: [
    'Paste your notes or text to get a concise summary',
  ],
  flashcards: [
    'Paste your study material to generate flashcards',
  ],
  quiz: [
    'Enter a topic like "Data Structures" to get a quiz',
  ],
  explain: [
    'Enter a topic you find difficult to understand',
  ],
  translate: [
    'Paste text to translate to another language',
  ],
  learning_path: [
    'Enter a skill like "Machine Learning" to get a roadmap',
  ],
  exam_plan: [
    'Enter your exam topic and date for a study plan',
  ],
};

const modelOptions = [
  { id: 'Llama-3.2-1B-Instruct-q4f16_1-MLC', label: 'Llama 3.2 1B (Fast, ~700MB)', size: 'fast' },
  { id: 'Llama-3.2-3B-Instruct-q4f16_1-MLC', label: 'Llama 3.2 3B (Better, ~1.8GB)', size: 'quality' },
  { id: 'Phi-3.5-mini-instruct-q4f16_1-MLC', label: 'Phi 3.5 Mini (Balanced, ~2.2GB)', size: 'balanced' },
  { id: 'SmolLM2-1.7B-Instruct-q4f16_1-MLC', label: 'SmolLM2 1.7B (Lightweight, ~1GB)', size: 'light' },
  { id: 'gemma-2-2b-it-q4f16_1-MLC', label: 'Gemma 2 2B (Quality, ~1.6GB)', size: 'quality' },
];

type Message = { role: 'user' | 'assistant'; content: string };

const SYSTEM_PROMPT = `You are CampusConnect AI Study Assistant, a helpful tutor for college students. You provide clear, accurate, and educational explanations. When asked about academic topics, give thorough but easy-to-understand answers with examples. Format responses using markdown when helpful (bullet points, bold text, numbered lists). Keep responses focused and educational.`;

export default function AIAssistantPage() {
  const { state, modelId, loadModel, generateResponse, unload, isWebGPUAvailable } = useWebLLM();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [activeTool, setActiveTool] = useState<ToolMode>('chat');
  const [streamingContent, setStreamingContent] = useState('');
  const [selectedModel, setSelectedModel] = useState(modelId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const webgpuAvailable = isWebGPUAvailable();
  const isReady = state.status === 'ready';
  const isLoading = state.status === 'loading';
  const isGenerating = state.status === 'generating';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  useEffect(() => {
    if (activeTool !== 'chat') {
      inputRef.current?.focus();
    }
  }, [activeTool]);

  const handleSend = useCallback(async (text?: string) => {
    const query = text || input;
    if (!query.trim() || isGenerating) return;

    if (!isReady) {
      toast.error('Please load the AI model first');
      return;
    }

    const tool = tools.find((t) => t.id === activeTool)!;
    const fullQuery = tool.prompt ? tool.prompt + query : query;

    setMessages((m) => [...m, { role: 'user', content: query }]);
    setInput('');
    setStreamingContent('');

    try {
      const apiMessages: ChatCompletionMessageParam[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m) => ({ role: m.role, content: m.content }) as ChatCompletionMessageParam),
        { role: 'user', content: fullQuery },
      ];

      let accumulated = '';
      await generateResponse(apiMessages, (token) => {
        accumulated += token;
        setStreamingContent(accumulated);
      });

      setMessages((m) => [...m, { role: 'assistant', content: accumulated }]);
      setStreamingContent('');
    } catch (err: any) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Sorry, I encountered an error generating a response. Please try again.' }]);
      setStreamingContent('');
      toast.error('Generation failed');
    }
  }, [input, isGenerating, isReady, activeTool, messages, generateResponse]);

  const handleToolSelect = (toolId: ToolMode) => {
    setActiveTool(toolId);
    if (toolId !== 'chat') {
      setMessages([]);
      setStreamingContent('');
    }
  };

  const handleModelChange = (newModelId: string) => {
    setSelectedModel(newModelId);
    if (state.status === 'ready' || state.status === 'loading') {
      unload().then(() => {
        loadModel(newModelId);
      });
    }
  };

  const activeToolConfig = tools.find((t) => t.id === activeTool)!;
  const placeholder = activeTool === 'chat'
    ? 'Ask anything about your studies...'
    : `Enter content for ${activeToolConfig.label}...`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-jakarta text-2xl font-bold flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          AI Study Assistant
        </h1>
        <p className="text-sm text-muted-foreground">
          Your personal AI tutor — runs a real LLM directly in your browser. No API keys, no servers.
        </p>
      </div>

      {/* Model status bar */}
      <Card className="p-4 border-border/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              state.status === 'ready' ? 'bg-emerald-500/10' :
              state.status === 'loading' ? 'bg-amber-500/10' :
              state.status === 'error' ? 'bg-destructive/10' : 'bg-muted'
            }`}>
              {state.status === 'ready' ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> :
               state.status === 'loading' ? <Loader2 className="h-5 w-5 text-amber-500 animate-spin" /> :
               state.status === 'error' ? <AlertTriangle className="h-5 w-5 text-destructive" /> :
               <Cpu className="h-5 w-5 text-muted-foreground" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {state.status === 'idle' && 'Model not loaded'}
                  {state.status === 'loading' && 'Loading model...'}
                  {state.status === 'ready' && 'Model ready'}
                  {state.status === 'generating' && 'Generating response...'}
                  {state.status === 'error' && (state.error === 'webgpu' ? 'WebGPU not available' : 'Error loading model')}
                </span>
                {state.status === 'ready' && (
                  <Badge variant="secondary" className="text-xs">
                    <Cpu className="h-3 w-3 mr-1" />
                    {modelId.split('-').slice(0, 3).join('-')}
                  </Badge>
                )}
              </div>
              {state.status === 'loading' && (
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-1.5 flex-1 max-w-xs rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: state.loadProgress + '%' }} />
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{state.loadProgress}%</span>
                </div>
              )}
              {state.status === 'loading' && state.loadText && (
                <p className="text-xs text-muted-foreground mt-1 truncate">{state.loadText}</p>
              )}
              {state.status === 'error' && state.error === 'webgpu' && (
                <p className="text-xs text-muted-foreground mt-1">
                  Your browser doesn&apos;t support WebGPU. Try Chrome or Edge 113+.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={selectedModel} onValueChange={handleModelChange} disabled={isGenerating}>
              <SelectTrigger className="w-full sm:w-64 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modelOptions.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    <div className="flex items-center gap-2">
                      <span>{m.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {state.status === 'idle' && webgpuAvailable && (
              <Button size="sm" onClick={() => loadModel(selectedModel)} className="shrink-0">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Load Model
              </Button>
            )}
            {state.status === 'ready' && (
              <Button size="sm" variant="outline" onClick={unload} className="shrink-0">
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Unload
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Tools grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tools.map((tool) => {
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => handleToolSelect(tool.id)}
              className="text-left"
            >
              <Card className={`p-4 border transition-all hover:shadow-md ${
                isActive ? 'border-primary shadow-md ring-1 ring-primary/20' : 'border-border/50 hover:border-primary/30'
              }`}>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tool.color} mb-3`}>
                  <tool.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold mb-0.5">{tool.label}</h3>
                <p className="text-xs text-muted-foreground">{tool.desc}</p>
              </Card>
            </button>
          );
        })}
      </div>

      {/* Chat interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/50 flex flex-col h-[560px]">
          <div className="flex items-center gap-2 p-4 border-b border-border/50">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">
                {activeTool === 'chat' ? 'Study Buddy Chat' : activeToolConfig.label + ' Mode'}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isReady
                  ? 'Powered by in-browser LLM (WebGPU)'
                  : 'Load a model to start chatting'}
              </p>
            </div>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto text-xs"
                onClick={() => { setMessages([]); setStreamingContent(''); }}
              >
                Clear
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && !streamingContent && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 mb-4">
                  <activeToolConfig.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-1">{activeToolConfig.label} Mode</h3>
                <p className="text-sm text-muted-foreground max-w-xs mb-4">{activeToolConfig.desc}</p>
                {isReady && activeTool === 'chat' && (
                  <div className="space-y-1.5 w-full max-w-sm">
                    {sampleQuestions[activeTool].map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        className="block w-full text-left text-xs text-muted-foreground hover:text-foreground p-2.5 rounded-lg hover:bg-muted border border-border/40 transition-all"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
                {!isReady && !isLoading && webgpuAvailable && (
                  <Button onClick={() => loadModel(selectedModel)}>
                    <Download className="h-4 w-4 mr-2" />
                    Load AI Model
                  </Button>
                )}
                {!webgpuAvailable && (
                  <div className="max-w-sm rounded-lg bg-destructive/5 border border-destructive/20 p-4">
                    <AlertTriangle className="h-5 w-5 text-destructive mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">
                      WebGPU is not available in this browser. Please use Chrome or Edge 113+ to run the AI model locally.
                    </p>
                  </div>
                )}
              </div>
            )}

            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    msg.role === 'user' ? 'bg-muted' : 'bg-gradient-to-br from-primary to-secondary text-white'
                  }`}>
                    {msg.role === 'user' ? <GraduationCap className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap break-words ${
                    msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}

            {streamingContent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex gap-2 max-w-[85%]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap break-words bg-muted">
                    {streamingContent}
                    <span className="inline-block w-1.5 h-3.5 bg-primary ml-0.5 animate-pulse rounded-sm" />
                  </div>
                </div>
              </motion.div>
            )}

            {isGenerating && !streamingContent && (
              <div className="flex justify-start">
                <div className="flex gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl bg-muted px-4 py-2.5 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-border/50">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <Textarea
                ref={inputRef}
                placeholder={placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isGenerating || !isReady}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="min-h-[40px] max-h-[120px] resize-none"
                rows={1}
              />
              <Button type="submit" size="icon" disabled={isGenerating || !isReady || !input.trim()} className="shrink-0">
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2">
              {isReady
                ? 'Press Enter to send, Shift+Enter for new line'
                : 'Load a model to start asking questions'}
            </p>
          </div>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="p-5 border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-4 w-4 text-warning" />
              <h3 className="text-sm font-semibold">How it works</h3>
            </div>
            <div className="space-y-3 text-xs text-muted-foreground">
              <div className="flex gap-2">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[10px]">1</div>
                <p>Choose a model and click <span className="font-medium text-foreground">Load Model</span>. The model downloads once and is cached in your browser.</p>
              </div>
              <div className="flex gap-2">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[10px]">2</div>
                <p>Select a tool mode (Summarize, Flashcards, Quiz, etc.) or use Chat for general questions.</p>
              </div>
              <div className="flex gap-2">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[10px]">3</div>
                <p>Type your question or paste content. The AI generates a response in real-time, streaming token by token.</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 border-border/50 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">AI Career Coach</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Get personalized career roadmaps, skill gap analysis, and interview prep powered by the same in-browser LLM.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => {
                handleToolSelect('learning_path');
                setTimeout(() => handleSend('Create a career roadmap for becoming a full-stack software engineer'), 100);
              }}
              disabled={!isReady || isGenerating}
            >
              <Map className="h-3.5 w-3.5 mr-1.5" />
              Generate Career Roadmap
            </Button>
          </Card>

          <Card className="p-5 border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-warning" />
              <h3 className="text-sm font-semibold">Privacy First</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              The AI model runs entirely in your browser using WebGPU. Your data never leaves your device — no API calls, no servers, no tracking.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
