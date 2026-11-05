import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Music2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  Disc3,
  Sliders
} from 'lucide-react';
import { luxuryAudio, LUXURY_TRACKS, TrackInfo } from '../utils/audio';

export const LuxuryAudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(luxuryAudio.getIsPlaying());
  const [currentTrack, setCurrentTrack] = useState<TrackInfo>(luxuryAudio.getCurrentTrack());
  const [volume, setVolume] = useState(luxuryAudio.getVolume());
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.35);

  useEffect(() => {
    const unsubscribe = luxuryAudio.subscribe((playing, track, vol) => {
      setIsPlaying(playing);
      setCurrentTrack(track);
      setVolume(vol);
      if (vol === 0) {
        setIsMuted(true);
      } else {
        setIsMuted(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleTogglePlay = () => {
    luxuryAudio.toggle();
  };

  const handleNext = () => {
    luxuryAudio.nextTrack();
  };

  const handlePrev = () => {
    luxuryAudio.prevTrack();
  };

  const handleSelectTrack = (index: number) => {
    luxuryAudio.selectTrack(index);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    luxuryAudio.setVolume(val);
  };

  const handleToggleMute = () => {
    if (isMuted) {
      luxuryAudio.setVolume(prevVolume || 0.35);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      luxuryAudio.setVolume(0);
      setIsMuted(true);
    }
  };

  return (
    <aside 
      aria-label="Place Vendôme Audio Experience"
      className="fixed bottom-5 left-5 z-40 max-w-[340px] sm:max-w-[380px] w-full font-sans-luxury transition-all duration-300"
    >
      <div className="bg-[#1C1B19]/95 dark:bg-[#121110]/95 backdrop-blur-md text-[#FAF9F5] border border-[#8C7853]/40 shadow-2xl overflow-hidden rounded-xs">
        {/* Top Header / Status Strip */}
        <div className="px-3.5 py-2 bg-[#141312] border-b border-[#2E2B27] flex items-center justify-between text-[10px] tracking-[0.2em] uppercase text-[#C5B492]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              {isPlaying && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? 'bg-[#D4AF37]' : 'bg-[#706B63]'}`}></span>
            </span>
            <span className="font-medium">Maison Aurelia · Soundscape</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Animated Equalizer Bars */}
            <div className="flex items-end gap-0.5 h-3 px-1" title={isPlaying ? 'Boutique Soundscape Playing' : 'Muted'}>
              <span 
                className={`w-0.5 bg-[#D4AF37] transition-all duration-200 ${
                  isPlaying ? 'h-3 animate-pulse' : 'h-1 opacity-40'
                }`} 
              />
              <span 
                className={`w-0.5 bg-[#C5B492] transition-all duration-300 ${
                  isPlaying ? 'h-2 animate-bounce' : 'h-1.5 opacity-40'
                }`} 
              />
              <span 
                className={`w-0.5 bg-[#D4AF37] transition-all duration-150 ${
                  isPlaying ? 'h-2.5 animate-pulse' : 'h-1 opacity-40'
                }`} 
              />
              <span 
                className={`w-0.5 bg-[#EAE6DE] transition-all duration-250 ${
                  isPlaying ? 'h-1.5 animate-bounce' : 'h-0.5 opacity-40'
                }`} 
              />
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#A59F94] hover:text-[#FAF9F5] transition-colors cursor-pointer p-0.5"
              aria-label={isExpanded ? 'Collapse track selector' : 'Expand track selector'}
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Primary Controls Row */}
        <div className="p-3.5 flex items-center justify-between gap-3">
          
          {/* Vinyl / Cover Icon */}
          <div className="relative shrink-0">
            <div className={`w-9 h-9 rounded-full bg-[#282522] border border-[#8C7853]/60 flex items-center justify-center ${
              isPlaying ? 'animate-spin' : ''
            }`} style={{ animationDuration: '8s' }}>
              <Disc3 className="w-5 h-5 text-[#C5B492]" />
            </div>
          </div>

          {/* Track Meta Details */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] uppercase tracking-wider text-[#8C7853] font-mono">
                {currentTrack.bpm} BPM
              </span>
              <span className="text-[9px] text-[#A59F94] truncate">· {currentTrack.genre}</span>
            </div>
            <h4 className="text-xs sm:text-sm font-serif-luxury text-[#FAF9F5] truncate leading-tight mt-0.5">
              {currentTrack.title}
            </h4>
            <p className="text-[10px] text-[#8C7853] dark:text-[#C5B492] italic truncate font-serif-luxury opacity-90">
              {currentTrack.frenchTitle}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handlePrev}
              title="Previous Luxury Track"
              className="p-1.5 text-[#A59F94] hover:text-white transition-colors cursor-pointer"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleTogglePlay}
              title={isPlaying ? 'Pause Luxury Soundscape' : 'Play Luxury Soundscape'}
              className="w-8 h-8 rounded-full bg-[#FAF9F5] text-[#181715] hover:bg-[#D4AF37] hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-md"
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={handleNext}
              title="Next Luxury Track"
              className="p-1.5 text-[#A59F94] hover:text-white transition-colors cursor-pointer"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Volume & Details Bar */}
        <div className="px-3.5 pb-2.5 pt-0.5 flex items-center justify-between gap-3 text-xs border-t border-[#25221F]">
          <div className="flex items-center gap-2 flex-1">
            <button
              onClick={handleToggleMute}
              className="text-[#8C7853] hover:text-[#C5B492] transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1 bg-[#332F2A] rounded-lg appearance-none cursor-pointer accent-[#C5B492]"
              aria-label="Volume Control"
            />
          </div>

          <span className="text-[10px] font-mono text-[#8C7853] shrink-0">
            {Math.round(volume * 100)}%
          </span>
        </div>

        {/* Expanded Track Selection Drawer */}
        {isExpanded && (
          <div className="px-3 pb-3 pt-2 bg-[#141312] border-t border-[#2A2724] space-y-1">
            <div className="text-[9px] uppercase tracking-[0.2em] text-[#8C7853] font-mono mb-1.5 px-1">
              Curated Place Vendôme Soundtracks:
            </div>
            {LUXURY_TRACKS.map((t, idx) => {
              const isSelected = t.id === currentTrack.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelectTrack(idx)}
                  className={`w-full text-left px-2.5 py-1.5 transition-colors cursor-pointer flex items-center justify-between text-xs ${
                    isSelected
                      ? 'bg-[#8C7853]/25 text-[#D4AF37] border-l-2 border-[#D4AF37]'
                      : 'text-[#A59F94] hover:bg-[#201D1A] hover:text-[#FAF9F5]'
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className="font-serif-luxury text-sm block leading-tight">{t.title}</span>
                    <span className="text-[10px] text-[#787268] block truncate">{t.genre}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8C7853] shrink-0">
                    {isSelected && isPlaying ? 'PLAYING' : `${t.bpm} BPM`}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};
