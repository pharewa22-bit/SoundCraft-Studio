import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Volume2, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Radio, 
  Music, 
  Mic, 
  Layers, 
  Table, 
  HelpCircle,
  ExternalLink,
  Zap,
  Info,
  Sliders
} from 'lucide-react';
import { 
  DETAILED_KNOWLEDGE_MODULES, 
  RADIO_9_FORMATS, 
  KnowledgeCategory, 
  RadioTypeItem,
  AudioElementSample 
} from '../data/studioData';
import { studioAudio } from '../utils/audioEngine';

interface KnowledgeBaseViewProps {
  completedLessonIds: string[];
  onCompleteLesson: (lessonId: string) => void;
  isDarkMode: boolean;
  onOpenReferences: () => void;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  completedLessonIds,
  onCompleteLesson,
  isDarkMode,
  onOpenReferences,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>('diff-radio-podcast');
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    'diff-radio-podcast-0': true,
    'radio-9-types-0': true,
    'jingle-spot-30s-0': true,
    'principles-6t-3h-0': true,
  });

  // 9 Formats Sub-selector
  const [selectedFormat, setSelectedFormat] = useState<RadioTypeItem>(RADIO_9_FORMATS[0]);

  // Audio Component Players State
  const [playingSfx, setPlayingSfx] = useState<string | null>(null);
  const [playingBgm, setPlayingBgm] = useState<string | null>(null);
  const [isVoSpeaking, setIsVoSpeaking] = useState<boolean>(false);

  const activeModule =
    DETAILED_KNOWLEDGE_MODULES.find((m) => m.id === selectedModuleId) ||
    DETAILED_KNOWLEDGE_MODULES[0];

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Trigger Sound Effect (SFX)
  const handlePlaySfx = (type: string) => {
    setPlayingSfx(type);
    if (type === 'whoosh') studioAudio.playStationWhoosh();
    else if (type === 'jingle') studioAudio.playJingle();
    else if (type === 'news') studioAudio.playNewsStinger();
    else if (type === 'censor') studioAudio.playCensorBeep();
    else if (type === 'applause') studioAudio.playApplause();
    else if (type === 'phone') studioAudio.playPhoneRing();
    else if (type === 'door') studioAudio.playDoorCreak();
    else if (type === 'countdown') {
      studioAudio.playCountdownTone(false);
      setTimeout(() => studioAudio.playCountdownTone(true), 400);
    }
    setTimeout(() => setPlayingSfx(null), 1200);
  };

  // Trigger Music Bed (BGM)
  const handleToggleBgm = (type: 'upbeat' | 'dramatic' | 'lofi') => {
    if (playingBgm === type) {
      studioAudio.stopBgm();
      setPlayingBgm(null);
    } else {
      if (type === 'upbeat') studioAudio.playUpbeatPopBed();
      else if (type === 'dramatic') studioAudio.playDramaticAmbientBed();
      else if (type === 'lofi') studioAudio.playLoFiChillBed();
      setPlayingBgm(type);
    }
  };

  // Trigger Voiceover (VO)
  const handleToggleVoiceover = (text: string) => {
    if (isVoSpeaking) {
      studioAudio.stopVoiceover();
      setIsVoSpeaking(false);
    } else {
      setIsVoSpeaking(true);
      studioAudio.speakVoiceover(text, () => {
        setIsVoSpeaking(false);
      });
    }
  };

  // Stop All Active Audio Elements
  const stopAllAudio = () => {
    studioAudio.stopBgm();
    studioAudio.stopVoiceover();
    setPlayingBgm(null);
    setIsVoSpeaking(false);
    setPlayingSfx(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded border border-orange-500/20">
              ACADEMIC CURRICULUM
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-['Chakra_Petch',sans-serif] text-white">
              คลังความรู้การจัดรายการวิทยุดิจิทัลและ Podcast
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            4 หมวดหมู่ความรู้โต้ตอบได้ พร้อมระบบจำลองฟังเสียงแยก 3 องค์ประกอบ (SFX, BGM, Voiceover)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenReferences}
            className="px-3.5 py-1.5 rounded-xl bg-[#141720] hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-orange-400" />
            <span>แหล่งอ้างอิง & ข้อมูลผู้พัฒนา</span>
          </button>
        </div>
      </div>

      {/* 4 Main Interactive Knowledge Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {DETAILED_KNOWLEDGE_MODULES.map((mod, idx) => {
          const isSelected = selectedModuleId === mod.id;
          const isCompleted = completedLessonIds.includes(mod.id);

          return (
            <div
              key={mod.id}
              onClick={() => {
                setSelectedModuleId(mod.id);
                stopAllAudio();
                onCompleteLesson(mod.id);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? 'bg-gradient-to-b from-[#1a1f2c] to-[#12151d] border-orange-500 shadow-xl shadow-orange-500/10 ring-1 ring-orange-500/40'
                  : 'bg-[#12151d] border-zinc-800 hover:border-zinc-700 hover:bg-[#151924]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  หมวดที่ {idx + 1}
                </span>
                {isCompleted && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
              </div>

              <h3 className={`font-bold text-xs sm:text-sm transition-colors line-clamp-2 ${
                isSelected ? 'text-orange-400 font-bold' : 'text-zinc-200 group-hover:text-white'
              }`}>
                {mod.title}
              </h3>

              <p className="text-[11px] text-zinc-500 mt-2 line-clamp-2 leading-relaxed">
                {mod.shortDesc}
              </p>

              <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-orange-400/90 group-hover:text-orange-300">
                <span>{isSelected ? 'กำลังดูเนื้อหา' : 'คลิกเพื่อเปิดศึกษา'}</span>
                <span className="font-mono">→</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3-Dimensional Audio Component Demonstrator (SFX, BGM, Voiceover) */}
      <div className="bg-[#0e1119] border-2 border-orange-500/30 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-['Chakra_Petch',sans-serif] font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <span>จำลองฟังเสียงแยก 3 องค์ประกอบ (Audio Layering Sandbox)</span>
                <span className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                  Web Audio Engine
                </span>
              </h4>
              <p className="text-xs text-zinc-400">
                กดฟังแยกชิ้นส่วน หรือกดเปิดพร้อมกันเพื่อสังเกตการมิกซ์เสียงและการทำงานร่วมกันของ 3 องค์ประกอบหลัก
              </p>
            </div>
          </div>

          <button
            onClick={stopAllAudio}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-xs font-mono flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            หยุดเสียงทั้งหมด
          </button>
        </div>

        {/* 3 Component Columns: SFX | BGM | VO */}
        {(() => {
          const sample: AudioElementSample =
            selectedModuleId === 'radio-9-types'
              ? selectedFormat.audioSample
              : activeModule.content.audioSample;

          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Element 1: Sound Effect (SFX) */}
              <div className="bg-[#141722] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      1. SOUND EFFECT (SFX)
                    </span>
                    <span className="text-[10px] bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded font-mono">
                      เสียงประกอบ
                    </span>
                  </div>
                  <h5 className="font-semibold text-xs text-zinc-100">{sample.sfxName}</h5>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                    {sample.sfxDescription}
                  </p>
                </div>

                <button
                  onClick={() => handlePlaySfx(sample.sfxType)}
                  className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    playingSfx === sample.sfxType
                      ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/30 animate-pulse'
                      : 'bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-200'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>กดฟังเสียง SFX</span>
                </button>
              </div>

              {/* Element 2: Background Music Bed (BGM) */}
              <div className="bg-[#141722] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-orange-400 flex items-center gap-1.5">
                      <Music className="w-3.5 h-3.5" />
                      2. MUSIC BED (BGM)
                    </span>
                    <span className="text-[10px] bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded font-mono">
                      ดนตรีคลอ
                    </span>
                  </div>
                  <h5 className="font-semibold text-xs text-zinc-100">{sample.bgmName}</h5>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                    {sample.bgmDescription}
                  </p>
                </div>

                <button
                  onClick={() => handleToggleBgm(sample.bgmType)}
                  className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    playingBgm === sample.bgmType
                      ? 'bg-orange-500 text-zinc-950 shadow-lg shadow-orange-500/30'
                      : 'bg-zinc-800 hover:bg-orange-500 hover:text-zinc-950 text-zinc-200'
                  }`}
                >
                  {playingBgm === sample.bgmType ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>หยุดเล่นดนตรี BGM</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>เปิดดนตรี BGM คลอ</span>
                    </>
                  )}
                </button>
              </div>

              {/* Element 3: Voiceover (VO) */}
              <div className="bg-[#141722] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5" />
                      3. VOICEOVER (VO)
                    </span>
                    <span className="text-[10px] bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded font-mono">
                      เสียงพากย์สาธิต
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300 italic bg-[#0c0e14] p-2 rounded-lg border border-zinc-800">
                    "{sample.voScript}"
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-1">
                    {sample.voDescription}
                  </p>
                </div>

                <button
                  onClick={() => handleToggleVoiceover(sample.voScript)}
                  className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isVoSpeaking
                      ? 'bg-cyan-500 text-zinc-950 shadow-lg shadow-cyan-500/30 animate-pulse'
                      : 'bg-zinc-800 hover:bg-cyan-500 hover:text-zinc-950 text-zinc-200'
                  }`}
                >
                  {isVoSpeaking ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>หยุดเสียงพากย์</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>กดฟังเสียงพากย์สาธิต (VO)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Special Sub-Component for Category 2: 9 Radio Formats Interactive Explorer */}
      {selectedModuleId === 'radio-9-types' && (
        <div className="bg-[#12151d] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <span className="text-xs font-mono font-bold text-orange-400 uppercase">
                EXPLORE 9 BROADCAST FORMATS
              </span>
              <h3 className="font-bold text-base text-white">
                เลือกเจาะลึกรูปแบบรายการวิทยุ 9 ประเภท
              </h3>
            </div>
            <span className="text-xs text-zinc-500 font-mono">คลิกปุ่มด้านล่างเพื่อสลับรูปแบบ</span>
          </div>

          {/* 9 Format Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
            {RADIO_9_FORMATS.map((fmt) => {
              const isFmtSelected = selectedFormat.id === fmt.id;
              return (
                <button
                  key={fmt.id}
                  onClick={() => {
                    setSelectedFormat(fmt);
                    stopAllAudio();
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    isFmtSelected
                      ? 'bg-orange-500 text-zinc-950 font-bold border-orange-400 shadow-lg shadow-orange-500/20'
                      : 'bg-[#171b26] text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  <span className="font-mono text-xs font-black">{fmt.id}</span>
                  <span className="text-[11px] font-semibold leading-tight line-clamp-2">
                    {fmt.name.split('/')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Format Detailed Inspection Card */}
          <div className="bg-[#161a24] border border-orange-500/20 rounded-xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-2">
              <div>
                <span className="text-[10px] font-mono text-orange-400 font-bold uppercase">
                  FORMAT #{selectedFormat.id} • {selectedFormat.englishName}
                </span>
                <h4 className="text-base font-bold text-white">{selectedFormat.name}</h4>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {selectedFormat.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-[#0f121a] p-3 rounded-lg border border-zinc-800">
                <span className="text-orange-400 font-semibold block mb-1">
                  ⏱️ สัดส่วนเนื้อหาและโครงสร้างเวลา:
                </span>
                <p className="text-zinc-300">{selectedFormat.keyFormat}</p>
              </div>

              <div className="bg-[#0f121a] p-3 rounded-lg border border-zinc-800">
                <span className="text-amber-400 font-semibold block mb-1">
                  🎛️ องค์ประกอบเสียงเด่น (Sound Design):
                </span>
                <p className="text-zinc-300">{selectedFormat.soundElements}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Accordion for Detailed Sections */}
      <div className="bg-[#12151d] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-orange-400" />
            <h3 className="font-bold text-base text-white">
              เนื้อหาเชิงลึกและทฤษฎีประกอบการเรียนรู้ (Academic Deep-Dive)
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {activeModule.content.overview}
          </p>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-3">
          {activeModule.content.sections.map((sec, secIdx) => {
            const secKey = `${activeModule.id}-${secIdx}`;
            const isExpanded = expandedSections[secKey] ?? true;

            return (
              <div
                key={secIdx}
                className="border border-zinc-800 rounded-xl overflow-hidden bg-[#161a24] transition-all"
              >
                <button
                  onClick={() => toggleSection(secKey)}
                  className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-zinc-800/40 transition-colors"
                >
                  <h4 className="font-bold text-xs sm:text-sm text-zinc-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    {sec.heading}
                  </h4>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-orange-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-4 pt-0 space-y-3 text-xs text-zinc-300 border-t border-zinc-800/60 mt-1">
                    <ul className="space-y-2">
                      {sec.details.map((d, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2 leading-relaxed">
                          <span className="text-orange-400 font-bold shrink-0">•</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Optional Interactive Table */}
                    {sec.tableData && (
                      <div className="mt-3 overflow-x-auto rounded-lg border border-zinc-800">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#0f121a] text-orange-400 font-mono border-b border-zinc-800">
                            <tr>
                              {sec.tableData.headers.map((h, hIdx) => (
                                <th key={hIdx} className="p-2.5 font-semibold">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800/60 bg-[#12151f]">
                            {sec.tableData.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-zinc-800/40">
                                {row.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className={`p-2.5 ${
                                      cIdx === 0 ? 'font-semibold text-zinc-200' : 'text-zinc-300'
                                    }`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
