import React, { useState, useRef, useEffect, useCallback } from 'react';
import { LOOKBOOK_SLIDES, PRODUCTS } from '../data/products';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ArrowRight, 
  ShoppingBag, 
  Film, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  X, 
  ExternalLink,
  Layers,
  Compass,
  Check,
  Crosshair,
  Move,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  Scan
} from 'lucide-react';
import { Product, LookbookSlide } from '../types/fashion';

interface LookbookSectionProps {
  onSelectProduct: (product: Product) => void;
  onOpenSalonBooking: () => void;
}

export const LookbookSection: React.FC<LookbookSectionProps> = ({
  onSelectProduct,
  onOpenSalonBooking,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);
  const [isRunwayCinemaOpen, setIsRunwayCinemaOpen] = useState(false);
  const [activeCinemaTrack, setActiveCinemaTrack] = useState<
    'nano-banana-couture' | 'nano-banana-paris' | 'lv' | 'dior' | 'balenciaga'
  >('nano-banana-couture');
  const [isCinemaMuted, setIsCinemaMuted] = useState(true);
  const [isCinemaPlaying, setIsCinemaPlaying] = useState(true);
  const [isCinemaSlowMo, setIsCinemaSlowMo] = useState(false);
  const [showEnsembleDrawer, setShowEnsembleDrawer] = useState(false);

  // Tactile Magnification & Zoom States (Dior & Victoria's Secret inspired)
  const [zoomMode, setZoomMode] = useState<'dior-loupe' | 'vs-pan'>('dior-loupe');
  const [zoomLevel, setZoomLevel] = useState<number>(2.5); // 1, 2, 2.5, 3.5
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, percentX: 50, percentY: 50 });
  const [isPanZoomLocked, setIsPanZoomLocked] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 640, height: 720 });
  
  // Touch Pinch-to-zoom & Mobile Pan States
  const [touchScale, setTouchScale] = useState(1);
  const [touchPan, setTouchPan] = useState({ x: 0, y: 0 });
  const initialPinchDistRef = useRef<number | null>(null);
  const initialTouchScaleRef = useRef<number>(1);
  const lastTapTimeRef = useRef<number>(0);
  const touchStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Fullscreen Modal Zoom State
  const [modalZoomScale, setModalZoomScale] = useState(1);
  const [modalZoomMode, setModalZoomMode] = useState<'dior-loupe' | 'vs-pan'>('dior-loupe');
  const [modalMousePos, setModalMousePos] = useState({ x: 0, y: 0, percentX: 50, percentY: 50 });
  const [isModalHovering, setIsModalHovering] = useState(false);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const [modalContainerSize, setModalContainerSize] = useState({ width: 800, height: 700 });

  const containerRef = useRef<HTMLDivElement>(null);
  const slide = LOOKBOOK_SLIDES[currentIndex];

  // Measure container size dynamically
  const updateContainerDimensions = useCallback(() => {
    if (containerRef.current) {
      setContainerSize({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    }
    if (modalContainerRef.current) {
      setModalContainerSize({
        width: modalContainerRef.current.clientWidth,
        height: modalContainerRef.current.clientHeight,
      });
    }
  }, []);

  useEffect(() => {
    updateContainerDimensions();
    window.addEventListener('resize', updateContainerDimensions);
    return () => window.removeEventListener('resize', updateContainerDimensions);
  }, [updateContainerDimensions]);

  // Reset zoom on slide change
  const resetZoomState = useCallback(() => {
    setTouchScale(1);
    setTouchPan({ x: 0, y: 0 });
    setIsPanZoomLocked(false);
    setModalZoomScale(1);
  }, []);

  const handlePrev = useCallback(() => {
    resetZoomState();
    setCurrentIndex((prev) => (prev === 0 ? LOOKBOOK_SLIDES.length - 1 : prev - 1));
  }, [resetZoomState]);

  const handleNext = useCallback(() => {
    resetZoomState();
    setCurrentIndex((prev) => (prev === LOOKBOOK_SLIDES.length - 1 ? 0 : prev + 1));
  }, [resetZoomState]);

  // Autoplay timer
  useEffect(() => {
    if (!isAutoplay) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoplay, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        resetZoomState();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, resetZoomState]);

  // Touch handlers with Pinch-to-zoom, Pan & Double-tap
  const handleTouchStart = (e: React.TouchEvent) => {
    // 2-finger pinch gesture detection
    if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialPinchDistRef.current = dist;
      initialTouchScaleRef.current = touchScale;
      return;
    }

    // 1-finger touch
    if (e.touches.length === 1) {
      const now = Date.now();
      // Double-tap detection (< 300ms)
      if (now - lastTapTimeRef.current < 300) {
        if (touchScale > 1.1) {
          setTouchScale(1);
          setTouchPan({ x: 0, y: 0 });
        } else {
          setTouchScale(2.5);
        }
        lastTapTimeRef.current = 0;
        return;
      }
      lastTapTimeRef.current = now;

      touchStartPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      if (touchScale > 1.05) {
        // In zoomed state: pan around image instead of swiping carousel
        setIsDragging(false);
      } else {
        // In normal state: carousel swipe
        setIsDragging(true);
        setDragStartX(e.touches[0].clientX);
        setDragOffset(0);
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Pinch scaling
    if (e.touches.length === 2 && initialPinchDistRef.current !== null) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = currentDist / initialPinchDistRef.current;
      const nextScale = Math.min(4.0, Math.max(1.0, initialTouchScaleRef.current * ratio));
      setTouchScale(nextScale);
      return;
    }

    // Single finger
    if (e.touches.length === 1) {
      if (touchScale > 1.05) {
        // Pan the zoomed view
        const deltaX = e.touches[0].clientX - touchStartPosRef.current.x;
        const deltaY = e.touches[0].clientY - touchStartPosRef.current.y;
        touchStartPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        setTouchPan((prev) => ({
          x: Math.max(-200, Math.min(200, prev.x + deltaX)),
          y: Math.max(-200, Math.min(200, prev.y + deltaY)),
        }));
      } else if (isDragging) {
        const currentX = e.touches[0].clientX;
        const delta = currentX - dragStartX;
        setDragOffset(delta);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      initialPinchDistRef.current = null;
    }
    if (touchScale <= 1.05) {
      if (!isDragging) return;
      setIsDragging(false);
      const threshold = 60;
      if (dragOffset > threshold) {
        handlePrev();
      } else if (dragOffset < -threshold) {
        handleNext();
      }
      setDragOffset(0);
    } else {
      setIsDragging(false);
    }
  };

  // Mouse hover & drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    // If not zoomed or dragging carousel
    if (touchScale <= 1.05 && (!isPanZoomLocked || zoomMode === 'dior-loupe')) {
      setIsDragging(true);
      setDragStartX(e.clientX);
      setDragOffset(0);
    }
  };

  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const percentX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const percentY = Math.max(0, Math.min(100, (y / rect.height) * 100));

    setMousePos({ x, y, percentX, percentY });
    setIsHoveringImage(true);

    if (isDragging && touchScale <= 1.05) {
      const delta = e.clientX - dragStartX;
      setDragOffset(delta);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 70;
    if (dragOffset > threshold) {
      handlePrev();
    } else if (dragOffset < -threshold) {
      handleNext();
    }
    setDragOffset(0);
  };

  const handleContainerMouseLeave = () => {
    setIsHoveringImage(false);
    if (isDragging) {
      setIsDragging(false);
      setDragOffset(0);
    }
  };

  const handleDoubleClick = () => {
    if (zoomMode === 'vs-pan') {
      setIsPanZoomLocked((prev) => !prev);
    } else {
      setZoomLevel((prev) => (prev >= 3.5 ? 2.0 : 3.5));
    }
  };

  // Find primary product and all ensemble products
  const primaryProduct = PRODUCTS.find((p) => {
    if (slide.primaryProductId && p.id === slide.primaryProductId) return true;
    if (slide.id === 'look-01') return p.id === 'coat-hourglass-cashmere';
    if (slide.id === 'look-02') return p.id === 'lv-graphic-ski-jacket-1akx5z';
    if (slide.id === 'look-03') return p.id === 'dior-bar-jacket-heritage';
    if (slide.id === 'look-04') return p.id === 'coat-homme-navy-cashmere';
    if (slide.id === 'look-05') return p.id === 'bag-nano-knit-knot';
    if (slide.id === 'look-06') return p.id === 'dress-silk-slip-champagne';
    return p.id === 'coat-hourglass-cashmere';
  });

  const ensembleProducts = PRODUCTS.filter((p) => {
    if (slide.productIds && slide.productIds.includes(p.id)) return true;
    return false;
  });

  return (
    <section id="lookbook" className="py-24 bg-[#F2EFE8] dark:bg-[#121110] border-y border-[#E2DDD3] dark:border-[#24211E] transition-colors duration-200 select-none">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 border-b border-[#DFD9CD] dark:border-[#2B2724] gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] font-sans-luxury text-[#8C7853] dark:text-[#C5B492] mb-1">
              <span>Digital Runway & Editorial Archive</span>
              <span aria-hidden="true">·</span>
              <span>{slide.season}</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3]">
              The Digital Lookbook
            </h2>
          </div>

          {/* Right Action Tools: Cinema Reel, Autoplay & Prev/Next */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Dior & LV Runway Cinema Button */}
            <button
              onClick={() => setIsRunwayCinemaOpen(true)}
              className="px-3.5 py-2 text-xs uppercase tracking-[0.16em] font-sans-luxury bg-[#FAF9F5] dark:bg-[#1A1816] border border-[#C5BDAF] dark:border-[#38332E] hover:border-[#8C7853] text-[#181715] dark:text-[#FAF8F3] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              title="Watch Dior Haute Couture & Louis Vuitton Ski Runway Cinema"
            >
              <Film className="w-3.5 h-3.5 text-[#8C7853]" />
              <span>Haute Couture Cinema</span>
            </button>

            {/* Autoplay Toggle */}
            <button
              onClick={() => setIsAutoplay(!isAutoplay)}
              className={`p-2 border transition-colors cursor-pointer ${
                isAutoplay
                  ? 'border-[#8C7853] bg-[#8C7853]/15 text-[#8C7853]'
                  : 'border-[#CEC7B9] dark:border-[#38332E] text-[#706B63] dark:text-[#A7A096] hover:text-[#181715]'
              }`}
              title={isAutoplay ? 'Pause Slideshow' : 'Autoplay Slideshow'}
              aria-label={isAutoplay ? 'Pause Slideshow' : 'Autoplay Slideshow'}
            >
              {isAutoplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            {/* Slide Navigation Controls */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono tabular-nums tracking-widest text-[#706B63] dark:text-[#A7A096]">
                {String(currentIndex + 1).padStart(2, '0')} / {String(LOOKBOOK_SLIDES.length).padStart(2, '0')}
              </span>

              <div className="flex items-center border border-[#CEC7B9] dark:border-[#38332E] bg-[#FAF9F5] dark:bg-[#181614]">
                <button
                  onClick={handlePrev}
                  className="p-2.5 hover:bg-[#EAE4D7] dark:hover:bg-[#201D1A] text-[#181715] dark:text-[#FAF8F3] transition-colors cursor-pointer"
                  aria-label="Previous look"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="w-[1px] h-6 bg-[#CEC7B9] dark:bg-[#38332E]" />
                <button
                  onClick={handleNext}
                  className="p-2.5 hover:bg-[#EAE4D7] dark:hover:bg-[#201D1A] text-[#181715] dark:text-[#FAF8F3] transition-colors cursor-pointer"
                  aria-label="Next look"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Swipe Hint Banner */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-[#787268] dark:text-[#9A9388] font-sans-luxury">
          <span className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#8C7853]" />
            <span>Swipe left or right (touch/drag) to explore high-resolution editorial photography</span>
          </span>
          <span className="hidden sm:inline-block font-mono text-[10px] tracking-wider uppercase">
            Click 'Shop the Look' on each photo to view piece
          </span>
        </div>

        {/* Lookbook Content Grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Main Swipeable Visual Spread */}
          <div 
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleContainerMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleContainerMouseLeave}
            onDoubleClick={handleDoubleClick}
            className={`lg:col-span-7 relative aspect-[3/4] sm:aspect-[4/5] max-h-[720px] bg-[#E8E3D7] dark:bg-[#1A1816] overflow-hidden border border-[#DCD5C6] dark:border-[#2E2925] shadow-xl group cursor-grab ${
              isDragging ? 'cursor-grabbing' : ''
            }`}
          >
            {/* Sliding Image Canvas with Touch Drag Transform & VS Pan Zoom */}
            <div 
              style={{
                transform: `translateX(${dragOffset}px)`,
                transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              className="w-full h-full relative"
            >
              <img
                key={slide.id}
                src={slide.image}
                alt={slide.title}
                referrerPolicy="no-referrer"
                draggable={false}
                style={
                  touchScale > 1.05
                    ? {
                        transform: `scale(${touchScale}) translate(${touchPan.x / touchScale}px, ${touchPan.y / touchScale}px)`,
                        transformOrigin: 'center center',
                        transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                      }
                    : zoomMode === 'vs-pan' && (isHoveringImage || isPanZoomLocked)
                    ? {
                        transform: `scale(${zoomLevel})`,
                        transformOrigin: `${mousePos.percentX}% ${mousePos.percentY}%`,
                        transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                      }
                    : undefined
                }
                className="w-full h-full object-cover object-[center_20%] select-none pointer-events-none transition-transform"
              />

              {/* Subtle Vignette & Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 pointer-events-none" />

              {/* DIOR SAVOIR-FAIRE OPTICAL RETICLE LOUPE */}
              {zoomMode === 'dior-loupe' && isHoveringImage && touchScale <= 1.05 && (
                <div
                  style={{
                    left: `${mousePos.x}px`,
                    top: `${mousePos.y}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="w-[210px] h-[210px] rounded-full border-2 border-[#C5B492] shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.2)] ring-4 ring-black/70 overflow-hidden absolute pointer-events-none z-30 transition-opacity duration-150 backdrop-blur-xs bg-black"
                >
                  {/* Magnified Image precisely anchored */}
                  <img
                    src={slide.image}
                    alt={slide.title}
                    referrerPolicy="no-referrer"
                    style={{
                      position: 'absolute',
                      width: `${containerSize.width * zoomLevel}px`,
                      height: `${containerSize.height * zoomLevel}px`,
                      maxWidth: 'none',
                      maxHeight: 'none',
                      left: `${-mousePos.x * zoomLevel + 105}px`,
                      top: `${-mousePos.y * zoomLevel + 105}px`,
                      objectFit: 'cover',
                    }}
                    className="select-none pointer-events-none"
                  />

                  {/* Dior Fine Crosshair Reticle Overlay */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="absolute top-0 bottom-[calc(50%+7px)] left-1/2 w-[1px] bg-gradient-to-t from-[#C5B492] to-transparent" />
                    <div className="absolute top-[calc(50%+7px)] bottom-0 left-1/2 w-[1px] bg-gradient-to-b from-[#C5B492] to-transparent" />
                    <div className="absolute left-0 right-[calc(50%+7px)] top-1/2 h-[1px] bg-gradient-to-l from-[#C5B492] to-transparent" />
                    <div className="absolute left-[calc(50%+7px)] right-0 top-1/2 h-[1px] bg-gradient-to-r from-[#C5B492] to-transparent" />
                    
                    <div className="w-3.5 h-3.5 rounded-full border border-[#C5B492] flex items-center justify-center bg-black/30">
                      <div className="w-1 h-1 rounded-full bg-[#C5B492]" />
                    </div>
                  </div>

                  {/* Telemetry Ribbons */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/85 text-[#C5B492] text-[8.5px] font-mono tracking-widest uppercase border border-[#C5B492]/50 rounded-full whitespace-nowrap shadow-sm">
                    DIOR SAVOIR-FAIRE · {zoomLevel.toFixed(1)}X
                  </div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/85 text-[#FAF8F3] text-[8px] font-mono tracking-wider border border-white/20 rounded-full whitespace-nowrap shadow-sm">
                    X: {mousePos.percentX.toFixed(0)}% · Y: {mousePos.percentY.toFixed(0)}%
                  </div>
                </div>
              )}

              {/* VICTORIA'S SECRET RUNWAY PAN SCAN BADGE */}
              {zoomMode === 'vs-pan' && (isHoveringImage || isPanZoomLocked) && (
                <div className="absolute top-16 left-1/2 -translate-x-1/2 px-3.5 py-1.5 bg-[#141311]/90 backdrop-blur-md border border-[#C5B492]/80 text-[#FAF8F3] text-[10px] font-sans-luxury uppercase tracking-[0.2em] shadow-xl flex items-center gap-2 pointer-events-none z-30 rounded-full animate-fade-in">
                  <span className="w-1.5 h-1.5 bg-[#8C7853] rounded-full animate-pulse" />
                  <span>VICTORIA'S SECRET RUNWAY PAN · {zoomLevel.toFixed(1)}X {isPanZoomLocked ? '(LOCKED)' : '(MOVE TO SCAN)'}</span>
                </div>
              )}

              {/* TACTILE MOBILE PINCH-TO-ZOOM PILL */}
              {touchScale > 1.05 && (
                <div className="absolute top-16 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/90 backdrop-blur-md border border-[#C5B492] text-[#FAF8F3] text-[10px] font-mono shadow-xl flex items-center gap-2 z-30 rounded-full">
                  <span>Pinch Zoom: {touchScale.toFixed(1)}x</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetZoomState();
                    }}
                    className="px-2 py-0.5 bg-[#8C7853] text-white uppercase text-[9px] font-bold rounded cursor-pointer"
                  >
                    Reset 1x
                  </button>
                </div>
              )}

              {/* Top Tag: Look Number & Season */}
              <div className="absolute top-4 left-4 bg-[#FAF9F5]/90 dark:bg-[#141311]/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-serif-luxury text-[#181715] dark:text-[#FAF8F3] border border-[#E5DFD4] dark:border-[#332E29] shadow-sm flex items-center gap-2">
                <span className="font-semibold text-[#8C7853]">Look {slide.lookNumber}</span>
                <span aria-hidden="true" className="opacity-40">·</span>
                <span>{slide.season}</span>
              </div>

              {/* TACTILE LUXURY CONTROLS BAR (Top Right) */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-[#141311]/85 backdrop-blur-md p-1 border border-white/20 shadow-xl">
                {/* Mode Selector */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomMode('dior-loupe');
                  }}
                  className={`px-2 py-1 text-[10px] uppercase tracking-wider font-sans-luxury flex items-center gap-1 transition-colors cursor-pointer ${
                    zoomMode === 'dior-loupe'
                      ? 'bg-[#8C7853] text-white font-medium'
                      : 'text-white/70 hover:text-white'
                  }`}
                  title="Dior Savoir-Faire Precision Optical Loupe"
                >
                  <Crosshair className="w-3 h-3" />
                  <span className="hidden sm:inline">Dior Loupe</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomMode('vs-pan');
                  }}
                  className={`px-2 py-1 text-[10px] uppercase tracking-wider font-sans-luxury flex items-center gap-1 transition-colors cursor-pointer ${
                    zoomMode === 'vs-pan'
                      ? 'bg-[#8C7853] text-white font-medium'
                      : 'text-white/70 hover:text-white'
                  }`}
                  title="Victoria's Secret Runway Pan-Scan"
                >
                  <Move className="w-3 h-3" />
                  <span className="hidden sm:inline">VS Pan</span>
                </button>

                <div className="w-[1px] h-4 bg-white/20" />

                {/* Multipliers */}
                {[2.0, 3.5].map((scale) => (
                  <button
                    key={scale}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomLevel(scale);
                    }}
                    className={`px-1.5 py-0.5 text-[9px] font-mono transition-colors cursor-pointer ${
                      zoomLevel === scale
                        ? 'bg-white/30 text-white font-bold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {scale}x
                  </button>
                ))}

                <div className="w-[1px] h-4 bg-white/20" />

                {/* Fullscreen Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFullscreenModalOpen(true);
                  }}
                  className="p-1 text-white/80 hover:text-white transition-colors cursor-pointer"
                  title="Inspect High-Res Editorial Photography"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Model / Editorial Provenance Tag */}
              <div className="absolute bottom-4 left-4 max-w-[280px] bg-[#141311]/80 backdrop-blur-md px-3 py-1.5 text-[11px] font-sans-luxury text-[#FAF9F5] border border-white/15">
                <div className="text-[9px] uppercase tracking-wider text-[#C5B492] font-semibold">Editorial Specs</div>
                <div className="truncate">{slide.modelSpecs}</div>
              </div>

              {/* ============================================================== */}
              {/* PRIMARY 'SHOP THE LOOK' BUTTON OVERLAID DIRECTLY ON IMAGE */}
              {/* ============================================================== */}
              {primaryProduct && (
                <div className="absolute bottom-4 right-4 z-20">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProduct(primaryProduct);
                    }}
                    className="group/shop relative flex items-center gap-3 px-4 py-2.5 sm:px-5 sm:py-3 bg-[#FAF9F5]/95 dark:bg-[#161513]/95 hover:bg-white dark:hover:bg-[#201D1A] backdrop-blur-md text-[#181715] dark:text-[#FAF8F3] border border-[#8C7853] shadow-2xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                  >
                    {/* Glowing Accent Dot */}
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8C7853] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8C7853]" />
                    </span>

                    <ShoppingBag className="w-4 h-4 text-[#8C7853] shrink-0" />

                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] sm:text-xs uppercase tracking-[0.18em] font-sans-luxury font-bold text-[#181715] dark:text-[#FAF8F3]">
                          Shop the Look
                        </span>
                        <ArrowRight className="w-3 h-3 text-[#8C7853] transition-transform group-hover/shop:translate-x-0.5" />
                      </div>
                      <div className="text-[10px] font-mono text-[#706B63] dark:text-[#A7A096] truncate max-w-[140px] sm:max-w-[180px]">
                        {primaryProduct.name.split('(')[0]} · €{primaryProduct.price.toLocaleString()}
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Ensemble Drawer Toggle on bottom left if multiple pieces */}
            {ensembleProducts.length > 1 && (
              <div className="absolute bottom-16 left-4 z-20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEnsembleDrawer(!showEnsembleDrawer);
                  }}
                  className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-sans-luxury bg-black/70 hover:bg-black/90 text-white backdrop-blur-sm border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Layers className="w-3 h-3 text-[#C5B492]" />
                  <span>Ensemble Pieces ({ensembleProducts.length})</span>
                </button>
              </div>
            )}

            {/* Expandable Ensemble Drawer Overlay */}
            {showEnsembleDrawer && ensembleProducts.length > 0 && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute inset-x-4 bottom-14 z-30 p-4 bg-[#FAF9F5]/95 dark:bg-[#181614]/95 backdrop-blur-md border border-[#8C7853] shadow-2xl animate-fade-in"
              >
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E2DDD3] dark:border-[#2C2824]">
                  <span className="text-xs uppercase tracking-wider font-sans-luxury font-semibold text-[#181715] dark:text-[#FAF8F3]">
                    Featured Ensemble Pieces
                  </span>
                  <button 
                    onClick={() => setShowEnsembleDrawer(false)}
                    className="p-1 text-[#878177] hover:text-[#181715] dark:hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {ensembleProducts.map((p) => (
                    <div 
                      key={p.id}
                      onClick={() => onSelectProduct(p)}
                      className="p-2 border border-[#E0D9CB] dark:border-[#2F2B27] hover:border-[#8C7853] bg-white dark:bg-[#121110] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="w-10 h-10 object-cover object-[center_20%] border border-[#E0D9CB]" 
                        />
                        <div>
                          <p className="text-xs font-serif-luxury text-[#181715] dark:text-[#FAF8F3] line-clamp-1">{p.name}</p>
                          <p className="text-[10px] font-mono text-[#8C7853]">€{p.price.toLocaleString()} EUR</p>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-[#8C7853] font-sans-luxury font-medium flex items-center gap-1">
                        <span>Inspect</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Swipe Controls on Left/Right for Desktop Hover */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm cursor-pointer z-10"
              aria-label="Previous look"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm cursor-pointer z-10"
              aria-label="Next look"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Column: Editorial Essay, Silhouette Specs & Direct Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between py-2">
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs uppercase tracking-[0.24em] font-sans-luxury text-[#8C7853] dark:text-[#C5B492]">
                    Editorial Silhouette {slide.lookNumber}
                  </span>
                  <span className="text-[10px] font-mono text-[#706B63] dark:text-[#A7A096]">
                    [{slide.season}]
                  </span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-serif-luxury text-[#181715] dark:text-[#FAF8F3] leading-tight">
                  {slide.title}
                </h3>
              </div>

              <p className="text-sm sm:text-base text-[#605B54] dark:text-[#A7A096] leading-relaxed font-light">
                {slide.description}
              </p>

              {/* Ensemble Composition & Archival Pieces */}
              <div className="p-5 bg-[#FAF9F5] dark:bg-[#181614] border border-[#E0D9CB] dark:border-[#2C2723]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[11px] uppercase tracking-[0.2em] font-sans-luxury font-semibold text-[#181715] dark:text-[#FAF8F3]">
                    Ensemble Composition
                  </h4>
                  <span className="text-[10px] text-[#8C7853] uppercase tracking-wider font-sans-luxury">
                    Curated Pieces
                  </span>
                </div>
                <ul className="space-y-2 text-xs text-[#57534D] dark:text-[#B5ADA1]">
                  {slide.ensemblePieces.map((piece, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#8C7853] rounded-full shrink-0" />
                      <span>{piece}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Primary Matching Product Spotlight Box */}
              {primaryProduct && (
                <div className="p-4 bg-[#EDE8DE] dark:bg-[#1E1C1A] border border-[#D5CFC5] dark:border-[#35302C] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={primaryProduct.image}
                      alt={primaryProduct.name}
                      className="w-12 h-14 object-cover object-[center_20%] border border-[#CEC7B9] dark:border-[#38332E]"
                    />
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[#8C7853] font-semibold">
                        Primary Silhouette
                      </div>
                      <p className="text-xs font-serif-luxury text-[#181715] dark:text-[#FAF8F3] line-clamp-1">
                        {primaryProduct.name}
                      </p>
                      <p className="text-xs font-mono font-medium text-[#181715] dark:text-[#FAF8F3]">
                        €{primaryProduct.price.toLocaleString()} EUR
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectProduct(primaryProduct)}
                    className="py-2 px-3 bg-[#181715] text-[#FAF9F5] dark:bg-[#FAF8F3] dark:text-[#181715] text-[11px] uppercase tracking-wider font-sans-luxury font-medium transition-transform hover:scale-105 cursor-pointer whitespace-nowrap"
                  >
                    Shop Now
                  </button>
                </div>
              )}
            </div>

            {/* Actions for Lookbook */}
            <div className="mt-8 pt-6 border-t border-[#DFD9CD] dark:border-[#2B2724] space-y-3">
              {primaryProduct && (
                <button
                  onClick={() => onSelectProduct(primaryProduct)}
                  className="w-full py-3.5 px-6 bg-[#181715] text-[#FAF9F5] hover:bg-[#33302B] dark:bg-[#FAF8F3] dark:text-[#181715] dark:hover:bg-white text-xs uppercase tracking-[0.2em] font-sans-luxury transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <ShoppingBag className="w-4 h-4 text-[#8C7853]" />
                  <span>Shop This Look: {primaryProduct.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setIsRunwayCinemaOpen(true)}
                  className="py-3 px-4 border border-[#BDB5A4] dark:border-[#38332E] text-[#181715] dark:text-[#FAF8F3] hover:border-[#181715] dark:hover:border-white text-xs uppercase tracking-[0.16em] font-sans-luxury transition-colors flex items-center justify-center gap-2 cursor-pointer bg-[#FAF9F5]/50 dark:bg-[#181614]/50"
                >
                  <Film className="w-3.5 h-3.5 text-[#8C7853]" />
                  <span>Runway Reel</span>
                </button>

                <button
                  onClick={onOpenSalonBooking}
                  className="py-3 px-4 border border-[#BDB5A4] dark:border-[#38332E] text-[#181715] dark:text-[#FAF8F3] hover:border-[#181715] dark:hover:border-white text-xs uppercase tracking-[0.16em] font-sans-luxury transition-colors flex items-center justify-center gap-2 cursor-pointer bg-[#FAF9F5]/50 dark:bg-[#181614]/50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#8C7853]" />
                  <span>Private Fitting</span>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Thumbnail Selector Strip with Swipe Jump */}
        <div className="mt-12">
          <div className="flex items-center justify-between text-xs uppercase tracking-wider text-[#706B63] dark:text-[#9F998F] font-sans-luxury mb-3">
            <span>Lookbook Silhouettes ({LOOKBOOK_SLIDES.length})</span>
            <span className="font-mono text-[10px]">Select any look to inspect</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {LOOKBOOK_SLIDES.map((item, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setShowEnsembleDrawer(false);
                  }}
                  className={`p-2.5 text-left border transition-all cursor-pointer relative group/thumb overflow-hidden ${
                    isSelected
                      ? 'border-[#8C7853] bg-[#FAF9F5] dark:bg-[#181614] shadow-md ring-1 ring-[#8C7853]'
                      : 'border-[#DFD9CD] dark:border-[#2B2724] hover:bg-[#FAF9F5]/60 dark:hover:bg-[#181614]/60'
                  }`}
                >
                  <div className="aspect-[4/3] w-full mb-2 overflow-hidden bg-black/10">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className={`w-full h-full object-cover object-[center_20%] transition-transform duration-300 group-hover/thumb:scale-105 ${
                        isSelected ? 'filter brightness-105' : 'filter brightness-90'
                      }`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[9px] tracking-widest text-[#8C7853] dark:text-[#C5B492] uppercase font-sans-luxury mb-0.5">
                    <span>Look {item.lookNumber}</span>
                    {isSelected && <span className="w-1.5 h-1.5 bg-[#8C7853] rounded-full" />}
                  </div>
                  <p className="text-[11px] font-serif-luxury text-[#181715] dark:text-[#FAF8F3] truncate">
                    {item.title}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* FULLSCREEN EDITORIAL PHOTOGRAPHY LIGHTBOX */}
      {/* ============================================================== */}
      {isFullscreenModalOpen && (
        <div 
          onClick={() => setIsFullscreenModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col justify-between p-4 sm:p-8 animate-fade-in"
        >
          <div className="flex items-center justify-between text-white border-b border-white/20 pb-4">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-sans-luxury text-[#C5B492]">
                Look {slide.lookNumber} · {slide.season}
              </span>
              <h3 className="text-xl font-serif-luxury">{slide.title}</h3>
            </div>
            
            <div className="flex items-center gap-3">
              {primaryProduct && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFullscreenModalOpen(false);
                    onSelectProduct(primaryProduct);
                  }}
                  className="px-4 py-2 bg-white text-black text-xs uppercase tracking-wider font-sans-luxury font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#8C7853]" />
                  <span>Shop Silhouette (€{primaryProduct.price.toLocaleString()})</span>
                </button>
              )}
              <button
                onClick={() => setIsFullscreenModalOpen(false)}
                className="p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
                aria-label="Close Fullscreen"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center py-4 overflow-hidden">
            <img
              src={slide.image}
              alt={slide.title}
              className="max-h-[82vh] max-w-full object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="flex items-center justify-between text-white/70 text-xs font-sans-luxury pt-2">
            <span>{slide.modelSpecs}</span>
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="p-2 text-white hover:text-[#C5B492]"
              >
                ← Previous Look
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="p-2 text-white hover:text-[#C5B492]"
              >
                Next Look →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CHRISTIAN DIOR & LOUIS VUITTON RUNWAY CINEMA MODAL */}
      {/* ============================================================== */}
      {isRunwayCinemaOpen && (
        <div 
          onClick={() => setIsRunwayCinemaOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-[#141311] border border-[#8C7853] text-[#FAF8F3] overflow-hidden shadow-2xl"
          >
            {/* Cinema Header */}
            <div className="p-4 sm:p-5 border-b border-[#2B2724] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-[#8C7853]" />
                <span className="text-xs uppercase tracking-[0.2em] font-sans-luxury font-semibold text-[#C5B492]">
                  Haute Couture Runway & Atelier Cinema
                </span>
              </div>
              <button
                onClick={() => setIsRunwayCinemaOpen(false)}
                className="p-1.5 text-[#9A9388] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Runway Track Selector */}
            <div className="flex border-b border-[#2B2724] bg-black/40 overflow-x-auto text-[11px]">
              <button
                onClick={() => setActiveCinemaTrack('nano-banana-couture')}
                className={`py-3 px-3.5 whitespace-nowrap uppercase tracking-wider font-sans-luxury text-center transition-all cursor-pointer ${
                  activeCinemaTrack === 'nano-banana-couture'
                    ? 'bg-[#1E1C19] text-[#FAF8F3] border-b-2 border-[#8C7853] font-semibold'
                    : 'text-[#878177] hover:text-white'
                }`}
              >
                🎬 Nano Banana · Surreal AI Runway
              </button>
              <button
                onClick={() => setActiveCinemaTrack('nano-banana-paris')}
                className={`py-3 px-3.5 whitespace-nowrap uppercase tracking-wider font-sans-luxury text-center transition-all cursor-pointer ${
                  activeCinemaTrack === 'nano-banana-paris'
                    ? 'bg-[#1E1C19] text-[#FAF8F3] border-b-2 border-[#8C7853] font-semibold'
                    : 'text-[#878177] hover:text-white'
                }`}
              >
                🎬 Nano Banana · Ateliers Vendôme
              </button>
              <button
                onClick={() => setActiveCinemaTrack('lv')}
                className={`py-3 px-3.5 whitespace-nowrap uppercase tracking-wider font-sans-luxury text-center transition-all cursor-pointer ${
                  activeCinemaTrack === 'lv'
                    ? 'bg-[#1E1C19] text-[#FAF8F3] border-b-2 border-[#8C7853] font-semibold'
                    : 'text-[#878177] hover:text-white'
                }`}
              >
                Louis Vuitton · Alpine Ski
              </button>
              <button
                onClick={() => setActiveCinemaTrack('dior')}
                className={`py-3 px-3.5 whitespace-nowrap uppercase tracking-wider font-sans-luxury text-center transition-all cursor-pointer ${
                  activeCinemaTrack === 'dior'
                    ? 'bg-[#1E1C19] text-[#FAF8F3] border-b-2 border-[#8C7853] font-semibold'
                    : 'text-[#878177] hover:text-white'
                }`}
              >
                Christian Dior · 30 Montaigne
              </button>
              <button
                onClick={() => setActiveCinemaTrack('balenciaga')}
                className={`py-3 px-3.5 whitespace-nowrap uppercase tracking-wider font-sans-luxury text-center transition-all cursor-pointer ${
                  activeCinemaTrack === 'balenciaga'
                    ? 'bg-[#1E1C19] text-[#FAF8F3] border-b-2 border-[#8C7853] font-semibold'
                    : 'text-[#878177] hover:text-white'
                }`}
              >
                Balenciaga · 52nd Couture
              </button>
            </div>

            {/* Video Player Display */}
            <div className="relative aspect-video bg-black overflow-hidden group/player">
              {/* Animated Cinematic Background Image simulating high-fashion motion video */}
              <div className="w-full h-full relative overflow-hidden">
                <img
                  key={activeCinemaTrack}
                  src={
                    activeCinemaTrack === 'nano-banana-couture'
                      ? '/assets/images/couture_salon_gown.jpg'
                      : activeCinemaTrack === 'nano-banana-paris'
                      ? '/assets/images/place_vendome_twilight.jpg'
                      : activeCinemaTrack === 'lv'
                      ? '/assets/images/courchevel_ski_campaign.jpg'
                      : activeCinemaTrack === 'dior'
                      ? '/assets/images/dior_bar_jacket_model.jpg'
                      : '/assets/images/balenciaga_model_pose.jpg'
                  }
                  alt="High Couture Runway Cinema"
                  className={`w-full h-full object-cover filter brightness-[0.85] transition-transform duration-[12000ms] ease-out ${
                    isCinemaPlaying ? 'scale-110 translate-y-[-2%]' : 'scale-100'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/50" />
              </div>

              {/* Video Player UI Controls Overlay */}
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between pointer-events-none">
                {/* Top Telemetry & Controls */}
                <div className="flex items-center justify-between pointer-events-auto">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-[10px] uppercase tracking-widest font-sans-luxury text-white border border-white/20">
                      {activeCinemaTrack.startsWith('nano-banana')
                        ? 'AI Runway Reel · Created by Nano Banana'
                        : 'Official Haute Couture Runway'}
                    </span>
                    <button
                      onClick={() => setIsCinemaSlowMo(!isCinemaSlowMo)}
                      className={`px-2.5 py-1 text-[9px] uppercase tracking-wider font-mono border transition-colors cursor-pointer ${
                        isCinemaSlowMo 
                          ? 'bg-[#8C7853] text-white border-[#8C7853]' 
                          : 'bg-black/60 text-white/80 border-white/20 hover:text-white'
                      }`}
                    >
                      {isCinemaSlowMo ? '0.5x Slow-Motion Couture' : '1.0x Normal Speed'}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsCinemaPlaying(!isCinemaPlaying)}
                      className="p-2 bg-black/60 text-white rounded-full hover:bg-black transition-colors cursor-pointer"
                      title={isCinemaPlaying ? 'Pause Video' : 'Play Video'}
                    >
                      {isCinemaPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setIsCinemaMuted(!isCinemaMuted)}
                      className="p-2 bg-black/60 text-white rounded-full hover:bg-black transition-colors cursor-pointer"
                      title={isCinemaMuted ? 'Unmute Ambient Sound' : 'Mute Sound'}
                    >
                      {isCinemaMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Bottom Story & Call to Action */}
                <div className="space-y-2 max-w-lg pointer-events-auto">
                  {/* Nano Banana Credit Callout */}
                  {activeCinemaTrack === 'nano-banana-couture' && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#8C7853]/90 text-white text-[10px] font-mono uppercase tracking-wider font-bold rounded">
                      <Sparkles className="w-3 h-3 text-[#FAF8F3]" />
                      <span>Video Created by Nano Banana</span>
                    </div>
                  )}
                  {activeCinemaTrack === 'nano-banana-paris' && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#8C7853]/90 text-white text-[10px] font-mono uppercase tracking-wider font-bold rounded">
                      <Sparkles className="w-3 h-3 text-[#FAF8F3]" />
                      <span>Video Created by Nano Banana</span>
                    </div>
                  )}

                  <span className="text-[11px] uppercase tracking-[0.2em] font-sans-luxury text-[#C5B492] block">
                    {activeCinemaTrack === 'nano-banana-couture' && 'Avant-Garde AI Couture · 35mm Parisian Salon Simulation'}
                    {activeCinemaTrack === 'nano-banana-paris' && 'Twilight Metamorphosis · Place Vendôme Midnight Cobblestones'}
                    {activeCinemaTrack === 'lv' && 'Courchevel 1850 · Official Louis Vuitton Ski Capsule'}
                    {activeCinemaTrack === 'dior' && 'Christian Dior Haute Couture · 30 Avenue Montaigne'}
                    {activeCinemaTrack === 'balenciaga' && 'Balenciaga 52nd Couture Defilé · 10 Avenue George V'}
                  </span>

                  <h4 className="text-xl sm:text-2xl font-serif-luxury text-white">
                    {activeCinemaTrack === 'nano-banana-couture' && 'Surreal Architectural Silk Gown in Golden Boiserie'}
                    {activeCinemaTrack === 'nano-banana-paris' && 'Place Vendôme Midnight Velvet Tuxedo Cape & Cobblestones'}
                    {activeCinemaTrack === 'lv' && 'Graphic Signature Ski Jacket (Ref: 1AKX5Z)'}
                    {activeCinemaTrack === 'dior' && 'The 1947 Bar Jacket & Corolle Pleated Silhouette'}
                    {activeCinemaTrack === 'balenciaga' && 'Sculpted Cocoon Opera Volume & Liquid Spandex Gown'}
                  </h4>

                  <p className="text-xs text-neutral-300 font-light leading-relaxed line-clamp-2">
                    {activeCinemaTrack === 'nano-banana-couture' && 'Creative video direction by Nano Banana exploring physics of hand-embroidered floral couture silk moving under 19th-century chandeliers.'}
                    {activeCinemaTrack === 'nano-banana-paris' && 'A cinematic night portrait created by Nano Banana, capturing rain-slicked Place Vendôme stones reflecting streetlamps.'}
                    {activeCinemaTrack === 'lv' && 'High-altitude luxury skiwear with sealed waterproof seams and monogram scuba zippers on Courchevel slopes. Official portal: https://louisvuitton.com/'}
                    {activeCinemaTrack === 'dior' && 'Monsieur Dior’s architectural wasp-waisted peplum jacket hand-padded over horsehair canvas.'}
                    {activeCinemaTrack === 'balenciaga' && 'Cristóbal Balenciaga’s monumental cocoon sculpture re-engineered with razor-sharp knife boots.'}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        setIsRunwayCinemaOpen(false);
                        const p = PRODUCTS.find((prod) => {
                          if (activeCinemaTrack === 'nano-banana-couture') return prod.id === 'coat-hourglass-cashmere';
                          if (activeCinemaTrack === 'nano-banana-paris') return prod.id === 'aurelia-place-vendome-velvet-cape';
                          if (activeCinemaTrack === 'lv') return prod.id === 'lv-graphic-ski-jacket-1akx5z';
                          if (activeCinemaTrack === 'dior') return prod.id === 'dior-bar-jacket-heritage';
                          return prod.id === 'balenciaga-cocoon-opera-coat';
                        });
                        if (p) onSelectProduct(p);
                      }}
                      className="px-4 py-2 bg-[#8C7853] hover:bg-[#A38D64] text-white text-xs uppercase tracking-wider font-sans-luxury font-medium transition-colors inline-flex items-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Inspect & Acquire Featured Silhouette</span>
                    </button>

                    {activeCinemaTrack === 'lv' && (
                      <a
                        href="https://louisvuitton.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-white/20 hover:bg-white/35 text-white text-xs uppercase tracking-wider font-sans-luxury inline-flex items-center gap-1.5 transition-colors"
                      >
                        <span>Visit louisvuitton.com</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Cinema Footer with Direct Archive Links to All Luxury Houses */}
            <div className="p-4 bg-[#181614] border-t border-[#2B2724] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#878177]">
              <span>Videos created by Nano Banana and archival defilés for Louis Vuitton, Christian Dior, Balenciaga & Victoria's Secret.</span>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://louisvuitton.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C5B492] hover:underline flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>Louis Vuitton (louisvuitton.com)</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <span className="opacity-30">·</span>
                <a
                  href="https://www.dior.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C5B492] hover:underline flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>Dior</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <span className="opacity-30">·</span>
                <a
                  href="https://www.balenciaga.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C5B492] hover:underline flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>Balenciaga</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <span className="opacity-30">·</span>
                <a
                  href="https://www.victoriassecret.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C5B492] hover:underline flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>Victoria's Secret</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <span className="opacity-30">·</span>
                <a
                  href="https://maisonaurelia.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C5B492] hover:underline flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>Maison Aurelia.co</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
