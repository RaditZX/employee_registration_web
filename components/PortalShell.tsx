import Link from 'next/link';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Registration', href: '/' },
  { label: 'Documents', href: '/' },
  { label: 'Help', href: '/faq' }
];

type PortalShellProps = {
  active: 'Dashboard' | 'Registration' | 'Documents' | 'Help';
  children: React.ReactNode;
};

export function PortalShell({ active, children }: PortalShellProps) {
  return (
    <div className="min-h-screen bg-surface-base text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500 text-lg font-semibold text-white">
              EP
            </div>
            <div>
              <p className="text-base font-semibold text-slate-950">Employee Portal</p>
              <p className="text-xs font-medium text-slate-600">Human Resources</p>
            </div>
          </Link>

          <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = item.label === active;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-surface-low hover:text-slate-950'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Notifications"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:border-primary-200 hover:bg-primary-50"
            >
              <span aria-hidden="true" className="text-lg leading-none">○</span>
            </button>
            <button
              type="button"
              aria-label="User account"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-high text-sm font-semibold text-slate-700"
            >
              HR
            </button>
          </div>
        </div>
      </header>

      {children}

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2024 Corporate Systems Inc. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/faq" className="hover:text-primary-700">Privacy Policy</Link>
            <Link href="/faq" className="hover:text-primary-700">Terms of Service</Link>
            <Link href="/faq" className="hover:text-primary-700">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
