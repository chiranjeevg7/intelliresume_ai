import { Bell, LogOut, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
      <div className="flex flex-col gap-4 px-4 py-4 md:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-600/70 dark:text-cyan-300/70">Career Intelligence</p>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">IntelliResume AI</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 md:flex dark:border-white/10 dark:bg-white/5">
            <Search size={16} className="text-slate-400" />
            <input
              className="bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
              placeholder="Search analysis, skills, reports"
            />
          </div>

          <button className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10">
            <Bell size={18} />
          </button>

          <ThemeToggle />

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm dark:border-white/10 dark:bg-white/5">
            <div className="font-semibold text-slate-900 dark:text-white">{user?.name || 'User'}</div>
            <div className="capitalize text-slate-500 dark:text-slate-400">{user?.role || 'member'}</div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;