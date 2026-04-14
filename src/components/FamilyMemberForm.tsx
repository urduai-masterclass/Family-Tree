import React, { useState } from 'react';
import { FamilyMember } from '../types';
import { Plus, UserPlus, Trash2, User } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  members: FamilyMember[];
  onAddMember: (member: FamilyMember) => void;
  onDeleteMember: (id: string) => void;
}

export default function FamilyMemberForm({ members, onAddMember, onDeleteMember }: Props) {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newMember: FamilyMember = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      parentId: parentId || undefined,
      gender,
    };

    onAddMember(newMember);
    setName('');
    setParentId('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white p-8 rounded-2xl premium-shadow border border-slate-100 dir-rtl" 
      dir="rtl"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-premium-gold/10 flex items-center justify-center">
          <UserPlus className="w-5 h-5 text-premium-gold" />
        </div>
        <h2 className="text-2xl font-bold text-premium-dark urdu-text leading-none">
          خاندان کا نیا رکن
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-500 mr-1">رکن کا نام</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-premium-gold/20 focus:border-premium-gold outline-none transition-all bg-slate-50/50"
            placeholder="نام درج کریں..."
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-500 mr-1">والد یا والدہ کا انتخاب</label>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-premium-gold/20 focus:border-premium-gold outline-none transition-all bg-slate-50/50 appearance-none cursor-pointer"
          >
            <option value="">بنیادی رکن (خاندان کا سربراہ)</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-500 mr-1">جنس</label>
          <div className="flex gap-3">
            {(['male', 'female'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`flex-1 py-3 px-4 rounded-xl border transition-all flex items-center justify-center gap-2 font-medium ${
                  gender === g 
                    ? 'bg-premium-dark text-white border-premium-dark shadow-lg' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-premium-gold/50'
                }`}
              >
                <User className="w-4 h-4" />
                {g === 'male' ? 'مرد' : 'عورت'}
              </button>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-premium-gold hover:bg-[#b38f4d] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-premium-gold/20"
        >
          <Plus className="w-5 h-5" />
          شجرہ میں شامل کریں
        </motion.button>
      </form>

      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-premium-dark">ارکان کی فہرست</h3>
          <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-full">
            {members.length} کل ارکان
          </span>
        </div>
        <div className="space-y-3 max-h-72 overflow-y-auto pl-1 custom-scrollbar">
          {members.map((member) => (
            <motion.div 
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={member.id} 
              className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-premium-gold/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${member.gender === 'female' ? 'bg-pink-400' : 'bg-emerald-500'}`} />
                <span className="font-semibold text-slate-700">{member.name}</span>
              </div>
              <button
                onClick={() => onDeleteMember(member.id)}
                className="text-slate-300 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
          {members.length === 0 && (
            <div className="text-center py-10 px-4 border-2 border-dashed border-slate-100 rounded-2xl">
              <p className="text-slate-400 text-sm italic">ابھی تک کوئی رکن شامل نہیں کیا گیا</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
