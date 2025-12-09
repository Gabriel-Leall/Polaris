import React, { useState } from 'react';
import { CloudRain, Coffee, Disc, Waves, Link as LinkIcon, Zap } from 'lucide-react';

const MediaPlayerWidget: React.FC = () => {
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

  const toggleSound = (id: string) => setPlayingSound(playingSound === id ? null : id);

  const handleLoadStream = () => {
    let src = null;
    if (embedUrl.includes('spotify.com')) {
      src = embedUrl.includes('/embed') ? embedUrl : embedUrl.replace('spotify.com/', 'spotify.com/embed/');
    } else if (embedUrl.includes('youtube.com') || embedUrl.includes('youtu.be')) {
      let videoId = '';
      if (embedUrl.includes('v=')) videoId = embedUrl.split('v=')[1]?.split('&')[0];
      else if (embedUrl.includes('youtu.be/')) videoId = embedUrl.split('youtu.be/')[1];
      if (videoId) src = `https://www.youtube.com/embed/${videoId}`;
    }
    setEmbedSrc(src);
  };

  return (
    <div className="flex flex-col h-full bg-surface rounded-3xl border border-border-subtle overflow-hidden shadow-card">
        {/* Tabs */}
        <div className="flex border-b border-border-subtle shrink-0">
          <button 
            onClick={() => setActiveTab('AMBIENT')}
            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === 'AMBIENT' ? 'text-indigo-400 bg-highlight border-b-2 border-indigo-500' : 'text-textSecondary hover:text-textPrimary'}`}
          >
            <Waves size={14} /> Ambient
          </button>
          <button 
            onClick={() => setActiveTab('STREAM')}
            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === 'STREAM' ? 'text-indigo-400 bg-highlight border-b-2 border-indigo-500' : 'text-textSecondary hover:text-textPrimary'}`}
          >
            <LinkIcon size={14} /> Stream
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
            {activeTab === 'AMBIENT' ? (
                // Compact Grid for 4 items in a row
                <div className="grid grid-cols-4 gap-3 h-full">
                    {ambientSounds.map((sound) => (
                        <button
                            key={sound.id}
                            onClick={() => toggleSound(sound.id)}
                            className={`
                                flex flex-col items-center justify-center gap-1.5 rounded-2xl border transition-all duration-300 h-full
                                ${playingSound === sound.id 
                                    ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)] scale-[1.02]' 
                                    : 'bg-inputBg border-border-subtle text-textSecondary hover:border-textSecondary/20 hover:text-textPrimary hover:bg-highlight'}
                            `}
                        >
                            <sound.icon size={20} className={playingSound === sound.id ? 'animate-pulse' : ''} />
                            <span className="text-[10px] font-medium tracking-wide">{sound.label}</span>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="h-full flex flex-col gap-3">
                    {!embedSrc ? (
                        <div className="flex flex-col justify-center h-full gap-3">
                            <input 
                                type="text" 
                                placeholder="Paste URL..." 
                                className="w-full bg-inputBg border border-border-subtle rounded-xl px-3 py-2 text-xs text-textPrimary placeholder-textSecondary focus:outline-none focus:border-indigo-500/50 transition-colors"
                                value={embedUrl}
                                onChange={(e) => setEmbedUrl(e.target.value)}
                            />
                            <button 
                                onClick={handleLoadStream}
                                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl py-2 text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_10px_rgba(99,102,241,0.3)]"
                            >
                                Connect
                            </button>
                        </div>
                    ) : (
                        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border-subtle shadow-lg group">
                            <iframe 
                                src={embedSrc} 
                                className="w-full h-full" 
                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture" 
                                allowFullScreen
                            />
                            <button 
                                onClick={() => setEmbedSrc(null)} 
                                className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md"
                            >
                                <Zap size={12} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};

export default MediaPlayerWidget;