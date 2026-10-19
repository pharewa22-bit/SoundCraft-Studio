import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Sliders, 
  FileEdit, 
  Calendar, 
  Headphones, 
  Award, 
  Radio, 
  BookMarked, 
  X,
  ChevronRight
} from 'lucide-react';

export type TabType = 'dashboard' | 'knowledge' | 'live_simulator' | 'script_lab' | 'onair_table';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  learningProgress: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  onOpenReferences: () => void;
  isDarkMode: boolean;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  learningProgress,
  completedLessonsCount,
  totalLessonsCount,
  onOpenReferences,
  isDarkMode,
  isOpen,
  onCloseMobile,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as TabType,
      title: 'Studio Dashboard',
      subtitle: 'แดชบอร์ดสถิติ & VU Meter',
      icon: LayoutDashboard,
      badge: 'สด',
      badgeColor: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    },
    {
      id: 'knowledge' as TabType,
      title: 'คลังความรู้การจัดรายการ',
      subtitle: '4 หมวด • 9 รูปแบบ • 6T 3H',
      icon: BookOpen,
      badge: `${completedLessonsCount}/${totalLessonsCount}`,
      badgeColor: 'bg-zinc-800 text-zinc-300',
    },
    {
      id: 'script_lab' as TabType,
      title: 'ห้องเขียนบทวิทยุ & Spot',
      subtitle: 'โครงสร้าง 4 ส่วน & ตาราง 3 ช่อง',
      icon: FileEdit,
      badge: 'Editor',
      badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    },
    {
      id: 'onair_table' as TabType,
      title: 'ผังรายการ OnAir Table',
      subtitle: 'Drag & Drop Rundown',
      icon: Calendar,
      badge: 'Live Run',
      badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/30',
    },
    {
      id: 'live_simulator' as TabType,
      title: 'ห้องแล็บมิกซ์เสียง On-Air',
      subtitle: '4-CH Mixer & Auto-Ducking',
      icon: Sliders,
      badge: 'PRO LAB',
      badgeColor: 'bg-gradient-to-r from-orange-500 to-amber-500 text-zinc-950 font-bold shadow-sm',
    },
  ];

  const handleItemClick = (id: TabType) => {
    onSelectTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-fadeIn"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 flex flex-col justify-between shrink-0 shadow-2xl transition-all duration-300 border-r ${
          isDarkMode ? 'bg-[#0d0f15] border-zinc-800/80 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-800'
        } ${
          // Mobile responsive drawer
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${
          // Desktop collapsed vs expanded
          isOpen ? 'w-64 lg:w-72' : 'md:w-16 lg:w-18'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className={`p-4 border-b flex items-center justify-between ${
            isDarkMode ? 'border-zinc-800/80' : 'border-zinc-200'
          }`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30 shrink-0">
                <Headphones className="w-5 h-5 text-zinc-950 font-black" />
              </div>
              {isOpen && (
                <div className="truncate">
                  <h1 className="font-['Chakra_Petch',sans-serif] font-bold text-base tracking-wide flex items-center gap-1">
                    SoundCraft <span className="text-orange-500 font-black">Studio</span>
                  </h1>
                  <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                    ห้องส่งเพื่อการเรียนรู้
                  </p>
                </div>
              )}
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-zinc-400 hover:text-white md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <div className="p-2.5 space-y-1">
            {isOpen && (
              <div className="px-3 py-1.5 text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">
                แผงควบคุม & หลักสูตร
              </div>
            )}

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  title={!isOpen ? item.title : undefined}
                  className={`w-full text-left rounded-xl transition-all duration-200 flex items-center group cursor-pointer ${
                    isOpen ? 'px-3 py-2.5 justify-between' : 'p-2.5 justify-center'
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500/20 via-orange-500/10 to-transparent border border-orange-500/40 text-white shadow-lg shadow-orange-500/10'
                      : isDarkMode
                      ? 'text-zinc-400 hover:text-zinc-100 hover:bg-[#161922] border border-transparent'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/70 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                        isActive
                          ? 'bg-orange-500 text-zinc-950 shadow-md shadow-orange-500/30'
                          : isDarkMode
                          ? 'bg-[#181b24] text-zinc-400 group-hover:text-orange-400 group-hover:bg-[#1e2330]'
                          : 'bg-zinc-200 text-zinc-700 group-hover:text-orange-600 group-hover:bg-zinc-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {isOpen && (
                      <div className="truncate">
                        <p className={`text-xs font-semibold transition-colors ${
                          isActive
                            ? 'text-orange-400'
                            : isDarkMode
                            ? 'text-zinc-200 group-hover:text-white'
                            : 'text-zinc-800 group-hover:text-black'
                        }`}>
                          {item.title}
                        </p>
                        <p className="text-[10px] text-zinc-500 group-hover:text-zinc-400 truncate max-w-[130px]">
                          {item.subtitle}
                        </p>
                      </div>
                    )}
                  </div>

                  {isOpen && item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono shrink-0 ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className={`p-3 border-t space-y-2.5 ${
          isDarkMode ? 'border-zinc-800/80 bg-[#0a0c10]/80' : 'border-zinc-200 bg-zinc-100/80'
        }`}>
          {/* Progress Mini Card (if open) */}
          {isOpen ? (
            <div className={`p-2.5 rounded-xl border ${
              isDarkMode ? 'bg-[#13161f] border-zinc-800' : 'bg-white border-zinc-300'
            }`}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-zinc-400 flex items-center gap-1 font-medium text-[11px]">
                  <Award className="w-3 h-3 text-amber-400" />
                  ความก้าวหน้า
                </span>
                <span className="font-mono font-bold text-orange-400 text-xs">{learningProgress}%</span>
              </div>
              <div className="w-full bg-zinc-700/40 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${learningProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-center" title={`ความก้าวหน้า: ${learningProgress}%`}>
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-mono text-[10px] font-bold border border-orange-500/30">
                {learningProgress}%
              </div>
            </div>
          )}

          {/* References and Developer Contact Button */}
          <button
            onClick={() => {
              onOpenReferences();
              onCloseMobile();
            }}
            title="แหล่งอ้างอิง & ติดต่อผู้พัฒนา"
            className={`w-full py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isOpen ? 'px-3' : 'px-1'
            } ${
              isDarkMode
                ? 'bg-[#151822] hover:bg-[#1c2130] text-zinc-300 hover:text-white border-zinc-800 hover:border-orange-500/40'
                : 'bg-white hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 border-zinc-300'
            }`}
          >
            <BookMarked className="w-4 h-4 text-orange-400 shrink-0" />
            {isOpen && <span className="truncate">แหล่งอ้างอิง & ติดต่อผู้พัฒนา</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
