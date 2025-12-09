
import React, { useState, useEffect } from 'react';
import { Play, Pause, Zap, CloudRain, Coffee, Waves, Sparkles, Link as LinkIcon, Disc } from 'lucide-react';
import { useZen } from '../context/ZenContext';

const ZenMediaWidget: React.FC = () => {
  const { isZenMode, toggleZenMode } = useZen();
  
  // --- TIMER LOGIC ---
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'FOCUS' | 'BREAK'>('FOCUS');

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setMode(prev => prev === 'FOCUS' ? 'BREAK' : 'FOCUS');
      setTimeLeft(mode === 'FOCUS' ? 5 * 60 : 25 * 60);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
    if (!isActive && !isZenMode && mode === 'FOCUS') toggleZenMode();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- MEDIA LOGIC ---
  const [activeTab, setActiveTab] = useState<'AMBIENT' | 'STREAM'>('AMBIENT');
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [embedUrl, setEmbedUrl] = useState('');
  const [embedSrc, setEmbedSrc] = useState<string | null>(null);

  const ambientSounds = [
    { id: 'rain', icon: CloudRain, label: 'Rain' },
    { id: 'cafe', icon: Coffee, label: 'Cafe' },
    { id: 'lofi', icon: Disc, label: 'Lo-Fi' },
    { id: 'white', icon: Waves, label: 'Noise' },
  ];

  const handleProcessLink = () => {
    // Basic parser for Spotify and YouTube
    let src = null;
    if (embedUrl.includes('spotify.com')) {
      if (embedUrl.includes('/embed')) {
        src = embedUrl;
      } else {
        src = embedUrl.replace('spotify.com/', 'spotify.com/embed/');
      }
    } else if (embedUrl.includes('youtube.com') || embedUrl.includes('youtu.be')) {
      let videoId = '';
      if (embedUrl.includes('v=')) {
        videoId = embedUrl.split('v=')[1]?.split('&')[0];
      } else if (embedUrl.includes('youtu.be/')) {
        videoId = embedUrl.split('youtu.be/')[1];
      }
      if (videoId) src = `https://www.youtube.com/embed/${videoId}`;
    }
    setEmbedSrc(src);
  };

  return (
    <div className={`
      relative bg-nordic-card rounded-2xl border border-white/5 flex flex-col h-full overflow-hidden transition-all duration-500 group
      ${isZenMode ? 'ring-1 ring-mint shadow-glow-mint' : ''}
    `}>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 pointer-events-none" />

      {/* --- TOP HALF: TIMER --- */}
      <div className="flex-1 p-4 flex flex-col items-center justify-center relative z-10">
        <div className={`flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/5 border border-white/5 ${mode === 'FOCUS' ? 'text-mint' : 'text-violet'}`}>
          <Zap size={12} className={isActive ? 'animate-bounce' : ''} />
          <span className="text-[10px] font-mono tracking-widest uppercase font-bold">{mode}</span>
        </div>
        
        <div className="text-5xl font-mono font-bold text-white mb-6 tracking-tighter drop-shadow-lg">
          {formatTime(timeLeft)}
        </div>

        <div className="flex items-center gap-4">
           <button 
             onClick={toggleTimer}
             className={`
               w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 text-nordic-bg shadow-lg
               ${mode === 'FOCUS' ? 'bg-mint shadow-[0_0_15px_rgba(94,234,212,0.4)]' : 'bg-violet shadow-[0_0_15px_rgba(167,139,250,0.4)]'}
             `}
           >
             {isActive ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
           </button>
           
           {mode === 'FOCUS' && !isActive && (
             <button 
                onClick={toggleZenMode} 
                className="absolute top-4 right-4 text-muted hover:text-white transition-colors"
                title="Toggle Zen Mode"
             >
                <Sparkles size={16} className={isZenMode ? 'text-mint' : ''} />
             </button>
           )}
        </div>
      </div>

      {/* --- BOTTOM HALF: MEDIA PLAYER (Glassmorphism) --- */}
      <div className="h-[140px] bg-white/5 backdrop-blur-md border-t border-white/10 flex flex-col relative z-20">
        {/* Tabs */}
        <div className="flex border-b border-white/5">
          <button 
            onClick={() => setActiveTab('AMBIENT')}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wide flex items-center justify-center gap-1.5 transition-colors ${activeTab === 'AMBIENT' ? 'text-white bg-white/5' : 'text-textSecondary hover:text-white'}`}
          >
            <Waves size={12} /> Ambient
          </button>
          <button 
            onClick={() => setActiveTab('STREAM')}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wide flex items-center justify-center gap-1.5 transition-colors ${activeTab === 'STREAM' ? 'text-white bg-white/5' : 'text-textSecondary hover:text-white'}`}
          >
            <LinkIcon size={12} /> Stream
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-3">
          {activeTab === 'AMBIENT' ? (
            <div className="grid grid-cols-4 gap-2 h-full">
               {ambientSounds.map((sound) => (
                 <button
                   key={sound.id}
                   onClick={() => setPlayingSound(playingSound === sound.id ? null : sound.id)}
                   className={`
                     flex flex-col items-center justify-center gap-1 rounded-xl border transition-all duration-300
                     ${playingSound === sound.id 
                       ? 'bg-mint/20 border-mint/50 text-mint shadow-[0_0_10px_rgba(94,234,212,0.1)]' 
                       : 'bg-black/20 border-white/5 text-textSecondary hover:bg-white/10 hover:border-white/10 hover:text-white'}
                   `}
                 >
                   <sound.icon size={18} />
                   <span className="text-[9px] font-medium">{sound.label}</span>
                 </button>
               ))}
            </div>
          ) : (
            <div className="h-full flex flex-col gap-2">
               {!embedSrc ? (
                 <div className="flex flex-col gap-2 h-full justify-center">
                   <input 
                     type="text" 
                     placeholder="Paste Spotify or YouTube URL..." 
                     className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-textSecondary focus:outline-none focus:border-mint/50 transition-colors"
                     value={embedUrl}
                     onChange={(e) => setEmbedUrl(e.target.value)}
                   />
                   <button 
                    onClick={handleProcessLink}
                    className="w-full bg-mint/10 hover:bg-mint/20 text-mint border border-mint/20 rounded-lg py-1.5 text-xs font-medium transition-all"
                   >
                     Load Stream
                   </button>
                 </div>
               ) : (
                 <div className="relative w-full h-full rounded-lg overflow-hidden border border-white/10 group shadow-lg">
                    <iframe 
                      src={embedSrc} 
                      className="w-full h-full" 
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture" 
                      allowFullScreen
                    />
                    <button 
                      onClick={() => setEmbedSrc(null)} 
                      className="absolute top-2 right-2 bg-black/60 hover:bg-red-500/80 backdrop-blur-sm text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                      title="Close Player"
                    >
                      <Zap size={10} />
                    </button>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ZenMediaWidget;
