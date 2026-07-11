import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';

const Layout = ({ children }) => (
  <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 lg:grid lg:grid-cols-[288px_1fr]">
    <Sidebar />
    <div className="min-h-screen">
      <Header />
      <main className="px-4 py-6 md:px-8">{children}</main>
    </div>
  </div>
);

export default Layout;