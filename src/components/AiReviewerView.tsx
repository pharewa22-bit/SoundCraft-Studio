import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Volume2, 
  Copy, 
  Check, 
  RefreshCw, 
  Send, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Sliders
} from 'lucide-react';
import { TabType } from './Sidebar';

interface AiReviewResult {
  readinessScore: number;
  verdict: string;
  estimatedSeconds: number;
  timingAnalysis: string;
  hookEvaluation: string;
  pronunciationWarnings: string[];
  sfxRecommendations: string[];
  toneAndPacing: string;
  polishedScript: string;
}

interface AiReviewerViewProps {
  initialScript: string;
  onApplyPolishedScript: (script: string) => void;
  onSelectTab: (tab: TabType) => void;
}

export const AiReviewerView: React.FC<AiReviewerViewProps> = ({
  initialScript,
  onApplyPolishedScript,
  onSelectTab,
}) => {
  const [scriptText, setScriptText] = useState<string>(
    initialScript ||
      `[MUSIC BED: ดนตรีจังหวะ Acoustic Pop สดใส]\n[SFX: เสียงน้ำแข็งกระทบแก้ว + เสียงซ่า]\n\n[DJ/HOST]: "บ่ายนี้ง่วงไหม? ชาร์จพลังความสดชื่นเต็มแก้วกับ GreenCraft Cold Brew กาแฟสกัดเย็นออร์แกนิก 100% หอมเข้ม กลมกล่อม ไม่เติมน้ำตาล! พิเศษ! พกแก้วมาเอง ลดทันที 10 บาททุกเมนู แวะเลยที่ GreenCraft ทุกสาขา เสิร์ฟความเฟรชถึงมือคุณ!"\n\n[SFX: เสียงจิงเกิล 2 วินาที]\n[BED: Fade Out]`
  );
  const [scriptType, setScriptType] = useState<string>('spot');
  const [targetSeconds, setTargetSeconds] = useState<number>(30);
  const [voiceTone, setVoiceTone] = useState<string>('สดใส กระตือรือร้น ทันสมัย (Energetic)');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AiReviewResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedPolished, setCopiedPolished] = useState<boolean>(false);
  const [reviewSource, setReviewSource] = useState<string | null>(null);

  const runAiReview = async () => {
    if (!scriptText.trim()) {
      setErrorMsg('กรุณากรอกข้อความบทวิทยุที่ต้องการให้ AI ตรวจทาน');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/ai-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptText,
          scriptType,
          targetSeconds,
          voiceTone,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'ไม่สามารถวิเคราะห์บทได้');
      }

      setAnalysisResult(data.analysis);
      setReviewSource(data.source || 'gemini-3.8-flash');
    } catch (err: any) {
      console.error('Error submitting AI review:', err);
      setErrorMsg(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPolished = () => {
    if (!analysisResult?.polishedScript) return;
    navigator.clipboard.writeText(analysisResult.polishedScript);
    setCopiedPolished(true);
    setTimeout(() => setCopiedPolished(false), 2000);
  };

  const handleSendToScriptLab = () => {
    if (!analysisResult?.polishedScript) return;
    onApplyPolishedScript(analysisResult.polishedScript);
    onSelectTab('script_lab');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
              MODULE 4
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-['Chakra_Petch',sans-serif] text-white flex items-center gap-2">
              <Bot className="w-6 h-6 text-orange-400" />
              ผู้ช่วย AI ตรวจทานบทเสียง (AI Voice Script Reviewer)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            ตรวจวัดจังหวะเวลา Pacing, คำที่อาจลิ้นพันในภาษาไทย, หมัดฮุก 5 วินาทีแรก และเกลาคำให้พร้อมออกอากาศ
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-[#141720] px-3 py-1.5 rounded-lg border border-zinc-800">
          <Sparkles className="w-4 h-4 text-orange-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Gemini 3.8 Flash Engine</span>
        </div>
      </div>

      {/* Main Grid: Inputs vs Output Report */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 Cols): Script Input & Parameters */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#12151d] border border-zinc-800 rounded-2xl p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-orange-400" />
                บทวิทยุที่ต้องการตรวจทาน
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">
                {scriptText.length} ตัวอักษร
              </span>
            </div>

            <textarea
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              rows={9}
              placeholder="วางหรือเขียนบทวิทยุ สปอต หรือบทพอดแคสต์ที่นี่..."
              className="w-full bg-[#0d0f15] border border-zinc-800 rounded-xl p-3 text-xs sm:text-sm text-zinc-100 font-sans focus:outline-none focus:border-orange-500 transition-all font-['Prompt',sans-serif] leading-relaxed resize-y"
            />

            {/* Production Parameters */}
            <div className="space-y-3 pt-2 border-t border-zinc-800">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">ประเภทชิ้นงาน</label>
                  <select
                    value={scriptType}
                    onChange={(e) => setScriptType(e.target.value)}
                    className="w-full bg-[#181c26] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
                  >
                    <option value="spot">สปอตโฆษณา (Spot)</option>
                    <option value="news">ข่าวต้นชั่วโมง (News Flash)</option>
                    <option value="podcast">พอดแคสต์เปิดตอน (Podcast)</option>
                    <option value="music_show">รายการเพลงดีเจ (Music Show)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">เวลาเป้าหมาย (วิ)</label>
                  <select
                    value={targetSeconds}
                    onChange={(e) => setTargetSeconds(parseInt(e.target.value, 10))}
                    className="w-full bg-[#181c26] border border-zinc-800 rounded-lg p-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-orange-500"
                  >
                    <option value={15}>15 วินาที</option>
                    <option value={30}>30 วินาที</option>
                    <option value={60}>60 วินาที</option>
                    <option value={90}>90 วินาที</option>
                    <option value={120}>120 วินาที</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">โทนเสียงที่ต้องการ (Tone of Voice)</label>
                <select
                  value={voiceTone}
                  onChange={(e) => setVoiceTone(e.target.value)}
                  className="w-full bg-[#181c26] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="สดใส กระตือรือร้น ทันสมัย (Energetic & Fresh)">สดใส กระตือรือร้น ทันสมัย (Energetic & Fresh)</option>
                  <option value="น่าเชื่อถือ ชัดเจน มั่นคง มีพลัง (Authoritative & Crisp)">น่าเชื่อถือ ชัดเจน มั่นคง มีพลัง (Authoritative & Crisp)</option>
                  <option value="อบอุ่น เป็นกันเอง สุภาพ (Warm & Conversational)">อบอุ่น เป็นกันเอง สุภาพ (Warm & Conversational)</option>
                  <option value="ลึกลับ ตื่นเต้น น่าค้นหา (Dramatic & Intriguing)">ลึกลับ ตื่นเต้น น่าค้นหา (Dramatic & Intriguing)</option>
                </select>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400 bg-red-950/30 border border-red-800 p-2 rounded-lg">
                {errorMsg}
              </p>
            )}

            <button
              disabled={isLoading}
              onClick={runAiReview}
              className={`w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
                isLoading
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-zinc-950 shadow-orange-500/20'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-orange-400" />
                  <span>กำลังวิเคราะห์บทวิทยุ...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>เริ่มตรวจทานบทด้วย AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column (7 Cols): AI Studio Evaluation Report */}
        <div className="lg:col-span-7 space-y-4">
          {!analysisResult && !isLoading && (
            <div className="bg-[#12151d] border border-zinc-800 rounded-2xl p-8 text-center space-y-3 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">พร้อมตรวจทานบทวิทยุกระจายเสียง</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                กดปุ่ม <strong>"เริ่มตรวจทานบทด้วย AI"</strong> เพื่อรับคะแนนความพร้อมออกอากาศ 
                การวิเคราะห์ความยาวเทียบกับเวลาเป้าหมาย การเช็คคำลิ้นพัน และสคริปต์ฉบับปรับปรุง
              </p>
              <button
                onClick={runAiReview}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-orange-400" />
                ตรวจทานบทตัวอย่างทันที
              </button>
            </div>
          )}

          {isLoading && (
            <div className="bg-[#12151d] border border-zinc-800 rounded-2xl p-10 text-center space-y-4 shadow-xl">
              <div className="relative w-14 h-14 mx-auto">
                <div className="w-14 h-14 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
                <Bot className="w-6 h-6 text-orange-400 absolute inset-0 m-auto" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">ผู้ช่วย AI กำลังตรวจสอบมาตรฐานบท...</p>
                <p className="text-xs text-zinc-400 mt-1">
                  คำนวณอัตราเร็วพยางค์ไทย • สแกนหาคำที่อาจออกเสียงสะดุด • ประเมินการวางตำแหน่งคิวเสียง [SFX]
                </p>
              </div>
            </div>
          )}

          {analysisResult && !isLoading && (
            <div className="bg-[#12151d] border border-zinc-800 rounded-2xl p-5 space-y-5 shadow-2xl">
              {/* Score & Verdict Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center w-14 h-14 rounded-xl bg-[#171b26] border border-orange-500/30">
                    <span className="text-2xl font-black font-mono text-orange-400">
                      {analysisResult.readinessScore}
                    </span>
                    <span className="absolute -top-1.5 -right-1 text-[9px] font-mono text-zinc-400 bg-zinc-800 px-1 rounded">
                      /100
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-zinc-400 font-mono uppercase">
                      คะแนนความพร้อมออกอากาศ (Readiness)
                    </span>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{analysisResult.verdict}</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </h4>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-zinc-400">ประมาณการเวลาพูด:</span>
                  <p className="text-sm font-bold font-mono text-amber-400">
                    {analysisResult.estimatedSeconds} วินาที (เป้าหมาย: {targetSeconds}s)
                  </p>
                </div>
              </div>

              {/* Analysis Highlights Cards */}
              <div className="space-y-3">
                {/* 1. Timing & Pacing */}
                <div className="bg-[#171b24] p-3 rounded-xl border border-zinc-800/80 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-orange-400 font-semibold font-mono text-[11px] uppercase">
                    <Clock className="w-3.5 h-3.5" />
                    1. การวิเคราะห์ความยาวและจังหวะ (Timing & Pacing)
                  </div>
                  <p className="text-zinc-200 leading-relaxed">{analysisResult.timingAnalysis}</p>
                </div>

                {/* 2. Hook Evaluation */}
                <div className="bg-[#171b24] p-3 rounded-xl border border-zinc-800/80 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 font-semibold font-mono text-[11px] uppercase">
                    <Zap className="w-3.5 h-3.5" />
                    2. หมัดฮุก 5 วินาทีแรก (Attention Hook)
                  </div>
                  <p className="text-zinc-200 leading-relaxed">{analysisResult.hookEvaluation}</p>
                </div>

                {/* 3. Tongue-Twister & Pronunciation Check */}
                <div className="bg-[#171b24] p-3 rounded-xl border border-zinc-800/80 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-red-400 font-semibold font-mono text-[11px] uppercase">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    3. ข้อควรระวังการออกเสียงและคำที่อาจลิ้นพัน (Pronunciation Check)
                  </div>
                  <ul className="space-y-1 text-zinc-300">
                    {analysisResult.pronunciationWarnings.map((warn, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-400 text-xs">•</span>
                        <span>{warn}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4. SFX & Bed Recommendations */}
                <div className="bg-[#171b24] p-3 rounded-xl border border-zinc-800/80 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-semibold font-mono text-[11px] uppercase">
                    <Volume2 className="w-3.5 h-3.5" />
                    4. คำแนะนำการวางคิวเสียง Sound Effects & Music Bed
                  </div>
                  <ul className="space-y-1 text-zinc-300">
                    {analysisResult.sfxRecommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-cyan-400 text-xs">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 5. Tone & Pacing Advice */}
                <div className="bg-[#171b24] p-3 rounded-xl border border-zinc-800/80 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono text-[11px] uppercase">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    5. น้ำเสียงและอารมณ์การอ่านหน้าไมค์ (Tone Guidance)
                  </div>
                  <p className="text-zinc-200 leading-relaxed">{analysisResult.toneAndPacing}</p>
                </div>
              </div>

              {/* Polished Broadcast-Ready Script */}
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-orange-400 uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    บทฉบับเกลาปรับปรุงโดย AI (Polished Script)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyPolished}
                      className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-mono cursor-pointer"
                    >
                      {copiedPolished ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedPolished ? 'คัดลอกแล้ว' : 'คัดลอกบทปรับปรุง'}
                    </button>
                  </div>
                </div>

                <div className="bg-[#0b0d12] border border-orange-500/30 rounded-xl p-3.5 text-xs sm:text-sm font-sans text-zinc-100 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                  {analysisResult.polishedScript}
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleSendToScriptLab}
                    className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer"
                  >
                    <span>นำบทปรับปรุงไปเปิดในห้องเขียนบท</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
