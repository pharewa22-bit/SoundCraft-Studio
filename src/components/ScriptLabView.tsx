import React, { useState, useRef, useEffect } from 'react';
import { 
  FileEdit, 
  Sparkles, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Sliders, 
  Users, 
  FileText, 
  Award, 
  ShieldCheck, 
  Volume2, 
  Tag, 
  Download, 
  Printer,
  ChevronDown,
  Bot,
  AlertTriangle,
  CheckCircle2,
  Share2,
  FileCode,
  Zap,
  Info,
  ArrowRight
} from 'lucide-react';
import { 
  AUTO_FILL_TEMPLATES, 
  StructuredScript, 
  ScriptRow,
  RundownItem
} from '../data/studioData';
import { studioAudio } from '../utils/audioEngine';

interface ScriptLabViewProps {
  currentScript: string;
  setCurrentScript: (script: string) => void;
  onSendToAiReview: (script: string) => void;
  rundown?: RundownItem[];
}

interface AiAnalysisResult {
  readinessScore: number;
  verdict: string;
  timeAnalysis: {
    wordCount: number;
    estimatedSeconds: number;
    targetSeconds: number;
    isWithinLimit: boolean;
    timingComment: string;
  };
  soundTechniques: {
    hasFI: boolean;
    hasFO: boolean;
    hasFU: boolean;
    hasVoice: boolean;
    hasSFX: boolean;
    techniqueFeedback: string;
    spokenLanguageTips: string;
  };
  scoreBreakdown: {
    structure: number;
    timing: number;
    soundTechniques: number;
    spokenLanguage: number;
  };
  recommendations: string[];
}

