import Link from 'next/link';
import { PortalShell } from '@/components/PortalShell';

const features = [
  {
    icon: 'SP',
    title: 'Fast & Efficient',
    description: 'Complete your profile step-by-step with clear guidance and real-time progress tracking.'
  },
  {
    icon: 'SC',
    title: 'Secure Data',
    description: 'Your personal information and documents are protected with encrypted storage and access control.'
  },
  {
    icon: 'HR',
    title: 'HR Support',
    description: 'Get help from HR through integrated support channels whenever you need assistance.'
  }
];

export default function DashboardPage() {
  return (
    <PortalShell active="Dashboard">
      <main className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <section className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-700">Portal Pendaftaran Pegawai</p>
              <h1 className="max-w-2xl text-[32px] font-semibold leading-10 tracking-[-0.02em] text-slate-950 sm:text-5xl sm:leading-tight">
                Digital Onboarding
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-700">
                Welcome to our modernized recruitment and onboarding experience. Complete your registration securely, upload documents, and follow every step through a seamless paperless process.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-200"
              >
                Mulai Pendaftaran <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/faq"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-surface-low focus:outline-none focus:ring-4 focus:ring-primary-100"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="grid min-h-80 place-items-center rounded-lg bg-gradient-to-br from-primary-50 via-white to-surface-low p-8 text-center">
              <div className="max-w-sm space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500 text-2xl font-semibold text-white">HR</div>
                <h2 className="text-2xl font-semibold tracking-[-0.01em] text-slate-950">Modern Corporate Office</h2>
                <p className="text-sm leading-6 text-slate-700">A clean workspace for secure employee registration, document collection, and onboarding coordination.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-6xl">
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-semibold tracking-[-0.01em] text-slate-950">Streamlined Process</h2>
            <p className="text-sm leading-6 text-slate-700">Designed to make recruitment administration faster, safer, and easier to follow.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="rounded-lg border border-slate-200 bg-white p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-100 text-xs font-semibold text-primary-700" aria-hidden="true">
                  {feature.icon}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-950">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-700">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </PortalShell>
  );
}
