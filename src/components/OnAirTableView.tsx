import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Radio, 
  Plus, 
  Play, 
  Check, 
  Copy, 
  Filter, 
  Trash2, 
  Mic, 
  GripVertical,
  ArrowUp,
  ArrowDown,
  Edit3,
  Save,
  X,
  Volume2
} from 'lucide-react';
import { RundownItem } from '../data/studioData';
import { studioAudio } from '../utils/audioEngine';

interface OnAirTableViewProps {
  rundown: RundownItem[];
  setRundown: React.Dispatch<React.SetStateAction<RundownItem[]>>;
  currentShowTitle: string;
  setCurrentShowTitle: (title: string) => void;
  setActiveDj: (dj: string) => void;
  setOnAirState: (st: 'on_air' | 'standby' | 'rehearsal' | 'off') => void;
}

export const OnAirTableView: React.FC<OnAirTableViewProps> = ({
  rundown = [],
  setRundown,
  currentShowTitle,
  setCurrentShowTitle,
  setActiveDj,
  setOnAirState,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<RundownItem | null>(null);
  const [copiedRundown, setCopiedRundown] = useState<boolean>(false);

  // Drag and Drop State
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Add/Edit Form State
  const [formTitle, setFormTitle] = useState('');
  const [formHost, setFormHost] = useState('');
  const [formTime, setFormTime] = useState('18:00 - 19:30');
  const [formCategory, setFormCategory] = useState<'ข่าว' | 'เพลง' | 'สนทนา' | 'สปอต' | 'สาระความรู้'>('เพลง');
  const [formDuration, setFormDuration] = useState(90);

  const categories = ['all', 'ข่าว', 'เพลง', 'สนทนา', 'สปอต', 'สาระความรู้'];

  // Safe Filtered List
  const filteredItems = (rundown || []).filter((item) => {
    if (!item) return false;
    if (filterCategory === 'all') return true;
    return item.category === filterCategory;
  });

  // Cue Current Show
  const handleCueShow = (item: RundownItem) => {
    if (!item) return;
    studioAudio.playStationWhoosh();
    setCurrentShowTitle(item.title);
    setActiveDj(item.host);
    setOnAirState('on_air');

    setRundown((prev) =>
      prev.map((r) => {
        if (r.id === item.id) return { ...r, status: 'on_air' };
        if (r.status === 'on_air') return { ...r, status: 'completed' };
        return r;
      })
    );
  };

  // Direct Inline Update
  const handleInlineUpdate = (id: string, field: keyof RundownItem, value: any) => {
    setRundown((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, [field]: value };
          // If this is currently on-air, sync header as well
          if (updated.status === 'on_air') {
            if (field === 'title') setCurrentShowTitle(value);
            if (field === 'host') setActiveDj(value);
          }
          return updated;
        }
        return r;
      })
    );
  };

  // Add / Edit Modal Handlers
  const openAddModal = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormHost('');
    setFormTime('18:00 - 19:30');
    setFormCategory('เพลง');
    setFormDuration(90);
    setIsAddModalOpen(true);
  };

  const openEditModal = (item: RundownItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormHost(item.host);
    setFormTime(item.timeSlot);
    setFormCategory(item.category);
    setFormDuration(item.durationMinutes);
    setIsAddModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingItem) {
      // Update existing item
      setRundown((prev) =>
        prev.map((r) =>
          r.id === editingItem.id
            ? {
                ...r,
                title: formTitle,
                host: formHost || 'ดีเจประจำสถานี',
                timeSlot: formTime,
                category: formCategory,
                durationMinutes: formDuration,
              }
            : r
        )
      );
      if (editingItem.status === 'on_air') {
        setCurrentShowTitle(formTitle);
        setActiveDj(formHost || 'ดีเจประจำสถานี');
      }
    } else {
      // Create new item
      const newItem: RundownItem = {
        id: `rd-${Date.now()}`,
        timeSlot: formTime,
        title: formTitle,
        host: formHost || 'ดีเจประจำสถานี',
        category: formCategory,
        durationMinutes: formDuration,
        cartId: `CART-${Math.floor(100 + Math.random() * 900)}`,
        status: 'queued',
        bitrate: '320 kbps HD',
      };
      setRundown((prev) => [...prev, newItem]);
    }

    setIsAddModalOpen(false);
  };

  const handleDeleteSegment = (id: string) => {
    setRundown((prev) => prev.filter((item) => item.id !== id));
  };

  // Reordering via Buttons
  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= rundown.length) return;
    const newItems = [...rundown];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setRundown(newItems);
  };

  // Drag and Drop Handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    const newItems = [...rundown];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);
    setRundown(newItems);
    setDraggedIndex(null);
  };

  const copyRundownSheet = () => {
    const text = (rundown || [])
      .map(
        (r) =>
          `[${r.timeSlot}] ${r.title} | ผู้จัด: ${r.host} | หมวด: ${r.category} | ${r.durationMinutes} นาที | Cart: ${r.cartId} (${r.status})`
      )
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedRundown(true);
    setTimeout(() => setCopiedRundown(false), 2000);
  };

  const getStatusBadge = (status: RundownItem['status']) => {
    switch (status) {
      case 'on_air':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-red-600/20 text-red-400 border border-red-500/30 flex items-center gap-1 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            ON AIR
          </span>
        );
      case 'up_next':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            UP NEXT
          </span>
        );
      case 'queued':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-800 text-zinc-400">
            QUEUED
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400">
            ✓ ออกอากาศแล้ว
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              MODULE 3
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-['Chakra_Petch',sans-serif] text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-orange-400" />
              ระบบจัดตารางผังออกอากาศ (OnAir Table & Broadcast Rundown)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            ผู้เรียนสามารถลากวาง (Drag & Drop) จัดลำดับ หรือคลิกแก้ไขชื่อผู้จัดและช่วงเวลาออกอากาศได้อย่างอิสระ
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={copyRundownSheet}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedRundown ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedRundown ? 'คัดลอกผังแล้ว' : 'ส่งออกผังรายการ'}</span>
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มช่วงรายการใหม่</span>
          </button>
        </div>
      </div>

      {/* Filter Bar & Interactive Guidance */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#12151d] p-3 rounded-xl border border-zinc-800">
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-zinc-400">กรองหมวดหมู่:</span>
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                  filterCategory === cat
                    ? 'bg-orange-500 text-zinc-950 font-bold'
                    : 'bg-[#181c26] text-zinc-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'ทั้งหมด' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
          <span className="text-[11px] text-zinc-400 bg-[#171b26] px-2 py-1 rounded border border-zinc-800">
            💡 คลิกแก้ไขชื่อผู้จัด/เวลาในตารางได้โดยตรง หรือลากแถวเพื่อสลับคิว
          </span>
        </div>
      </div>

      {/* Interactive Rundown Table */}
      <div className="bg-[#10131a] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#161a24] text-orange-400 font-mono text-xs uppercase border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-3 w-10 text-center">คิว</th>
                <th className="py-3.5 px-3 w-40 font-semibold">ช่วงเวลา (Time Slot)</th>
                <th className="py-3.5 px-4 font-semibold">ชื่อรายการ / เซกเมนต์</th>
                <th className="py-3.5 px-4 font-semibold">ผู้ดำเนินรายการ / ดีเจ</th>
                <th className="py-3.5 px-3 w-28 font-semibold">หมวดหมู่</th>
                <th className="py-3.5 px-3 w-20 font-semibold">ความยาว</th>
                <th className="py-3.5 px-3 w-28 font-semibold">สถานะ</th>
                <th className="py-3.5 px-4 text-right font-semibold">ควบคุมคิว</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {filteredItems.map((item, index) => {
                const isOnAir = item.status === 'on_air';
                const originalIndex = rundown.findIndex((r) => r.id === item.id);

                return (
                  <tr
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(originalIndex)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(originalIndex)}
                    className={`transition-colors cursor-move group ${
                      isOnAir
                        ? 'bg-orange-500/10 hover:bg-orange-500/15'
                        : draggedIndex === originalIndex
                        ? 'bg-zinc-800 opacity-60'
                        : 'hover:bg-[#151922]'
                    }`}
                  >
                    {/* Drag Handle & Order */}
                    <td className="py-3 px-3 text-center align-middle">
                      <div className="flex items-center justify-center gap-1 text-zinc-500 group-hover:text-orange-400">
                        <GripVertical className="w-4 h-4 cursor-grab" />
                        <span className="font-mono text-[11px]">{index + 1}</span>
                      </div>
                    </td>

                    {/* Time Slot (Editable) */}
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={item.timeSlot}
                        onChange={(e) => handleInlineUpdate(item.id, 'timeSlot', e.target.value)}
                        className="w-full bg-[#161a24] border border-zinc-800 rounded px-2 py-1 text-xs font-mono font-semibold text-zinc-200 focus:outline-none focus:border-orange-500"
                        title="คลิกเพื่อแก้ไขช่วงเวลาได้ทันที"
                      />
                    </td>

                    {/* Show Title (Editable) */}
                    <td className="py-2.5 px-4">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleInlineUpdate(item.id, 'title', e.target.value)}
                        className={`w-full bg-[#161a24] border border-zinc-800 rounded px-2.5 py-1 text-xs sm:text-sm font-medium focus:outline-none focus:border-orange-500 ${
                          isOnAir ? 'text-orange-300 font-bold' : 'text-white'
                        }`}
                        title="คลิกเพื่อแก้ไขชื่อรายการได้ทันที"
                      />
                    </td>

                    {/* Host Name (Editable) */}
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <Mic className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <input
                          type="text"
                          value={item.host}
                          onChange={(e) => handleInlineUpdate(item.id, 'host', e.target.value)}
                          className="w-full bg-[#161a24] border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:border-orange-500"
                          title="คลิกเพื่อแก้ไขชื่อผู้จัดรายการได้ทันที"
                        />
                      </div>
                    </td>

                    {/* Category Selector */}
                    <td className="py-2.5 px-3">
                      <select
                        value={item.category}
                        onChange={(e) => handleInlineUpdate(item.id, 'category', e.target.value)}
                        className="bg-[#161a24] border border-zinc-800 rounded px-2 py-1 text-xs font-mono text-zinc-300 focus:outline-none focus:border-orange-500"
                      >
                        <option value="ข่าว">ข่าว</option>
                        <option value="เพลง">เพลง</option>
                        <option value="สนทนา">สนทนา</option>
                        <option value="สปอต">สปอต</option>
                        <option value="สาระความรู้">สาระความรู้</option>
                      </select>
                    </td>

                    {/* Duration */}
                    <td className="py-2.5 px-3 font-mono text-zinc-400 text-xs">
                      {item.durationMinutes} นาที
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {!isOnAir && (
                          <button
                            onClick={() => handleCueShow(item)}
                            className="px-2.5 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500 text-orange-300 hover:text-zinc-950 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer border border-orange-500/30"
                            title="สลับรายการนี้ขึ้น Live On-Air ทันที"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            Cue Live
                          </button>
                        )}

                        <button
                          disabled={originalIndex === 0}
                          onClick={() => moveItem(originalIndex, 'up')}
                          className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 disabled:opacity-30 cursor-pointer"
                          title="เลื่อนคิวขึ้น"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        <button
                          disabled={originalIndex === rundown.length - 1}
                          onClick={() => moveItem(originalIndex, 'down')}
                          className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 disabled:opacity-30 cursor-pointer"
                          title="เลื่อนคิวลง"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white cursor-pointer"
                          title="แก้ไขรายละเอียดเชิงลึก"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteSegment(item.id)}
                          className="p-1 rounded bg-zinc-800 hover:bg-red-600 hover:text-white text-zinc-500 cursor-pointer"
                          title="ลบช่วงรายการนี้"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Segment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#12151d] border border-zinc-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {editingItem ? <Edit3 className="w-4 h-4 text-orange-400" /> : <Plus className="w-4 h-4 text-orange-400" />}
                <span>{editingItem ? 'แก้ไขช่วงรายการผัง OnAir' : 'เพิ่มช่วงรายการลงผัง OnAir'}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-500 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">ชื่อช่วงรายการ</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="เช่น Drive Time ชวนคุยประเด็นร้อน"
                  className="w-full bg-[#171b24] border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-100 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">ผู้ดำเนินรายการ / ดีเจ</label>
                <input
                  type="text"
                  required
                  value={formHost}
                  onChange={(e) => setFormHost(e.target.value)}
                  placeholder="เช่น ดีเจ ตะวัน & แขกรับเชิญ"
                  className="w-full bg-[#171b24] border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-100 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">ช่วงเวลา (Time Slot)</label>
                  <input
                    type="text"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full bg-[#171b24] border border-zinc-800 rounded-lg p-2.5 text-xs font-mono text-zinc-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">ความยาว (นาที)</label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={formDuration}
                    onChange={(e) => setFormDuration(parseInt(e.target.value, 10))}
                    className="w-full bg-[#171b24] border border-zinc-800 rounded-lg p-2.5 text-xs font-mono text-zinc-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">หมวดหมู่รายการ</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full bg-[#171b24] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="เพลง">เพลง</option>
                  <option value="ข่าว">ข่าว</option>
                  <option value="สนทนา">สนทนา</option>
                  <option value="สปอต">สปอต</option>
                  <option value="สาระความรู้">สาระความรู้</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold text-xs cursor-pointer shadow-md shadow-orange-500/20"
                >
                  {editingItem ? 'บันทึกการแก้ไข' : 'บันทึกลงผังรายการ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
