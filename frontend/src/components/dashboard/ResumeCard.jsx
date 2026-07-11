import { FileText } from 'lucide-react';

const ResumeCard = ({ resume, selected, onSelect }) => (
  <button onClick={() => onSelect(resume)} className={`glass w-full rounded-3xl p-5 text-left transition ${selected? 'ring-2 ring-cyan-400/60' : 'hover:bg-white/10'}`}>
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-3 text-white"><FileText size={18} /> {resume.originalFileName}</div>
      <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">{new Date(resume.createdAt).toLocaleDateString()}</span>
    </div>
    <div className="text-sm text-slate-300">{resume.extractedData?.name || 'Candidate'}</div>
    <div className="mt-2 text-xs text-slate-400">{(resume.extractedData?.skills || []).slice(0, 5).join(', ')}</div>
  </button>
);

export default ResumeCard;