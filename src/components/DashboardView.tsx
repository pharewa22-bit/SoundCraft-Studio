import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  Heart, 
  Radio, 
  Mic, 
  MicOff, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Music, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Play,
  RotateCcw,
  Zap,
  Sliders,
  ShieldCheck,
  Disc3,
  MessageSquareText
} from 'lucide-react';
import { studioAudio } from '../utils/audioEngine';
import { TabType } from './Sidebar';

interface DashboardViewProps {
  onSelectTab: (tab: TabType) => void;
  learningProgress: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  onAirState: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectTab,
  learningProgress,
  completedLessonsCount,
  totalLessonsCount,
  onAirState,
}) => {
  // Simulated Listener Statistics with organic real-time drift
  const [liveListeners, setLiveListeners] = useState<number>(14820);
  const [peakListeners] = useState<number>(28450);
  const [avgListenMinutes] = useState<number>(24.6);
  const [sentimentRate] = useState<number>(94.8);

  // VU Meter Audio State
  const [audioLevels, setAudioLevels] = useState<{ left: number; right: number; peak: boolean }>({
    left: -24,
    right: -24,
    peak: false,
  });
  const [peakHoldL, setPeakHoldL] = useState<number>(-24);
  const [peakHoldR, setPeakHoldR] = useState<number>(-24);
  const [meterMode, setMeterMode] = useState<'led' | 'needle'>('led');
  const [limiterActive, setLimiterActive] = useState<boolean>(true);
  const [gainLevel, setGainLevel] = useState<number>(75);
  const [activeSfx, setActiveSfx] = useState<string | null>(null);

  // Simulated live listener SMS/Chat ticker
  const [chatTicker, setChatTicker] = useState<string[]>([
    'คุณธนภัทร (สาทร): "เสียงดีเจช่วงบ่ายจัดเต็มมาก ชอบเพลงนี้ครับ!"',
    'คุณนภัสสร (เชียงใหม่): "ฟังผ่านแอปชัดเจน ไม่มีสะดุดเลย"',
    'คุณกิตติศักดิ์ (ออฟฟิศบางนา): "รอฟังสรุปข่าวต้นชั่วโมงครับ"',
    'คุณชลธิชา: "สปอตกาแฟเมื่อกี้ ดนตรีกระชับฟังเพลินดี"',
    'คุณปพน (บนทางด่วน): "เพลงบ่ายนี้ช่วยคลายเครียดรถติดได้เยอะเลย"',
  ]);
  const [currentChatIndex, setCurrentChatIndex] = useState<number>(0);

  // Fluctuate listener numbers naturally
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveListeners((prev) => {
        const delta = Math.floor((Math.random() - 0.48) * 14);
        return Math.max(12000, prev + delta);
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Rotate listener feedback messages
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentChatIndex((prev) => (prev + 1) % chatTicker.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [chatTicker.length]);

  // Subscribe to real-time audio engine levels
  useEffect(() => {
    const unsubscribe = studioAudio.subscribeLevels((levels) => {
      setAudioLevels(levels);
      setPeakHoldL((prev) => Math.max(prev * 0.95, levels.left));
      setPeakHoldR((prev) => Math.max(prev * 0.95, levels.right));
    });
    return () => unsubscribe();
  }, []);

  // Trigger studio sound effects
  const triggerSound = (type: string) => {
    setActiveSfx(type);
    if (type === 'jingle') studioAudio.playJingle();
    else if (type === 'news') studioAudio.playNewsStinger();
    else if (type === 'whoosh') studioAudio.playStationWhoosh();
    else if (type === 'censor') studioAudio.playCensorBeep();
    else if (type === 'applause') studioAudio.playApplause();
    else if (type === 'countdown') {
      studioAudio.playCountdownTone(false);
      setTimeout(() => studioAudio.playCountdownTone(false), 300);
      setTimeout(() => studioAudio.playCountdownTone(true), 600);
    }
    setTimeout(() => setActiveSfx(null), 800);
  };

  // Convert dB (-40dB to +6dB) to percentage (0 - 100%)
  const dbToPercent = (db: number) => {
    const clamped = Math.max(-40, Math.min(6, db));
    return ((clamped + 40) / 46) * 100;
  };

  // Calculate needle rotation angle (-45deg to +45deg)
  const dbToAngle = (db: number) => {
    const pct = dbToPercent(db) / 100;
    return -45 + pct * 90;
  };

  // LED Segment count (24 segments)
  const segments = Array.from({ length: 24 }, (_, i) => {
    const stepDb = -40 + (i / 23) * 46;
    let color = 'bg-emerald-500';
    if (stepDb >= -6 && stepDb < 0) color = 'bg-amber-400';
    else if (stepDb >= 0) color = 'bg-red-500';
    return { index: i, db: stepDb, color };
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner with Quick Live Status */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#171b26] via-[#1a1f2c] to-[#141722] border border-orange-500/20 p-5 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                ON-AIR BROADCAST CONSOLE
              </span>
              <span className="text-xs text-zinc-400 flex items-center gap-1 font-mono">
                <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                Live Feed: 102.5 FM Digital HD
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Chakra_Petch',sans-serif] text-white">
              ยินดีต้อนรับสู่ <span className="text-orange-500 text-glow-orange">SoundCraft Studio</span>
            </h2>
            <p className="text-zinc-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              แพลตฟอร์มสตูดิโอมัลติมีเดียเพื่อการฝึกปฏิบัติการจัดรายการวิทยุกระจายเสียงและพอดแคสต์ระดับมืออาชีพ 
              เรียนรู้ทักษะเสียง ควบคุมระดับเดซิเบล วางผังรายการสด และประเมินบทวิทยุกระจายเสียงแบบเรียลไทม์
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => onSelectTab('script_lab')}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              เริ่มเขียนบทวิทยุ
            </button>
            <button
              onClick={() => onSelectTab('knowledge')}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs sm:text-sm border border-zinc-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Disc3 className="w-4 h-4 text-orange-400" />
              ดูคอร์สเรียน
            </button>
          </div>
        </div>

        {/* Live Chat / Feedback Ticker Bar */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center gap-2 text-xs text-zinc-400">
          <span className="flex items-center gap-1 text-orange-400 font-semibold shrink-0">
            <MessageSquareText className="w-3.5 h-3.5" />
            SMS & Live Chat ผู้ฟัง:
          </span>
          <span className="truncate text-zinc-200 italic font-mono transition-all duration-300">
            {chatTicker[currentChatIndex]}
          </span>
        </div>
      </div>

      {/* 1. การ์ดสถิติผู้ฟังจำลอง (Simulated Listener Analytics) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
            <h3 className="text-sm font-semibold tracking-wide text-zinc-300 uppercase font-mono">
              การ์ดสถิติผู้ฟังจำลอง (Audience Analytics)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
            อัปเดตทุก 3 วินาที • Live Telemetry
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Active Listeners */}
          <div className="bg-[#12151d] p-4 rounded-xl border border-zinc-800 hover:border-orange-500/40 transition-all shadow-lg group">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-medium">ผู้ฟังสดขณะนี้ (Live Listeners)</span>
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white tracking-tight">
                {liveListeners.toLocaleString()}
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-0.5 font-semibold">
                <TrendingUp className="w-3 h-3" />
                +4.2%
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">กระจายผ่าน Web, iOS, Android และเสาสัญญาณ FM</p>
          </div>

          {/* Card 2: Peak Listeners */}
          <div className="bg-[#12151d] p-4 rounded-xl border border-zinc-800 hover:border-amber-500/40 transition-all shadow-lg group">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-medium">ยอดผู้ฟังสูงสุดวันนี้ (Daily Peak)</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-amber-400 tracking-tight">
                {peakListeners.toLocaleString()}
              </span>
              <span className="text-[11px] font-mono text-zinc-400">ช่วง 08:15 น.</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">ช่วงรายการ Morning Drive เวลาเร่งด่วน</p>
          </div>

          {/* Card 3: Avg Duration */}
          <div className="bg-[#12151d] p-4 rounded-xl border border-zinc-800 hover:border-orange-500/40 transition-all shadow-lg group">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-medium">ระยะเวลาฟังเฉลี่ย (Avg Session)</span>
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white tracking-tight">
                {avgListenMinutes}
              </span>
              <span className="text-xs text-zinc-400 font-mono">นาที/คน</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">สูงกว่าเกณฑ์สถานีเพลงทั่วไป 18%</p>
          </div>

          {/* Card 4: Sentiment & Engagement */}
          <div className="bg-[#12151d] p-4 rounded-xl border border-zinc-800 hover:border-emerald-500/40 transition-all shadow-lg group">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-medium">ความพึงพอใจและฟีดแบ็ก (Sentiment)</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-emerald-400 tracking-tight">
                {sentimentRate}%
              </span>
              <span className="text-xs text-zinc-400 font-mono">เชิงบวก</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">ประเมินจากรีแอ็กชันและข้อความหน้าไมค์ 1,240 รายการ</p>
          </div>
        </div>

        {/* Platform Distribution Bar */}
        <div className="bg-[#10131b] p-4 rounded-xl border border-zinc-800">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span className="font-medium text-zinc-300">สัดส่วนช่องทางการรับฟัง (Broadcast Channels Distribution)</span>
            <span className="font-mono text-orange-400">Total: 100% Verified</span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-zinc-800">
            <div style={{ width: '48%' }} className="bg-orange-500 transition-all" title="Mobile App (iOS/Android): 48%" />
            <div style={{ width: '24%' }} className="bg-amber-400 transition-all" title="Web Player Stream: 24%" />
            <div style={{ width: '18%' }} className="bg-red-500 transition-all" title="FM 102.5 MHz Relay: 18%" />
            <div style={{ width: '10%' }} className="bg-cyan-500 transition-all" title="Smart Speakers / Pod: 10%" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-[11px] font-mono text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
              <span>Mobile App: 48%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
              <span>Web Player: 24%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-500" />
              <span>FM 102.5 Relay: 18%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500" />
              <span>Smart Speaker: 10%</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. แถบวัดระดับเสียง (VU Meter Graphic & Audio Console) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <h3 className="text-sm font-semibold tracking-wide text-zinc-300 uppercase font-mono">
              แถบวัดระดับเสียง (VU Meter Graphic & Audio Rack)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMeterMode(meterMode === 'led' ? 'needle' : 'led')}
              className="text-[11px] font-mono bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2.5 py-1 rounded border border-zinc-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Sliders className="w-3 h-3 text-orange-400" />
              โหมด: {meterMode === 'led' ? 'LED Bar Ladder' : 'Analog VU Needle'}
            </button>
          </div>
        </div>

        {/* Hardware-Styled Studio Rack Enclosure */}
        <div className="relative rounded-2xl bg-[#0c0e14] border-2 border-zinc-800 p-5 shadow-2xl studio-grid">
          {/* Rack mount screw graphics */}
          <div className="absolute top-2 left-2 w-2 h-2 rounded-full border border-zinc-600 bg-zinc-800" />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full border border-zinc-600 bg-zinc-800" />
          <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full border border-zinc-600 bg-zinc-800" />
          <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full border border-zinc-600 bg-zinc-800" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left 8 Cols: Dual Channel VU Meters (Stereo L & R) */}
            <div className="lg:col-span-8 bg-[#141720] border border-zinc-800/90 rounded-xl p-4 shadow-inner">
              <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-['Chakra_Petch',sans-serif] text-xs font-bold tracking-widest text-orange-400 uppercase">
                    DUAL CHANNEL BROADCAST VU MONITOR
                  </span>
                  <span className="text-[10px] bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded font-mono">
                    CALIBRATED 0 VU = +4 dBu
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${audioLevels.peak ? 'bg-red-600 text-white animate-pulse' : 'bg-zinc-800 text-zinc-500'}`}>
                    PEAK CLIP
                  </span>
                  <button
                    onClick={() => {
                      setPeakHoldL(-40);
                      setPeakHoldR(-40);
                    }}
                    className="text-[10px] text-zinc-400 hover:text-white font-mono flex items-center gap-1 cursor-pointer"
                    title="Reset Peak Hold indicator"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset Peak
                  </button>
                </div>
              </div>

              {meterMode === 'led' ? (
                /* LED Bar Ladder Display */
                <div className="space-y-3">
                  {/* Channel L */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1">
                      <span className="font-bold text-orange-400">CH-L (LEFT)</span>
                      <span>{audioLevels.left.toFixed(1)} dBFS</span>
                    </div>
                    <div className="h-5 bg-[#090b10] rounded p-1 flex items-center gap-[3px] border border-zinc-800">
                      {segments.map((seg) => {
                        const isLit = audioLevels.left >= seg.db;
                        const isPeakHold = Math.abs(peakHoldL - seg.db) < 2.5;
                        return (
                          <div
                            key={`L-${seg.index}`}
                            className={`flex-1 h-full rounded-[1px] transition-all duration-75 ${
                              isLit
                                ? `${seg.color} shadow-sm shadow-current`
                                : isPeakHold
                                ? 'bg-amber-300 opacity-90'
                                : 'bg-zinc-800/40 opacity-20'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Channel R */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1">
                      <span className="font-bold text-orange-400">CH-R (RIGHT)</span>
                      <span>{audioLevels.right.toFixed(1)} dBFS</span>
                    </div>
                    <div className="h-5 bg-[#090b10] rounded p-1 flex items-center gap-[3px] border border-zinc-800">
                      {segments.map((seg) => {
                        const isLit = audioLevels.right >= seg.db;
                        const isPeakHold = Math.abs(peakHoldR - seg.db) < 2.5;
                        return (
                          <div
                            key={`R-${seg.index}`}
                            className={`flex-1 h-full rounded-[1px] transition-all duration-75 ${
                              isLit
                                ? `${seg.color} shadow-sm shadow-current`
                                : isPeakHold
                                ? 'bg-amber-300 opacity-90'
                                : 'bg-zinc-800/40 opacity-20'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Decibel Scale Markers */}
                  <div className="flex justify-between text-[9px] font-mono text-zinc-500 pt-1 px-1">
                    <span>-40</span>
                    <span>-30</span>
                    <span>-20</span>
                    <span>-14</span>
                    <span className="text-amber-400 font-bold">-7</span>
                    <span className="text-amber-400 font-bold">-2</span>
                    <span className="text-red-500 font-bold">0 dB</span>
                    <span className="text-red-500 font-bold">+3</span>
                    <span className="text-red-500 font-bold">+6</span>
                  </div>
                </div>
              ) : (
                /* Dual Analog Meter Needle Display */
                <div className="grid grid-cols-2 gap-4">
                  {/* Left Needle Gauge */}
                  <div className="bg-[#0b0d12] border border-zinc-800 rounded-lg p-3 text-center">
                    <div className="text-[10px] font-mono text-zinc-400 mb-2">VU CHANNEL LEFT</div>
                    <div className="relative w-full h-24 bg-gradient-to-b from-[#181a20] to-[#0e1014] rounded overflow-hidden border border-zinc-700/60 flex items-end justify-center">
                      {/* Scale arc marks */}
                      <div className="absolute top-2 w-full flex justify-between px-3 text-[8px] font-mono text-zinc-400">
                        <span>-20</span>
                        <span>-10</span>
                        <span>-3</span>
                        <span className="text-red-400">0</span>
                        <span className="text-red-500">+3</span>
                      </div>
                      {/* Needle */}
                      <div
                        className="w-0.5 h-20 bg-orange-500 origin-bottom transition-transform duration-75 shadow-lg shadow-orange-500/50"
                        style={{ transform: `rotate(${dbToAngle(audioLevels.left)}deg)` }}
                      />
                      {/* Pivot screw */}
                      <div className="absolute -bottom-2 w-5 h-5 rounded-full bg-zinc-600 border border-zinc-400" />
                    </div>
                    <span className="text-xs font-mono font-bold text-orange-400 mt-2 block">
                      {audioLevels.left.toFixed(1)} dB
                    </span>
                  </div>

                  {/* Right Needle Gauge */}
                  <div className="bg-[#0b0d12] border border-zinc-800 rounded-lg p-3 text-center">
                    <div className="text-[10px] font-mono text-zinc-400 mb-2">VU CHANNEL RIGHT</div>
                    <div className="relative w-full h-24 bg-gradient-to-b from-[#181a20] to-[#0e1014] rounded overflow-hidden border border-zinc-700/60 flex items-end justify-center">
                      <div className="absolute top-2 w-full flex justify-between px-3 text-[8px] font-mono text-zinc-400">
                        <span>-20</span>
                        <span>-10</span>
                        <span>-3</span>
                        <span className="text-red-400">0</span>
                        <span className="text-red-500">+3</span>
                      </div>
                      <div
                        className="w-0.5 h-20 bg-orange-500 origin-bottom transition-transform duration-75 shadow-lg shadow-orange-500/50"
                        style={{ transform: `rotate(${dbToAngle(audioLevels.right)}deg)` }}
                      />
                      <div className="absolute -bottom-2 w-5 h-5 rounded-full bg-zinc-600 border border-zinc-400" />
                    </div>
                    <span className="text-xs font-mono font-bold text-orange-400 mt-2 block">
                      {audioLevels.right.toFixed(1)} dB
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right 4 Cols: Studio Audio Controls & Limiter */}
            <div className="lg:col-span-4 space-y-3 bg-[#13161f] border border-zinc-800 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-300 uppercase">
                  Rack Preamp & DSP
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  EBU R128 Active
                </span>
              </div>

              {/* Limiter Switch */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#0e1017] border border-zinc-800">
                <div>
                  <p className="text-xs font-semibold text-zinc-200">Peak Limiter (-1.0 dBFS)</p>
                  <p className="text-[10px] text-zinc-500">ป้องกันเสียงแตกเมื่อผู้จัดตะโกน</p>
                </div>
                <button
                  onClick={() => setLimiterActive(!limiterActive)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all cursor-pointer ${
                    limiterActive ? 'bg-orange-500 text-zinc-950 shadow-md shadow-orange-500/30' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {limiterActive ? 'ENGAGED' : 'BYPASS'}
                </button>
              </div>

              {/* Mic Gain Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Mic Gain Trim:</span>
                  <span className="font-mono text-orange-400 font-semibold">{gainLevel}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={gainLevel}
                  onChange={(e) => setGainLevel(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              {/* 1kHz Tone Test Signal */}
              <button
                onClick={() => {
                  studioAudio.playCensorBeep(1.0);
                }}
                className="w-full py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg font-mono flex items-center justify-center gap-1.5 border border-zinc-700 transition-colors cursor-pointer"
                title="ยิงสัญญาณ 1 kHz Calibration Tone เพื่อเทียบระดับเดซิเบล"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                ยิงสัญญาณทดสอบ 1 kHz Tone (-18 dBFS)
              </button>
            </div>
          </div>

          {/* Quick Sound Cart Pad (6 synthesized studio SFX) */}
          <div className="mt-4 pt-4 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-semibold text-zinc-400 uppercase flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-orange-400" />
                Sound Cart & Stinger Pad (กดเพื่อเปิดเสียงประกอบสตูดิโอสด)
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">Web Audio Instant Synth</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              <button
                onClick={() => triggerSound('jingle')}
                className={`p-2.5 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeSfx === 'jingle'
                    ? 'bg-orange-500 text-zinc-950 border-orange-400 scale-95 shadow-lg shadow-orange-500/40'
                    : 'bg-[#151822] hover:bg-[#1c202d] text-zinc-200 border-zinc-800 hover:border-orange-500/30'
                }`}
              >
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span>On-Air Jingle</span>
                <span className="text-[9px] text-zinc-400 font-mono">F5 Chord</span>
              </button>

              <button
                onClick={() => triggerSound('news')}
                className={`p-2.5 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeSfx === 'news'
                    ? 'bg-red-600 text-white border-red-400 scale-95 shadow-lg shadow-red-500/40'
                    : 'bg-[#151822] hover:bg-[#1c202d] text-zinc-200 border-zinc-800 hover:border-red-500/30'
                }`}
              >
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>Breaking Fanfare</span>
                <span className="text-[9px] text-zinc-400 font-mono">ข่าวด่วน</span>
              </button>

              <button
                onClick={() => triggerSound('whoosh')}
                className={`p-2.5 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeSfx === 'whoosh'
                    ? 'bg-cyan-600 text-white border-cyan-400 scale-95 shadow-lg shadow-cyan-500/40'
                    : 'bg-[#151822] hover:bg-[#1c202d] text-zinc-200 border-zinc-800 hover:border-cyan-500/30'
                }`}
              >
                <Radio className="w-4 h-4 text-cyan-400" />
                <span>Station Whoosh</span>
                <span className="text-[9px] text-zinc-400 font-mono">Sub Drop</span>
              </button>

              <button
                onClick={() => triggerSound('censor')}
                className={`p-2.5 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeSfx === 'censor'
                    ? 'bg-amber-500 text-zinc-950 border-amber-400 scale-95 shadow-lg shadow-amber-500/40'
                    : 'bg-[#151822] hover:bg-[#1c202d] text-zinc-200 border-zinc-800 hover:border-amber-500/30'
                }`}
              >
                <VolumeX className="w-4 h-4 text-amber-400" />
                <span>Censor Beep</span>
                <span className="text-[9px] text-zinc-400 font-mono">1000 Hz</span>
              </button>

              <button
                onClick={() => triggerSound('applause')}
                className={`p-2.5 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeSfx === 'applause'
                    ? 'bg-emerald-600 text-white border-emerald-400 scale-95 shadow-lg shadow-emerald-500/40'
                    : 'bg-[#151822] hover:bg-[#1c202d] text-zinc-200 border-zinc-800 hover:border-emerald-500/30'
                }`}
              >
                <Heart className="w-4 h-4 text-emerald-400" />
                <span>Applause</span>
                <span className="text-[9px] text-zinc-400 font-mono">เสียงปรบมือ</span>
              </button>

              <button
                onClick={() => triggerSound('countdown')}
                className={`p-2.5 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeSfx === 'countdown'
                    ? 'bg-purple-600 text-white border-purple-400 scale-95 shadow-lg shadow-purple-500/40'
                    : 'bg-[#151822] hover:bg-[#1c202d] text-zinc-200 border-zinc-800 hover:border-purple-500/30'
                }`}
              >
                <Clock className="w-4 h-4 text-purple-400" />
                <span>Countdown 3-2-1</span>
                <span className="text-[9px] text-zinc-400 font-mono">คิวเข้าไมค์</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. แถบก้าวหน้าการเรียนรู้ (Progress Bar & Learning Paths) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h3 className="text-sm font-semibold tracking-wide text-zinc-300 uppercase font-mono">
              แถบก้าวหน้าการเรียนรู้ (Learning Progress & Milestones)
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            ผ่านแล้ว {completedLessonsCount} จาก {totalLessonsCount} บทเรียน
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Progress Bar & Level Card */}
          <div className="lg:col-span-7 bg-[#12151d] p-5 rounded-2xl border border-zinc-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-400">สถานะหลักสูตรวิทยุดิจิทัล</span>
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Broadcaster Pro Certificate</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 font-mono">
                    Level 3
                  </span>
                </h4>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold font-mono text-orange-400">{learningProgress}%</span>
                <p className="text-[10px] text-zinc-500 font-mono">Overall Completion</p>
              </div>
            </div>

            {/* Big Glowing Progress Bar */}
            <div className="relative w-full bg-zinc-900 h-4 rounded-full overflow-hidden border border-zinc-800 p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-400 transition-all duration-700 box-glow-orange"
                style={{ width: `${learningProgress}%` }}
              />
            </div>

            {/* 4 Learning Tracks Progress Breakdown */}
            <div className="space-y-2.5 pt-2 border-t border-zinc-800/80">
              {/* Track 1 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-300">1. ความรู้พื้นฐานการใช้ไมค์และเสียงบรอดคาสต์</span>
                  <span className="font-mono text-orange-400 font-semibold">
                    {completedLessonsCount >= 1 ? '100%' : '50%'}
                  </span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-orange-500 h-full rounded-full transition-all"
                    style={{ width: completedLessonsCount >= 1 ? '100%' : '50%' }}
                  />
                </div>
              </div>

              {/* Track 2 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-300">2. ทักษะการเขียนบทสปอต 30s/60s และสูตร AIDA</span>
                  <span className="font-mono text-amber-400 font-semibold">
                    {completedLessonsCount >= 3 ? '100%' : '65%'}
                  </span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all"
                    style={{ width: completedLessonsCount >= 3 ? '100%' : '65%' }}
                  />
                </div>
              </div>

              {/* Track 3 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-300">3. การจัดผังรายการ Clock Format & Rundown</span>
                  <span className="font-mono text-cyan-400 font-semibold">
                    {completedLessonsCount >= 4 ? '100%' : '75%'}
                  </span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full rounded-full transition-all"
                    style={{ width: completedLessonsCount >= 4 ? '100%' : '75%' }}
                  />
                </div>
              </div>

              {/* Track 4 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-300">4. เกณฑ์วัดความดัง LUFS และจรรยาบรรณสื่อ กสทช.</span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    {completedLessonsCount >= 6 ? '100%' : '55%'}
                  </span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all"
                    style={{ width: completedLessonsCount >= 6 ? '100%' : '55%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Practice Challenges & Quests */}
          <div className="lg:col-span-5 bg-[#12151d] p-5 rounded-2xl border border-zinc-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  ภารกิจฝึกปฏิบัติห้องสตูดิโอ (Studio Quests)
                </h4>
                <span className="text-[10px] text-zinc-500 font-mono">3 Daily Tasks</span>
              </div>

              <div className="space-y-2.5">
                <div className="p-2.5 rounded-xl bg-[#171b24] border border-zinc-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-medium text-zinc-200">ทดสอบเสียงไมโครโฟนและตรวจระดับเดซิเบล</p>
                    <p className="text-[11px] text-zinc-500">ควบคุมระดับเสียงไม่ให้เกิน 0 dBFS</p>
                  </div>
                </div>

                <div 
                  onClick={() => onSelectTab('script_lab')}
                  className="p-2.5 rounded-xl bg-[#171b24] border border-orange-500/30 hover:border-orange-500 flex items-start gap-2.5 cursor-pointer transition-colors group"
                >
                  <div className="w-4 h-4 rounded-full border border-orange-400 shrink-0 mt-0.5 group-hover:bg-orange-500/20" />
                  <div className="text-xs">
                    <p className="font-medium text-orange-300 group-hover:text-orange-200">
                      เขียนสปอตโฆษณา 30 วินาที 1 ชิ้นงาน
                    </p>
                    <p className="text-[11px] text-zinc-400">ใช้สูตร AIDA พร้อมแท็ก [SFX] และ [BED]</p>
                  </div>
                </div>

                <div 
                  onClick={() => onSelectTab('live_simulator')}
                  className="p-2.5 rounded-xl bg-[#171b24] border border-zinc-800 hover:border-amber-500/50 flex items-start gap-2.5 cursor-pointer transition-colors group"
                >
                  <div className="w-4 h-4 rounded-full border border-zinc-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-medium text-zinc-300 group-hover:text-amber-300">
                      ทดลองจัดรายการสดในห้องแล็บมิกซ์เสียง (Live Simulator)
                    </p>
                    <p className="text-[11px] text-zinc-500">ทดสอบระบบ Auto-Ducking 4 แชนเนลและอัดเสียงซ้อม</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-400">ต้องการศึกษาเพิ่มเติม?</span>
              <button
                onClick={() => onSelectTab('knowledge')}
                className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer"
              >
                เข้าสู่คลังความรู้ <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
