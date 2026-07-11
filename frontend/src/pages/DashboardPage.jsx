import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Download, Sparkles } from 'lucide-react';
import Layout from '../components/common/Layout';
import UploadZone from '../components/dashboard/UploadZone';
import ResumeCard from '../components/dashboard/ResumeCard';
import ScoreCard from '../components/dashboard/ScoreCard';
import InsightCard from '../components/dashboard/InsightCard';
import ScoreBarChart from '../components/charts/ScoreBarChart';
import SkillsDonutChart from '../components/charts/SkillsDonutChart';
import ImprovementRadar from '../components/charts/ImprovementRadar';
import api from '../api/client';
import Loader from '../components/common/Loader';

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'insights', label: 'Insights' },
  { key: 'jobMatch', label: 'Job Match' },
  { key: 'roadmap', label: 'Roadmap' },
  { key: 'interview', label: 'Interview Prep' },
];

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [value];
};

const renderText = (value) => {
  if (value == null) return 'Not available';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(renderText).join(', ');
  if (typeof value === 'object') {
    if (value.title && value.reason) return `${value.title}: ${value.reason}`;
    if (value.question && value.answer) return `${value.question}`;
    if (value.role && value.reason) return `${value.role}: ${value.reason}`;
    if (value.name && value.details) return `${value.name}: ${value.details}`;
    return Object.values(value)
      .filter((v) => typeof v === 'string' || typeof v === 'number')
      .join(' • ') || JSON.stringify(value);
  }
  return String(value);
};

const SafeList = ({ items, variant = 'default' }) => {
  const normalized = toArray(items);

  if (!normalized.length) {
    return <div className="text-sm text-slate-500 dark:text-slate-400">No data available.</div>;
  }

  return (
    <ul className="space-y-3">
      {normalized.map((item, index) => (
        <li
          key={index}
          className={
            variant === 'pill'
              ? 'inline-block mr-2 mb-2 rounded-full bg-slate-100 px-3 py-1 text-xs dark:bg-white/5'
              : 'rounded-2xl bg-slate-100 px-4 py-3 dark:bg-white/5'
          }
        >
          {typeof item === 'object' && item !== null ? (
            <div className="space-y-1">
              {'title' in item && (
                <div className="font-semibold text-slate-900 dark:text-white">{renderText(item.title)}</div>
              )}
              {'role' in item && !('title' in item) && (
                <div className="font-semibold text-slate-900 dark:text-white">{renderText(item.role)}</div>
              )}
              {'question' in item && (
                <div className="font-semibold text-slate-900 dark:text-white">{renderText(item.question)}</div>
              )}
              {'reason' in item && (
                <div className="text-sm text-slate-600 dark:text-slate-300">{renderText(item.reason)}</div>
              )}
              {'answer' in item && (
                <div className="text-sm text-slate-600 dark:text-slate-300">{renderText(item.answer)}</div>
              )}
              {!('title' in item) &&
                !('role' in item) &&
                !('question' in item) &&
                !('reason' in item) &&
                !('answer' in item) && (
                  <div>{renderText(item)}</div>
                )}
            </div>
          ) : (
            renderText(item)
          )}
        </li>
      ))}
    </ul>
  );
};

const SectionCard = ({ title, children }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
    <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">{children}</div>
  </div>
);

