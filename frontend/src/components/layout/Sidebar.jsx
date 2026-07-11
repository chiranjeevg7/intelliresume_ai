import { BarChart3, FileText, LayoutDashboard, ShieldCheck, Sparkles, UserCog } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.svg';

const Sidebar = () => {
  const { user } = useAuth();

  const items = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/workbench', label: 'Resume Workbench', icon: FileText },
    { to: '/dashboard', label: 'AI Analysis', icon: Sparkles },
    { to: '/dashboard', label: 'Reports', icon: BarChart3 },
  ];

  if (user?.role === 'admin') {
    items.push({ to: '/admin', label: 'Admin', icon: UserCog });
  }

  return (
    <aside className="hidden h-screen w-72 flex-col border-r border-slate-200 bg-white/80 px-4 py-6 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 lg:flex">
      <div className="mb-8 flex items-center gap-3 px-2">
        <img src={logo} alt="IntelliResume AI" className="h-8 w-auto" />
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={label}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
        <div className="mb-2 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
          <ShieldCheck size={16} />
          AI Resume Quality
        </div>
        Semantic scoring, project intelligence, JD fit, roadmap, and export-ready recruiter insights.
      </div>
    </aside>
  );
};

export default Sidebar;