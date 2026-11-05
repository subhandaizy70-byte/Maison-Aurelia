import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Disc3, 
  Sparkles, 
  Radio, 
  ArrowRight, 
  Clock, 
  Music2, 
  Headphones, 
  Waves,
  Sliders,
  CheckCircle2,
  Award
} from 'lucide-react';
import { luxuryAudio, LUXURY_TRACKS, TrackInfo } from '../utils/audio';
import { NavigationPage } from './Header';
import { LuxeLogo } from './LuxeLogo';

interface SoundscapeSectionProps {
  onNavigatePage?: (page: NavigationPage) => void;
  onOpenSalonBooking?: () => void;
}

export const SoundscapeSection: React.FC<SoundscapeSectionProps> = ({
  onNavigatePage,
  onOpenSalonBooking
}) => {
  const [isPlaying, setIsPlaying] = useState(luxuryAudio.getIsPlaying());
  const [currentTrack, setCurrentTrack] = useState<TrackInfo>(luxuryAudio.getCurrentTrack());
  const [volume, setVolume] = useState(luxuryAudio.getVolume());
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.35);
  const [acousticPreset, setAcousticPreset] = useState<'hall' | 'boudoir' | 'rain'>('hall');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Sync state with luxuryAudio singleton
  useEffect(() => {
    const unsub = luxuryAudio.subscribe((playing, track, vol) => {
      setIsPlaying(playing);
      setCurrentTrack(track);
      setVolume(vol);
      setIsMuted(vol === 0);
    });
    return () => unsub();
  }, []);

  // Track playback time simulated counter
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => (prev + 1) % 240); // 4-minute loop cycle
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const handleTogglePlay = () => {
    luxuryAudio.toggle();
  };

  const handleNext = () => {
    luxuryAudio.nextTrack();
    setElapsedSeconds(0);
  };

  const handlePrev = () => {
    luxuryAudio.prevTrack();
    setElapsedSeconds(0);
  };

  const handleSelectTrack = (index: number) => {
    luxuryAudio.selectTrack(index);
    setElapsedSeconds(0);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    luxuryAudio.setVolume(val);
  };

  const handleToggleMute = () => {
    if (isMuted) {
      const restore = prevVolume > 0 ? prevVolume : 0.35;
      luxuryAudio.setVolume(restore);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      luxuryAudio.setVolume(0);
      setIsMuted(true);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] dark:bg-[#0E0D0C] text-[#181715] dark:text-[#FAF8F5] transition-colors duration-300 pb-24">
      {/* Editorial Header */}
      <div className="relative border-b border-[#E8E4DC] dark:border-[#22201D] bg-[#F4F1EA] dark:bg-[#141311] py-14 sm:py-20 px-6 sm:px-12 overflow-hidden">
        {/* Subtle decorative background watermark */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.03] dark:opacity-[0.05] text-[180px] font-serif-luxury font-light leading-none">
          ACOUSTIQUE
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8C7853]/10 dark:bg-[#8C7853]/20 border border-[#8C7853]/30 text-[#8C7853] dark:text-[#C5B492] text-[11px] uppercase tracking-[0.25em] font-sans-luxury rounded-xs">
              <Radio className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
              <span>Dedicated Audio Tab · Salon Musique MMXXVI</span>
            </div>
            <LuxeLogo size="sm" variant="horizontal" showSubtitle={false} />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif-luxury font-light tracking-tight text-[#181715] dark:text-[#FAF8F5] leading-tight">
            Place Vendôme <span className="italic font-serif-luxury text-[#8C7853] dark:text-[#D4AF37]">Acoustic Sanctuary</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm sm:text-base text-[#656057] dark:text-[#A8A196] leading-relaxed font-light">
            Welcome to the private sonic sanctuary of LUXE LAYOUT. All acoustic compositions play entirely in this dedicated tab with continuous background synthesis. You may start the music here, then switch freely to the Exhibition, Women, Men, or Lookbook tabs with serene, uninterrupted ambiance.
          </p>

          {/* Quick Tab Switcher Badges */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
            <span className="text-[#8C7853] uppercase tracking-wider font-mono text-[10px]">
              Browse other pavilions while listening:
            </span>
            <button
              onClick={() => onNavigatePage && onNavigatePage('exhibition')}
              className="px-3 py-1 bg-white dark:bg-[#1D1B18] border border-[#DDD7CD] dark:border-[#302D29] hover:border-[#8C7853] text-[#181715] dark:text-[#FAF8F5] rounded text-xs transition-colors cursor-pointer"
            >
              Exhibition Overview
            </button>
            <button
              onClick={() => onNavigatePage && onNavigatePage('women')}
              className="px-3 py-1 bg-white dark:bg-[#1D1B18] border border-[#DDD7CD] dark:border-[#302D29] hover:border-[#8C7853] text-[#181715] dark:text-[#FAF8F5] rounded text-xs transition-colors cursor-pointer"
            >
              Femme (Women)
            </button>
            <button
              onClick={() => onNavigatePage && onNavigatePage('men')}
              className="px-3 py-1 bg-white dark:bg-[#1D1B18] border border-[#DDD7CD] dark:border-[#302D29] hover:border-[#8C7853] text-[#181715] dark:text-[#FAF8F5] rounded text-xs transition-colors cursor-pointer"
            >
              Homme (Men)
            </button>
            <button
              onClick={() => onNavigatePage && onNavigatePage('lookbook')}
              className="px-3 py-1 bg-white dark:bg-[#1D1B18] border border-[#DDD7CD] dark:border-[#302D29] hover:border-[#8C7853] text-[#181715] dark:text-[#FAF8F5] rounded text-xs transition-colors cursor-pointer"
            >
              Lookbook
            </button>
          </div>
        </div>
      </div>

      {/* Main Experience Layout */}
      <div className="max-w-6xl mx-auto px-6 sm:px-12 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: The Grand Gold Turntable & Live Master Console (7 cols) */}
          <div className="lg:col-span-7 bg-[#1C1B19] text-[#FAF8F5] rounded-lg p-6 sm:p-8 border border-[#3A352F] shadow-2xl relative overflow-hidden">
            
            {/* Top Turntable Header */}
            <div className="flex items-center justify-between border-b border-[#2D2A26] pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  {isPlaying && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isPlaying ? 'bg-[#D4AF37]' : 'bg-[#555048]'}`}></span>
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-[#C5B492] font-mono">
                  {isPlaying ? 'TURNTABLE ACTIVE · 33⅓ RPM' : 'TURNTABLE PAUSED'}
                </span>
              </div>
              <span className="text-[11px] text-[#8C7853] font-mono uppercase tracking-widest">
                PARIS 75001 · 432 Hz
              </span>
            </div>

            {/* Turntable Deck Centerpiece */}
            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-8 py-6 my-2 bg-[#141312] border border-[#2A2724] rounded-md p-6">
              
              {/* Vinyl Record */}
              <div className="relative group">
                <div 
                  className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-[#0F0E0D] via-[#1A1918] to-[#0D0C0B] border-4 border-[#2A2825] shadow-2xl flex items-center justify-center relative ${
                    isPlaying ? 'animate-spin' : ''
                  }`}
                  style={{ animationDuration: '6s', animationTimingFunction: 'linear' }}
                >
                  {/* Vinyl Grooves concentric rings */}
                  <div className="absolute inset-2 rounded-full border border-[#262421]/70 pointer-events-none" />
                  <div className="absolute inset-5 rounded-full border border-[#22201D] pointer-events-none" />
                  <div className="absolute inset-8 rounded-full border border-[#2B2824] pointer-events-none" />
                  <div className="absolute inset-12 rounded-full border border-[#201F1C] pointer-events-none" />
                  <div className="absolute inset-16 rounded-full border border-[#2A2724] pointer-events-none" />
                  
                  {/* Center Gold Label */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8C7853] via-[#D4AF37] to-[#5C4D30] text-[#181715] flex flex-col items-center justify-center text-center p-2 shadow-inner border border-[#E5D7A3]">
                    <div className="w-3 h-3 rounded-full bg-[#141312] border border-[#C5B492] mb-0.5"></div>
                    <span className="text-[6.5px] font-sans-luxury tracking-[0.16em] uppercase font-bold text-[#141312] leading-tight">
                      LUXE LAYOUT
                    </span>
                    <span className="text-[5.5px] tracking-widest font-mono text-[#2D2A24]">
                      PARIS · MMXXVI
                    </span>
                  </div>
                </div>

                {/* Vinyl Gloss Sheen reflection */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
              </div>

              {/* Tonearm & Needle Indicator */}
              <div className="flex flex-col justify-between items-center sm:items-start text-center sm:text-left">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#25221E] text-[#D4AF37] text-[10px] tracking-wider uppercase font-mono rounded-xs">
                    <Headphones className="w-3 h-3" />
                    <span>Acoustic Output</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif-luxury text-[#FAF8F5] leading-snug">
                    {currentTrack.title}
                  </h3>
                  <p className="text-xs text-[#C5B492] font-serif-luxury italic">
                    {currentTrack.frenchTitle}
                  </p>
                </div>

                <div className="mt-4 space-y-1 text-xs text-[#8C7853] font-mono">
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                    <span>Tempo: <strong className="text-[#FAF8F5]">{currentTrack.bpm} BPM</strong></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8C7853]"></span>
                    <span>Genre: <strong className="text-[#FAF8F5]">{currentTrack.genre}</strong></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#524B42]"></span>
                    <span>Mastering: <strong className="text-[#FAF8F5]">Web Audio Synth</strong></span>
                  </p>
                </div>

                {/* Animated Spectrum Waveform */}
                <div className="mt-4 flex items-end gap-1 h-6 bg-[#0E0D0C] px-3 py-1 rounded border border-[#23201D] w-full max-w-[200px]">
                  {[40, 75, 55, 90, 65, 80, 45, 95, 70, 60, 85, 50].map((h, i) => (
                    <span
                      key={i}
                      className={`flex-1 bg-[#D4AF37] transition-all rounded-t-xs ${
                        isPlaying ? 'animate-pulse' : 'opacity-25'
                      }`}
                      style={{
                        height: isPlaying ? `${h}%` : '20%',
                        animationDuration: `${0.4 + (i % 5) * 0.15}s`
                      }}
                    />
                  ))}
                </div>
              </div>

            </div>

            {/* Timeline Progress Bar */}
            <div className="mt-6 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#8C7853]">
                <span>{formatTime(elapsedSeconds)}</span>
                <span className="text-[#C5B492]">Loop Cycle · 4:00</span>
              </div>
              <div className="relative w-full h-1.5 bg-[#2A2723] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#8C7853] to-[#D4AF37] transition-all duration-300"
                  style={{ width: `${(elapsedSeconds / 240) * 100}%` }}
                />
              </div>
            </div>

            {/* Master Playback Controls */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#2D2A26]">
              {/* Prev / Play / Next */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-full bg-[#25221F] hover:bg-[#34302B] text-[#FAF8F5] transition-colors cursor-pointer border border-[#3A352F]"
                  title="Previous composition"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={handleTogglePlay}
                  className="px-6 py-3 rounded-full bg-[#D4AF37] hover:bg-[#E5C358] text-[#141312] font-semibold flex items-center gap-2.5 transition-all transform active:scale-95 shadow-lg cursor-pointer"
                  title={isPlaying ? 'Pause music' : 'Play music'}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span className="text-xs uppercase tracking-wider font-sans-luxury">Pause Acoustic</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                      <span className="text-xs uppercase tracking-wider font-sans-luxury">Play Soundscape</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-full bg-[#25221F] hover:bg-[#34302B] text-[#FAF8F5] transition-colors cursor-pointer border border-[#3A352F]"
                  title="Next composition"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Master Volume Controller */}
              <div className="flex items-center gap-3 min-w-[180px] bg-[#141312] px-3.5 py-2 rounded-full border border-[#2D2A26]">
                <button
                  onClick={handleToggleMute}
                  className="text-[#C5B492] hover:text-[#FAF8F5] transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-red-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 sm:w-28 h-1 bg-[#3A352F] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                  aria-label="Master volume level"
                />
                <span className="text-[11px] font-mono text-[#C5B492] w-9 text-right tabular-nums">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>

            {/* Acoustic Space Resonance Presets */}
            <div className="mt-6 pt-4 border-t border-[#2D2A26] flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-[#8C7853] uppercase tracking-wider font-mono text-[10px] flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Atmospheric Mode:</span>
              </span>

              <div className="flex items-center gap-1.5">
                {[
                  { id: 'hall', label: 'Grand Salon' },
                  { id: 'boudoir', label: 'Intimate Boudoir' },
                  { id: 'rain', label: 'Vendôme Rain' }
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setAcousticPreset(preset.id as any)}
                    className={`px-2.5 py-1 text-[11px] uppercase tracking-wider font-sans-luxury rounded transition-colors cursor-pointer ${
                      acousticPreset === preset.id
                        ? 'bg-[#8C7853] text-[#FAF8F5] font-semibold'
                        : 'bg-[#25221F] text-[#9A9386] hover:text-[#FAF8F5]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Curated Playlist & Track Profiles (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Playlist Box */}
            <div className="bg-white dark:bg-[#151412] border border-[#E8E4DC] dark:border-[#282522] rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#E8E4DC] dark:border-[#282522] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Music2 className="w-4 h-4 text-[#8C7853]" />
                  <h3 className="font-serif-luxury text-base font-semibold text-[#181715] dark:text-[#FAF8F5]">
                    Place Vendôme Repertory
                  </h3>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C7853] bg-[#8C7853]/10 px-2 py-0.5 rounded">
                  3 Compositions
                </span>
              </div>

              <div className="space-y-3">
                {LUXURY_TRACKS.map((t, idx) => {
                  const isCurrent = t.id === currentTrack.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => handleSelectTrack(idx)}
                      className={`p-3.5 rounded border transition-all cursor-pointer relative ${
                        isCurrent
                          ? 'border-[#8C7853] bg-[#F7F4ED] dark:bg-[#1E1C19] shadow-sm'
                          : 'border-[#EAE6DE] dark:border-[#22201D] hover:border-[#C5B492] hover:bg-[#FAF9F5] dark:hover:bg-[#181715]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isCurrent) {
                                handleTogglePlay();
                              } else {
                                handleSelectTrack(idx);
                              }
                            }}
                            className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center transition-all ${
                              isCurrent && isPlaying
                                ? 'bg-[#8C7853] text-[#FAF8F5]'
                                : 'bg-[#EAE6DE] dark:bg-[#2A2723] text-[#181715] dark:text-[#FAF8F5] hover:bg-[#8C7853] hover:text-white'
                            }`}
                          >
                            {isCurrent && isPlaying ? (
                              <Pause className="w-3.5 h-3.5 fill-current" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            )}
                          </button>

                          <div>
                            <h4 className="font-serif-luxury text-sm font-semibold text-[#181715] dark:text-[#FAF8F5]">
                              {t.title}
                            </h4>
                            <p className="text-xs text-[#8C7853] italic font-serif-luxury">
                              {t.frenchTitle}
                            </p>
                            <p className="text-[11px] text-[#656057] dark:text-[#9A9386] mt-1 line-clamp-2">
                              {t.description}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-mono text-[#8C7853] block">
                            {t.bpm} BPM
                          </span>
                          <span className="text-[9px] uppercase tracking-wider text-[#A59F94] block mt-0.5">
                            {t.genre}
                          </span>
                        </div>
                      </div>

                      {/* Status indicator pill */}
                      {isCurrent && (
                        <div className="mt-2.5 pt-2 border-t border-[#E2DDD3] dark:border-[#2B2824] flex items-center justify-between text-[10px] font-mono text-[#8C7853]">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8C7853] animate-ping" />
                            <span>Currently Loaded on Turntable</span>
                          </span>
                          <span className="font-semibold text-[#181715] dark:text-[#FAF8F5]">
                            {isPlaying ? 'PLAYING NOW' : 'READY TO PLAY'}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Background Playback Notice & Exhibition Concierge Callout */}
            <div className="bg-[#FAF9F5] dark:bg-[#181714] border border-[#8C7853]/40 rounded-lg p-5">
              <div className="flex items-center gap-2 text-[#8C7853] text-xs font-semibold uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Seamless Exhibition Background Listening</span>
              </div>
              <p className="text-xs text-[#605B54] dark:text-[#A8A196] leading-relaxed">
                Music does not interrupt when you leave this tab. It continues softly in the background as you inspect couture pieces, configure appointments, or review our market pricing indices.
              </p>

              <div className="mt-4 pt-3 border-t border-[#E8E4DC] dark:border-[#2D2A26] flex items-center justify-between">
                <span className="text-[11px] text-[#8C7853] font-serif-luxury italic">
                  Private Salon Listening Appointments
                </span>
                <button
                  onClick={onOpenSalonBooking}
                  className="text-xs uppercase tracking-wider font-semibold text-[#181715] dark:text-[#FAF8F5] hover:text-[#8C7853] dark:hover:text-[#D4AF37] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Book In-Person Salon</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
