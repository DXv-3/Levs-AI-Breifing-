import React, { useState, useEffect, useRef } from 'react';
import { 
  auth, db, googleProvider, signInWithPopup, signOut, onAuthStateChanged, 
  doc, getDoc, setDoc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, 
  Timestamp, User, OperationType, handleFirestoreError, getDocFromServer 
} from './lib/firebase';
import { generateAnalysis, chatWithGemini, quickResponse } from './lib/gemini';
import { BRIEFING_DATA } from './constants/briefing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, MessageSquare, BookOpen, Terminal, Shield, Cpu, 
  TrendingUp, LogOut, LogIn, Send, Sparkles, Search, 
  Layers, Database, Zap, ChevronRight, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { Toaster, toast } from 'sonner';

// --- Types ---
interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: any;
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: any;
  updatedAt: any;
}

// --- Components ---

const AuthOverlay = ({ onLogin }: { onLogin: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 tech-grid">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md p-8 glass-panel rounded-xl text-center"
    >
      <div className="flex justify-center mb-6">
        <div className="p-4 rounded-full bg-accent/10 border border-accent/20">
          <Brain className="w-12 h-12 text-accent accent-glow" />
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-2 mono-text tracking-tighter">LEV'S AI BRIEFING</h1>
      <p className="text-muted-foreground mb-8">Access the master session document and AI-powered landscape analysis.</p>
      <Button onClick={onLogin} className="w-full bg-accent text-black hover:bg-accent/90 font-bold">
        <LogIn className="w-4 h-4 mr-2" />
        SIGN IN WITH GOOGLE
      </Button>
    </motion.div>
  </div>
);

const Sidebar = ({ activeSection, setActiveSection, user, onLogout }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Briefing Dashboard', icon: BookOpen },
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
    { id: 'analysis', label: 'Deep Analysis', icon: Brain },
  ];

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)} className="glass-panel">
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>

      <AnimatePresence>
        {(isOpen || window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed inset-y-0 left-0 z-30 w-64 glass-panel border-r border-line flex flex-col"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-8">
                <Brain className="w-8 h-8 text-accent" />
                <span className="font-bold mono-text tracking-tighter text-xl">LEV BRIEF</span>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeSection === item.id 
                        ? 'bg-accent/10 text-accent border border-accent/20' 
                        : 'text-muted-foreground hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="mt-auto p-6 border-t border-line">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-10 h-10 border border-line">
                  <AvatarImage src={user?.photoURL} />
                  <AvatarFallback>{user?.displayName?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-red-400" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

const Dashboard = () => {
  return (
    <div className="space-y-8 pb-20">
      <header className="space-y-2">
        <Badge variant="outline" className="border-accent/30 text-accent mono-text">
          {BRIEFING_DATA.date} | {BRIEFING_DATA.location}
        </Badge>
        <h1 className="text-4xl font-bold tracking-tighter mono-text">{BRIEFING_DATA.title}</h1>
        <p className="text-xl text-muted-foreground">Master Session Document — {BRIEFING_DATA.author}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BRIEFING_DATA.sections.map((section, idx) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="glass-panel border-line h-full hover:border-accent/30 transition-colors group">
              <CardHeader>
                <CardTitle className="text-lg mono-text group-hover:text-accent transition-colors">
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground prose prose-invert max-w-none">
                <div className="markdown-body">
                  <ReactMarkdown>{section.content}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ChatAssistant = ({ user }: { user: User }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'users', user.uid, 'chats', 'default', 'messages'),
      orderBy('timestamp', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(msgs);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'messages'));

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setIsLoading(true);

    try {
      await addDoc(collection(db, 'users', user.uid, 'chats', 'default', 'messages'), {
        role: 'user',
        content: userMsg,
        timestamp: serverTimestamp(),
      });

      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const response = await chatWithGemini(history, userMsg);

      await addDoc(collection(db, 'users', user.uid, 'chats', 'default', 'messages'), {
        role: 'model',
        content: response,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      toast.error('Failed to send message');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] glass-panel rounded-xl overflow-hidden border-line">
      <div className="p-4 border-b border-line bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-accent" />
          <h2 className="font-bold mono-text">AI LANDSCAPE ASSISTANT</h2>
        </div>
        <Badge variant="outline" className="text-[10px] border-accent/20 text-accent/70">GEMINI-3-FLASH</Badge>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Ask me anything about the AI landscape briefing.</p>
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-accent text-black font-medium' 
                  : 'bg-white/5 border border-line text-white'
              }`}>
                <div className="markdown-body prose prose-invert prose-sm">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                <div className={`text-[10px] mt-1 opacity-50 ${msg.role === 'user' ? 'text-black' : 'text-white'}`}>
                  {msg.timestamp?.toDate ? format(msg.timestamp.toDate(), 'HH:mm') : ''}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-line p-3 rounded-xl">
                <div className="flex gap-1">
                  <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-accent rounded-full" />
                  <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-accent rounded-full" />
                  <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-accent rounded-full" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-line bg-white/5">
        <div className="flex gap-2">
          <Input 
            placeholder="Type your question..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="bg-black border-line focus:border-accent"
          />
          <Button onClick={handleSend} disabled={isLoading} className="bg-accent text-black hover:bg-accent/90">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const DeepAnalysis = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!prompt.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    setResult('');
    try {
      const content = BRIEFING_DATA.sections.map(s => `${s.title}\n${s.content}`).join('\n\n');
      const analysis = await generateAnalysis(prompt, content);
      setResult(analysis);
    } catch (err) {
      toast.error('Analysis failed');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold mono-text tracking-tighter">DEEP ANALYSIS ENGINE</h1>
        <p className="text-muted-foreground">Utilizing Gemini 3.1 Pro with High Thinking for complex synthesis.</p>
      </header>

      <Card className="glass-panel border-line">
        <CardHeader>
          <CardTitle className="text-sm mono-text text-accent">INPUT PARAMETERS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Analysis Prompt</label>
            <textarea 
              className="w-full h-32 bg-black border border-line rounded-lg p-4 text-sm focus:border-accent outline-none transition-colors"
              placeholder="e.g. Synthesize the impact of desktop agents on the SaaS market and predict the next 12 months..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing} 
            className="w-full bg-accent text-black hover:bg-accent/90 font-bold"
          >
            {isAnalyzing ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-pulse" />
                PROCESSING COMPLEX REASONING...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                EXECUTE DEEP ANALYSIS
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-panel border-line border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm mono-text text-accent">ANALYSIS OUTPUT</CardTitle>
              <Badge variant="outline" className="text-[10px] border-accent/30">THINKING_LEVEL: HIGH</Badge>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <div className="markdown-body">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    // Connection test
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
          toast.error("Firebase connection failed. Check console for details.");
        }
      }
    };
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          // Ensure user doc exists
          const userRef = doc(db, 'users', u.uid);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              uid: u.uid,
              displayName: u.displayName,
              email: u.email,
              photoURL: u.photoURL,
              role: 'user',
              createdAt: serverTimestamp(),
            });
          }
          setUser(u);
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${u.uid}`);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      toast.error('Login failed');
      console.error(err);
    }
  };

  const handleLogout = () => signOut(auth);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black tech-grid">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Brain className="w-16 h-16 text-accent" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <AuthOverlay onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-accent selection:text-black">
      <Toaster position="top-right" theme="dark" richColors />
      
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        user={user} 
        onLogout={handleLogout} 
      />

      <main className="lg:ml-64 p-6 lg:p-12 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeSection === 'dashboard' && <Dashboard />}
            {activeSection === 'chat' && <ChatAssistant user={user} />}
            {activeSection === 'analysis' && <DeepAnalysis />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none tech-grid opacity-20 z-[-1]" />
    </div>
  );
}
