
import React, { useState, useEffect, useRef } from 'react';
import { TaskType, Language, PromptLength, ChatMessage, AspectRatio } from './types.js';
import { promptService } from './services/geminiService.js';
import ScoreChart from './components/ScoreChart.js';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'optimizer' | 'chat' | 'vision'>('optimizer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; type: 'auth' | 'system' | 'quota' | 'other' } | null>(null);
  
  // Optimizer State
  const [input, setInput] = useState('');
  const [taskType, setTaskType] = useState<TaskType>(TaskType.GENERAL);
  const [length, setLength] = useState<PromptLength>(PromptLength.MEDIUM);
  const [result, setResult] = useState<any>(null);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Image/Vision State
  const [visionPrompt, setVisionPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  const [analyzedResult, setAnalyzedResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { if (activeTab === 'chat') scrollToBottom(); }, [messages, activeTab]);

  const parseError = (err: any) => {
    const msg = err.message;
    if (msg.includes("Clé API")) return { message: msg, type: 'auth' as const };
    if (msg.includes("Limite")) return { message: msg, type: 'quota' as const };
    if (msg.includes("Service indisponible")) return { message: msg, type: 'system' as const };
    return { message: msg, type: 'other' as const };
  };

  const handleOptimize = async () => {
    if (!input.trim()) return;
    setLoading(true); setError(null);
    try {
      const res = await promptService.optimize(input, taskType, Language.FR, length);
      setResult(res);
    } catch (e: any) { setError(parseError(e)); }
    finally { setLoading(false); }
  };

  const handleChat = async () => {
    if (!chatInput.trim() || loading) return;
    const userMsg: ChatMessage = { role: 'user', text: chatInput };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setLoading(true); setError(null);
    try {
      const reply = await promptService.chat(chatInput, messages);
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (e: any) { setError(parseError(e)); }
    finally { setLoading(false); }
  };

  const handleGenerateImage = async () => {
    if (!visionPrompt.trim() || loading) return;
    setLoading(true); setError(null);
    try {
      if (!(await (window as any).aistudio.hasSelectedApiKey())) {
        await (window as any).aistudio.openSelectKey();
      }
      const img = await promptService.generateImage(visionPrompt, aspectRatio);
      setGeneratedImg(img);
    } catch (e: any) {
      if (e.message === "KEY_REQUIRED") {
        await (window as any).aistudio.openSelectKey();
      } else {
        setError(parseError(e));
      }
    } finally { setLoading(false); }
  };

  const handleAnalyzeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true); setError(null);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await promptService.analyzeImage(visionPrompt, reader.result as string, file.type);
        setAnalyzedResult(res);
      } catch (err: any) { setError(parseError(err)); }
      finally { setLoading(false); }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#05070a] text-slate-100">
      {/* Toast Error Alert */}
      {error && (
        <div className={`fixed top-6 right-6 z-[100] p-5 rounded-2xl shadow-2xl flex flex-col max-w-sm animate-in slide-in-from-right duration-300 border ${
          error.type === 'auth' ? 'bg-orange-500/90 border-orange-400' : 
          error.type === 'quota' ? 'bg-yellow-500/90 border-yellow-400' : 
          'bg-red-500/90 border-red-400'
        }`}>
          <div className="flex justify-between items-start mb-2">
            <span className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
              {error.type === 'auth' ? '🔑 Erreur Authentification' : 
               error.type === 'quota' ? '⏳ Limite Atteinte' : '⚠️ Erreur Système'}
            </span>
            <button onClick={() => setError(null)} className="text-white/60 hover:text-white transition-colors">✕</button>
          </div>
          <span className="text-sm font-medium leading-tight">{error.message}</span>
          <div className="mt-3 text-[10px] opacity-60 italic">Consultez la console pour plus de détails.</div>
        </div>
      )}

      <header className="h-16 border-b border-white/5 bg-slate-900/40 backdrop-blur-md flex items-center px-8 justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="text-white w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <h1 className="font-black text-lg tracking-tight uppercase">PromptMaster Elite</h1>
        </div>
        <nav className="flex gap-2">
          {['optimizer', 'chat', 'vision'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab as any); setError(null); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === tab ? 'bg-indigo-600 shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:bg-white/5'}`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </nav>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-6 lg:p-10">
        {activeTab === 'optimizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
            <div className="lg:col-span-4 space-y-6">
              <div className="glass rounded-[32px] p-6 border border-white/5 space-y-6">
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Entrez votre prompt basique ici..."
                  className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Type de Tâche</label>
                    <select value={taskType} onChange={e => setTaskType(e.target.value as any)} className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-xs">
                      {Object.values(TaskType).map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Taille de Sortie</label>
                    <select value={length} onChange={e => setLength(e.target.value as any)} className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-xs">
                      {Object.values(PromptLength).map(l => <option key={l} value={l} className="bg-slate-900">{l}</option>)}
                    </select>
                  </div>
                </div>
                <button 
                  onClick={handleOptimize} 
                  disabled={loading || !input.trim()}
                  className="w-full py-4 bg-indigo-600 rounded-2xl font-bold hover:bg-indigo-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/10"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "OPTIMISER LE PROMPT"}
                </button>
              </div>
            </div>
            <div className="lg:col-span-8">
              {result ? (
                <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
                  <div className="glass rounded-[32px] p-8 border border-white/5 flex items-center gap-8">
                    <ScoreChart score={result.score} />
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold">Score de Qualité : {result.score}%</h3>
                      <p className="text-sm text-slate-400 mt-2 leading-relaxed">{result.explanation}</p>
                    </div>
                  </div>
                  <div className="glass rounded-[32px] p-8 border border-indigo-500/20 bg-indigo-500/5">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Version Optimisée</h4>
                      <button 
                        onClick={() => { navigator.clipboard.writeText(result.optimizedPrompt); }}
                        className="text-[10px] font-bold bg-white/5 hover:bg-white/10 px-3 py-1 rounded-lg transition-colors"
                      >
                        COPIER
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono text-slate-200">{result.optimizedPrompt}</pre>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[400px] border border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center text-slate-600 italic">
                  <div className="w-12 h-12 mb-4 opacity-20">
                     <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>
                  </div>
                  Prêt pour l'ingénierie de prompt...
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="h-[75vh] glass rounded-[32px] border border-white/5 flex flex-col overflow-hidden animate-in fade-in duration-500">
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                  </div>
                  <p className="text-lg font-medium">Assistant PromptMaster Pro</p>
                  <p className="text-sm mt-2">Posez vos questions techniques sur l'IA ou testez vos prompts.</p>
                </div>
              )}
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                  <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-white/5 border border-white/10 backdrop-blur-sm'}`}>
                    <div className="font-bold text-[10px] uppercase tracking-widest mb-1 opacity-50">
                      {m.role === 'user' ? 'Vous' : 'PromptMaster'}
                    </div>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="p-6 bg-white/5 border-t border-white/5 flex gap-4">
              <input 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleChat()}
                placeholder="Discutez avec Gemini Pro..."
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
              />
              <button 
                onClick={handleChat} 
                disabled={loading || !chatInput.trim()}
                className="w-14 h-14 bg-indigo-600 rounded-2xl hover:bg-indigo-500 transition-all disabled:opacity-50 flex items-center justify-center shadow-xl shadow-indigo-600/10"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"/></svg>
                }
              </button>
            </div>
          </div>
        )}

        {activeTab === 'vision' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in duration-500">
            <div className="space-y-6">
              <div className="glass rounded-[32px] p-8 border border-white/5 space-y-6 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-6 h-6 bg-purple-600/20 text-purple-400 rounded-md flex items-center justify-center">
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z"/></svg>
                   </div>
                   <h3 className="font-bold text-lg">Image & Vision Lab</h3>
                </div>
                
                <textarea 
                  value={visionPrompt} 
                  onChange={e => setVisionPrompt(e.target.value)} 
                  placeholder="Décrivez l'image à créer ou les questions pour l'analyse visuelle..."
                  className="w-full h-36 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                />
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Rapport de Forme (Génération)</label>
                  <div className="flex flex-wrap gap-2">
                    {["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"].map(r => (
                      <button 
                        key={r} 
                        onClick={() => setAspectRatio(r as any)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${aspectRatio === r ? 'bg-purple-600 border-purple-600 shadow-lg shadow-purple-600/20' : 'border-white/10 hover:bg-white/5 text-slate-400'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button onClick={handleGenerateImage} disabled={loading} className="py-4 bg-purple-600 rounded-2xl font-bold text-xs hover:bg-purple-500 shadow-xl shadow-purple-600/10 transition-all flex items-center justify-center gap-2">
                    {loading && activeTab === 'vision' ? '...' : 'CRÉER IMAGE'}
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} disabled={loading} className="py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-xs hover:bg-white/10 transition-all">
                    ANALYSER IMAGE
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleAnalyzeImage} className="hidden" accept="image/*" />
                </div>
              </div>

              {analyzedResult && (
                <div className="glass rounded-[32px] p-8 border border-purple-500/20 bg-purple-500/5 animate-in slide-in-from-top-4 duration-500">
                  <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-3">Résultat de l'Analyse Vision</h4>
                  <p className="text-sm leading-relaxed text-slate-200">{analyzedResult}</p>
                </div>
              )}
            </div>

            <div className="glass rounded-[40px] border border-white/5 min-h-[500px] flex flex-col items-center justify-center overflow-hidden relative group shadow-2xl bg-black/20">
              {loading ? (
                <div className="flex flex-col items-center gap-6 animate-pulse">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-purple-500/10 border-t-purple-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>
                    </div>
                  </div>
                  <p className="text-xs font-black text-purple-400 uppercase tracking-tighter">Traitement Multimodal en cours...</p>
                </div>
              ) : generatedImg ? (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <img src={generatedImg} className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain animate-in zoom-in-95 duration-500" alt="Générée" />
                  <div className="absolute top-6 right-6 flex gap-2">
                    <a href={generatedImg} download="promptmaster-ai.png" className="bg-black/80 backdrop-blur-xl p-3 rounded-full hover:bg-purple-600 transition-all opacity-0 group-hover:opacity-100 shadow-2xl">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-slate-600 gap-4 opacity-40">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  <p className="text-sm font-medium italic">Zone de rendu visuel</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="py-8 text-center border-t border-white/5">
        <div className="flex justify-center gap-6 mb-3 opacity-30">
           <span className="text-[10px] font-black uppercase tracking-widest">Gemini 3 Pro</span>
           <span className="text-[10px] font-black uppercase tracking-widest">Gemini 2.5 Flash</span>
           <span className="text-[10px] font-black uppercase tracking-widest">Imagen Pro</span>
        </div>
        <p className="text-slate-700 text-[10px] uppercase font-bold tracking-[0.2em]">PromptMaster AI Elite • Studio Multimodal de Nouvelle Génération</p>
      </footer>
    </div>
  );
};

export default App;