export const ScriptLabView: React.FC<ScriptLabViewProps> = ({
  currentScript,
  setCurrentScript,
  onSendToAiReview,
  rundown = [],
}) => {
  // Active structured script initialized with Spot 30s
  const [scriptData, setScriptData] = useState<StructuredScript>(AUTO_FILL_TEMPLATES.spot_30s);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedJsonLink, setCopiedJsonLink] = useState<boolean>(false);
  const [copiedRawJson, setCopiedRawJson] = useState<boolean>(false);
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [exportModalTab, setExportModalTab] = useState<'options' | 'schema'>('options');

  // AI Radio Assistant Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisResult | null>(null);
  const [feedbackTab, setFeedbackTab] = useState<'overview' | 'timing' | 'techniques' | 'score'>('overview');

  // Teleprompter State
  const [isTeleprompterOpen, setIsTeleprompterOpen] = useState<boolean>(false);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(2);
  const [fontSize, setFontSize] = useState<number>(22);
  const [elapsedTimer, setElapsedTimer] = useState<number>(0);
  const prompterContentRef = useRef<HTMLDivElement>(null);

  // Generate flat text whenever scriptData changes
  useEffect(() => {
    const formatted = formatScriptToText(scriptData);
    setCurrentScript(formatted);
  }, [scriptData]);

  const formatScriptToText = (data: StructuredScript): string => {
    let out = `========================================================\n`;
    out += `SOUNDCRAFT STUDIO - BROADCAST SCRIPT SHEET\n`;
    out += `========================================================\n`;
    out += `[HEADING]\n`;
    out += `ชื่อเรื่อง: ${data.heading.title}\n`;
    out += `ความยาวเป้าหมาย: ${data.heading.targetDuration} | รหัส: ${data.heading.productionCode}\n`;
    out += `วันที่ผลิต: ${data.heading.productionDate} | สถานี/ช่องทาง: ${data.heading.stationOrPlatform}\n\n`;

    out += `[CREW - ผู้ร่วมงาน]\n`;
    out += `ผู้เขียนบท: ${data.crew.scriptwriter}\n`;
    out += `โปรดิวเซอร์: ${data.crew.producer}\n`;
    out += `ผู้ให้เสียง/ดีเจ: ${data.crew.voiceTalent}\n`;
    out += `ซาวด์เอนจิเนียร์: ${data.crew.soundEngineer}\n\n`;

    out += `[CONTENT - ตารางบท 3 ช่อง]\n`;
    data.contentRows.forEach((row, i) => {
      out += `--------------------------------------------------------\n`;
      out += `CUE #${i + 1} [${row.cueTime}]\n`;
      out += `เสียง/บทพูด: ${row.audioDetail}\n`;
      out += `หมายเหตุเทคนิค: ${row.productionNote}\n`;
    });
    out += `--------------------------------------------------------\n\n`;

    out += `[CREDIT - ส่วนปิด]\n`;
    out += `แหล่งอ้างอิง: ${data.credit.referenceSource}\n`;
    out += `ผู้สนับสนุน/ลิขสิทธิ์: ${data.credit.sponsorOrCopyright}\n`;
    out += `สโลแกนส่งท้าย: ${data.credit.signOffSlogan}\n`;
    out += `========================================================`;
    return out;
  };

  // Run AI Radio Assistant Analysis
  const handleAnalyzeScript = async () => {
    setIsAnalyzing(true);
    studioAudio.playStationWhoosh();

    const formattedText = formatScriptToText(scriptData);
    let targetSec = 30;
    if (scriptData.heading.targetDuration.includes('60')) targetSec = 60;
    else if (scriptData.heading.targetDuration.includes('90')) targetSec = 90;
    else if (scriptData.heading.targetDuration.includes('5 นาที') || scriptData.heading.targetDuration.includes('300')) targetSec = 90;

    // Check sound techniques from current scriptData
    const allText = formattedText.toLowerCase();
    const productionNotesText = scriptData.contentRows.map((r) => r.productionNote).join(' ').toLowerCase();
    const audioDetailsText = scriptData.contentRows.map((r) => r.audioDetail).join(' ').toLowerCase();

    const hasFI = productionNotesText.includes('fi') || productionNotesText.includes('fade in') || allText.includes('fade in');
    const hasFO = productionNotesText.includes('fo') || productionNotesText.includes('fade out') || allText.includes('fade out');
    const hasFU = productionNotesText.includes('fu') || productionNotesText.includes('ducking') || productionNotesText.includes('fade up') || allText.includes('ducking');
    const hasVoice = audioDetailsText.includes('vo') || audioDetailsText.includes('host') || audioDetailsText.includes('dj') || allText.includes('[dj') || allText.includes('[vo') || allText.includes('ผู้จัด');
    const hasSFX = audioDetailsText.includes('sfx') || audioDetailsText.includes('sound') || audioDetailsText.includes('เอฟเฟกต์') || allText.includes('[sfx');

    try {
      const response = await fetch('/api/ai-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptText: formattedText,
          scriptType: scriptData.templateType,
          targetSeconds: targetSec,
        }),
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        // Merge with fine-grained direct cue scan
        const enhancedAnalysis: AiAnalysisResult = {
          ...data.analysis,
          soundTechniques: {
            ...data.analysis.soundTechniques,
            hasFI: hasFI || data.analysis.soundTechniques.hasFI,
            hasFO: hasFO || data.analysis.soundTechniques.hasFO,
            hasFU: hasFU || data.analysis.soundTechniques.hasFU,
            hasVoice: hasVoice || data.analysis.soundTechniques.hasVoice,
            hasSFX: hasSFX || data.analysis.soundTechniques.hasSFX,
          },
        };
        setAiAnalysis(enhancedAnalysis);
      } else {
        throw new Error('Analysis payload error');
      }
    } catch (err) {
      console.warn('API error, generating studio analysis locally:', err);
      // Fallback local calculation
      const words = formattedText.trim().split(/\s+/).filter(Boolean);
      const thaiChars = formattedText.replace(/[^ก-๙]/g, '').length;
      const estimatedSyllables = Math.max(1, Math.round(thaiChars / 2.6) + words.length);
      const estimatedSeconds = Math.max(5, Math.round(estimatedSyllables / 3.8));

      const isWithinLimit = scriptData.templateType === 'spot_30s' ? estimatedSeconds <= 32 : Math.abs(estimatedSeconds - targetSec) <= 8;

      let timingScore = isWithinLimit ? 29 : Math.max(14, 29 - Math.abs(estimatedSeconds - targetSec) * 2);
      let techScore = 10;
      if (hasFI) techScore += 4;
      if (hasFO) techScore += 4;
      if (hasFU) techScore += 3;
      if (hasSFX) techScore += 2;
      if (hasVoice) techScore += 2;

      const structScore = 25;
      const langScore = 18;
      const totalScore = Math.min(100, Math.max(50, timingScore + techScore + structScore + langScore));

      setAiAnalysis({
        readinessScore: totalScore,
        verdict: totalScore >= 85 ? 'พร้อมออกอากาศ (Broadcast Ready)' : 'ต้องปรับแต่งเทคนิคเพิ่มเติม',
        timeAnalysis: {
          wordCount: words.length,
          estimatedSeconds,
          targetSeconds: targetSec,
          isWithinLimit,
          timingComment: `บทมีความยาวเสียงพูดประมาณ ${estimatedSeconds} วินาที เทียบกับเป้าหมาย ${targetSec} วินาที ${
            isWithinLimit ? 'อยู่ในเกณฑ์มาตรฐานความยาวบรอดคาสต์อย่างเหมาะสม' : 'ความยาวคลาดเคลื่อนจากเป้าหมาย แนะนำปรับเพิ่ม/ลดคำพูด'
          }`,
        },
        soundTechniques: {
          hasFI,
          hasFO,
          hasFU,
          hasVoice,
          hasSFX,
          techniqueFeedback: hasFI && hasFO && hasFU 
            ? 'ระบุคำสั่งเทคนิคครบถ้วนสมบูรณ์ มี Fade In, Fade Out และ Ducking ชัดเจน'
            : 'ยังขาดบางคำสั่งเทคนิคเสียง เช่น Fade In/Out หรือ Ducking ในช่วงเสียงพูด',
          spokenLanguageTips: 'ภาษาเพื่อการฟังควรเน้นประโยคสั้น กระชับ มีจังหวะเว้นวรรคหายใจ และสะกดตัวเลขเป็นคำอ่าน',
        },
        scoreBreakdown: {
          structure: structScore,
          timing: timingScore,
          soundTechniques: techScore,
          spokenLanguage: langScore,
        },
        recommendations: [
          'ระบุระดับเสียง Ducking ของดนตรี BGM เป็นตัวเลขเดซิเบล เช่น -12 dBFS',
          'รักษาอัตราเร็วการพูดไว้ที่ 3.5 - 4.0 พยางค์ต่อวินาทีเพื่อความชัดเจน',
          'ตรวจเช็คจังหวะเว้นวรรคหายใจ (Breath Marks) ระหว่างเปลี่ยนประโยค',
        ],
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Auto-Fix Missing Techniques into the script rows
  const handleAutoFixTechniques = () => {
    studioAudio.playJingle();
    setScriptData((prev) => {
      const rows = [...prev.contentRows];
      if (rows.length === 0) return prev;

      // Ensure first row has Fade In
      if (rows[0] && !/fi|fade\s*in/i.test(rows[0].productionNote)) {
        rows[0] = {
          ...rows[0],
          productionNote: rows[0].productionNote ? `FI: Fade In (3s) | ${rows[0].productionNote}` : 'FI: Fade In (3s)',
        };
      }

      // Ensure middle row has Ducking / FU
      const midIdx = Math.min(1, rows.length - 1);
      if (rows[midIdx] && !/fu|ducking/i.test(rows[midIdx].productionNote)) {
        rows[midIdx] = {
          ...rows[midIdx],
          productionNote: rows[midIdx].productionNote ? `${rows[midIdx].productionNote} | FU: Ducking -12dB` : 'FU: Ducking -12dB',
        };
      }

      // Ensure last row has Fade Out
      const lastIdx = rows.length - 1;
      if (rows[lastIdx] && !/fo|fade\s*out/i.test(rows[lastIdx].productionNote)) {
        rows[lastIdx] = {
          ...rows[lastIdx],
          productionNote: rows[lastIdx].productionNote ? `${rows[lastIdx].productionNote} | FO: Fade Out` : 'FO: Fade Out',
        };
      }

      return {
        ...prev,
        contentRows: rows,
      };
    });

    // Re-analyze after short delay
    setTimeout(() => {
      handleAnalyzeScript();
    }, 250);
  };

  // Auto-Fill Template handler
  const handleAutoFill = (typeKey: 'spot_30s' | 'travel_documentary' | 'storytelling_podcast') => {
    const template = AUTO_FILL_TEMPLATES[typeKey];
    if (template) {
      setScriptData(JSON.parse(JSON.stringify(template)));
      setIsTemplateMenuOpen(false);
      setAiAnalysis(null);
      studioAudio.playJingle();
    }
  };

  // Heading Handlers
  const updateHeading = (field: keyof StructuredScript['heading'], value: string) => {
    setScriptData((prev) => ({
      ...prev,
      heading: { ...prev.heading, [field]: value },
    }));
  };

  // Crew Handlers
  const updateCrew = (field: keyof StructuredScript['crew'], value: string) => {
    setScriptData((prev) => ({
      ...prev,
      crew: { ...prev.crew, [field]: value },
    }));
  };

  // Credit Handlers
  const updateCredit = (field: keyof StructuredScript['credit'], value: string) => {
    setScriptData((prev) => ({
      ...prev,
      credit: { ...prev.credit, [field]: value },
    }));
  };

  // Content Rows Handlers (3-Column Table)
  const updateRow = (id: string, field: keyof ScriptRow, value: string) => {
    setScriptData((prev) => ({
      ...prev,
      contentRows: prev.contentRows.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    }));
  };

  const addRow = () => {
    const newRow: ScriptRow = {
      id: `row-${Date.now()}`,
      cueTime: `00:${String((scriptData.contentRows.length + 1) * 8).padStart(2, '0')}`,
      audioDetail: '[DJ/VO]: "..."',
      productionNote: 'Ducking BGM -12dB / Fade Out',
    };
    setScriptData((prev) => ({
      ...prev,
      contentRows: [...prev.contentRows, newRow],
    }));
  };

  const deleteRow = (id: string) => {
    if (scriptData.contentRows.length <= 1) return;
    setScriptData((prev) => ({
      ...prev,
      contentRows: prev.contentRows.filter((r) => r.id !== id),
    }));
  };

  const moveRow = (index: number, direction: 'up' | 'down') => {
    const newRows = [...scriptData.contentRows];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newRows.length) return;
    const temp = newRows[index];
    newRows[index] = newRows[targetIndex];
    newRows[targetIndex] = temp;
    setScriptData((prev) => ({ ...prev, contentRows: newRows }));
  };

  const insertTagToRow = (rowId: string, tag: string) => {
    setScriptData((prev) => ({
      ...prev,
      contentRows: prev.contentRows.map((r) =>
        r.id === rowId ? { ...r, audioDetail: `${r.audioDetail}\n${tag}` } : r
      ),
    }));
  };

  const copyScriptText = () => {
    const text = formatScriptToText(scriptData);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export to JSON file & Data URL
  const exportToJson = () => {
    const exportPayload = {
      application: 'SoundCraft Studio',
      exportDate: new Date().toISOString(),
      script: scriptData,
      rundown: rundown,
      simulatedAudienceStats: {
        activeListeners: 14820,
        dailyPeak: 28450,
        avgDurationMinutes: 24.6,
        sentimentScore: '94.8%',
      },
    };

    const jsonString = JSON.stringify(exportPayload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soundcraft-script-${scriptData.heading.productionCode || 'data'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy Data URL / JSON Link
  const copyJsonDataLink = () => {
    const exportPayload = {
      application: 'SoundCraft Studio',
      exportDate: new Date().toISOString(),
      script: scriptData,
      rundown: rundown,
    };
    const jsonString = JSON.stringify(exportPayload, null, 2);
    const dataUrl = `data:application/json;charset=utf-8,${encodeURIComponent(jsonString)}`;
    navigator.clipboard.writeText(dataUrl);
    setCopiedJsonLink(true);
    setTimeout(() => setCopiedJsonLink(false), 2000);
  };

  // Print to PDF
  const exportToPdfPrint = () => {
    window.print();
  };

  // Teleprompter Autoscroll & Stopwatch
  useEffect(() => {
    let scrollInterval: any = null;
    let timerInterval: any = null;

    if (isTeleprompterOpen && isScrolling) {
      scrollInterval = setInterval(() => {
        if (prompterContentRef.current) {
          prompterContentRef.current.scrollTop += scrollSpeed * 1.5;
        }
      }, 50);

      timerInterval = setInterval(() => {
        setElapsedTimer((t) => t + 1);
      }, 1000);
    }

    return () => {
      clearInterval(scrollInterval);
      clearInterval(timerInterval);
    };
  }, [isTeleprompterOpen, isScrolling, scrollSpeed]);

  const startPrompterWithCountdown = () => {
    studioAudio.playCountdownTone(false);
    setTimeout(() => studioAudio.playCountdownTone(false), 400);
    setTimeout(() => {
      studioAudio.playCountdownTone(true);
      setIsScrolling(true);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              MODULE 2
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-['Chakra_Petch',sans-serif] text-white flex items-center gap-2">
              <FileEdit className="w-6 h-6 text-orange-400" />
              ห้องปฏิบัติการเขียนบทและสร้าง Spot (Interactive Script Editor)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            โปรแกรมแก้ไขบทวิทยุมาตรฐาน 4 ส่วน (ส่วนหัว, ผู้ร่วมงาน, ตารางบท 3 ช่อง, ส่วนปิด) พร้อมผู้ช่วย AI Radio Assistant
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* AI Radio Assistant Button */}
          <button
            onClick={handleAnalyzeScript}
            disabled={isAnalyzing}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg cursor-pointer ${
              isAnalyzing
                ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-700'
                : 'bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 hover:from-orange-600 hover:to-amber-600 text-zinc-950 shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            <Bot className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'AI กำลังวิเคราะห์บท 3 ด้าน...' : 'วิเคราะห์บทวิทยุ (Analyze Script)'}</span>
            <span className="w-2 h-2 rounded-full bg-zinc-950/40 animate-pulse hidden sm:inline-block" />
          </button>

          {/* Auto-Fill Template Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsTemplateMenuOpen(!isTemplateMenuOpen)}
              className="px-3.5 py-2.5 rounded-xl bg-[#171b26] hover:bg-zinc-800 text-orange-400 border border-orange-500/30 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Auto-Fill Template</span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
            </button>

            {isTemplateMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#161a24] border border-orange-500/30 p-2 shadow-2xl z-30 space-y-1 animate-fadeIn">
                <div className="text-[10px] font-mono font-bold text-orange-400 px-2 py-1 uppercase border-b border-zinc-800">
                  เลือกแม่แบบบทอัตโนมัติ (3 ประเภท)
                </div>
                <button
                  onClick={() => handleAutoFill('spot_30s')}
                  className="w-full text-left p-2.5 rounded-lg text-xs hover:bg-zinc-800 text-zinc-200 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                  <div>
                    <p className="font-semibold text-white">1) บทสปอตรณรงค์สังคม (30 วินาที)</p>
                    <p className="text-[10px] text-zinc-400">สูตร AIDA ง่วงไม่ขับ พักก่อนสาย</p>
                  </div>
                </button>
                <button
                  onClick={() => handleAutoFill('travel_documentary')}
                  className="w-full text-left p-2.5 rounded-lg text-xs hover:bg-zinc-800 text-zinc-200 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shrink-0" />
                  <div>
                    <p className="font-semibold text-white">2) บทรายการสารคดีท่องเที่ยว</p>
                    <p className="text-[10px] text-zinc-400">วิถีอัมพวา + Nat Sound ริมคลอง</p>
                  </div>
                </button>
                <button
                  onClick={() => handleAutoFill('storytelling_podcast')}
                  className="w-full text-left p-2.5 rounded-lg text-xs hover:bg-zinc-800 text-zinc-200 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <div>
                    <p className="font-semibold text-white">3) บทรายการพ็อดแคสต์เล่าเรื่อง</p>
                    <p className="text-[10px] text-zinc-400">Mindset Booster + Cold Open</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Export to PDF/JSON Suite Button */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-zinc-800 to-[#1b202e] hover:from-zinc-700 hover:to-[#242b3d] text-zinc-100 border border-zinc-700 hover:border-orange-500/50 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
            title="ส่งออกบทวิทยุ ผังรายการ และสถิติเป็น PDF/JSON"
          >
            <Download className="w-3.5 h-3.5 text-orange-400" />
            <span>Export to PDF/JSON</span>
            <span className="text-[10px] font-mono bg-orange-500/20 text-orange-400 px-1.5 py-0.2 rounded">
              Suite
            </span>
          </button>

          {/* Teleprompter Button */}
          <button
            onClick={() => {
              setIsTeleprompterOpen(true);
              setElapsedTimer(0);
              setIsScrolling(false);
            }}
            className="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5 text-orange-400" />
            <span>Teleprompter</span>
          </button>
        </div>
      </div>

      {/* AI Analyzing Scanner Banner */}
      {isAnalyzing && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-red-500/10 border border-orange-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-2">
                <span>AI Radio Assistant กำลังสแกนข้อมูลบท 3 ด้านหลัก...</span>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
              </p>
              <p className="text-[11px] text-zinc-400">
                1) ตรวจสอบจำนวนคำและความยาวรายการ • 2) สแกนคำสั่งเทคนิคเสียง FI/FO/FU/Voice/SFX • 3) คำนวณคะแนนความสมบูรณ์
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-orange-400">
            <span>AUDITING SCRIPT...</span>
          </div>
        </div>
      )}

      {/* AI Radio Assistant Feedback Box */}
      {aiAnalysis && (
        <div className="bg-[#10141f] border-2 border-orange-500/60 rounded-2xl p-5 space-y-4 shadow-2xl animate-fadeIn">
          {/* Header & Overall Dial */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-zinc-950 font-bold flex items-center justify-center text-lg shadow-md shadow-orange-500/30 shrink-0">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-['Chakra_Petch',sans-serif] font-bold text-base text-white">
                    AI Radio Assistant Feedback Box
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {aiAnalysis.verdict}
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  ระบบวิเคราะห์อัจฉริยะ 3 ด้าน: 1) จำนวนคำ & เวลา • 2) คำสั่งเทคนิคเสียง • 3) คะแนนความสมบูรณ์
                </p>
              </div>
            </div>

            {/* Overall Score Dial */}
            <div className="flex items-center gap-3 bg-[#171b26] px-4 py-2 rounded-xl border border-zinc-800 self-start sm:self-auto shadow-inner">
              <div className="text-right">
                <span className="text-[10px] text-zinc-400 font-mono block">คะแนนความสมบูรณ์</span>
                <span className="text-2xl font-black font-mono text-orange-400">
                  {aiAnalysis.readinessScore}
                </span>
                <span className="text-zinc-500 text-xs font-mono">/100</span>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-orange-500 flex items-center justify-center font-bold text-sm text-orange-400 bg-orange-500/10">
                {aiAnalysis.readinessScore >= 80 ? '✓' : '!'}
              </div>
            </div>
          </div>

          {/* Feedback Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-2 text-xs font-mono">
            <button
              onClick={() => setFeedbackTab('overview')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                feedbackTab === 'overview'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-zinc-950 font-bold shadow-md'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>🌟 สรุป 3 ด้านหลัก (Overview)</span>
            </button>

            <button
              onClick={() => setFeedbackTab('timing')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                feedbackTab === 'timing'
                  ? 'bg-orange-500 text-zinc-950 font-bold'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>1) ความสอดคล้องของเวลา</span>
            </button>

            <button
              onClick={() => setFeedbackTab('techniques')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                feedbackTab === 'techniques'
                  ? 'bg-orange-500 text-zinc-950 font-bold'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>2) คำสั่งเทคนิคเสียง (FI/FO/FU)</span>
            </button>

            <button
              onClick={() => setFeedbackTab('score')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                feedbackTab === 'score'
                  ? 'bg-orange-500 text-zinc-950 font-bold'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>3) คะแนน & คำแนะนำ</span>
            </button>
          </div>

          {/* TAB: OVERVIEW (3-in-1 Comprehensive Layout) */}
          {feedbackTab === 'overview' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                {/* 1. Time & Word Count Card */}
                <div className="p-3.5 rounded-xl bg-[#151924] border border-orange-500/25 space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-orange-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        1) ความสอดคล้องเวลา
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        aiAnalysis.timeAnalysis.isWithinLimit
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {aiAnalysis.timeAnalysis.isWithinLimit ? '✓ ผ่านเกณฑ์' : '▲ เกินเป้าหมาย'}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        <span className="text-zinc-400 text-[11px] block">เวลาพูดประมาณการ</span>
                        <span className="text-xl font-black font-mono text-orange-400">
                          {aiAnalysis.timeAnalysis.estimatedSeconds}s
                        </span>
                        <span className="text-zinc-500 text-[10px] font-mono"> / เป้าหมาย {aiAnalysis.timeAnalysis.targetSeconds}s</span>
                      </div>
                      <div className="text-right">
                        <span className="text-zinc-400 text-[11px] block">จำนวนคำรวม</span>
                        <span className="text-base font-bold font-mono text-zinc-200">
                          {aiAnalysis.timeAnalysis.wordCount} คำ
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed pt-1 border-t border-zinc-800">
                      {aiAnalysis.timeAnalysis.timingComment}
                    </p>
                  </div>
                  <button
                    onClick={() => setFeedbackTab('timing')}
                    className="text-[11px] text-orange-400 hover:text-orange-300 flex items-center gap-1 font-semibold pt-1"
                  >
                    <span>ดูรายละเอียดจังหวะเวลา</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* 2. Sound Techniques Card */}
                <div className="p-3.5 rounded-xl bg-[#151924] border border-amber-500/25 space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400 flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5" />
                        2) คำสั่งเทคนิคเสียง
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">5 เทคนิคหลัก</span>
                    </div>

                    <div className="grid grid-cols-5 gap-1 font-mono text-center pt-1 text-[10px]">
                      <div className={`p-1.5 rounded ${aiAnalysis.soundTechniques.hasFI ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-zinc-900 text-zinc-500'}`}>
                        <span className="font-bold block">FI</span>
                        <span>{aiAnalysis.soundTechniques.hasFI ? '✓' : '✕'}</span>
                      </div>
                      <div className={`p-1.5 rounded ${aiAnalysis.soundTechniques.hasFO ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-zinc-900 text-zinc-500'}`}>
                        <span className="font-bold block">FO</span>
                        <span>{aiAnalysis.soundTechniques.hasFO ? '✓' : '✕'}</span>
                      </div>
                      <div className={`p-1.5 rounded ${aiAnalysis.soundTechniques.hasFU ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-zinc-900 text-zinc-500'}`}>
                        <span className="font-bold block">FU</span>
                        <span>{aiAnalysis.soundTechniques.hasFU ? '✓' : '✕'}</span>
                      </div>
                      <div className={`p-1.5 rounded ${aiAnalysis.soundTechniques.hasSFX ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-zinc-900 text-zinc-500'}`}>
                        <span className="font-bold block">SFX</span>
                        <span>{aiAnalysis.soundTechniques.hasSFX ? '✓' : '✕'}</span>
                      </div>
                      <div className={`p-1.5 rounded ${aiAnalysis.soundTechniques.hasVoice ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-zinc-900 text-zinc-500'}`}>
                        <span className="font-bold block">VO</span>
                        <span>{aiAnalysis.soundTechniques.hasVoice ? '✓' : '✕'}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-300 leading-relaxed pt-1 border-t border-zinc-800">
                      {aiAnalysis.soundTechniques.techniqueFeedback}
                    </p>
                  </div>

                  {(!aiAnalysis.soundTechniques.hasFI || !aiAnalysis.soundTechniques.hasFO || !aiAnalysis.soundTechniques.hasFU) ? (
                    <button
                      onClick={handleAutoFixTechniques}
                      className="w-full py-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500 text-orange-300 hover:text-zinc-950 font-bold text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer border border-orange-500/30"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>+ เติมคำสั่งเทคนิคที่ขาดให้อัตโนมัติ</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setFeedbackTab('techniques')}
                      className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold pt-1"
                    >
                      <span>ดูข้อแนะนำภาษาเพื่อการฟัง</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* 3. Completeness Score Card */}
                <div className="p-3.5 rounded-xl bg-[#151924] border border-cyan-500/25 space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" />
                        3) คะแนนความสมบูรณ์
                      </span>
                      <span className="text-[10px] font-mono text-cyan-300 font-bold">
                        {aiAnalysis.readinessScore}%
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-1 text-[11px] font-mono">
                      <div className="flex justify-between text-zinc-400">
                        <span>โครงสร้าง 4 ส่วน</span>
                        <span className="text-zinc-200">{aiAnalysis.scoreBreakdown.structure}/25</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>ความสอดคล้องเวลา</span>
                        <span className="text-orange-400">{aiAnalysis.scoreBreakdown.timing}/30</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>คำสั่งเทคนิคเสียง</span>
                        <span className="text-amber-400">{aiAnalysis.scoreBreakdown.soundTechniques}/25</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>ภาษาเพื่อการฟัง</span>
                        <span className="text-emerald-400">{aiAnalysis.scoreBreakdown.spokenLanguage}/20</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-zinc-800">
                    <button
                      onClick={() => setIsExportModalOpen(true)}
                      className="flex-1 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-zinc-950 font-bold text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer border border-cyan-500/30"
                    >
                      <Download className="w-3 h-3" />
                      <span>Export รายงาน PDF/JSON</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 1 Content: Timing Analysis */}
          {feedbackTab === 'timing' && (
            <div className="space-y-3 text-xs animate-fadeIn">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-[#171b26] p-3 rounded-xl border border-zinc-800">
                  <span className="text-zinc-500 font-mono text-[11px]">จำนวนคำรวม</span>
                  <p className="text-base font-bold font-mono text-zinc-100 mt-0.5">
                    {aiAnalysis.timeAnalysis.wordCount} คำ
                  </p>
                </div>
                <div className="bg-[#171b26] p-3 rounded-xl border border-zinc-800">
                  <span className="text-zinc-500 font-mono text-[11px]">เวลาพูดประมาณการ</span>
                  <p className="text-base font-bold font-mono text-orange-400 mt-0.5">
                    {aiAnalysis.timeAnalysis.estimatedSeconds} วินาที
                  </p>
                </div>
                <div className="bg-[#171b26] p-3 rounded-xl border border-zinc-800">
                  <span className="text-zinc-500 font-mono text-[11px]">เวลาเป้าหมาย</span>
                  <p className="text-base font-bold font-mono text-zinc-100 mt-0.5">
                    {aiAnalysis.timeAnalysis.targetSeconds} วินาที
                  </p>
                </div>
                <div className="bg-[#171b26] p-3 rounded-xl border border-zinc-800">
                  <span className="text-zinc-500 font-mono text-[11px]">เกณฑ์ความยาว</span>
                  <p className={`text-xs font-bold font-mono mt-1 ${
                    aiAnalysis.timeAnalysis.isWithinLimit ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {aiAnalysis.timeAnalysis.isWithinLimit ? '✓ ไม่เกินเกณฑ์เป้าหมาย' : '▲ เกินเวลาเป้าหมาย'}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#151924] border border-zinc-800 leading-relaxed text-zinc-300 space-y-2">
                <p className="font-semibold text-orange-400">บทวิเคราะห์จังหวะและเวลาในการออกอากาศ:</p>
                <p>{aiAnalysis.timeAnalysis.timingComment}</p>
                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
                  <span>💡 <strong>สูตรความเร็วมาตรฐาน:</strong> 3.6 - 4.0 พยางค์ต่อวินาที (สปอต 30 วิ ควรมีประมาณ 110-120 พยางค์)</span>
                  <span className="font-mono text-orange-400">Pacing: Optimum</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2 Content: Sound Techniques (FI, FO, FU, Voice, SFX) */}
          {feedbackTab === 'techniques' && (
            <div className="space-y-3 text-xs animate-fadeIn">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-center">
                <div className={`p-2.5 rounded-xl border ${
                  aiAnalysis.soundTechniques.hasFI ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                }`}>
                  <span className="block font-bold">FI (Fade In)</span>
                  <span className="text-[10px]">{aiAnalysis.soundTechniques.hasFI ? '✓ ตรวจพบ' : '✕ ไม่พบ'}</span>
                </div>

                <div className={`p-2.5 rounded-xl border ${
                  aiAnalysis.soundTechniques.hasFO ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                }`}>
                  <span className="block font-bold">FO (Fade Out)</span>
                  <span className="text-[10px]">{aiAnalysis.soundTechniques.hasFO ? '✓ ตรวจพบ' : '✕ ไม่พบ'}</span>
                </div>

                <div className={`p-2.5 rounded-xl border ${
                  aiAnalysis.soundTechniques.hasFU ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                }`}>
                  <span className="block font-bold">FU / Ducking</span>
                  <span className="text-[10px]">{aiAnalysis.soundTechniques.hasFU ? '✓ ตรวจพบ' : '✕ ไม่พบ'}</span>
                </div>

                <div className={`p-2.5 rounded-xl border ${
                  aiAnalysis.soundTechniques.hasSFX ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                }`}>
                  <span className="block font-bold">SFX (Effect)</span>
                  <span className="text-[10px]">{aiAnalysis.soundTechniques.hasSFX ? '✓ ตรวจพบ' : '✕ ไม่พบ'}</span>
                </div>

                <div className={`p-2.5 rounded-xl border ${
                  aiAnalysis.soundTechniques.hasVoice ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                }`}>
                  <span className="block font-bold">Voice / VO</span>
                  <span className="text-[10px]">{aiAnalysis.soundTechniques.hasVoice ? '✓ ตรวจพบ' : '✕ ไม่พบ'}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#151924] border border-zinc-800 space-y-2 text-zinc-300">
                <p>
                  <strong className="text-orange-400">การระบุคำสั่งเทคนิค:</strong> {aiAnalysis.soundTechniques.techniqueFeedback}
                </p>
                <p>
                  <strong className="text-cyan-400">หลักภาษาเพื่อการฟัง (Spoken Language):</strong> {aiAnalysis.soundTechniques.spokenLanguageTips}
                </p>

                {(!aiAnalysis.soundTechniques.hasFI || !aiAnalysis.soundTechniques.hasFO || !aiAnalysis.soundTechniques.hasFU) && (
                  <div className="pt-2">
                    <button
                      onClick={handleAutoFixTechniques}
                      className="px-3.5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>+ เติมคำสั่งเทคนิคเสียงที่ขาดลงในตารางบทอัตโนมัติ (Auto-Fix)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3 Content: Score Breakdown & Recommendations */}
          {feedbackTab === 'score' && (
            <div className="space-y-3 text-xs animate-fadeIn">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
                <div className="bg-[#171b26] p-2.5 rounded-xl border border-zinc-800">
                  <span className="text-zinc-500 text-[10px]">โครงสร้างบท 4 ส่วน</span>
                  <p className="text-sm font-bold text-white">{aiAnalysis.scoreBreakdown.structure}/25</p>
                </div>
                <div className="bg-[#171b26] p-2.5 rounded-xl border border-zinc-800">
                  <span className="text-zinc-500 text-[10px]">ความสอดคล้องเวลา</span>
                  <p className="text-sm font-bold text-orange-400">{aiAnalysis.scoreBreakdown.timing}/30</p>
                </div>
                <div className="bg-[#171b26] p-2.5 rounded-xl border border-zinc-800">
                  <span className="text-zinc-500 text-[10px]">คำสั่งเทคนิคเสียง</span>
                  <p className="text-sm font-bold text-amber-400">{aiAnalysis.scoreBreakdown.soundTechniques}/25</p>
                </div>
                <div className="bg-[#171b26] p-2.5 rounded-xl border border-zinc-800">
                  <span className="text-zinc-500 text-[10px]">ภาษาเพื่อการฟัง</span>
                  <p className="text-sm font-bold text-emerald-400">{aiAnalysis.scoreBreakdown.spokenLanguage}/20</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#151924] border border-zinc-800 space-y-1.5 text-zinc-300">
                <p className="font-semibold text-orange-400">ข้อเสนอแนะในการปรับปรุงเพื่อออกอากาศจริง:</p>
                <ul className="space-y-1">
                  {aiAnalysis.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-orange-400 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Export to PDF / JSON Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#12151d] border-2 border-orange-500/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-[#161a24]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-['Chakra_Petch',sans-serif] font-bold text-base text-white">
                    Export to PDF / JSON Suite
                  </h3>
                  <p className="text-xs text-zinc-400">
                    ส่งออกข้อมูลบทวิทยุ ผังรายการ OnAir Table และสถิติผู้ฟังไปใช้งานต่อ
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsExportModalOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-2 px-5 pt-3 border-b border-zinc-800 bg-[#0f121a] text-xs font-mono">
              <button
                onClick={() => setExportModalTab('options')}
                className={`px-3 py-1.5 rounded-t-lg transition-colors cursor-pointer ${
                  exportModalTab === 'options'
                    ? 'bg-[#151924] text-orange-400 font-bold border-t-2 border-orange-500'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                ตัวเลือกการส่งออก (Export Formats)
              </button>
              <button
                onClick={() => setExportModalTab('schema')}
                className={`px-3 py-1.5 rounded-t-lg transition-colors cursor-pointer ${
                  exportModalTab === 'schema'
                    ? 'bg-[#151924] text-orange-400 font-bold border-t-2 border-orange-500'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                ดูโครงสร้าง JSON & ลิงก์ (Schema & Data URI)
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {exportModalTab === 'options' ? (
                <div className="space-y-3.5">
                  {/* Option 1: PDF Export */}
                  <div className="p-4 rounded-xl bg-[#171b26] border border-zinc-800 hover:border-orange-500/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Printer className="w-4 h-4 text-orange-400" />
                        <h4 className="font-bold text-sm text-white">1) Export to PDF (พิมพ์บทวิทยุมาตรฐาน)</h4>
                      </div>
                      <p className="text-xs text-zinc-400">
                        จัดหน้าเป็นเอกสารบรอดคาสต์ชีต 4 ส่วน พร้อมผังรายการและผลคะแนน AI สะอาด คมชัด สั่งเซฟเป็น PDF ได้ทันที
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsExportModalOpen(false);
                        exportToPdfPrint();
                      }}
                      className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-md shadow-orange-500/20"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>พิมพ์ / เซฟเป็น PDF</span>
                    </button>
                  </div>

                  {/* Option 2: JSON Download */}
                  <div className="p-4 rounded-xl bg-[#171b26] border border-zinc-800 hover:border-cyan-500/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-cyan-400" />
                        <h4 className="font-bold text-sm text-white">2) Export to JSON (ดาวน์โหลดชุดข้อมูล)</h4>
                      </div>
                      <p className="text-xs text-zinc-400">
                        รวมข้อมูลบทวิทยุ, ตารางผังออกอากาศ {rundown.length} ช่วง, สถิติผู้ฟังจำลอง และผลวิเคราะห์ AI เป็นไฟล์ .json
                      </p>
                    </div>

                    <button
                      onClick={exportToJson}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-md shadow-cyan-500/20"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ดาวน์โหลด JSON</span>
                    </button>
                  </div>

                  {/* Option 3: Copy Data URL Link */}
                  <div className="p-4 rounded-xl bg-[#171b26] border border-zinc-800 hover:border-amber-500/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-amber-400" />
                        <h4 className="font-bold text-sm text-white">3) นำลิงก์โครงสร้างข้อมูลไปใช้งานต่อ (Data Link)</h4>
                      </div>
                      <p className="text-xs text-zinc-400">
                        สร้าง Data URI รูปแบบ <code>data:application/json;...</code> สำหรับแชร์หรือนำไปประมวลผลต่อกับระบบอื่น
                      </p>
                    </div>

                    <button
                      onClick={copyJsonDataLink}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-md shadow-amber-500/20"
                    >
                      {copiedJsonLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedJsonLink ? 'คัดลอกลิงก์แล้ว' : 'คัดลอก Data Link'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400 font-mono">
                      โครงสร้าง JSON ชุดข้อมูลบรอดคาสต์สตูดิโอ
                    </span>
                    <button
                      onClick={() => {
                        const payload = {
                          application: 'SoundCraft Studio',
                          exportDate: new Date().toISOString(),
                          script: scriptData,
                          rundown: rundown,
                          simulatedAudienceStats: {
                            activeListeners: 14820,
                            dailyPeak: 28450,
                            avgDurationMinutes: 24.6,
                            sentimentScore: '94.8%',
                          },
                          aiAnalysisResult: aiAnalysis,
                        };
                        navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
                        setCopiedRawJson(true);
                        setTimeout(() => setCopiedRawJson(false), 2000);
                      }}
                      className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedRawJson ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedRawJson ? 'คัดลอกแล้ว' : 'คัดลอก JSON'}</span>
                    </button>
                  </div>

                  <pre className="bg-[#0b0d13] p-3.5 rounded-xl border border-zinc-800 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-72 leading-relaxed">
                    {JSON.stringify(
                      {
                        application: 'SoundCraft Studio',
                        exportDate: new Date().toISOString(),
                        script: scriptData,
                        rundownCount: rundown.length,
                        audienceStats: {
                          activeListeners: 14820,
                          dailyPeak: 28450,
                          avgDurationMinutes: 24.6,
                        },
                        aiReadinessScore: aiAnalysis ? `${aiAnalysis.readinessScore}/100` : 'N/A',
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-800 bg-[#161a24] flex items-center justify-end">
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: ส่วนหัว (Heading) */}
      <div className="bg-[#12151d] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-orange-500/20 text-orange-400 font-mono font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="font-bold text-sm sm:text-base text-white">
              ส่วนหัวของบทรายการ (Script Heading)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
            {scriptData.typeName}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 text-xs">
          <div className="md:col-span-8">
            <label className="block text-zinc-400 font-medium mb-1">ชื่อเรื่อง / ชื่อตอน (Program Title)</label>
            <input
              type="text"
              value={scriptData.heading.title}
              onChange={(e) => updateHeading('title', e.target.value)}
              className="w-full bg-[#171b26] border border-zinc-800 rounded-lg p-2.5 text-zinc-100 font-semibold focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-zinc-400 font-medium mb-1">ความยาวเป้าหมาย (Duration)</label>
            <input
              type="text"
              value={scriptData.heading.targetDuration}
              onChange={(e) => updateHeading('targetDuration', e.target.value)}
              className="w-full bg-[#171b26] border border-zinc-800 rounded-lg p-2.5 text-orange-400 font-mono font-bold focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-zinc-400 font-medium mb-1">วันที่ผลิต (Production Date)</label>
            <input
              type="date"
              value={scriptData.heading.productionDate}
              onChange={(e) => updateHeading('productionDate', e.target.value)}
              className="w-full bg-[#171b26] border border-zinc-800 rounded-lg p-2.5 text-zinc-200 font-mono focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-zinc-400 font-medium mb-1">สถานี / ช่องทางออกอากาศ (Platform)</label>
            <input
              type="text"
              value={scriptData.heading.stationOrPlatform}
              onChange={(e) => updateHeading('stationOrPlatform', e.target.value)}
              className="w-full bg-[#171b26] border border-zinc-800 rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-zinc-400 font-medium mb-1">รหัสชิ้นงาน (Production Code)</label>
            <input
              type="text"
              value={scriptData.heading.productionCode}
              onChange={(e) => updateHeading('productionCode', e.target.value)}
              className="w-full bg-[#171b26] border border-zinc-800 rounded-lg p-2.5 text-zinc-200 font-mono focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: ผู้ร่วมงาน (Crew) */}
      <div className="bg-[#12151d] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 font-mono font-bold text-xs flex items-center justify-center">
            2
          </span>
          <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-1.5">
            <Users className="w-4 h-4 text-amber-400" />
            ผู้ร่วมงานและฝ่ายผลิต (Production Crew)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          <div>
            <label className="block text-zinc-400 font-medium mb-1">ผู้เขียนบท (Scriptwriter)</label>
            <input
              type="text"
              value={scriptData.crew.scriptwriter}
              onChange={(e) => updateCrew('scriptwriter', e.target.value)}
              className="w-full bg-[#171b26] border border-zinc-800 rounded-lg p-2 text-zinc-100 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-medium mb-1">ผู้กำกับเสียง (Producer)</label>
            <input
              type="text"
              value={scriptData.crew.producer}
              onChange={(e) => updateCrew('producer', e.target.value)}
              className="w-full bg-[#171b26] border border-zinc-800 rounded-lg p-2 text-zinc-100 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-medium mb-1">ผู้ให้เสียง / ดีเจ (Voice Talent/Host)</label>
            <input
              type="text"
              value={scriptData.crew.voiceTalent}
              onChange={(e) => updateCrew('voiceTalent', e.target.value)}
              className="w-full bg-[#171b26] border border-zinc-800 rounded-lg p-2 text-zinc-100 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-medium mb-1">ซาวด์เอนจิเนียร์ (Sound Engineer)</label>
            <input
              type="text"
              value={scriptData.crew.soundEngineer}
              onChange={(e) => updateCrew('soundEngineer', e.target.value)}
              className="w-full bg-[#171b26] border border-zinc-800 rounded-lg p-2 text-zinc-100 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: เนื้อหา - ตารางบท 3 ช่องมาตรฐานบรอดคาสต์ (Content) */}
      <div className="bg-[#12151d] border-2 border-orange-500/30 rounded-2xl p-5 space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center">
              3
            </span>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                ตารางบท 3 ช่องมาตรฐานบรอดคาสต์ (3-Column Content Table)
              </h3>
              <p className="text-[11px] text-zinc-400">
                ช่อง 1: เวลา/คิว • ช่อง 2: รายละเอียดเสียง Voice/SFX/BGM • ช่อง 3: หมายเหตุ Fade In/Fade Out
              </p>
            </div>
          </div>

          <button
            onClick={addRow}
            className="px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-md shadow-orange-500/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>เพิ่มแถวคิวบท (+ Add Cue Row)</span>
          </button>
        </div>

        {/* The 3-Column Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#171b26] text-orange-400 font-mono uppercase border-b border-zinc-800">
              <tr>
                <th className="p-3 w-44 font-bold">1. เวลา / คิว (Time / Cue)</th>
                <th className="p-3 font-bold">2. รายละเอียดเสียง (Voice / SFX / BGM)</th>
                <th className="p-3 w-64 font-bold">3. หมายเหตุ (Fade In/Out)</th>
                <th className="p-3 w-24 text-center font-bold">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 bg-[#0f121a]">
              {scriptData.contentRows.map((row, idx) => (
                <tr key={row.id} className="hover:bg-zinc-800/30 transition-colors">
                  {/* Column 1: Time / Cue */}
                  <td className="p-2.5 align-top">
                    <input
                      type="text"
                      value={row.cueTime}
                      onChange={(e) => updateRow(row.id, 'cueTime', e.target.value)}
                      placeholder="เช่น 00:00 - 00:05"
                      className="w-full bg-[#161a24] border border-zinc-800 rounded p-2 text-xs font-mono font-semibold text-orange-400 focus:outline-none focus:border-orange-500"
                    />
                    <div className="mt-1 text-[10px] text-zinc-500 font-mono text-center">
                      CUE #{idx + 1}
                    </div>
                  </td>

                  {/* Column 2: Voice / SFX / BGM */}
                  <td className="p-2.5 align-top space-y-1.5">
                    <textarea
                      rows={3}
                      value={row.audioDetail}
                      onChange={(e) => updateRow(row.id, 'audioDetail', e.target.value)}
                      placeholder="ใส่บทพูดผู้จัด หรือแท็ก [SFX: ...] [BGM: ...]"
                      className="w-full bg-[#161a24] border border-zinc-800 rounded p-2.5 text-xs text-zinc-100 font-['Prompt',sans-serif] leading-relaxed focus:outline-none focus:border-orange-500 resize-y"
                    />

                    {/* Quick tag inserters */}
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      <button
                        onClick={() => insertTagToRow(row.id, '[SFX: เสียงเอฟเฟกต์]')}
                        className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 hover:text-orange-400 border border-zinc-700"
                      >
                        + [SFX]
                      </button>
                      <button
                        onClick={() => insertTagToRow(row.id, '[BGM: ดนตรีคลอเบาๆ]')}
                        className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 hover:text-orange-400 border border-zinc-700"
                      >
                        + [BGM]
                      </button>
                      <button
                        onClick={() => insertTagToRow(row.id, '[DJ/HOST]: "..."')}
                        className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 hover:text-orange-400 border border-zinc-700"
                      >
                        + [HOST]
                      </button>
                      <button
                        onClick={() => insertTagToRow(row.id, '[SFX: SoundCraft Stinger]')}
                        className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 hover:text-orange-400 border border-zinc-700"
                      >
                        + [STATION ID]
                      </button>
                    </div>
                  </td>

                  {/* Column 3: Production Note (Fade In/Fade Out) */}
                  <td className="p-2.5 align-top space-y-1.5">
                    <input
                      type="text"
                      value={row.productionNote}
                      onChange={(e) => updateRow(row.id, 'productionNote', e.target.value)}
                      placeholder="เช่น Fade In, Ducking -12dB"
                      className="w-full bg-[#161a24] border border-zinc-800 rounded p-2 text-xs text-zinc-300 font-mono focus:outline-none focus:border-orange-500"
                    />
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      <button
                        onClick={() => updateRow(row.id, 'productionNote', 'FI: Fade In (3s)')}
                        className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 hover:text-white"
                      >
                        FI (Fade In)
                      </button>
                      <button
                        onClick={() => updateRow(row.id, 'productionNote', 'FO: Fade Out')}
                        className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 hover:text-white"
                      >
                        FO (Fade Out)
                      </button>
                      <button
                        onClick={() => updateRow(row.id, 'productionNote', 'FU: Ducking -12dB')}
                        className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 hover:text-white"
                      >
                        FU (Ducking)
                      </button>
                      <button
                        onClick={() => updateRow(row.id, 'productionNote', 'Swell & Cut')}
                        className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 hover:text-white"
                      >
                        Swell
                      </button>
                    </div>
                  </td>

                  {/* Actions (Move & Delete) */}
                  <td className="p-2.5 align-top text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        disabled={idx === 0}
                        onClick={() => moveRow(idx, 'up')}
                        className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 disabled:opacity-30 cursor-pointer"
                        title="เลื่อนแถวขึ้น"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={idx === scriptData.contentRows.length - 1}
                        onClick={() => moveRow(idx, 'down')}
                        className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 disabled:opacity-30 cursor-pointer"
                        title="เลื่อนแถวลง"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteRow(row.id)}
                        className="p-1 rounded bg-zinc-800 hover:bg-red-600 hover:text-white text-zinc-500 cursor-pointer"
                        title="ลบแถวคิวนี้"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4: ส่วนปิด (Credit) */}
      <div className="bg-[#12151d] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <span className="w-6 h-6 rounded-md bg-purple-500/20 text-purple-400 font-mono font-bold text-xs flex items-center justify-center">
            4
          </span>
          <h3 className="font-bold text-sm sm:text-base text-white">
            ส่วนปิดของบทรายการ (Script Credit & Sign-Off)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          <div>
            <label className="block text-zinc-400 font-medium mb-1">แหล่งอ้างอิงข้อมูล (Reference Source)</label>
            <input
              type="text"
              value={scriptData.credit.referenceSource}
              onChange={(e) => updateCredit('referenceSource', e.target.value)}
              className="w-full bg-[#171b26] border border-zinc-800 rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-medium mb-1">ผู้สนับสนุน / ลิขสิทธิ์ (Sponsorship / Copyright)</label>
            <input
              type="text"
              value={scriptData.credit.sponsorOrCopyright}
              onChange={(e) => updateCredit('sponsorOrCopyright', e.target.value)}
              className="w-full bg-[#171b26] border border-zinc-800 rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-medium mb-1">สโลแกนส่งท้าย (Sign-Off Line)</label>
            <input
              type="text"
              value={scriptData.credit.signOffSlogan}
              onChange={(e) => updateCredit('signOffSlogan', e.target.value)}
              className="w-full bg-[#171b26] border border-zinc-800 rounded-lg p-2.5 text-orange-400 font-semibold focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Full-Screen Studio Teleprompter Modal */}
      {isTeleprompterOpen && (
        <div className="fixed inset-0 z-50 bg-[#090b10]/95 backdrop-blur-md flex flex-col p-4 sm:p-8 animate-fadeIn">
          {/* Prompter Top Bar */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold bg-red-600 text-white px-2.5 py-1 rounded animate-pulse">
                STUDIO TELEPROMPTER ON-AIR
              </span>
              <span className="text-xs font-mono text-zinc-400">
                เวลา: <strong className="text-orange-400 text-base">{elapsedTimer}s</strong> | {scriptData.heading.targetDuration}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1 rounded-lg border border-zinc-800 text-xs">
                <span className="text-zinc-400">ความเร็ว:</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={scrollSpeed}
                  onChange={(e) => setScrollSpeed(parseInt(e.target.value, 10))}
                  className="w-20 accent-orange-500"
                />
              </div>

              <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1 rounded-lg border border-zinc-800 text-xs">
                <span className="text-zinc-400">ขนาด:</span>
                <button
                  onClick={() => setFontSize((s) => Math.max(16, s - 2))}
                  className="px-2 py-0.5 bg-zinc-800 rounded hover:bg-zinc-700"
                >
                  -
                </button>
                <span className="font-mono">{fontSize}px</span>
                <button
                  onClick={() => setFontSize((s) => Math.min(48, s + 2))}
                  className="px-2 py-0.5 bg-zinc-800 rounded hover:bg-zinc-700"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => {
                  if (!isScrolling) {
                    startPrompterWithCountdown();
                  } else {
                    setIsScrolling(false);
                  }
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isScrolling
                    ? 'bg-amber-500 text-zinc-950'
                    : 'bg-orange-500 text-zinc-950 shadow-md shadow-orange-500/20'
                }`}
              >
                {isScrolling ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                {isScrolling ? 'หยุดเลื่อน' : 'เริ่มอ่านนับถอยหลัง'}
              </button>

              <button
                onClick={() => {
                  setIsTeleprompterOpen(false);
                  setIsScrolling(false);
                }}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Prompter Eye-line Guide Marker */}
          <div className="relative flex-1 overflow-hidden border border-zinc-800/80 rounded-2xl bg-[#0d0f15] p-6 sm:p-12">
            <div className="absolute top-1/3 left-0 right-0 border-y border-orange-500/30 pointer-events-none z-10 flex items-center justify-between px-3">
              <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest bg-zinc-950/80 px-2 py-0.5 rounded">
                EYE LEVEL READ LINE
              </span>
              <span className="text-[10px] font-mono text-orange-400">● ON-MIC</span>
            </div>

            {/* Scrollable Text Body */}
            <div
              ref={prompterContentRef}
              className="h-full overflow-y-auto space-y-8 text-zinc-100 font-medium leading-loose select-none"
              style={{ fontSize: `${fontSize}px` }}
            >
              <div className="h-24" />
              <div className="text-center pb-4 border-b border-zinc-800">
                <h2 className="text-2xl font-bold text-orange-400">{scriptData.heading.title}</h2>
                <p className="text-sm text-zinc-400 mt-1">{scriptData.heading.targetDuration} • {scriptData.crew.voiceTalent}</p>
              </div>

              {scriptData.contentRows.map((row, idx) => (
                <div key={row.id} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-orange-400">
                    <span>CUE #{idx + 1} [{row.cueTime}]</span>
                    <span className="text-amber-400">เทคนิค: {row.productionNote}</span>
                  </div>
                  <div className="whitespace-pre-wrap text-zinc-100 font-['Prompt',sans-serif]">
                    {row.audioDetail}
                  </div>
                </div>
              ))}

              <div className="text-center pt-6 text-sm text-zinc-500 italic">
                {scriptData.credit.signOffSlogan}
              </div>
              <div className="h-64" />
            </div>
          </div>
        </div>
      )}

      {/* Printable Official Broadcast Sheet (Only visible when printing or exporting to PDF) */}
      <div className="hidden print:block bg-white text-black p-6 space-y-5 font-['Prompt',sans-serif]">
        {/* Print Header */}
        <div className="border-b-2 border-black pb-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-wider uppercase font-mono">
              SOUNDCRAFT STUDIO - BROADCAST PRODUCTION SHEET
            </h1>
            <p className="text-xs text-gray-700">
              เอกสารบทวิทยุและผังรายการมาตรฐานสำหรับการออกอากาศจริง (Broadcast Master Copy)
            </p>
          </div>
          <div className="text-right text-xs font-mono">
            <span className="font-bold block">รหัส: {scriptData.heading.productionCode || 'SC-ONAIR'}</span>
            <span>วันที่: {scriptData.heading.productionDate}</span>
          </div>
        </div>

        {/* 1. Heading & Crew Boxes */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="border border-gray-400 rounded p-3 space-y-1">
            <h4 className="font-bold border-b border-gray-300 pb-1 uppercase font-mono text-gray-900">
              1. ข้อมูลรายการ (Heading)
            </h4>
            <p><strong>ชื่อเรื่อง:</strong> {scriptData.heading.title}</p>
            <p><strong>ประเภท:</strong> {scriptData.typeName}</p>
            <p><strong>ความยาวเป้าหมาย:</strong> {scriptData.heading.targetDuration}</p>
            <p><strong>สถานี/ช่องทาง:</strong> {scriptData.heading.stationOrPlatform}</p>
          </div>

          <div className="border border-gray-400 rounded p-3 space-y-1">
            <h4 className="font-bold border-b border-gray-300 pb-1 uppercase font-mono text-gray-900">
              2. ผู้ร่วมงานฝ่ายผลิต (Crew)
            </h4>
            <p><strong>ผู้เขียนบท:</strong> {scriptData.crew.scriptwriter}</p>
            <p><strong>ผู้กำกับเสียง:</strong> {scriptData.crew.producer}</p>
            <p><strong>ผู้ให้เสียง / ดีเจ:</strong> {scriptData.crew.voiceTalent}</p>
            <p><strong>ซาวด์เอนจิเนียร์:</strong> {scriptData.crew.soundEngineer}</p>
          </div>
        </div>

        {/* 3. 3-Column Content Table */}
        <div className="space-y-1">
          <h4 className="font-bold text-xs uppercase font-mono text-gray-900">
            3. ตารางบท 3 ช่องมาตรฐานบรอดคาสต์ (3-Column Script Table)
          </h4>
          <table className="w-full text-xs border border-gray-400">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-400 font-mono text-left">
                <th className="p-2 border-r border-gray-400 w-36">1. เวลา / คิว (Time/Cue)</th>
                <th className="p-2 border-r border-gray-400">2. รายละเอียดเสียง (Voice / SFX / BGM)</th>
                <th className="p-2 w-52">3. หมายเหตุเทคนิค (FI/FO/FU)</th>
              </tr>
            </thead>
            <tbody>
              {scriptData.contentRows.map((row, idx) => (
                <tr key={row.id} className="border-b border-gray-300">
                  <td className="p-2 font-mono font-bold border-r border-gray-300 align-top">
                    CUE #{idx + 1} [{row.cueTime}]
                  </td>
                  <td className="p-2 whitespace-pre-wrap border-r border-gray-300 align-top">
                    {row.audioDetail}
                  </td>
                  <td className="p-2 font-mono text-gray-800 align-top">
                    {row.productionNote}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. Credit */}
        <div className="border border-gray-400 rounded p-3 text-xs space-y-1">
          <h4 className="font-bold border-b border-gray-300 pb-1 uppercase font-mono text-gray-900">
            4. ส่วนปิดของบทรายการ (Sign-Off & Credits)
          </h4>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <p><strong>แหล่งอ้างอิง:</strong> {scriptData.credit.referenceSource}</p>
            <p><strong>ลิขสิทธิ์/ผู้สนับสนุน:</strong> {scriptData.credit.sponsorOrCopyright}</p>
            <p><strong>สโลแกนส่งท้าย:</strong> <em>"{scriptData.credit.signOffSlogan}"</em></p>
          </div>
        </div>

        {/* 5. AI Assistant Evaluation Summary (If analyzed) */}
        {aiAnalysis && (
          <div className="border border-gray-400 rounded p-3 text-xs space-y-1.5 bg-gray-50">
            <div className="flex items-center justify-between border-b border-gray-300 pb-1">
              <span className="font-bold font-mono">ผลการประเมินโดย AI RADIO ASSISTANT: {aiAnalysis.verdict}</span>
              <span className="font-mono font-black text-sm">คะแนน: {aiAnalysis.readinessScore}/100</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <p><strong>เวลาประมาณการ:</strong> {aiAnalysis.timeAnalysis.estimatedSeconds}s (เป้าหมาย {aiAnalysis.timeAnalysis.targetSeconds}s)</p>
              <p><strong>จำนวนคำ:</strong> {aiAnalysis.timeAnalysis.wordCount} คำ</p>
              <p><strong>คำสั่งเทคนิค:</strong> FI ({aiAnalysis.soundTechniques.hasFI ? '✓' : '✕'}), FO ({aiAnalysis.soundTechniques.hasFO ? '✓' : '✕'}), FU ({aiAnalysis.soundTechniques.hasFU ? '✓' : '✕'})</p>
            </div>
            <p className="text-[11px] text-gray-700 italic">คำแนะนำ: {aiAnalysis.recommendations.join(' | ')}</p>
          </div>
        )}

        {/* 6. Rundown Excerpt */}
        {rundown && rundown.length > 0 && (
          <div className="space-y-1 pt-2">
            <h4 className="font-bold text-xs uppercase font-mono text-gray-900">
              5. ผังรายการออกอากาศประจำวัน (Station OnAir Rundown Table)
            </h4>
            <table className="w-full text-xs border border-gray-400">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-400 font-mono text-left">
                  <th className="p-1.5 border-r border-gray-400 w-12 text-center">คิว</th>
                  <th className="p-1.5 border-r border-gray-400 w-32">ช่วงเวลา</th>
                  <th className="p-1.5 border-r border-gray-400">ชื่อรายการ / เซกเมนต์</th>
                  <th className="p-1.5 border-r border-gray-400 w-36">ผู้ดำเนินรายการ</th>
                  <th className="p-1.5 w-24">หมวดหมู่</th>
                </tr>
              </thead>
              <tbody>
                {rundown.slice(0, 6).map((item, idx) => (
                  <tr key={item.id} className="border-b border-gray-300">
                    <td className="p-1.5 font-mono text-center border-r border-gray-300">{idx + 1}</td>
                    <td className="p-1.5 font-mono border-r border-gray-300">{item.timeSlot}</td>
                    <td className="p-1.5 border-r border-gray-300 font-medium">{item.title}</td>
                    <td className="p-1.5 border-r border-gray-300">{item.host}</td>
                    <td className="p-1.5">{item.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="text-center text-[10px] text-gray-500 pt-4 border-t border-gray-300">
          SoundCraft Studio • Multimedia Broadcast & Podcast Learning Lab • Exported on {new Date().toLocaleDateString('th-TH')}
        </div>
      </div>
    </div>
  );
};
