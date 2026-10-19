import React, { useState } from 'react';
import { 
  BookOpen, 
  Mail, 
  ExternalLink, 
  Send, 
  CheckCircle2, 
  User, 
  Building, 
  Info, 
  X,
  FileCheck,
  ShieldCheck,
  Award,
  Copy,
  Check,
  GraduationCap
} from 'lucide-react';
import { ACADEMIC_REFERENCES, DEVELOPER_INFO } from '../data/studioData';

interface ReferencesAndContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const ReferencesAndContactModal: React.FC<ReferencesAndContactModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'references' | 'contact'>('references');
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(DEVELOPER_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFeedbackMessage('');
      setFeedbackName('');
      setFeedbackEmail('');
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className={`border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl transition-colors ${
        isDarkMode ? 'bg-[#12151d] border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-800'
      }`}>
        {/* Modal Top Bar */}
        <div className={`p-4 border-b flex items-center justify-between ${
          isDarkMode ? 'bg-[#161a24] border-zinc-800' : 'bg-zinc-50 border-zinc-200'
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <h3 className={`font-['Chakra_Petch',sans-serif] font-bold text-base sm:text-lg ${
              isDarkMode ? 'text-zinc-100' : 'text-zinc-900'
            }`}>
              แหล่งอ้างอิงวิชาการ & ข้อมูลผู้พัฒนา (References & Contact)
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDarkMode ? 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200' : 'hover:bg-zinc-200 text-zinc-500 hover:text-zinc-800'
            }`}
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className={`flex border-b text-xs font-semibold ${
          isDarkMode ? 'border-zinc-800 bg-[#0d0f15]' : 'border-zinc-200 bg-zinc-100'
        }`}>
          <button
            onClick={() => setActiveTab('references')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'references'
                ? 'border-orange-500 text-orange-500 font-bold bg-orange-500/5'
                : isDarkMode
                  ? 'border-transparent text-zinc-400 hover:text-zinc-200'
                  : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>แหล่งอ้างอิงวิชาการ & มาตรฐาน (References)</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'contact'
                ? 'border-orange-500 text-orange-500 font-bold bg-orange-500/5'
                : isDarkMode
                  ? 'border-transparent text-zinc-400 hover:text-zinc-200'
                  : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>ข้อมูลติดต่อผู้พัฒนา (Developer Contact)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'references' && (
            <div className="space-y-3">
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                เนื้อหาหลักสูตรและเกณฑ์การฝึกปฏิบัติใน SoundCraft Studio อ้างอิงตามมาตรฐานวิชาชีพสื่อกระจายเสียงและโทรคมนาคมระดับชาติและสากล:
              </p>

              <div className="space-y-3">
                {ACADEMIC_REFERENCES.map((ref) => (
                  <div
                    key={ref.id}
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition-colors ${
                      isDarkMode 
                        ? 'bg-[#171b26] border-zinc-800 hover:border-zinc-700' 
                        : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-orange-500/15 text-orange-400 border border-orange-500/30">
                        {ref.category}
                      </span>
                      <span className="font-mono text-zinc-500 text-[11px]">{ref.year}</span>
                    </div>

                    <h4 className={`font-bold text-sm flex items-center gap-1.5 ${
                      isDarkMode ? 'text-zinc-100' : 'text-zinc-900'
                    }`}>
                      <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      {ref.title}
                    </h4>

                    <p className={`font-medium ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      {ref.authorOrOrg}
                    </p>
                    <p className={`leading-relaxed text-[11px] ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {ref.description}
                    </p>

                    {ref.url && (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-orange-500 hover:underline pt-1"
                      >
                        <span>ดูข้อมูลทางการ</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-5">
              {/* Developer Profile Card */}
              <div className={`p-5 rounded-xl border space-y-4 ${
                isDarkMode ? 'bg-[#171b26] border-zinc-800' : 'bg-orange-50/40 border-orange-200/70'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-zinc-950 font-black flex items-center justify-center text-lg shadow-md shadow-orange-500/20 shrink-0">
                      SU
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`font-bold text-base ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                          {DEVELOPER_INFO.leadDeveloper}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" />
                          Silpakorn Univ.
                        </span>
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        {DEVELOPER_INFO.name}
                      </p>
                    </div>
                  </div>

                  {/* Quick Email Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyEmail}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                        copiedEmail
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                          : isDarkMode
                            ? 'bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                            : 'bg-white hover:bg-zinc-100 border-zinc-300 text-zinc-700'
                      }`}
                      title="คัดลอกอีเมล"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>คัดลอกแล้ว!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-orange-400" />
                          <span>คัดลอกอีเมล</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`mailto:${DEVELOPER_INFO.email}?subject=SoundCraft%20Studio%20Inquiry%20%26%20Feedback`}
                      className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm shadow-orange-500/20"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>เปิดส่งเมล</span>
                    </a>
                  </div>
                </div>

                {/* Email Address Highlight Box */}
                <div className={`p-3 rounded-lg border flex items-center justify-between gap-2 ${
                  isDarkMode ? 'bg-[#0d0f15] border-zinc-800' : 'bg-white border-orange-200'
                }`}>
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                    <span className="text-xs font-mono font-bold text-orange-500 truncate select-all">
                      {DEVELOPER_INFO.email}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 hidden sm:inline-block">
                    อีเมลติดต่อหลักสำหรับผู้พัฒนาและงานวิชาการ
                  </span>
                </div>

                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-3 border-t ${
                  isDarkMode ? 'text-zinc-400 border-zinc-800' : 'text-zinc-600 border-zinc-200'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-orange-400 shrink-0" />
                    <span className="truncate">{DEVELOPER_INFO.organization}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{DEVELOPER_INFO.version}</span>
                  </div>
                </div>
              </div>

              {/* Feedback Form */}
              <div className={`p-5 rounded-xl border space-y-4 ${
                isDarkMode ? 'bg-[#151922] border-zinc-800' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-mono font-bold uppercase flex items-center gap-1.5 ${
                    isDarkMode ? 'text-zinc-300' : 'text-zinc-700'
                  }`}>
                    <Mail className="w-3.5 h-3.5 text-orange-400" />
                    ส่งข้อเสนอแนะหรือติดต่อผู้จัดทำแอปพลิเคชัน
                  </h4>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    ส่งตรงถึง: {DEVELOPER_INFO.email}
                  </span>
                </div>

                {isSubmitted ? (
                  <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-bold text-sm">ส่งข้อความถึง {DEVELOPER_INFO.email} เรียบร้อยแล้ว!</p>
                      <p className="text-[11px] text-emerald-300/90 mt-0.5">
                        ระบบได้บันทึกข้อเสนอแนะของคุณส่งต่อไปยังทีมผู้พัฒนา ({DEVELOPER_INFO.leadDeveloper}) ขอบพระคุณครับ
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitFeedback} className="space-y-3.5 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={`block mb-1 font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-700'}`}>
                          ชื่อผู้ติดต่อ <span className="text-orange-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={feedbackName}
                          onChange={(e) => setFeedbackName(e.target.value)}
                          placeholder="ชื่อ-นามสกุล หรือชื่อเรียก"
                          className={`w-full rounded-lg p-2.5 transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                            isDarkMode 
                              ? 'bg-[#0d0f15] border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:border-orange-500' 
                              : 'bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-orange-500'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block mb-1 font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-700'}`}>
                          อีเมลของคุณ <span className="text-orange-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={feedbackEmail}
                          onChange={(e) => setFeedbackEmail(e.target.value)}
                          placeholder="your-email@example.com"
                          className={`w-full rounded-lg p-2.5 transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                            isDarkMode 
                              ? 'bg-[#0d0f15] border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:border-orange-500' 
                              : 'bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-orange-500'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block mb-1 font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-700'}`}>
                        ข้อความ / ข้อเสนอแนะการเรียนรู้ <span className="text-orange-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={feedbackMessage}
                        onChange={(e) => setFeedbackMessage(e.target.value)}
                        placeholder="พิมพ์ข้อเสนอแนะ คำถามทางวิชาการ หรือข้อความถึงทีมผู้พัฒนาวิทยุกระจายเสียงและพอดแคสต์ที่นี่..."
                        className={`w-full rounded-lg p-2.5 transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                          isDarkMode 
                            ? 'bg-[#0d0f15] border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:border-orange-500' 
                            : 'bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-orange-500'
                        }`}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                      <span className="text-[11px] text-zinc-500">
                        ปลายทาง: <span className="font-mono text-orange-400 font-semibold">{DEVELOPER_INFO.email}</span>
                      </span>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-orange-500/20 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>ส่งข้อความถึงผู้พัฒนา</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
