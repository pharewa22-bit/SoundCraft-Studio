import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Clock, 
  Sun, 
  Moon, 
  PanelLeftClose, 
  PanelLeft,
  Edit3,
  Check,
  X,
  Sparkles,
  Music
} from 'lucide-react';
import { studioAudio } from '../utils/audioEngine';

interface LiveOnAirHeaderProps {
  onAirState: 'on_air' | 'standby' | 'rehearsal' | 'off';
  setOnAirState: (st: 'on_air' | 'standby' | 'rehearsal' | 'off') => void;
  currentShowTitle: string;
  setCurrentShowTitle: (title: string) => void;
  activeDj: string;
  setActiveDj: (dj: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  onOpenReferences: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const LiveOnAirHeader: React.FC<LiveOnAirHeaderProps> = ({
  onAirState,
  setOnAirState,
  currentShowTitle,
  setCurrentShowTitle,
  activeDj,
  setActiveDj,
  isDarkMode,
  setIsDarkMode,
  onOpenReferences,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [micActive, setMicActive] = useState<boolean>(false);
  const [micMode, setMicMode] = useState<'none' | 'hardware' | 'virtual'>('none');
  const [masterVol, setMasterVol] = useState<number>(85);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Station and Show Rename State
  const [isRenameModalOpen, setIsRenameModalOpen] = useState<boolean>(false);
  const [tempShowTitle, setTempShowTitle] = useState<string>(currentShowTitle);
  const [tempActiveDj, setTempActiveDj] = useState<string>(activeDj);
  const [stationFreq, setStationFreq] = useState<string>('102.5 FM');

  // Digital studio clock (BKK time UTC+7)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      setTimeStr(`${hours}:${mins}:${secs}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync temp state when props change
  useEffect(() => {
    setTempShowTitle(currentShowTitle);
  }, [currentShowTitle]);

  useEffect(() => {
    setTempActiveDj(activeDj);
  }, [activeDj]);

  // Guaranteed Working Microphone Switch (Hardware + Virtual Studio Fallback)
  const toggleMic = async () => {
    if (micActive) {
      studioAudio.disableMicrophone();
      setMicActive(false);
      setMicMode('none');
    } else {
      const res = await studioAudio.enableMicrophone();
      setMicActive(res.success);
      setMicMode(res.mode);
      if (res.success && onAirState === 'off') {
        setOnAirState('on_air');
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setMasterVol(val);
    studioAudio.setMasterVolume(isMuted ? 0 : val / 100);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    studioAudio.setMasterVolume(nextMuted ? 0 : masterVol / 100);
  };

  const handleSaveRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempShowTitle.trim()) {
      setCurrentShowTitle(tempShowTitle.trim());
    }
    if (tempActiveDj.trim()) {
      setActiveDj(tempActiveDj.trim());
    }
    setIsRenameModalOpen(false);
    studioAudio.playJingle();
  };

  const applyPreset = (title: string, host: string, freq?: string) => {
    setTempShowTitle(title);
    setTempActiveDj(host);
    if (freq) setStationFreq(freq);
  };

  return (
    <header className={`border-b px-3 sm:px-4 py-2.5 sticky top-0 z-40 shadow-xl transition-colors duration-200 ${
      isDarkMode ? 'bg-[#10131a] border-zinc-800/80 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-800'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Sidebar Toggle, Station Identity & Rename Trigger */}
        <div className="flex items-center gap-2">
          {/* Toggle Sidebar Button */}
          <button
            onClick={onToggleSidebar}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-[#171b24] hover:bg-zinc-800 text-orange-400 border-zinc-700'
                : 'bg-zinc-100 hover:bg-zinc-200 text-orange-600 border-zinc-300'
            }`}
            title={isSidebarOpen ? 'ย่อ/ปิดแถบเมนูด้านข้าง' : 'ขยาย/เปิดแถบเมนูด้านข้าง'}
          >
            {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </button>

          {/* Station Badge & Show Info with Rename Trigger */}
          <div className={`flex items-center gap-2 border px-2.5 sm:px-3 py-1.5 rounded-lg ${
            isDarkMode ? 'bg-[#171b24] border-orange-500/20' : 'bg-zinc-100 border-orange-500/30'
          }`}>
            <div className="relative flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-orange-500 to-amber-600 text-black font-bold shadow-md shadow-orange-500/20 shrink-0">
              <Radio className="w-4 h-4 text-black" />
              {onAirState === 'on_air' && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              )}
            </div>
            
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-bold text-orange-500 tracking-wider">
                  {stationFreq}
                </span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                  isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200 text-zinc-700'
                }`}>DIGITAL HD</span>

                {/* Edit Name Button */}
                <button
                  onClick={() => setIsRenameModalOpen(true)}
                  className={`text-[10px] flex items-center gap-0.5 px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                    isDarkMode
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-orange-400'
                      : 'bg-zinc-200 hover:bg-zinc-300 text-orange-600 font-semibold'
                  }`}
                  title="คลิกเพื่อเปลี่ยนชื่อรายการ หรือชื่อผู้จัดรายการ"
                >
                  <Edit3 className="w-2.5 h-2.5" />
                  <span>เปลี่ยนชื่อ</span>
                </button>
              </div>

              <div 
                onClick={() => setIsRenameModalOpen(true)}
                className="cursor-pointer group flex items-center gap-1"
                title="คลิกเพื่อแก้ไขชื่อรายการและชื่อผู้จัด"
              >
                <p className="text-xs text-zinc-400 group-hover:text-orange-400 transition-colors font-medium truncate max-w-[140px] sm:max-w-xs">
                  {currentShowTitle} • <span className={isDarkMode ? 'text-zinc-200' : 'text-zinc-700 font-semibold'}>{activeDj}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Center: The Iconic 3D Glowing ON-AIR Sign */}
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <div 
            onClick={() => {
              const next = onAirState === 'on_air' ? 'standby' : onAirState === 'standby' ? 'rehearsal' : onAirState === 'rehearsal' ? 'off' : 'on_air';
              setOnAirState(next);
            }}
            title="คลิกเพื่อเปลี่ยนโหมดไฟสตูดิโอ (On-Air / Standby / Rehearsal / Off)"
            className={`cursor-pointer transition-all duration-300 relative select-none rounded-md px-4 sm:px-5 py-1.5 sm:py-2 border flex items-center gap-2.5 shadow-2xl ${
              onAirState === 'on_air'
                ? 'bg-gradient-to-b from-red-600 to-red-800 border-red-500 text-white box-glow-red animate-pulse'
                : onAirState === 'standby'
                ? 'bg-gradient-to-b from-amber-600 to-amber-800 border-amber-400 text-white box-glow-orange'
                : onAirState === 'rehearsal'
                ? 'bg-gradient-to-b from-cyan-600 to-cyan-800 border-cyan-400 text-white box-glow-cyan'
                : isDarkMode
                ? 'bg-zinc-900 border-zinc-800 text-zinc-600'
                : 'bg-zinc-200 border-zinc-300 text-zinc-500'
            }`}
          >
            {/* Corner metallic screws */}
            <span className="absolute top-1 left-1.5 w-1 h-1 rounded-full bg-zinc-400/50" />
            <span className="absolute top-1 right-1.5 w-1 h-1 rounded-full bg-zinc-400/50" />
            <span className="absolute bottom-1 left-1.5 w-1 h-1 rounded-full bg-zinc-400/50" />
            <span className="absolute bottom-1 right-1.5 w-1 h-1 rounded-full bg-zinc-400/50" />

            <span className={`w-2.5 h-2.5 rounded-full ${
              onAirState === 'on_air' ? 'bg-red-200 animate-ping' :
              onAirState === 'standby' ? 'bg-amber-300' :
              onAirState === 'rehearsal' ? 'bg-cyan-300' : 'bg-zinc-500'
            }`} />

            <div className="text-center font-['Chakra_Petch',sans-serif] tracking-widest font-black text-xs sm:text-base leading-none">
              {onAirState === 'on_air' && '● LIVE ON AIR'}
              {onAirState === 'standby' && '▲ STANDBY'}
              {onAirState === 'rehearsal' && '■ REHEARSAL'}
              {onAirState === 'off' && '○ STUDIO OFF'}
            </div>
          </div>
        </div>

        {/* Right: Day/Night Segmented Switch, Master Clock, Microphone Switch, Volume */}
        <div className="flex items-center gap-2">
          {/* Day / Night Unambiguous Segmented Selector (ห้ามสลับ/ห้ามงง) */}
          <div 
            className={`flex items-center p-0.5 rounded-lg border text-xs font-semibold ${
              isDarkMode ? 'bg-[#0d0f15] border-zinc-800' : 'bg-zinc-200 border-zinc-300'
            }`}
            title="เลือกโหมดการแสดงผล (กลางวัน / กลางคืน)"
          >
            {/* กลางวัน (Light Mode) */}
            <button
              onClick={() => setIsDarkMode(false)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all cursor-pointer ${
                !isDarkMode
                  ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
                  : isDarkMode
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-600'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="text-[11px]">กลางวัน</span>
            </button>

            {/* กลางคืน (Dark Mode) */}
            <button
              onClick={() => setIsDarkMode(true)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all cursor-pointer ${
                isDarkMode
                  ? 'bg-orange-500 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="text-[11px]">กลางคืน</span>
            </button>
          </div>

          {/* Master Studio Clock */}
          <div className={`hidden sm:flex items-center gap-1.5 border px-2.5 py-1.5 rounded-lg font-mono shadow-inner ${
            isDarkMode ? 'bg-[#090b10] border-zinc-800 text-orange-400' : 'bg-zinc-100 border-zinc-300 text-orange-600'
          }`}>
            <Clock className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
            <span className="text-sm font-bold tracking-wider">{timeStr}</span>
            <span className="text-[9px] text-zinc-500 font-sans">BKK</span>
          </div>

          {/* Guaranteed Working Microphone Live Switch */}
          <button
            onClick={toggleMic}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
              micActive
                ? 'bg-red-600/25 border-red-500 text-red-400 shadow-lg shadow-red-500/30 animate-pulse ring-2 ring-red-500/40'
                : isDarkMode
                ? 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:border-orange-500/50 hover:text-white'
                : 'bg-zinc-100 border-zinc-300 text-zinc-700 hover:border-orange-500 hover:text-orange-600'
            }`}
            title={
              micActive
                ? `ไมโครโฟนเปิดอยู่ (${micMode === 'hardware' ? 'ไมค์จริง' : 'จำลองเสียงสด'}) - คลิกเพื่อปิด`
                : 'คลิกเพื่อเปิดไมโครโฟนพูดจัดรายการ'
            }
          >
            {micActive ? (
              <>
                <Mic className="w-4 h-4 text-red-500 animate-bounce" />
                <span>MIC LIVE</span>
                <span className="text-[9px] font-mono px-1 bg-red-600 text-white rounded">
                  {micMode === 'hardware' ? 'HW' : 'SIM'}
                </span>
              </>
            ) : (
              <>
                <MicOff className="w-4 h-4 text-zinc-400" />
                <span>เปิดไมค์</span>
              </>
            )}
          </button>

          {/* Volume Control */}
          <div className={`hidden lg:flex items-center gap-2 border px-2.5 py-1.5 rounded-lg ${
            isDarkMode ? 'bg-[#171b24] border-zinc-800' : 'bg-zinc-100 border-zinc-300'
          }`}>
            <button onClick={toggleMute} className="text-zinc-400 hover:text-orange-500 cursor-pointer" title="Mute/Unmute">
              {isMuted || masterVol === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-orange-400" />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : masterVol}
              onChange={handleVolumeChange}
              className="w-14 h-1.5 bg-zinc-600 rounded-lg appearance-none cursor-pointer accent-orange-500"
              title={`Master: ${isMuted ? 0 : masterVol}%`}
            />
          </div>
        </div>
      </div>

      {/* Modal: โหมดเปลี่ยนชื่อรายการ & ผู้จัดรายการ (Rename Mode Modal) */}
      {isRenameModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className={`border-2 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl ${
            isDarkMode ? 'bg-[#12151d] border-orange-500/50 text-zinc-100' : 'bg-white border-orange-500/50 text-zinc-800'
          }`}>
            {/* Modal Header */}
            <div className={`p-4 border-b flex items-center justify-between ${
              isDarkMode ? 'border-zinc-800 bg-[#161a24]' : 'border-zinc-200 bg-zinc-50'
            }`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-['Chakra_Petch',sans-serif] font-bold text-sm text-white sm:text-base">
                    โหมดเปลี่ยนชื่อรายการ & ดีเจ
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    ปรับเปลี่ยนชื่อรายการสดและผู้ดำเนินรายการให้ตรงกับรอบออกอากาศ
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsRenameModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveRename} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-medium mb-1">
                  ชื่อรายการที่ออกอากาศ (Program Title)
                </label>
                <input
                  type="text"
                  value={tempShowTitle}
                  onChange={(e) => setTempShowTitle(e.target.value)}
                  placeholder="เช่น SoundCraft Music Hits: เพลงฮิตติดกระแส"
                  className={`w-full p-2.5 rounded-lg border font-semibold focus:outline-none focus:border-orange-500 ${
                    isDarkMode ? 'bg-[#171b26] border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1">
                    ชื่อผู้ดำเนินรายการ / ดีเจ (Host/DJ)
                  </label>
                  <input
                    type="text"
                    value={tempActiveDj}
                    onChange={(e) => setTempActiveDj(e.target.value)}
                    placeholder="เช่น ดีเจ แพรรี่"
                    className={`w-full p-2.5 rounded-lg border font-semibold focus:outline-none focus:border-orange-500 ${
                      isDarkMode ? 'bg-[#171b26] border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1">
                    คลื่นความถี่ / สถานี (Frequency)
                  </label>
                  <input
                    type="text"
                    value={stationFreq}
                    onChange={(e) => setStationFreq(e.target.value)}
                    placeholder="เช่น 102.5 FM"
                    className={`w-full p-2.5 rounded-lg border font-mono font-bold text-orange-400 focus:outline-none focus:border-orange-500 ${
                      isDarkMode ? 'bg-[#171b26] border-zinc-800' : 'bg-zinc-50 border-zinc-300'
                    }`}
                  />
                </div>
              </div>

              {/* Quick Presets */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-mono text-zinc-400 block">
                  เลือกจากแม่แบบรายการยอดนิยม (Presets):
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => applyPreset('SoundCraft Music Hits: เพลงฮิตติดกระแส', 'ดีเจ แพรรี่', '102.5 FM')}
                    className={`p-2 rounded border text-left cursor-pointer transition-colors ${
                      isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:border-orange-500/50' : 'bg-zinc-100 border-zinc-300'
                    }`}
                  >
                    <span className="font-bold text-orange-400 block">🎵 รายการเพลงฮิต</span>
                    <span className="text-[10px] text-zinc-400">ดีเจ แพรรี่ • 102.5 FM</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPreset('เกาะติดข่าวเช้าทันเหตุการณ์ (Morning Brief)', 'ผู้ประกาศ สุชาดา', '98.5 FM')}
                    className={`p-2 rounded border text-left cursor-pointer transition-colors ${
                      isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:border-orange-500/50' : 'bg-zinc-100 border-zinc-300'
                    }`}
                  >
                    <span className="font-bold text-cyan-400 block">📰 รายการข่าวเช้า</span>
                    <span className="text-[10px] text-zinc-400">ผู้ประกาศ สุชาดา • 98.5 FM</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPreset('Podcast Insight: เรื่องเล่าเปลี่ยนมุมคิด', 'ดีเจ ภัทร', 'Online HD')}
                    className={`p-2 rounded border text-left cursor-pointer transition-colors ${
                      isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:border-orange-500/50' : 'bg-zinc-100 border-zinc-300'
                    }`}
                  >
                    <span className="font-bold text-amber-400 block">🎙️ พอดแคสต์สร้างแรงบันดาลใจ</span>
                    <span className="text-[10px] text-zinc-400">ดีเจ ภัทร • Online HD</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPreset('ละครวิทยุลี้ลับ: เสียงสะท้อนยามวิกาล', 'คณะละครเสียงสยาม', '104.0 FM')}
                    className={`p-2 rounded border text-left cursor-pointer transition-colors ${
                      isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:border-orange-500/50' : 'bg-zinc-100 border-zinc-300'
                    }`}
                  >
                    <span className="font-bold text-purple-400 block">📻 ละครวิทยุร่วมสมัย</span>
                    <span className="text-[10px] text-zinc-400">คณะละครเสียงสยาม</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsRenameModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-orange-500/20"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>บันทึกชื่อรายการ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
