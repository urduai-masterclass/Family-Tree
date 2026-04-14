import { useState, useEffect } from 'react';
import { FamilyMember } from './types';
import FamilyMemberForm from './components/FamilyMemberForm';
import FamilyTree from './components/FamilyTree';
import { Download, Share2, Users, TreeDeciduous, Sparkles } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [members, setMembers] = useState<FamilyMember[]>(() => {
    const saved = localStorage.getItem('family-tree-members');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('family-tree-members', JSON.stringify(members));
  }, [members]);

  const handleAddMember = (member: FamilyMember) => {
    setMembers([...members, member]);
  };

  const handleDeleteMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id).map(m => {
      if (m.parentId === id) return { ...m, parentId: undefined };
      return m;
    }));
  };

  const downloadPDF = async () => {
    const element = document.getElementById('tree-container');
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 3, // Higher scale for premium quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('shajra-e-nasab.pdf');
  };

  const downloadJPG = async () => {
    const element = document.getElementById('tree-container');
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/jpeg', 0.9);
    const link = document.createElement('a');
    link.download = 'shajra-e-nasab.jpg';
    link.href = imgData;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans selection:bg-premium-gold/20 selection:text-premium-dark">
      {/* Premium Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" 
           style={{ backgroundImage: 'radial-gradient(#c5a059 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center relative">
          {/* Centered Logo and Title */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 absolute left-1/2 -translate-x-1/2"
          >
            <div className="bg-premium-dark p-2.5 rounded-xl shadow-xl shadow-premium-dark/10">
              <TreeDeciduous className="w-7 h-7 text-premium-gold" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-premium-dark tracking-tight urdu-text leading-none">شجرہ نسب</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mt-1">Heritage Archive</p>
            </div>
          </motion.div>
          
          {/* Action Buttons on the Right */}
          <div className="flex items-center gap-3 ml-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadJPG}
              disabled={members.length === 0}
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm hover:border-premium-gold/50"
            >
              <Download className="w-4 h-4 text-premium-gold" />
              <span className="hidden md:inline text-sm">تصویر (JPG)</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadPDF}
              disabled={members.length === 0}
              className="flex items-center gap-2 bg-premium-dark hover:bg-black text-white px-4 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-premium-dark/20"
            >
              <Download className="w-4 h-4 text-premium-gold" />
              <span className="hidden md:inline text-sm">محفوظ کریں (PDF)</span>
            </motion.button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <FamilyMemberForm 
              members={members} 
              onAddMember={handleAddMember} 
              onDeleteMember={handleDeleteMember}
            />
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-premium-dark p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-premium-gold/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <h3 className="text-premium-gold font-bold mb-4 flex items-center gap-2 urdu-text">
                <Sparkles className="w-4 h-4" />
                ضروری معلومات
              </h3>
              <ul className="text-slate-300 text-sm space-y-4 dir-rtl leading-relaxed" dir="rtl">
                <li className="flex gap-3">
                  <span className="text-premium-gold font-bold">1.</span>
                  <span>اپنے خاندان کے سب سے بزرگ رکن سے آغاز کریں تاکہ شجرہ درست بنے۔</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-premium-gold font-bold">2.</span>
                  <span>ہر نئے رکن کو شامل کرتے وقت ان کے والد یا والدہ کا انتخاب فہرست سے کریں۔</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-premium-gold font-bold">3.</span>
                  <span>شجرہ مکمل ہونے پر پی ڈی ایف یا تصویر کی صورت میں اسے اپنے پاس محفوظ کر لیں۔</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3 text-premium-dark font-bold">
                  <Users className="w-5 h-5 text-premium-gold" />
                  <span className="urdu-text">خاندانی شجرہ کا منظر</span>
                </div>
                <div className="flex gap-6 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20"></div>
                    <span>مرد (Male)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-pink-400 shadow-lg shadow-pink-400/20"></div>
                    <span>عورت (Female)</span>
                  </div>
                </div>
              </div>
              
              <FamilyTree members={members} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-100 mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 opacity-50">
            <TreeDeciduous className="w-5 h-5 text-premium-dark" />
            <span className="text-xs font-bold tracking-widest uppercase">Heritage Archive</span>
          </div>
          <p className="text-slate-400 text-xs font-medium">
            © {new Date().getFullYear()} شجرہ نسب میکر - آپ کی خاندانی تاریخ، ہمارا ورثہ
          </p>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-premium-gold hover:text-white transition-all cursor-pointer">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
