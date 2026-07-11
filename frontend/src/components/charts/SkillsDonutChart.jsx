import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#46c7d8', '#7c8cff', '#7ef0b8', '#fbbf24', '#fb7185'];

const SkillsDonutChart = ({ skills = [] }) => {
  const data = skills.slice(0, 5).map((skill, index) => ({ name: skill, value: 20 - index * 2 }));
  return (
    <div className="glass rounded-3xl p-5">
      <h3 className="mb-4 text-lg font-semibold text-white">Top Skills Distribution</h3>
      <div className="h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} innerRadius={60} outerRadius={95} paddingAngle={4} dataKey="value">
              {data.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SkillsDonutChart;