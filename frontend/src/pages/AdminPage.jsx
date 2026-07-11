import { useMemo, useState } from 'react';
import useApi from '../hooks/useApi';
import api from '../api/client';
import Layout from '../components/common/Layout';
import Loader from '../components/common/Loader';
import ScoreCard from '../components/dashboard/ScoreCard';

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'users', label: 'Users' },
  { key: 'resumes', label: 'Resumes' },
  { key: 'analyses', label: 'Analyses' },
];

const Card = ({ title, children }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
    <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">{children}</div>
  </div>
);

const Empty = ({ text }) => (
  <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
    {text}
  </div>
);

const DetailModal = ({ title, open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/10"
          >
            Close
          </button>
        </div>
        <div className="space-y-4 text-sm text-slate-300">{children}</div>
      </div>
    </div>
  );
};

const JsonBlock = ({ data }) => (
  <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-cyan-300">
    {JSON.stringify(data, null, 2)}
  </pre>
);

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedResume, setSelectedResume] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const dashboardQuery = useApi(() => api.get('/admin/dashboard'), []);
  const usersQuery = useApi(() => api.get('/admin/users'), []);
  const resumesQuery = useApi(() => api.get('/admin/resumes'), []);
  const analysesQuery = useApi(() => api.get('/admin/analyses'), []);

  const loading =
    dashboardQuery.loading ||
    usersQuery.loading ||
    resumesQuery.loading ||
    analysesQuery.loading;

  const analytics = dashboardQuery.data?.analytics;
  const users = usersQuery.data?.users || [];
  const resumes = resumesQuery.data?.resumes || [];
  const analyses = analysesQuery.data?.analyses || [];

  const selectedResumeData = useMemo(
    () => resumes.find((item) => item._id === selectedResume),
    [resumes, selectedResume]
  );

  const selectedAnalysisData = useMemo(
    () => analyses.find((item) => item._id === selectedAnalysis),
    [analyses, selectedAnalysis]
  );

  const downloadAdminReport = async (id) => {
    const response = await api.get(`/admin/reports/${id}/pdf`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `intelliresume-admin-report-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  if (loading) return <Loader />;

  return (
    <Layout>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-600/70 dark:text-cyan-300/70">
          Admin Console
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
          Platform Control Center
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Review users, resumes, AI analyses, and downloadable reports across the platform.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab.key
                ? 'bg-cyan-500 text-slate-950'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <ScoreCard title="Users" score={analytics?.totals?.users || 0} description="Registered users across the platform." />
            <ScoreCard title="Resumes" score={analytics?.totals?.resumes || 0} description="Uploaded resumes available for analysis." />
            <ScoreCard title="Analyses" score={analytics?.totals?.analyses || 0} description="Generated AI analysis sessions and reports." />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <Card title="Latest Users">
              {(analytics?.latestUsers || []).length ? (
                analytics.latestUsers.map((user) => (
                  <div key={user._id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                    <div className="font-medium text-slate-900 dark:text-white">{user.name}</div>
                    <div>{user.email}</div>
                    <div className="text-xs uppercase tracking-wide text-cyan-600 dark:text-cyan-300">{user.role}</div>
                  </div>
                ))
              ) : (
                <Empty text="No users found." />
              )}
            </Card>

            <Card title="Latest Resumes">
              {(analytics?.latestResumes || []).length ? (
                analytics.latestResumes.map((resume) => (
                  <div key={resume._id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                    <div className="font-medium text-slate-900 dark:text-white">{resume.originalFileName}</div>
                    <div>Owner: {resume.user?.name || 'Unknown'}</div>
                    <div>Candidate: {resume.extractedData?.name || 'Candidate'}</div>
                  </div>
                ))
              ) : (
                <Empty text="No resumes found." />
              )}
            </Card>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <Card title="All Users">
          {users.length ? (
            users.map((user) => (
              <div key={user._id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                <div className="font-medium text-slate-900 dark:text-white">{user.name}</div>
                <div>{user.email}</div>
                <div className="text-xs uppercase tracking-wide text-cyan-600 dark:text-cyan-300">{user.role}</div>
              </div>
            ))
          ) : (
            <Empty text="No users found." />
          )}
        </Card>
      )}

      {activeTab === 'resumes' && (
        <Card title="All Uploaded Resumes">
          {resumes.length ? (
            resumes.map((resume) => (
              <div key={resume._id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                <div className="font-medium text-slate-900 dark:text-white">{resume.originalFileName}</div>
                <div>Owner: {resume.user?.name || 'Unknown'} ({resume.user?.email || 'No email'})</div>
                <div>Candidate: {resume.extractedData?.name || 'Candidate'}</div>
                <div className="mt-3">
                  <button
                    onClick={() => setSelectedResume(resume._id)}
                    className="rounded-xl bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
                  >
                    View Resume Data
                  </button>
                </div>
              </div>
            ))
          ) : (
            <Empty text="No resumes found." />
          )}
        </Card>
      )}

      {activeTab === 'analyses' && (
        <Card title="All Analyses">
          {analyses.length ? (
            analyses.map((analysis) => (
              <div key={analysis._id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                <div className="font-medium capitalize text-slate-900 dark:text-white">{analysis.analysisType}</div>
                <div>User: {analysis.user?.name || 'Unknown'} ({analysis.user?.email || 'No email'})</div>
                <div>Resume: {analysis.resume?.originalFileName || 'Unknown'}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedAnalysis(analysis._id)}
                    className="rounded-xl bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
                  >
                    View Analysis
                  </button>
                  <button
                    onClick={() => downloadAdminReport(analysis._id)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  >
                    Download Report
                  </button>
                </div>
              </div>
            ))
          ) : (
            <Empty text="No analyses found." />
          )}
        </Card>
      )}

      <DetailModal
        title="Resume Details"
        open={!!selectedResumeData}
        onClose={() => setSelectedResume(null)}
      >
        {selectedResumeData ? <JsonBlock data={selectedResumeData} /> : null}
      </DetailModal>

      <DetailModal
        title="Analysis Details"
        open={!!selectedAnalysisData}
        onClose={() => setSelectedAnalysis(null)}
      >
        {selectedAnalysisData ? <JsonBlock data={selectedAnalysisData} /> : null}
      </DetailModal>
    </Layout>
  );
};

export default AdminPage;