import { useEffect, useState } from 'react';
import Layout from '../components/common/Layout';
import Loader from '../components/common/Loader';
import api from '../api/client';

const Section = ({ title, items }) => (
  <div className="glass rounded-3xl p-6">
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    <ul className="mt-4 space-y-3 text-sm text-slate-300">
      {(items || []).length ? items.map((item, index) => <li key={index} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">{item}</li>) : <li className="text-slate-500">No data available.</li>}
    </ul>
  </div>
);

const ResumeWorkbenchPage = () => {
  const [resume, setResume] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/resumes'), api.get('/analysis')])
      .then(([resumeRes, analysisRes]) => {
        setResume(resumeRes.data.resumes[0] || null);
        setAnalysis(analysisRes.data.analyses[0]?.results || null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <Layout>
      <div className="grid gap-6 xl:grid-cols-2">
        <Section title="Extracted Skills" items={resume?.extractedData?.skills} />
        <Section title="Education" items={resume?.extractedData?.education} />
        <Section title="Experience" items={resume?.extractedData?.experience} />
        <Section title="Projects" items={resume?.extractedData?.projects} />
        <Section title="Certifications" items={resume?.extractedData?.certifications} />
        <Section title="Achievements" items={resume?.extractedData?.achievements} />

        <div className="glass rounded-3xl p-6 xl:col-span-2">
          <h3 className="text-lg font-semibold text-white">AI Resume Improvement Engine</h3>
          <div className="mt-5 grid gap-6 xl:grid-cols-2 text-sm text-slate-300">
            <div>
              <div className="mb-2 font-semibold text-white">Improved Summary</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">{analysis?.improvedContent?.summary || 'Run analysis to generate optimized content.'}</div>
            </div>
            <div>
              <div className="mb-2 font-semibold text-white">Optimized Skills Section</div>
              <ul className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">{(analysis?.improvedContent?.skillsSection || []).map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div>
              <div className="mb-2 font-semibold text-white">Improved Experience</div>
              <ul className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">{(analysis?.improvedContent?.experience || []).map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div>
              <div className="mb-2 font-semibold text-white">Improved Projects</div>
              <ul className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">{(analysis?.improvedContent?.projects || []).map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResumeWorkbenchPage;