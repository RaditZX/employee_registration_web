import { PortalShell } from '@/components/PortalShell';
import { RegistrationForm } from '@/components/RegistrationForm';

const steps = ['Data Diri', 'Dokumen', 'Selesai'];

export default function HomePage() {
  return (
    <PortalShell active="Registration">
      <main className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="mx-auto max-w-4xl">
          <div className="mb-8 rounded-lg border border-slate-200 bg-white px-6 py-5 sm:px-8">
            <ol className="grid gap-4 sm:grid-cols-3">
              {steps.map((step, index) => {
                const isCurrent = index === 0;
                const isLast = index === steps.length - 1;

                return (
                  <li key={step} className="relative flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                        isCurrent ? 'bg-primary-500 text-white' : 'bg-surface-high text-slate-600'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <p className={`text-sm font-semibold ${isCurrent ? 'text-primary-700' : 'text-slate-700'}`}>{step}</p>
                      <p className="text-xs text-slate-500">{isCurrent ? 'Sedang diisi' : 'Menunggu'}</p>
                    </div>
                    {!isLast ? <span className="hidden h-px flex-1 bg-slate-200 sm:block" aria-hidden="true" /> : null}
                  </li>
                );
              })}
            </ol>
          </div>

          <RegistrationForm />
        </section>
      </main>
    </PortalShell>
  );
}
