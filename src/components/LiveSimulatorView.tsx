import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Music, 
  Sparkles, 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Radio, 
  PhoneCall, 
  Download, 
  Bot, 
  ShieldCheck, 
  Clock, 
  Flame, 
  Award, 
  Heart,
  ChevronRight,
  Zap,
  Activity
} from 'lucide-react';
import { studioAudio } from '../utils/audioEngine';

interface LiveSimulatorViewProps {
  onAirState: string;
  setOnAirState: (st: 'on_air' | 'standby' | 'rehearsal' | 'off') => void;
  currentShowTitle: string;
}

export const LiveSimulatorView: React.FC<LiveSimulatorViewProps> = ({
  onAirState,
  setOnAirState,
  currentShowTitle,
}) => {
  // Mixer Faders
  const [micGain, setMicGain] = useState<number>(85);
  const [bgmVol, setBgmVol] = useState<number>(65);
  const [sfxVol, setSfxVol] = useState<number>(80);
  const [phoneVol, setPhoneVol] = useState<number>(75);

  // States
  const [isMicLive, setIsMicLive] = useState<boolean>(false);
  const [activeBgm, setActiveBgm] = useState<string | null>(null);
  const [autoDucking, setAutoDucking] = useState<boolean>(true);
  const [isDucked, setIsDucked] = useState<boolean>(false);

  // Rehearsal Recording State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);

  // Practice Script Cues
  const [activePracticeScript, setActivePracticeScript] = useState<string>(
    `[BED: เปิดดนตรี Upbeat Pop คลอเบาๆ]\n[DJ LIVE]: "สวัสดีครับคุณผู้ฟัง 102.5 SoundCraft Studio ในช่วงบ่ายนี้ อากาศกำลังสบายๆ อยู่กับดีเจฝึกหัดประจำห้องส่ง..."\n[SFX: กด Jingle ประจำสถานี]\n[DJ LIVE]: "ชั่วโมงนี้เราเปิดสายหน้าไมค์ให้ทุกท่านโทรเข้ามาทักทายกันครับ!"`
  );

  // Studio Director Tip
  const [directorTip, setDirectorTip] = useState<string>(
    'ยินดีต้อนรับสู่ห้องแล็บมิกซ์เสียง! เปิดเพลง BGM Bed แล้วลองเปิดไมค์พูด ระบบ Auto-Ducking จะลดเสียงเพลงลงอัตโนมัติเหมือนสถานีจริง'
  );

  // Handle Ducking logic when Mic is turned on
  useEffect(() => {
    if (autoDucking && activeBgm) {
      if (isMicLive) {
        setIsDucked(true);
        setDirectorTip('🎤 ไมค์กำลังทำงาน: ระบบ Auto-Ducking หรี่เสียงดนตรีลง -12dB เพื่อให้เสียงพูดผู้จัดเด่นชัด');
      } else {
        setIsDucked(false);
        setDirectorTip('🎵 ปิดไมค์แล้ว: ดนตรี BGM เร่งระดับความดังกลับคืนสู่ระดับปกติ');
      }
    }
  }, [isMicLive, autoDucking, activeBgm]);

  // Recording Timer
  useEffect(() => {
    let timer: any = null;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const toggleMic = async () => {
    if (isMicLive) {
      studioAudio.disableMicrophone();
      setIsMicLive(false);
    } else {
      const res = await studioAudio.enableMicrophone();
      setIsMicLive(res.success);
      if (res.success && onAirState === 'off') {
        setOnAirState('on_air');
      }
    }
  };

  const handleToggleBgm = (type: 'upbeat' | 'dramatic' | 'lofi') => {
    if (activeBgm === type) {
      studioAudio.stopBgm();
      setActiveBgm(null);
    } else {
      if (type === 'upbeat') studioAudio.playUpbeatPopBed();
      else if (type === 'dramatic') studioAudio.playDramaticAmbientBed();
      else if (type === 'lofi') studioAudio.playLoFiChillBed();
      setActiveBgm(type);
    }
  };

  const playSfx = (type: string) => {
    if (type === 'jingle') studioAudio.playJingle();
    else if (type === 'news') studioAudio.playNewsStinger();
    else if (type === 'whoosh') studioAudio.playStationWhoosh();
    else if (type === 'phone') studioAudio.playPhoneRing();
    else if (type === 'door') studioAudio.playDoorCreak();
    else if (type === 'censor') studioAudio.playCensorBeep();
    else if (type === 'applause') studioAudio.playApplause();
    else if (type === 'countdown') {
      studioAudio.playCountdownTone(false);
      setTimeout(() => studioAudio.playCountdownTone(true), 500);
    }
  };

  const triggerPhoneInVo = () => {
    studioAudio.playPhoneRing();
    setTimeout(() => {
      studioAudio.speakVoiceover(
        'สวัสดีครับดีเจ! โทรมาจากเชียงใหม่ครับ ฟังรายการอยู่ตลอด เพลงเพราะและเสียงดีเจฟังเพลินมากครับ ขอเพลงหน่อยครับ!'
      );
    }, 900);
  };

  const startRehearsalRecording = async () => {
    setRecordedAudioUrl(null);
    setRecordingSeconds(0);
    const ok = await studioAudio.startRecording();
    if (ok) {
      setIsRecording(true);
      setIsMicLive(true);
      setOnAirState('on_air');
      setDirectorTip('🔴 กำลังบันทึกเสียงจัดรายการสด... พูดหน้าไมค์และทดลองกด Sound Effect ควบคู่กันได้เลย!');
    }
  };

  const stopRehearsalRecording = async () => {
    const url = await studioAudio.stopRecording();
    setIsRecording(false);
    if (url) {
      setRecordedAudioUrl(url);
      setDirectorTip('✅ บันทึกเสียงการซ้อมเสร็จสมบูรณ์! กดฟังเสียงตัวเองด้านล่างเพื่อประเมินความชัดเจนของน้ำเสียง');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
              STUDIO LABORATORY
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-['Chakra_Petch',sans-serif] text-white flex items-center gap-2">
              <Sliders className="w-6 h-6 text-orange-400" />
              ห้องแล็บมิกซ์เสียงและจำลองการจัดรายการสด (Live On-Air Simulator)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            แผงควบคุมมัลติแทร็ก 4 แชนเนล ระบบ Auto-Ducking ตัดดนตรีอัตโนมัติ และสตูดิโอบันทึกเสียงฝึกพูดหน้าไมค์
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400 bg-[#141720] px-3 py-1.5 rounded-lg border border-zinc-800 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>4-Channel Broadcast Mixer Active</span>
          </span>
        </div>
      </div>

      {/* AI Studio Director Live Banner */}
      <div className="bg-[#141722] border border-orange-500/30 rounded-xl p-4 flex items-center gap-3 shadow-lg">
        <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
          <Bot className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-orange-400 uppercase">
              AI STUDIO DIRECTOR (ผู้กำกับรายการ)
            </span>
            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono">
              Live Prompt
            </span>
          </div>
          <p className="text-xs text-zinc-200 mt-0.5 leading-relaxed font-sans">{directorTip}</p>
        </div>
      </div>

      {/* 4-Channel Virtual Broadcast Console */}
      <div className="bg-[#0c0e14] border-2 border-zinc-800 rounded-2xl p-5 shadow-2xl studio-grid">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-['Chakra_Petch',sans-serif] text-xs font-bold tracking-widest text-orange-400 uppercase">
              STUDIO MULTI-TRACK AUDIO CONSOLE (EBU R128 COMPLIANT)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-zinc-300">
              <input
                type="checkbox"
                checked={autoDucking}
                onChange={(e) => setAutoDucking(e.target.checked)}
                className="w-4 h-4 accent-orange-500 rounded"
              />
              <span>Auto-Ducking (-12dB)</span>
            </label>
            {isDucked && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                DUCKING ACTIVE
              </span>
            )}
          </div>
        </div>

        {/* 4 Channel Faders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* CH 1: DJ Microphone */}
          <div className={`p-4 rounded-xl border transition-all ${
            isMicLive ? 'bg-[#181c26] border-red-500/60 shadow-lg shadow-red-500/10' : 'bg-[#12141c] border-zinc-800'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-orange-400">CH 1: DJ MIC</span>
              <span className={`w-2 h-2 rounded-full ${isMicLive ? 'bg-red-500 animate-ping' : 'bg-zinc-700'}`} />
            </div>

            <button
              onClick={toggleMic}
              className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all mb-4 cursor-pointer ${
                isMicLive
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/30 animate-pulse'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {isMicLive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4 text-zinc-400" />}
              <span>{isMicLive ? 'MIC ON-AIR (สด)' : 'เปิดไมโครโฟน'}</span>
            </button>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                <span>Gain Trim:</span>
                <span className="text-orange-400 font-bold">{micGain}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={micGain}
                onChange={(e) => setMicGain(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            <p className="text-[10px] text-zinc-500 mt-3 font-mono">
              สถานะ: {isMicLive ? 'กระจายเสียงสดผ่านหูฟัง' : 'Muted'}
            </p>
          </div>

          {/* CH 2: Music Bed (BGM) */}
          <div className={`p-4 rounded-xl border transition-all ${
            activeBgm ? 'bg-[#181c26] border-orange-500/60 shadow-lg shadow-orange-500/10' : 'bg-[#12141c] border-zinc-800'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-orange-400">CH 2: MUSIC BED</span>
              <Music className={`w-4 h-4 ${activeBgm ? 'text-orange-400 animate-spin' : 'text-zinc-600'}`} style={{ animationDuration: '4s' }} />
            </div>

            <div className="space-y-1.5 mb-3">
              <button
                onClick={() => handleToggleBgm('upbeat')}
                className={`w-full py-1.5 px-2 rounded text-xs font-mono flex items-center justify-between transition-colors ${
                  activeBgm === 'upbeat' ? 'bg-orange-500 text-zinc-950 font-bold' : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                <span>Upbeat Radio Pop</span>
                <span>{activeBgm === 'upbeat' ? '■ หยุด' : '▶ เล่น'}</span>
              </button>

              <button
                onClick={() => handleToggleBgm('lofi')}
                className={`w-full py-1.5 px-2 rounded text-xs font-mono flex items-center justify-between transition-colors ${
                  activeBgm === 'lofi' ? 'bg-orange-500 text-zinc-950 font-bold' : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                <span>Lo-Fi Chill Podcast</span>
                <span>{activeBgm === 'lofi' ? '■ หยุด' : '▶ เล่น'}</span>
              </button>

              <button
                onClick={() => handleToggleBgm('dramatic')}
                className={`w-full py-1.5 px-2 rounded text-xs font-mono flex items-center justify-between transition-colors ${
                  activeBgm === 'dramatic' ? 'bg-orange-500 text-zinc-950 font-bold' : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                <span>Dramatic Ambient</span>
                <span>{activeBgm === 'dramatic' ? '■ หยุด' : '▶ เล่น'}</span>
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                <span>BGM Fader:</span>
                <span className="text-orange-400 font-bold">{isDucked ? Math.round(bgmVol * 0.4) : bgmVol}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={bgmVol}
                onChange={(e) => setBgmVol(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>
          </div>

          {/* CH 3: Sound Cart Pad */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-[#12141c]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-orange-400">CH 3: SOUND CART</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>

            <div className="grid grid-cols-2 gap-1.5 mb-3">
              <button
                onClick={() => playSfx('jingle')}
                className="py-1.5 px-2 bg-zinc-800 hover:bg-orange-500 hover:text-zinc-950 text-zinc-300 text-[11px] font-mono rounded transition-colors text-left"
              >
                ⚡ Jingle ID
              </button>
              <button
                onClick={() => playSfx('news')}
                className="py-1.5 px-2 bg-zinc-800 hover:bg-red-600 hover:text-white text-zinc-300 text-[11px] font-mono rounded transition-colors text-left"
              >
                🚨 Breaking
              </button>
              <button
                onClick={() => playSfx('whoosh')}
                className="py-1.5 px-2 bg-zinc-800 hover:bg-cyan-500 hover:text-zinc-950 text-zinc-300 text-[11px] font-mono rounded transition-colors text-left"
              >
                💨 Whoosh
              </button>
              <button
                onClick={() => playSfx('applause')}
                className="py-1.5 px-2 bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-300 text-[11px] font-mono rounded transition-colors text-left"
              >
                👏 Applause
              </button>
              <button
                onClick={() => playSfx('door')}
                className="py-1.5 px-2 bg-zinc-800 hover:bg-amber-600 hover:text-white text-zinc-300 text-[11px] font-mono rounded transition-colors text-left"
              >
                🚪 Door Creak
              </button>
              <button
                onClick={() => playSfx('censor')}
                className="py-1.5 px-2 bg-zinc-800 hover:bg-red-500 hover:text-white text-zinc-300 text-[11px] font-mono rounded transition-colors text-left"
              >
                ⛔ Censor
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                <span>SFX Fader:</span>
                <span className="text-orange-400 font-bold">{sfxVol}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sfxVol}
                onChange={(e) => setSfxVol(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>
          </div>

          {/* CH 4: Phone-In & Caller Voice */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-[#12141c]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-orange-400">CH 4: PHONE-IN</span>
              <PhoneCall className="w-4 h-4 text-cyan-400" />
            </div>

            <button
              onClick={triggerPhoneInVo}
              className="w-full py-2.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center gap-1.5 transition-all mb-4 cursor-pointer shadow-md shadow-cyan-600/20"
            >
              <PhoneCall className="w-4 h-4" />
              <span>รับสายสดผู้ฟัง (Simulated)</span>
            </button>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                <span>Phone Fader:</span>
                <span className="text-orange-400 font-bold">{phoneVol}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={phoneVol}
                onChange={(e) => setPhoneVol(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            <p className="text-[10px] text-zinc-500 mt-3 font-mono">
              Hybrid Line: Profanity Delay 7s
            </p>
          </div>
        </div>
      </div>

      {/* Practice Rehearsal & Live Recording Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Teleprompter Cue Sheet & Live Practice */}
        <div className="lg:col-span-7 bg-[#12151d] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="text-xs font-mono font-bold text-orange-400 uppercase flex items-center gap-1.5">
              <Radio className="w-4 h-4" />
              สคริปต์ฝึกจัดรายการสด (Studio Cue Sheet)
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              พิมพ์แก้ไขบทฝึกซ้อมได้อิสระ
            </span>
          </div>

          <textarea
            value={activePracticeScript}
            onChange={(e) => setActivePracticeScript(e.target.value)}
            rows={6}
            className="w-full bg-[#0d0f15] border border-zinc-800 rounded-xl p-3 text-xs sm:text-sm text-zinc-100 font-['Prompt',sans-serif] leading-relaxed focus:outline-none focus:border-orange-500"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              {!isRecording ? (
                <button
                  onClick={startRehearsalRecording}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-red-600/30 cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                  <span>เริ่มอัดเสียงฝึกพูดสด</span>
                </button>
              ) : (
                <button
                  onClick={stopRehearsalRecording}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-red-400 font-bold text-xs flex items-center gap-2 transition-all border border-red-500/40 cursor-pointer animate-pulse"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>หยุดการอัดเสียง ({recordingSeconds}s)</span>
                </button>
              )}
            </div>

            <span className="text-xs font-mono text-zinc-400">
              สถานะ: {isRecording ? '🔴 Recording On-Air Session' : 'พร้อมบันทึก'}
            </span>
          </div>
        </div>

        {/* Right 5 Cols: Playback & Review Rehearsal Session */}
        <div className="lg:col-span-5 bg-[#12151d] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                ฟังเสียงซ้อมย้อนหลัง (Playback Session)
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">Student Review</span>
            </div>

            {recordedAudioUrl ? (
              <div className="mt-4 space-y-3">
                <div className="p-3 rounded-xl bg-[#171b24] border border-emerald-500/30">
                  <p className="text-xs text-emerald-400 font-semibold mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    ไฟล์เสียงฝึกซ้อมล่าสุด ({recordingSeconds} วินาที)
                  </p>
                  <audio src={recordedAudioUrl} controls className="w-full h-10 accent-orange-500" />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <a
                    href={recordedAudioUrl}
                    download="soundcraft-rehearsal.webm"
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    ดาวน์โหลดไฟล์เสียง
                  </a>
                  <button
                    onClick={() => {
                      setRecordedAudioUrl(null);
                      setRecordingSeconds(0);
                    }}
                    className="text-zinc-500 hover:text-zinc-300 text-xs font-mono"
                  >
                    ล้างการซ้อม
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 text-zinc-600 flex items-center justify-center mx-auto">
                  <Mic className="w-6 h-6" />
                </div>
                <p className="text-xs text-zinc-400 font-medium">ยังไม่มีไฟล์เสียงซ้อม</p>
                <p className="text-[11px] text-zinc-500 max-w-xs mx-auto leading-relaxed">
                  กดปุ่ม <strong>"เริ่มอัดเสียงฝึกพูดสด"</strong> ทางด้านซ้าย เพื่อเริ่มทดลองจัดรายการและบันทึกเสียงผู้เรียนผ่านไมค์จริง
                </p>
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-[#171b24] border border-zinc-800 text-xs text-zinc-400 space-y-1">
            <span className="font-semibold text-zinc-200 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" /> เกณฑ์การประเมินตนเอง:
            </span>
            <p>1. น้ำเสียงชัดถ้อยชัดคำ ไม่กลืนคำ</p>
            <p>2. มีจังหวะเว้นวรรคหายใจ ไม่พูดเร็วเกินไป</p>
            <p>3. ควบคุมระดับเสียงดนตรีไม่ให้กลบเสียงพูด</p>
          </div>
        </div>
      </div>
    </div>
  );
};
