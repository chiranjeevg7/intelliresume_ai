import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts';

const ImprovementRadar = ({ areas = [] }) => {
  const data = areas.map((item) => ({ subject: item.area, score: item.score }));
  return (
    <div className="glass rounded-3xl p-5">
      <h3 className="mb-4 text-lg font-semibold text-white">Improvement Areas</h3>
      <div className="h-72">
        <ResponsiveContainer>
          <RadarChart data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.18)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
            <Radar dataKey="score" stroke="#7c8cff" fill="#7c8cff" fillOpacity={0.4} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ImprovementRadar;