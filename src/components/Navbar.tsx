import { Plane, BarChart3, Home, Github } from 'lucide-react';

export type View = 'home' | 'predict' | 'dashboard';

interface NavbarProps {
  view: View;
  onNavigate: (v: View) => void;
}

export function Navbar({ view, onNavigate }: NavbarProps) {
  const links: { id: View; label: string; icon: typeof Home }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'predict', label: 'Predict', icon: Plane },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-ink-800/60 bg-ink-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-500 shadow-lg shadow-accent-500/30">
            <Plane className="h-5 w-5 -rotate-45 text-white" />
          </div>
          <div className="text-left">
            <div className="text-sm font-bold leading-none text-ink-50">
              SkyDelay
            </div>
            <div className="text-[10px] font-medium leading-none text-ink-500">
              XAI Flight Intelligence
            </div>
          </div>
        </button>

        <nav className="flex items-center gap-1 rounded-xl border border-ink-800/80 bg-ink-900/50 p-1">
          {links.map((l) => {
            const Icon = l.icon;
            const active = view === l.id;
            return (
              <button
                key={l.id}
                onClick={() => onNavigate(l.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all sm:px-4 ${
                  active
                    ? 'bg-accent-500 text-white shadow-md shadow-accent-500/20'
                    : 'text-ink-400 hover:text-ink-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{l.label}</span>
              </button>
            );
          })}
        </nav>

        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-2 rounded-xl border border-ink-800 px-3 py-2 text-sm text-ink-400 transition-colors hover:border-ink-700 hover:text-ink-100 md:flex"
        >
          <Github className="h-4 w-4" />
          Source
        </a>
      </div>
    </header>
  );
}
