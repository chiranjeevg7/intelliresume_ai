import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

const ScoreBarChart = ({ analysis }) => {
  const data = [
    { name: 'Resume', score: analysis.resumeStrengthScore },
    { name: 'ATS', score: analysis.atsScore },
    { name: 'Match', score: analysis.jobMatchScore },
    { name: 'Skills', score: analysis.skillStrength }
  ];

  return (
    <div className="glass rounded-3xl p-5">
      <h3 className="mb-4 text-lg font-semibold text-white">Score Overview</h3>
      <div className="h-72">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" domain={[0, 100]} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }} />
            <Bar dataKey="score" fill="#46c7d8" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScoreBarChart;