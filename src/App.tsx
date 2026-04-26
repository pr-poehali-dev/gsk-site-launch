import { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Icon from '@/components/ui/icon';

import Home from './pages/Home';
import Documents from './pages/Documents';
import Cabinet from './pages/Cabinet';
import Announcements from './pages/Announcements';
import Forum from './pages/Forum';
import Contacts from './pages/Contacts';
import Management from './pages/Management';

const queryClient = new QueryClient();

type PageId = 'home' | 'documents' | 'cabinet' | 'announcements' | 'forum' | 'contacts' | 'management';

const navItems: { id: PageId; label: string; icon: string }[] = [
  { id: 'home', label: 'Главная', icon: 'Home' },
  { id: 'announcements', label: 'Объявления', icon: 'Bell' },
  { id: 'documents', label: 'Документы', icon: 'FileText' },
  { id: 'forum', label: 'Форум', icon: 'MessageSquare' },
  { id: 'management', label: 'Управление', icon: 'Settings2' },
  { id: 'cabinet', label: 'Кабинет', icon: 'User' },
  { id: 'contacts', label: 'Контакты', icon: 'Phone' },
];

const RESTRICTED: PageId[] = ['announcements', 'forum', 'contacts'];

function GuestWall({ pageName, onGoRegister }: { pageName: string; onGoRegister: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'hsl(220,45%,14%)' }}>
        <Icon name="Lock" size={28} className="text-amber-400" />
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">Раздел только для членов ГСК</h2>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-6">
        «{pageName}» доступен только зарегистрированным участникам кооператива. Заполните анкету — это займёт около 3 минут.
      </p>
      <button
        onClick={onGoRegister}
        className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:opacity-90 transition-opacity"
      >
        Зарегистрироваться в ГСК
      </button>
    </div>
  );
}

const staticPages: Partial<Record<PageId, React.ReactNode>> = {
  home: <Home />,
  documents: <Documents />,
  announcements: <Announcements />,
  forum: <Forum />,
  contacts: <Contacts />,
  management: <Management />,
};

function Layout() {
  const [page, setPage] = useState<PageId>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [registered, setRegistered] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-30 w-64 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'hsl(220,45%,14%)' }}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b" style={{ borderColor: 'hsl(220,35%,22%)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'hsl(38,92%,50%)' }}>
              <Icon name="Warehouse" size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">ГСК «Авангард»</p>
              <p className="text-xs" style={{ color: 'hsl(216,20%,55%)' }}>Кооператив</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isLocked = RESTRICTED.includes(item.id) && !registered;
            return (
              <button
                key={item.id}
                onClick={() => { setPage(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  page === item.id ? 'text-white' : 'hover:text-white'
                }`}
                style={
                  page === item.id
                    ? { background: 'hsl(220,40%,20%)' }
                    : { color: 'hsl(216,20%,65%)' }
                }
              >
                <Icon
                  name={item.icon}
                  size={17}
                  className={page === item.id ? 'text-amber-400' : ''}
                />
                {item.label}
                {isLocked ? (
                  <Icon name="Lock" size={12} className="ml-auto opacity-40" />
                ) : item.id === 'announcements' && registered ? (
                  <span className="ml-auto w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'hsl(38,92%,50%)', color: 'hsl(220,40%,10%)' }}>2</span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t" style={{ borderColor: 'hsl(220,35%,22%)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'hsl(220,40%,30%)' }}>
              АП
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">Петров А.Н.</p>
              <p className="text-xs truncate" style={{ color: 'hsl(216,20%,55%)' }}>Бокс № 147</p>
            </div>
            <button
              onClick={() => setPage('cabinet')}
              style={{ color: 'hsl(216,20%,55%)' }}
              className="hover:text-white transition-colors"
            >
              <Icon name="Settings" size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-card border-b border-border px-4 sm:px-6 h-14 flex items-center gap-3">
          <button
            className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Icon name="Menu" size={22} />
          </button>
          <h2 className="font-semibold text-foreground text-sm">
            {navItems.find((n) => n.id === page)?.label}
          </h2>
          <div className="ml-auto flex items-center gap-2">
            <button className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Icon name="Bell" size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center" style={{ background: 'hsl(38,92%,50%)', color: 'hsl(220,40%,10%)' }}>2</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 sm:px-6 py-6 max-w-5xl w-full mx-auto">
          {RESTRICTED.includes(page) && !registered ? (
            <GuestWall
              pageName={navItems.find((n) => n.id === page)!.label}
              onGoRegister={() => setPage('cabinet')}
            />
          ) : page === 'cabinet' ? (
            <Cabinet registered={registered} onRegistered={() => setRegistered(true)} />
          ) : (
            staticPages[page]
          )}
        </main>
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Layout />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;