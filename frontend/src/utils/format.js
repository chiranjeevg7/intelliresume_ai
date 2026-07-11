export const scoreTone = (score) => {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-300";
  return "text-rose-400";
};