const DashboardPage = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const loadResumes = async () => {
    const { data } = await api.get('/resumes');
    const resumeList = data.resumes || [];
    setResumes(resumeList);

    if (resumeList.length > 0) {
      setSelectedResume((prev) => prev || resumeList[0]);
    } else {
      setSelectedResume(null);
    }
  };

  useEffect(() => {
    Promise.all([loadResumes(), api.get('/analysis')])
      .then(([, analysisRes]) => {
        const latest = analysisRes?.data?.analyses?.[0];
        if (latest) setAnalysis(latest.results);
      })
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append('resume', file);

    try {
      await api.post('/resumes/upload', formData);
      toast.success('Resume uploaded successfully');
      await loadResumes();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    }
  };

  const runAnalysis = async () => {
    if (!selectedResume) {
      toast.error('Upload and select a resume first');
      return;
    }

    try {
      setAnalyzing(true);
      const { data } = await api.post('/analysis', {
        resumeId: selectedResume._id,
        jobDescription,
      });
      setAnalysis(data.analysis.results);
      setActiveTab('overview');
      toast.success('AI analysis complete');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const downloadReport = async () => {
    try {
      const analyses = await api.get('/analysis');
      const latestId = analyses.data.analyses?.[0]?._id;

      if (!latestId) {
        toast.error('No analysis report available');
        return;
      }

      const response = await api.get(`/reports/${latestId}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'intelliresume-report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Report download failed');
    }
  };

  const currentSkills = useMemo(
    () => analysis?.skillGapAnalysis?.currentSkills || selectedResume?.extractedData?.skills || [],
    [analysis, selectedResume]
  );

  if (loading) return <Loader />;

  return (
    <Layout>
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="space-y-6">
          <UploadZone onFile={uploadResume} />

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Uploaded Resumes</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Select one resume to analyze.</p>
            </div>

            <div className="space-y-4">
              {resumes.length > 0 ? (
                resumes.map((resume) => (
                  <ResumeCard
                    key={resume._id}
                    resume={resume}
                    selected={selectedResume?._id === resume._id}
                    onSelect={setSelectedResume}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
                  No resumes uploaded yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-600/70 dark:text-cyan-300/70">AI Engine</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Semantic Resume Analysis</h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                  Analyze resume quality, ATS compatibility, recruiter readability, project depth, career fit, and job description alignment using Gemini.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={runAnalysis}
                  disabled={analyzing}
                  className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60"
                >
                  <Sparkles size={18} />
                  {analyzing ? 'Analyzing...' : 'Run AI Analysis'}
                </button>

                <button
                  onClick={downloadReport}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  <Download size={18} />
                  Export PDF
                </button>
              </div>
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
              className="mt-6 w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 outline-none transition focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-100"
              placeholder="Paste a job description to generate intelligent match score, missing skills, and interview preparation..."
            />
          </div>

          {analysis ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <ScoreCard title="Resume Strength" score={analysis.resumeStrengthScore || 0} description="Overall semantic quality across structure, content, readability, and professionalism." />
                <ScoreCard title="AI ATS Score" score={analysis.atsScore || 0} description="Formatting, completeness, relevance, and recruiter-system readability." />
                <ScoreCard title="Job Match" score={analysis.jobMatchScore || 0} description="Role understanding, skill overlap, experience fit, and requirement alignment." />
                <ScoreCard title="Skill Strength" score={analysis.skillStrength || 0} description="Current skills depth relative to target career opportunities." />
              </div>

              <div className="flex flex-wrap gap-3">
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
                <div className="space-y-6">
                  <div className="grid gap-6 xl:grid-cols-3">
                    <ScoreBarChart analysis={analysis} />
                    <SkillsDonutChart skills={currentSkills} />
                    <ImprovementRadar areas={toArray(analysis.improvementAreas).map((item, index) => ({
                      subject: typeof item === 'object' ? item.title || `Area ${index + 1}` : String(item),
                      A: Math.max(60, 90 - index * 7),
                      fullMark: 100,
                    }))} />
                  </div>

                  <div className="grid gap-6 xl:grid-cols-2">
                    <SectionCard title="Career Recommendations">
                      <SafeList items={analysis.careerRecommendations?.recommendedRoles || analysis.careerRecommendations} />
                    </SectionCard>

                    <SectionCard title="Project Analyzer">
                      <SafeList items={analysis.projectAnalysis?.suggestions || analysis.projectAnalysis} />
                    </SectionCard>
                  </div>
                </div>
              )}

              {activeTab === 'insights' && (
                <div className="grid gap-6 xl:grid-cols-2">
                  <SectionCard title="AI Insights">
                    <div className="grid gap-4">
                      {toArray(analysis.insights).map((item, index) => (
                        <InsightCard key={index} text={renderText(item)} index={index} />
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard title="Improvement Areas">
                    <SafeList items={analysis.improvementAreas} />
                  </SectionCard>
                </div>
              )}

              {activeTab === 'jobMatch' && (
                <div className="grid gap-6 xl:grid-cols-2">
                  <SectionCard title="Matching Skills">
                    <div className="flex flex-wrap gap-2">
                      {toArray(analysis.jobMatch?.matchingSkills).map((skill, index) => (
                        <span key={index} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                          {renderText(skill)}
                        </span>
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard title="Missing Skills">
                    <div className="flex flex-wrap gap-2">
                      {toArray(analysis.jobMatch?.missingSkills).map((skill, index) => (
                        <span key={index} className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
                          {renderText(skill)}
                        </span>
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard title="Experience Gap">
                    <p>{renderText(analysis.jobMatch?.experienceGap)}</p>
                  </SectionCard>

                  <SectionCard title="Recommendations">
                    <SafeList items={analysis.jobMatch?.recommendations} />
                  </SectionCard>
                </div>
              )}

              {activeTab === 'roadmap' && (
                <div className="grid gap-6 xl:grid-cols-2">
                  <SectionCard title="Skill Gap Analysis">
                    <div className="space-y-5">
                      <div>
                        <div className="mb-2 font-semibold text-slate-900 dark:text-white">Current Skills</div>
                        <div className="flex flex-wrap gap-2">
                          {toArray(analysis.skillGapAnalysis?.currentSkills).map((skill, index) => (
                            <span key={index} className="rounded-full bg-slate-100 px-3 py-1 text-xs dark:bg-white/5">
                              {renderText(skill)}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 font-semibold text-slate-900 dark:text-white">Missing Skills</div>
                        <div className="flex flex-wrap gap-2">
                          {toArray(analysis.skillGapAnalysis?.missingSkills).map((skill, index) => (
                            <span key={index} className="rounded-full bg-rose-100 px-3 py-1 text-xs text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
                              {renderText(skill)}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 font-semibold text-slate-900 dark:text-white">High Demand Skills</div>
                        <div className="flex flex-wrap gap-2">
                          {toArray(analysis.skillGapAnalysis?.highDemandSkills).map((skill, index) => (
                            <span key={index} className="rounded-full bg-cyan-100 px-3 py-1 text-xs text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300">
                              {renderText(skill)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </SectionCard>

                  <SectionCard title="30 / 60 / 90 Day Roadmap">
                    <div className="space-y-4">
                      {['30Days', '60Days', '90Days'].map((phase) => (
                        <div key={phase} className="rounded-2xl bg-slate-100 p-4 dark:bg-white/5">
                          <div className="mb-2 font-semibold text-slate-900 dark:text-white">{phase.replace('Days', ' Days')}</div>
                          <SafeList items={analysis.skillGapAnalysis?.roadmap?.[phase]} />
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                </div>
              )}

              {activeTab === 'interview' && (
                <div className="grid gap-6 xl:grid-cols-2">
                  <SectionCard title="Technical Questions">
                    <SafeList items={analysis.interviewPreparation?.technicalQuestions} />
                  </SectionCard>

                  <SectionCard title="HR / Scenario / Project Questions">
                    <SafeList
                      items={[
                        ...toArray(analysis.interviewPreparation?.hrQuestions),
                        ...toArray(analysis.interviewPreparation?.projectQuestions),
                        ...toArray(analysis.interviewPreparation?.scenarioQuestions),
                      ]}
                    />
                  </SectionCard>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
              Run AI Analysis to view your resume intelligence dashboard.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;