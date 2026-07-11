import { motion } from 'framer-motion';
import { scoreTone } from '../../utils/format';

const ScoreCard = ({ title, score, description }) => (
  <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-5">
    <div className="text-sm text-slate-400">{title}</div>
    <div className={`mt-3 text-4xl font-bold ${scoreTone(score)}`}>{score}<span className="text-base text-slate-400">/100</span></div>
    <p className="mt-3 text-sm text-slate-300">{description}</p>
  </motion.div>
);

export default ScoreCard;