const InsightCard = ({ text, index }) => (
  <div className="glass rounded-2xl p-4 text-sm text-slate-200">
    <div className="mb-2 text-xs uppercase tracking-[0.25em] text-cyan-300/70">Insight {index + 1}</div>
    <p>{text}</p>
  </div>
);

export default InsightCard;