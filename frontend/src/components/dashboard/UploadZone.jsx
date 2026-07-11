import { useRef } from 'react';
import { UploadCloud } from 'lucide-react';

const UploadZone = ({ onFile }) => {
  const inputRef = useRef(null);
  return (
    <button onClick={() => inputRef.current?.click()} className="glass grid min-h-52 w-full place-items-center rounded-[2rem] border border-dashed border-cyan-400/30 p-6 text-center transition hover:border-cyan-300/60 hover:bg-white/10">
      <div>
        <UploadCloud className="mx-auto mb-4 text-cyan-300" size={36} />
        <div className="text-lg font-semibold text-white">Upload PDF or DOCX resume</div>
        <div className="mt-2 text-sm text-slate-400">AI extracts structure, experience, projects, certifications, and career signals.</div>
      </div>
      <input ref={inputRef} type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
    </button>
  );
};

export default UploadZone;